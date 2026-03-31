"use client";
import Image from "next/image";
import { useAppContext } from "@/context/context";

export default function VerifiedInformationsPage() {
  const { verificationInfo } = useAppContext();

  const formatSubmittedAt = (submittedAt) => {
    if (!submittedAt) return "N/A";
    const date = new Date(submittedAt);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatIdentityType = (type) => {
    if (!type) return "N/A";
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const statusText = verificationInfo?.identity_status === 1 ? "Verified" : "Pending";

  return (
    <section className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Verified Information</h1>
        <p className="text-sm text-gray-500 mt-1">Read-only details from your latest identity verification submission.</p>
      </div>

      {!verificationInfo ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-lg font-semibold text-gray-800">No verification data found</p>
          <p className="text-sm text-gray-500 mt-2">Submit your verification first to see your details here.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400">Verification Status</p>
              <h2 className="text-xl font-semibold text-gray-900 mt-1">{statusText}</h2>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                verificationInfo?.identity_status === 1
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {statusText}
            </span>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Identity Type</p>
                <p className="text-base font-medium text-gray-900 mt-1">{formatIdentityType(verificationInfo?.identity_type)}</p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Submitted At</p>
                <p className="text-base font-medium text-gray-900 mt-1">{formatSubmittedAt(verificationInfo?.submitted_at)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Identity Card</p>
                {verificationInfo?.identity_card ? (
                  <a
                    href={verificationInfo.identity_card}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-lg overflow-hidden border border-gray-100"
                  >
                    <Image
                      src={verificationInfo.identity_card}
                      alt="Identity card"
                      width={900}
                      height={600}
                      unoptimized
                      className="w-full h-72 md:h-80 object-cover"
                    />
                  </a>
                ) : (
                  <p className="text-sm text-gray-500">Not available</p>
                )}
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">User Verification Image</p>
                {verificationInfo?.user_verification_image ? (
                  <a
                    href={verificationInfo.user_verification_image}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-lg overflow-hidden border border-gray-100"
                  >
                    <Image
                      src={verificationInfo.user_verification_image}
                      alt="User verification"
                      width={900}
                      height={600}
                      unoptimized
                      className="w-full h-72 md:h-80 object-cover"
                    />
                  </a>
                ) : (
                  <p className="text-sm text-gray-500">Not available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
