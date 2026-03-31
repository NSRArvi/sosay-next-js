import Image from "next/image";
import { useEffect, useRef } from "react";
import { Camera, RefreshCw, CheckIcon, ArrowLeft, ArrowRight, User } from "lucide-react";

const R = 88, CX = 100, CY = 100, STROKE = 7;
const GAP_DEG = 5;
const SEG_DEG = (360 - GAP_DEG * 5) / 5;
const SEG_COLOR = "#22c55e";

function drawRing(canvas, stepProgress) {
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = 200 * dpr;
  canvas.height = 200 * dpr;
  canvas.style.width = "200px";
  canvas.style.height = "200px";
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, 200, 200);

  const startOffset = -Math.PI / 2;

  for (let i = 0; i < 5; i++) {
    const startAngle = startOffset + (i * (SEG_DEG + GAP_DEG) * Math.PI) / 180;
    const endAngle = startAngle + (SEG_DEG * Math.PI) / 180;

    // track
    ctx.beginPath();
    ctx.arc(CX, CY, R, startAngle, endAngle);
    ctx.strokeStyle = "#e2e5ec";
    ctx.lineWidth = STROKE;
    ctx.lineCap = "round";
    ctx.stroke();

    // fill
    const p = Math.max(0, Math.min(1, stepProgress[i]));
    if (p > 0) {
      ctx.beginPath();
      ctx.arc(CX, CY, R, startAngle, startAngle + (SEG_DEG * Math.PI / 180) * p);
      ctx.strokeStyle = SEG_COLOR;
      ctx.lineWidth = STROKE;
      ctx.lineCap = "round";
      ctx.stroke();
    }
  }
}

const LIVENESS_FRAMES = 5;

