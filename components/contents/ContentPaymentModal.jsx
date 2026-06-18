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
function PaymentSuccess({ price, onClose }) {
  return (
    <div className="flex flex-col items-center justify-center py-6 gap-4 text-center">
      <div className="rounded-full bg-green-100 p-4">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Payment Successful!
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          You are now subscribed.
        </p>
        <p className="text-2xl font-bold text-gray-900 mt-3">
          ${parseFloat(price).toFixed(2)} paid
        </p>
      </div>
      <Button
        onClick={onClose}
        className="w-full bg-blue-600 hover:bg-blue-700 mt-2 text-white"
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
      <div className="rounded-full bg-red-100 p-4">
        <XCircle className="h-12 w-12 text-red-500" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Payment Failed
        </h3>
        <p className="text-sm text-gray-500 mt-1 max-w-xs">
          {message || "Something went wrong. Please try again."}
        </p>
      </div>
      <div className="flex gap-3 w-full mt-2">
        <Button variant="outline" onClick={onClose} className="flex-1 cursor-pointer">
          Cancel
        </Button>
        <Button
          onClick={onRetry}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}

// ── Checkout form (rendered inside <Elements>) ────────────────────────────────
function CheckoutForm({ price, onSuccess, onError }) {
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
      <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 border border-gray-200">
        <span className="text-sm text-gray-500">
          Subscription Total
        </span>
        <span className="text-xl font-bold text-gray-900">
          ${parseFloat(price).toFixed(2)}
        </span>
      </div>

      {/* Stripe Payment Element */}
      <div className="rounded-lg border border-gray-200 p-4">
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      {/* Inline field error */}
      {fieldError && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
          <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{fieldError}</p>
        </div>
      )}

      {/* Submit */}
      <div className="space-y-3">
        <Button
          type="submit"
          disabled={!stripe || !elements || isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 text-base font-semibold cursor-pointer"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing…
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay ${parseFloat(price).toFixed(2)}
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
export default function ContentPaymentModal({ creatorId, accessToken, open, onClose, onSuccessCallback }) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState("loading");
  const [clientSecret, setClientSecret] = useState(null);
  const [price, setPrice] = useState(0);
  const [subscriptionId, setSubscriptionId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchIntent = () => {
    setStep("loading");
    setClientSecret(null);
    setErrorMessage("");

    fetch(
      `${process.env.NEXT_PUBLIC_API_DEV_URL}/contents/creators/${creatorId}/create-payment-intent`,
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
          setPrice(data.data.subscription_price);
          setSubscriptionId(data.data.subscription_id);
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
    if (!open || !creatorId) return;
    fetchIntent();
  }, [open, creatorId]);

  const activateSubscription = async (subId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DEV_URL}/contents/subscriptions/${subId}/activate`,
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
        queryClient.invalidateQueries({ queryKey: ["/contents"] });
        queryClient.invalidateQueries({ queryKey: ["/contents/creators"] });
        if (onSuccessCallback) {
          onSuccessCallback();
        }
      }
    } catch {
      // silent fail
    }
  };

  const handleSuccess = () => {
    setStep("success");
    if (subscriptionId) {
      activateSubscription(subscriptionId);
    }
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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        {/* Hide header on success/error screens */}
        {step !== "success" && step !== "error" && step !== "intent_error" && (
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Subscribe to Creator
            </DialogTitle>
            <DialogDescription>
              Enter your card details below to subscribe and unlock content
            </DialogDescription>
          </DialogHeader>
        )}

        {/* Loading intent */}
        {step === "loading" && (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
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
              price={price}
              onSuccess={handleSuccess}
              onError={handlePaymentError}
            />
          </Elements>
        )}

        {/* Success screen */}
        {step === "success" && (
          <PaymentSuccess
            price={price}
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
