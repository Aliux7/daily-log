"use client";
import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { clockIn, clockOut } from "@/app/(pages)/absensi/actions";
import { useAuth } from "@/app/context/AuthContext";

interface FaceScannerProps {
  setShowCamera: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  fetchDataAbsensi: () => void;
  id: string;
  name: string;
  typeAbsen: string;
  profileUrl: string;
}

export default function FaceScanner(props: FaceScannerProps) {
  const { userData, businessData, loading } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [cameraStatus, setCameraStatus] = useState(false);
  const [faceMatcher, setFaceMatcher] = useState<faceapi.FaceMatcher | null>(
    null
  );

  const [matchStatus, setMatchStatus] = useState(false);
  const [matchAccuracy, setMatchAccuracy] = useState<number | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);

        const refFace = await faceapi.fetchImage(props.profileUrl);

        const refFaceData = await faceapi
          .detectSingleFace(refFace)
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (refFaceData) {
          const refDescriptor = [refFaceData.descriptor];
          setFaceMatcher(new faceapi.FaceMatcher(refDescriptor));
        }

        startVideo();
      } catch (error: any) {
        console.error("Error loading models:", error.message);
      }
    };

    const startVideo = () => {
      if (videoRef.current) {
        navigator.mediaDevices
          .getUserMedia({ video: {} })
          .then((stream) => {
            videoRef.current!.srcObject = stream;
            setCameraStatus(true);
          })
          .catch((err) => {
            console.error("Error accessing camera:", err);
            setCameraStatus(false);
          });
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    const handlePlay = () => {
      if (videoRef.current && canvasRef.current) {
        const canvas = faceapi.createCanvasFromMedia(videoRef.current);
        canvasRef.current.appendChild(canvas);
        const displaySize = {
          width: videoRef.current.width,
          height: videoRef.current.height,
        };
        faceapi.matchDimensions(canvas, displaySize);

        const updateCanvas = async () => {
          if (videoRef.current) {
            const detections = await faceapi
              .detectAllFaces(
                videoRef.current,
                new faceapi.SsdMobilenetv1Options()
              )
              .withFaceLandmarks()
              .withFaceDescriptors();
            const resizedDetections = faceapi.resizeResults(
              detections,
              displaySize
            );
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.clearRect(0, 0, displaySize.width, displaySize.height);
              faceapi.draw.drawDetections(canvas, resizedDetections);
              faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

              if (faceMatcher) {
                resizedDetections.forEach((detection) => {
                  const bestMatch = faceMatcher.findBestMatch(
                    detection.descriptor
                  );
                  const accuracy = bestMatch.distance;
                  const label = bestMatch.toString();

                  const drawBox = new faceapi.draw.DrawBox(
                    detection.detection.box,
                    { label: label }
                  );
                  drawBox.draw(canvas);
                  if (accuracy < 0.45) {
                    setMatchStatus(true);
                    setMatchAccuracy(accuracy);
                  } else {
                    setMatchStatus(false);
                    setMatchAccuracy(null);
                  }
                });
              }
            }
          }
        };

        const intervalId = setInterval(updateCanvas, 100);

        return () => clearInterval(intervalId);
      }
    };

    if (videoRef.current) {
      videoRef.current.addEventListener("play", handlePlay);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("play", handlePlay);
      }
    };
  }, [faceMatcher]);

  const handleSubmitAbsen = async () => {
    if (!businessData) return;
    props.setLoading(true);
    if (props.typeAbsen == "Masuk") await clockIn(businessData?.id, props.id);
    if (props.typeAbsen == "Keluar") await clockOut(businessData?.id, props.id);
    props.setLoading(false);
    props.setShowCamera(false);
    props.fetchDataAbsensi();
  };

  return (
    <div
      className="w-fit h-fit relative flex flex-col justify-center items-start bg-gray-100 mt-5 p-2 rounded-lg"
      onClick={(e) => e.stopPropagation()}
    >
      {!cameraStatus && (
        <div role="status">
          <svg
            aria-hidden="true"
            className="inline w-6 h-6 text-gray-200 animate-spin fill-first-color"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      )}

      <div className="relative flex flex-col justify-start items-start gap-3">
        <video
          className="rounded-xl"
          ref={videoRef}
          id="video"
          // Aspect Ratio = 1,285714285714286
          width="320"
          height="240"
          autoPlay
          muted
        />
        <div ref={canvasRef} className="absolute" />

        <div className="px-1 flex flex-col gap-1 w-full">
          <h3>
            ID: <span className="text-first-color">#{props.id}</span>
          </h3>
          <h3>Nama: {props.name}</h3>
          <h3 className="flex justify-start items-center">
            Status:{" "}
            {matchStatus && matchAccuracy !== null && matchAccuracy < 0.45 ? (
              <span className="bg-green-300 text-green-700 px-1 py-px rounded-md mx-1">
                Sesuai
              </span>
            ) : (
              <span className="bg-red-300 text-red-700 px-1 py-px rounded-md mx-1">
                Tidak Sesuai
              </span>
            )}
          </h3>

          <p className="text-xs text-gray-700 italic">
            Catatan: Pastikan hanya 1 orang yang deteksi
          </p>
          <button
            onClick={handleSubmitAbsen}
            disabled={
              !(matchStatus && matchAccuracy !== null && matchAccuracy < 0.45)
            }
            className={`mt-2 px-4 py-2 ${
              !(matchStatus && matchAccuracy !== null && matchAccuracy < 0.45)
                ? "bg-gray-500"
                : "bg-first-color hover:bg-first-color/90"
            } text-white rounded w-full`}
          >
            {props.typeAbsen}
          </button>
        </div>
      </div>
    </div>
  );
}
