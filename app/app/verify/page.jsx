"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as blazeface from "@tensorflow-models/blazeface";
import "@tensorflow/tfjs";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/context";
import { postWithToken } from "@/helpers/api";
import StepOneVerification from "../../../components/verify/StepOneVerification";
import StepTwoVerification from "../../../components/verify/StepTwoVerification";

const STEADY_REQUIRED_FRAMES = 12;
const LIVENESS_REQUIRED_FRAMES = 5;
const VERIFY_ENDPOINT = "/user/submit-for-verification";
const MAX_DOC_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FACE_FILE_SIZE = 5 * 1024 * 1024;

export default function VerifyPage() {
  const router = useRouter();
  const { accessToken, userInfo } = useAppContext();
  const queryClient = useQueryClient();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const isStartingCameraRef = useRef(false);
  const modelRef = useRef(null);
  const detectIntervalRef = useRef(null);
  const previousCenterRef = useRef(null);
  const steadyFramesRef = useRef(0);
  // ✅ FIX: mirror livenessState in a ref so the interval always reads fresh values
  const livenessStateRef = useRef({
    leftFrames: 0,
    rightFrames: 0,
    leftDone: false,
    rightDone: false,
  });

  const [cameraError, setCameraError] = useState("");
  const [cameraReady, setCameraReady] = useState(false);
  const [autoDetectionSupported, setAutoDetectionSupported] = useState(true);
  const [faceTip, setFaceTip] = useState("Initializing camera...");
  const [checks, setChecks] = useState({
    singleFace: false,
    distance: false,
    steady: false,
  });
  const [steadyProgress, setSteadyProgress] = useState(0);
  const [livenessState, setLivenessState] = useState({
    leftFrames: 0,
    rightFrames: 0,
    leftDone: false,
    rightDone: false,
  });
  const [captureReady, setCaptureReady] = useState(false);
  const [faceImagePreview, setFaceImagePreview] = useState("");
  const [faceImageFile, setFaceImageFile] = useState(null);
  const [documentType, setDocumentType] = useState("national_id");
  const [documentFile, setDocumentFile] = useState(null);
  const [documentPreview, setDocumentPreview] = useState("");
  const [verificationStage, setVerificationStage] = useState("face");
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [verificationInfo, setVerificationInfo] = useState(null);

  // ✅ FIX: always updates both state and ref together
  const updateLivenessState = (updater) => {
    setLivenessState((prev) => {
      const next = updater(prev);
      livenessStateRef.current = next;
      return next;
    });
  };

  const instructionText = useMemo(() => {
    if (!cameraReady) return "Starting camera...";
    if (!checks.singleFace) return "Align a single face in the frame";
    if (!checks.distance) return "Move slightly closer to fit the guide";
    if (!checks.steady) return "Hold still for a moment";
    if (!livenessState.leftDone || !livenessState.rightDone) {
      if (!livenessState.leftDone)
        return "For liveness: turn face slightly to left";
      return "For liveness: turn face slightly to right";
    }
    return "Great. Your selfie is ready to capture";
  }, [cameraReady, checks, livenessState]);

  const livenessProgress = useMemo(() => {
    const left = Math.min(
      100,
      Math.round((livenessState.leftFrames / LIVENESS_REQUIRED_FRAMES) * 100),
    );
    const right = Math.min(
      100,
      Math.round((livenessState.rightFrames / LIVENESS_REQUIRED_FRAMES) * 100),
    );
    return Math.round((left + right) / 2);
  }, [livenessState]);

  const frameProgress = useMemo(() => {
    if (!checks.steady) return steadyProgress;
    return livenessProgress;
  }, [steadyProgress, livenessProgress, checks.steady]);

  const resetDetectionState = () => {
    previousCenterRef.current = null;
    steadyFramesRef.current = 0;
    const reset = {
      leftFrames: 0,
      rightFrames: 0,
      leftDone: false,
      rightDone: false,
    };
    livenessStateRef.current = reset;
    setSteadyProgress(0);
    setLivenessState(reset);
    setCaptureReady(false);
    setChecks({ singleFace: false, distance: false, steady: false });
  };

  const stopCamera = (resetStartingState = true) => {
    if (resetStartingState) isStartingCameraRef.current = false;
    if (detectIntervalRef.current) {
      clearInterval(detectIntervalRef.current);
      detectIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraReady(false);
    resetDetectionState();
  };

  const detectFaceQuality = async () => {
    const video = videoRef.current;
    if (!video || video.readyState < 2 || !modelRef.current) return;
    try {
      const predictions = await modelRef.current.estimateFaces(video, false);
      if ((predictions?.length || 0) !== 1) {
        resetDetectionState();
        setFaceTip("Keep only one face in frame.");
        return;
      }

      const [prediction] = predictions;
      setChecks((prev) => ({ ...prev, singleFace: true }));

      const landmarks = prediction?.landmarks || [];
      const rightEye = landmarks[0],
        leftEye = landmarks[1];
      const rightEar = landmarks[4],
        leftEar = landmarks[5];

      const topLeftX = Number(prediction.topLeft?.[0] || 0);
      const topLeftY = Number(prediction.topLeft?.[1] || 0);
      const bottomRightX = prediction.bottomRight?.[0] || 0;
      const bottomRightY = Number(prediction.bottomRight?.[1] || 0);
      const faceWidth = bottomRightX - topLeftX;
      const faceHeight = bottomRightY - topLeftY;

      if (faceWidth < 150) {
        setChecks((prev) => ({ ...prev, distance: false, steady: false }));
        setSteadyProgress(0);
        setCaptureReady(false);
        steadyFramesRef.current = 0;
        previousCenterRef.current = null;
        const reset = {
          leftFrames: 0,
          rightFrames: 0,
          leftDone: false,
          rightDone: false,
        };
        livenessStateRef.current = reset;
        setLivenessState(reset);
        setFaceTip("Come closer to camera.");
        return;
      }
      setChecks((prev) => ({ ...prev, distance: true }));

      const centerX = topLeftX + faceWidth / 2;
      const centerY = topLeftY + faceHeight / 2;
      if (!previousCenterRef.current)
        previousCenterRef.current = { x: centerX, y: centerY };
      const dx = centerX - previousCenterRef.current.x;
      const dy = centerY - previousCenterRef.current.y;
      const movement = Math.sqrt(dx * dx + dy * dy);
      previousCenterRef.current = { x: centerX, y: centerY };

      if (movement < 8) steadyFramesRef.current += 1;
      else steadyFramesRef.current = Math.max(0, steadyFramesRef.current - 1);

      const progress = Math.min(
        100,
        Math.round((steadyFramesRef.current / STEADY_REQUIRED_FRAMES) * 100),
      );
      setSteadyProgress(progress);
      const isSteady = steadyFramesRef.current >= STEADY_REQUIRED_FRAMES;
      setChecks((prev) => ({ ...prev, steady: isSteady }));

      // ✅ FIX: read from ref, not from stale closure state
      let livenessOk =
        livenessStateRef.current.leftDone && livenessStateRef.current.rightDone;

      if (isSteady && rightEye && leftEye && rightEar && leftEar) {
        const leftDelta = leftEar[0] - leftEye[0];
        const rightDelta = rightEye[0] - rightEar[0];
        const yawDiff = rightDelta - leftDelta;
        const yawThreshold = Math.max(12, faceWidth * 0.06);
        let horizontal = "front";
        if (yawDiff > yawThreshold) horizontal = "left";
        if (yawDiff < -yawThreshold) horizontal = "right";

        updateLivenessState((prev) => {
          let nextLeftFrames = prev.leftFrames;
          let nextRightFrames = prev.rightFrames;
          if (!prev.leftDone)
            nextLeftFrames =
              horizontal === "left"
                ? Math.min(LIVENESS_REQUIRED_FRAMES, prev.leftFrames + 1)
                : Math.max(0, prev.leftFrames - 1);
          if (!prev.rightDone)
            nextRightFrames =
              horizontal === "right"
                ? Math.min(LIVENESS_REQUIRED_FRAMES, prev.rightFrames + 1)
                : Math.max(0, prev.rightFrames - 1);
          const nextLeftDone =
            prev.leftDone || nextLeftFrames >= LIVENESS_REQUIRED_FRAMES;
          const nextRightDone =
            prev.rightDone || nextRightFrames >= LIVENESS_REQUIRED_FRAMES;
          livenessOk = nextLeftDone && nextRightDone;
          return {
            leftFrames: nextLeftFrames,
            rightFrames: nextRightFrames,
            leftDone: nextLeftDone,
            rightDone: nextRightDone,
          };
        });
      }

      const ready = isSteady && livenessOk;
      setCaptureReady(ready);

      if (!isSteady) {
        setFaceTip("Hold still for better verification.");
      } else if (!livenessOk) {
        const cur = livenessStateRef.current;
        if (!cur.leftDone && !cur.rightDone)
          setFaceTip("For liveness, turn slightly left and right.");
        else if (!cur.leftDone)
          setFaceTip("Please turn slightly to left to confirm liveness.");
        else setFaceTip("Please turn slightly to right to confirm liveness.");
      } else {
        setFaceTip("Perfect. Ready to capture.");
      }
    } catch {
      setFaceTip("Analyzing selfie quality...");
    }
  };

  const startCamera = async () => {
    if (isStartingCameraRef.current) return;
    isStartingCameraRef.current = true;
    stopCamera(false);
    setCameraError("");
    setFaceTip("Initializing camera...");
    try {
      if (!navigator?.mediaDevices?.getUserMedia)
        throw new Error("media_devices_unavailable");
      let stream = null;
      for (const constraints of [
        {
          video: {
            facingMode: "user",
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
          audio: false,
        },
        { video: { facingMode: "user" }, audio: false },
        { video: true, audio: false },
      ]) {
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints);
          break;
        } catch {
          stream = null;
        }
      }
      if (!stream) throw new Error("camera_unavailable");
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraReady(true);
      setCameraError("");
      try {
        if (!modelRef.current) modelRef.current = await blazeface.load();
        setAutoDetectionSupported(true);
        detectIntervalRef.current = setInterval(detectFaceQuality, 120);
      } catch {
        setAutoDetectionSupported(false);
        setCaptureReady(true);
        const full = {
          leftFrames: LIVENESS_REQUIRED_FRAMES,
          rightFrames: LIVENESS_REQUIRED_FRAMES,
          leftDone: true,
          rightDone: true,
        };
        livenessStateRef.current = full;
        setLivenessState(full);
        setFaceTip("Automatic checks unavailable. Capture manually.");
      }
    } catch (err) {
      const message =
        err?.name === "NotAllowedError"
          ? "Camera permission denied. Please allow camera access in browser settings and reload."
          : err?.name === "NotReadableError"
            ? "Camera is being used by another app/tab. Close other camera apps and try again."
            : err?.name === "OverconstrainedError"
              ? "Camera settings are not supported on this device. Please retry."
              : err?.message === "media_devices_unavailable"
                ? "Camera API is unavailable. Use HTTPS and a supported browser like Chrome/Safari."
                : "Unable to access camera. Please allow camera permission.";
      setCameraError(message);
      setFaceTip("Camera unavailable. Please check permission and restart.");
    } finally {
      isStartingCameraRef.current = false;
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);
  useEffect(() => {
    if (
      verificationStage === "face" &&
      !streamRef.current &&
      !isStartingCameraRef.current
    )
      startCamera();
  }, [verificationStage]);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current || !captureReady) return;
    const video = videoRef.current,
      canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setFaceImagePreview(dataUrl);
    const blob = await (await fetch(dataUrl)).blob();
    setFaceImageFile(
      new File([blob], `face-${Date.now()}.jpg`, { type: "image/jpeg" }),
    );
    stopCamera();
    toast.success("Face image captured");
    setVerificationStage("document");
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocumentFile(file);
    setDocumentPreview(
      file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
    );
  };

  const verifyMutation = useMutation({
    mutationFn: async (formData) =>
      postWithToken(VERIFY_ENDPOINT, formData, accessToken),
    onSuccess: (data) => {
      if (data.status === true) {
        setIsUserVerified(true);
        setVerificationInfo(data.data);
        queryClient.invalidateQueries({ queryKey: ["/user/is-verified"] });
        toast.success(data.message || "Verification submitted successfully");
        router.push("/app/profile");
      } else {
        setIsUserVerified(false);
        setVerificationInfo(null);
        toast.error(data.message || "Profile Not Verified");
      }
    },
    onError: () => {
      setIsUserVerified(false);
      setVerificationInfo(null);
      toast.error("Failed to submit verification");
    },
  });

  const handleSubmit = () => {
    if (!accessToken) {
      toast.error("Please log in again");
      return;
    }
    if (!faceImageFile) {
      toast.error("Capture your face image first");
      return;
    }
    if (!documentFile) {
      toast.error("Upload a verification document");
      return;
    }
    if (faceImageFile.size > MAX_FACE_FILE_SIZE) {
      toast.error("Selfie image is too large. Please capture again.");
      return;
    }
    if (documentFile.size > MAX_DOC_FILE_SIZE) {
      toast.error("Document is too large. Please upload a file under 10 MB.");
      return;
    }

    const formData = new FormData();
    formData.append("identity_type", documentType);
    formData.append("identity_card", documentFile);
    formData.append("user_verification_image", faceImageFile);

    const hasPayload = formData.entries().next().done === false;
    if (!hasPayload) {
      toast.error("Unable to prepare verification payload. Please try again.");
      return;
    }

    verifyMutation.mutate(formData);
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Identity Verification
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Complete Step 1 first, then continue to document upload in Step 2.
        </p>
      </div>
      {verificationStage === "face" ? (
        <StepOneVerification
          cameraReady={cameraReady}
          cameraError={cameraError}
          instructionText={instructionText}
          faceTip={faceTip}
          checks={checks}
          steadyProgress={frameProgress}
          livenessState={livenessState}
          livenessProgress={livenessProgress}
          autoDetectionSupported={autoDetectionSupported}
          captureReady={captureReady}
          videoRef={videoRef}
          canvasRef={canvasRef}
          faceImagePreview={faceImagePreview}
          onCapture={handleCapture}
          onRestartCamera={startCamera}
        />
      ) : (
        <StepTwoVerification
          documentType={documentType}
          onDocumentTypeChange={setDocumentType}
          onDocumentChange={handleDocumentChange}
          documentFile={documentFile}
          documentPreview={documentPreview}
          faceImagePreview={faceImagePreview}
          isSubmitting={verifyMutation.isPending}
          onSubmit={handleSubmit}
          onBackToStepOne={() => setVerificationStage("face")}
        />
      )}
    </section>
  );
}
