import { useEffect, useState, useRef } from "react";
import * as faceapi from "face-api.js";

export const useFaceDetection = () => {
  const intervalRef = useRef<number | null>(null);
  const [isDetected, setIsDetected] = useState(false);
  const [instructions, setInstructions] = useState("Ensure your face is clearly visible");
  const detectionCounterRef = useRef<number>(0);
  const nonCenterCounterRef = useRef<number>(0);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("https://test-models.pages.dev/"),
          faceapi.nets.faceLandmark68Net.loadFromUri("https://test-models.pages.dev/"),
          faceapi.nets.faceRecognitionNet.loadFromUri("https://test-models.pages.dev/"),
          faceapi.nets.faceExpressionNet.loadFromUri("https://test-models.pages.dev/"),
        ]);
        startFaceDetection();
      } catch (error) {
        console.error("Error loading face-api models:", error);
      }
    };

    const startFaceDetection = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        const video = document.createElement("video");
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play();
          detectFace(video);
        };
        return () => {
          stream.getTracks().forEach((track) => track.stop());
          if (intervalRef.current) {
            cancelAnimationFrame(intervalRef.current);
          }
        };
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    const detectFace = (video: HTMLVideoElement) => {
      const detect = async () => {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        if (detections && detections.length === 1) {
          const face = detections[0];
          const { box } = face.detection;
          const centerX = (box.x + box.width / 2) / video.videoWidth;
          const centerY = (box.y + box.height / 2) / video.videoHeight;
          const centerXThreshold = 0.2;
          const centerYThreshold = 0.2;

          if (
            centerX > 0.5 - centerXThreshold &&
            centerX < 0.5 + centerXThreshold &&
            centerY > 0.5 - centerYThreshold &&
            centerY < 0.5 + centerYThreshold
          ) {
            nonCenterCounterRef.current = 0;
            setIsDetected(true);
            setInstructions("Face detected in center");
          } else {
            nonCenterCounterRef.current++;
            if (nonCenterCounterRef.current >= 10) {
              setIsDetected(false);
              setInstructions("Please center your face");
            }
          }
        } else if (detections.length > 1) {
          detectionCounterRef.current = 0;
          setIsDetected(false);
          setInstructions("Multiple faces detected. Please ensure only one face is visible");
        } else {
          nonCenterCounterRef.current++;
          if (nonCenterCounterRef.current >= 10) {
            setIsDetected(false);
            setInstructions("No face detected");
          }
        }
        intervalRef.current = requestAnimationFrame(detect);
      };
      intervalRef.current = requestAnimationFrame(detect);
    };

    loadModels();

    return () => {
      if (intervalRef.current) {
        cancelAnimationFrame(intervalRef.current);
      }
    };
  }, []);

  return { isDetected, instructions };
};
