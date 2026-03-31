import Image from "next/image";
import { Loader2, ShieldCheck, Upload, FileText, CreditCard, BookOpen, CheckIcon, ArrowLeft } from "lucide-react";

const DOC_TYPES = [
  {
    value: "national_id",
    label: "National ID",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    value: "passport",
    label: "Passport",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    value: "driving_license",
    label: "Driving license",
    icon: <FileText className="h-5 w-5" />,
  },
];

export default function StepTwoVerification({
  documentType,
  onDocumentTypeChange,
  onDocumentChange,
  documentFile,
  documentPreview,
  faceImagePreview,
  isSubmitting,
  onSubmit,
  onBackToStepOne,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-[15px] font-semibold text-gray-900 tracking-tight">Document upload</h2>
          <p className="text-xs text-gray-400 mt-0.5">Upload a clear photo of your identity document</p>
        </div>
        <span className="inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700">
          Step 2
        </span>
      </div>

      <div className="px-6 py-6 space-y-5">
        {/* Selfie preview */}
        {faceImagePreview && (
          <div className="flex items-center gap-3 px-3 py-3 bg-green-50 border border-green-200 rounded-xl">
            <Image
              src={faceImagePreview}
              alt="Captured face"
              width={44}
              height={44}
              unoptimized
              className="w-11 h-11 rounded-full object-cover border-2 border-white flex-shrink-0"
            />
            <div>
              <p className="text-xs font-medium text-green-700">Selfie captured</p>
              <p className="text-[11px] text-green-600 mt-0.5">Face image ready for submission</p>
            </div>
            <CheckIcon className="h-4 w-4 text-green-500 ml-auto flex-shrink-0" />
          </div>
        )}

        {/* Document type */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
            Document type
          </p>
          <div className="grid grid-cols-3 gap-2">
            {DOC_TYPES.map((dt) => (
              <button
                key={dt.value}
                type="button"
                onClick={() => onDocumentTypeChange(dt.value)}
                className={`flex flex-col items-center gap-2 px-2 py-3 rounded-xl border text-center transition-all duration-150
                  ${documentType === dt.value
                    ? "border-blue-400 bg-blue-50 text-blue-600"
                    : "border-gray-200 bg-white text-gray-500 hover:border-blue-200 hover:bg-blue-50/40"
                  }`}
              >
                <span className={documentType === dt.value ? "text-blue-500" : "text-gray-400"}>
                  {dt.icon}
                </span>
                <span className="text-[11px] font-medium leading-tight">{dt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Upload */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
            Upload document
          </p>
          <label className="flex flex-col items-center gap-2 px-4 py-7
                            border-[1.5px] border-dashed border-gray-300 rounded-xl
                            bg-white cursor-pointer text-center
                            hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-150">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={onDocumentChange}
              className="hidden"
            />
            <Upload className="h-6 w-6 text-gray-300" />
            <div>
              <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG or PDF — max 10 MB</p>
            </div>
          </label>
        </div>

        {/* Document preview */}
        {documentFile && (
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            {documentPreview ? (
              <Image
                src={documentPreview}
                alt="Document preview"
                width={800}
                height={400}
                unoptimized
                className="w-full max-h-48 object-contain bg-gray-50 block"
              />
            ) : null}
            <div className="flex items-center gap-2 px-3 py-2.5 border-t border-gray-100 bg-white">
              <FileText className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-500 flex-1 truncate">{documentFile.name}</span>
              <CheckIcon className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
            </div>
          </div>
        )}

        {/* Info */}
        <div className="flex gap-2.5 items-start px-3.5 py-3 bg-blue-50 border border-blue-100 rounded-xl">
          <ShieldCheck className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 leading-relaxed">
            Your face image and document are submitted together over an encrypted connection for identity verification.
          </p>
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || !documentFile}
          className="w-full h-12 bg-gray-900 text-white text-sm font-medium rounded-xl
                     flex items-center justify-center gap-2
                     hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed
                     transition-all duration-150"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4" />
              Submit for verification
            </>
          )}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={onBackToStepOne}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to selfie capture
          </button>
        </div>
      </div>
    </div>
  );
}