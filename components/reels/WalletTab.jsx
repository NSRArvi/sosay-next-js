"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, DollarSign, Clock, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";

const WalletTab = ({ wallet = {} }) => {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!withdrawAmount || !withdrawMethod) {
      toast.error("Please fill in all fields");
      return;
    }

    const amount = parseFloat(withdrawAmount);
    const availableBalance = wallet.availableBalance || 0;

    if (amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    if (amount > availableBalance) {
      toast.error("Insufficient balance");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Call API to process cashout
      toast.success(`Cashout request submitted for $${amount}`);
      setWithdrawAmount("");
      setWithdrawMethod("");
    } catch (error) {
      toast.error("Failed to submit cashout request");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableBalance = wallet.availableBalance || 0;
  const pendingPayout = wallet.pendingPayout || 0;
  const nextPayout = wallet.nextPayout || null;

  return (
    <div className="space-y-6">
      {/* Balance Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Available Balance Card */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-0">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-300" />
              <p className="text-sm font-medium text-green-600 dark:text-green-300">
                Available Balance
              </p>
            </div>
            <p className="text-3xl font-bold text-green-900 dark:text-green-100">
              ${availableBalance.toFixed(2)}
            </p>
          </div>
        </Card>

        {/* Pending Payout Card */}
        <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-0">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-300" />
              <p className="text-sm font-medium text-amber-600 dark:text-amber-300">
                Pending Payout
              </p>
            </div>
            <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">
              ${pendingPayout.toFixed(2)}
            </p>
          </div>
        </Card>

        {/* Next Payout Card */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-0">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              <p className="text-sm font-medium text-blue-600 dark:text-blue-300">
                Next Payout
              </p>
            </div>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {nextPayout
                ? new Date(nextPayout).toLocaleDateString()
                : "Pending"}
            </p>
          </div>
        </Card>
      </div>

      {/* Cashout Form */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">
          Request Cashout
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Withdrawal Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-gray-700 dark:text-gray-300">
              Withdrawal Amount *
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                $
              </span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="pl-8"
                step="0.01"
                min="0"
                max={availableBalance}
                disabled={isSubmitting}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Available: ${availableBalance.toFixed(2)}
            </p>
          </div>

          {/* Withdrawal Method */}
          <div className="space-y-2">
            <Label
              htmlFor="method"
              className="text-gray-700 dark:text-gray-300"
            >
              Withdrawal Method *
            </Label>
            <Select
              value={withdrawMethod}
              onValueChange={setWithdrawMethod}
              disabled={isSubmitting}
            >
              <SelectTrigger id="method">
                <SelectValue placeholder="Select a withdrawal method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="cryptocurrency">Cryptocurrency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Request Cashout"
            )}
          </Button>
        </form>

        {/* Terms */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          Processing usually takes 3-5 business days. A fee may apply based on
          your selected method.
        </p>
      </Card>
    </div>
  );
};

export default WalletTab;