export default function StepOneVerification({
  cameraReady,
  cameraError,
  instructionText,
  faceTip,
  checks,
  steadyProgress,
  livenessState,
  livenessProgress,
  autoDetectionSupported,
  captureReady,
  videoRef,
  canvasRef,
  faceImagePreview,
  onCapture,
  onRestartCamera,
}) {
  const ringRef = useRef(null);

  const stepProgress = [
    checks.singleFace ? 1 : 0,
    checks.distance ? 1 : 0,
    checks.steady ? 1 : checks.distance ? Math.min(1, steadyProgress / 100) : 0,
    livenessState.leftDone ? 1 : checks.steady ? Math.min(1, livenessState.leftFrames / LIVENESS_FRAMES) : 0,
    livenessState.rightDone ? 1 : checks.steady ? Math.min(1, livenessState.rightFrames / LIVENESS_FRAMES) : 0,
  ];

  useEffect(() => {
    drawRing(ringRef.current, stepProgress);
  });

  const doneCount = stepProgress.filter((p) => p >= 1).length;

  const STEP_PILLS = [
    { label: "Single face", icon: <User className="h-3 w-3" /> },
    { label: "Distance",    icon: <span className="text-[10px] font-mono">↔</span> },
    { label: "Steady",      icon: <CheckIcon className="h-3 w-3" /> },
    { label: "Turn left",   icon: <ArrowLeft className="h-3 w-3" /> },
    { label: "Turn right",  icon: <ArrowRight className="h-3 w-3" /> },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-[15px] font-semibold text-gray-900 tracking-tight">Face capture</h2>
          <p className="text-xs text-gray-400 mt-0.5">Position your face and follow the prompts</p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full ${
            captureReady
              ? "bg-green-50 text-green-700"
              : "bg-blue-50 text-blue-600"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${captureReady ? "bg-green-500" : "bg-blue-500"}`}
          />
          {captureReady ? "Ready" : "Detecting"}
        </span>
      </div>

      <div className="px-6 py-6 space-y-5">
        {/* Ring + video */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-[200px] h-[200px]">
            {/* Canvas ring — drawn in JS, no SVG arc bugs */}
            <canvas ref={ringRef} className="absolute inset-0" />

            {/* Video inside ring */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          w-[164px] h-[164px] rounded-full overflow-hidden
                          border-[3px] border-white ring-1 ring-gray-200 bg-gray-950"
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover scale-x-[-1]"
                playsInline
                muted
              />
              {!cameraReady && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-500">
                  <User className="h-8 w-8 opacity-30" />
                  <span className="text-[11px] opacity-50">Camera loading</span>
                </div>
              )}
            </div>

            {/* Step counter badge */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2
                            bg-gray-900/80 backdrop-blur-sm text-white
                            text-[10px] font-mono font-medium
                            px-2.5 py-1 rounded-full whitespace-nowrap">
              {doneCount} / 5
            </div>
          </div>

          {/* Step pills */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {STEP_PILLS.map((pill, i) => {
              const done = stepProgress[i] >= 1;
              const active = !done && (i === 0 || stepProgress[i - 1] >= 1);
              return (
                <span
                  key={i}
                  className={`inline-flex items-center gap-1 text-[11px] font-medium
                              px-2.5 py-1 rounded-full border transition-all duration-200
                              ${done  ? "bg-green-50 border-green-200 text-green-700"
                               : active ? "bg-blue-50 border-blue-200 text-blue-600"
                               : "bg-white border-gray-200 text-gray-400"}`}
                >
                  {done ? <CheckIcon className="h-3 w-3" /> : pill.icon}
                  {pill.label}
                </span>
              );
            })}
          </div>
        </div>

        {/* Instruction */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
            Current step
          </p>
          <p className="text-sm font-medium text-gray-800 leading-snug">{instructionText}</p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{faceTip}</p>
        </div>

        {/* Liveness cards */}
        <div className="grid grid-cols-2 gap-2">
          {[
            {
              key: "left",
              label: "Turn left",
              done: livenessState.leftDone,
              frames: livenessState.leftFrames,
              active: checks.steady && !livenessState.leftDone,
              icon: <ArrowLeft className="h-4 w-4" />,
            },
            {
              key: "right",
              label: "Turn right",
              done: livenessState.rightDone,
              frames: livenessState.rightFrames,
              active: checks.steady && livenessState.leftDone && !livenessState.rightDone,
              icon: <ArrowRight className="h-4 w-4" />,
            },
          ].map((item) => (
            <div
              key={item.key}
              className={`rounded-xl border px-3 py-3 flex items-center gap-2.5 transition-all ${
                item.done
                  ? "bg-green-50 border-green-200"
                  : item.active
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white border-gray-200"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  item.done ? "bg-green-100 text-green-700"
                  : item.active ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-400"
                }`}
              >
                {item.done ? <CheckIcon className="h-4 w-4" /> : item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-[12px] font-medium ${
                    item.done ? "text-green-700" : item.active ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </p>
                <div className="mt-1.5 h-[3px] bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-400 rounded-full transition-all duration-200"
                    style={{ width: `${item.done ? 100 : Math.round((item.frames / LIVENESS_FRAMES) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {!autoDetectionSupported && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Automatic checks unavailable in this browser. You can capture manually.
          </div>
        )}

        {cameraError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {cameraError}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2.5">
          <button
            onClick={onCapture}
            disabled={!captureReady || !cameraReady}
            className="flex-1 h-11 bg-gray-900 text-white text-sm font-medium rounded-xl
                       flex items-center justify-center gap-2
                       hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed
                       transition-all duration-150"
          >
            <Camera className="h-4 w-4" />
            Capture selfie
          </button>
          <button
            onClick={onRestartCamera}
            className="h-11 w-11 flex items-center justify-center rounded-xl border border-gray-200
                       text-gray-500 hover:bg-gray-50 transition-all duration-150 flex-shrink-0"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {faceImagePreview && (
          <div className="flex items-center gap-3 px-3 py-3 bg-green-50 border border-green-200 rounded-xl">
            <Image
              src={faceImagePreview}
              alt="Captured"
              width={44}
              height={44}
              unoptimized
              className="w-11 h-11 rounded-full object-cover border-2 border-white flex-shrink-0"
            />
            <div>
              <p className="text-xs font-medium text-green-700">Selfie captured</p>
              <p className="text-[11px] text-green-600 mt-0.5">Ready for submission</p>
            </div>
            <CheckIcon className="h-4 w-4 text-green-500 ml-auto" />
          </div>
        )}
      </div>
    </div>
  );
}