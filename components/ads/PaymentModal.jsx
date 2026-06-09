"use client";
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2,
  CreditCard,
  ShieldCheck,
  X,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);



// ── Success screen ────────────────────────────────────────────────────────────
function PaymentSuccess({ campaignId, totalBudget, onClose }) {
  return (
    <div className="flex flex-col items-center justify-center py-6 gap-4 text-center">
      <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
        <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Payment Successful!
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Campaign #{campaignId} is now active.
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-3">
          ${parseFloat(totalBudget).toFixed(2)} paid
        </p>
      </div>
      <Button
        onClick={onClose}
        className="w-full bg-secondary hover:bg-secondary/90 mt-2"
      >
        Done
      </Button>
    </div>
  );
}

// ── Error screen ──────────────────────────────────────────────────────────────
function PaymentError({ message, onRetry, onClose }) {
  return (
    <div className="flex flex-col items-center justify-center py-6 gap-4 text-center">
      <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-4">
        <XCircle className="h-12 w-12 text-red-500 dark:text-red-400" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Payment Failed
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
          {message || "Something went wrong. Please try again."}
        </p>
      </div>
      <div className="flex gap-3 w-full mt-2">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button
          onClick={onRetry}
          className="flex-1 bg-secondary hover:bg-secondary/90"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}

// ── Checkout form (rendered inside <Elements>) ────────────────────────────────
function CheckoutForm({ campaignId, totalBudget, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [fieldError, setFieldError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setFieldError("");

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setFieldError(error.message || "Payment failed. Please try again.");
      setIsProcessing(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      onSuccess();
    } else {
      onError("Unexpected payment status. Please contact support.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Amount summary */}
      <div className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-800/60 px-4 py-3 border border-gray-200 dark:border-gray-700">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Campaign #{campaignId} · Total
        </span>
        <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
          ${parseFloat(totalBudget).toFixed(2)}
        </span>
      </div>

      {/* Stripe Payment Element */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      {/* Inline field error */}
      {fieldError && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3">
          <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-400">{fieldError}</p>
        </div>
      )}

      {/* Submit */}
      <div className="space-y-3">
        <Button
          type="submit"
          disabled={!stripe || !elements || isProcessing}
          className="w-full bg-secondary hover:bg-secondary/90 h-11 text-base font-semibold"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing…
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay ${parseFloat(totalBudget).toFixed(2)}
            </>
          )}
        </Button>
        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Secured by Stripe · 256-bit encryption</span>
        </div>
      </div>
    </form>
  );
}

// ── Modal shell ───────────────────────────────────────────────────────────────
// step: "loading" | "form" | "success" | "error" | "intent_error"
export default function PaymentModal({ campaign, accessToken, open, onClose }) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState("loading");
  const [clientSecret, setClientSecret] = useState(null);
  const [totalBudget, setTotalBudget] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchIntent = () => {
    setStep("loading");
    setClientSecret(null);
    setErrorMessage("");

    fetch(
      `${process.env.NEXT_PUBLIC_API_DEV_URL}/ads/campaigns/${campaign.id}/create-payment-intent`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.data?.clientSecret) {
          setClientSecret(data.data.clientSecret);
          setTotalBudget(data.data.total_budget);
          setStep("form");
        } else {
          setErrorMessage(data.message || "Could not initialise payment.");
          setStep("intent_error");
        }
      })
      .catch(() => {
        setErrorMessage("Network error. Please try again.");
        setStep("intent_error");
      });
  };

  // Re-fetch intent each time the modal opens
  useEffect(() => {
    if (!open || !campaign) return;
    fetchIntent();
  }, [open, campaign]);

  const activateCampaign = async (campaignId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DEV_URL}/ads/campaigns/${campaignId}/activate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const data = await res.json();
      if (data.status) {
        queryClient.invalidateQueries(["/ads/campaigns/me", accessToken]);
      }
    } catch {
      // silent fail — payment already succeeded
    }
  };

  const handleSuccess = () => {
    setStep("success");
    activateCampaign(campaign.id);
  };

  const handlePaymentError = (msg) => {
    setErrorMessage(msg);
    setStep("error");
  };

  const handleClose = () => {
    setStep("loading");
    setClientSecret(null);
    onClose();
  };

  const elementsOptions = clientSecret
    ? {
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: { borderRadius: "8px", fontFamily: "inherit" },
        },
      }
    : null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        {/* Hide header on success/error screens */}
        {step !== "success" && step !== "error" && step !== "intent_error" && (
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-secondary" />
              Complete Payment
            </DialogTitle>
            <DialogDescription>
              Campaign #{campaign?.id} · Enter your card details below
            </DialogDescription>
          </DialogHeader>
        )}

        {/* Loading intent */}
        {step === "loading" && (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            <p className="text-sm text-gray-500">Preparing payment…</p>
          </div>
        )}

        {/* Intent fetch error */}
        {step === "intent_error" && (
          <PaymentError
            message={errorMessage}
            onRetry={fetchIntent}
            onClose={handleClose}
          />
        )}

        {/* Stripe form */}
        {step === "form" && clientSecret && (
          <Elements stripe={stripePromise} options={elementsOptions}>
            <CheckoutForm
              campaignId={campaign.id}
              totalBudget={totalBudget ?? campaign.total_budget}
              onSuccess={handleSuccess}
              onError={handlePaymentError}
            />
          </Elements>
        )}

        {/* Success screen */}
        {step === "success" && (
          <PaymentSuccess
            campaignId={campaign.id}
            totalBudget={totalBudget ?? campaign.total_budget}
            onClose={handleClose}
          />
        )}

        {/* Payment confirmation error */}
        {step === "error" && (
          <PaymentError
            message={errorMessage}
            onRetry={fetchIntent}
            onClose={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}