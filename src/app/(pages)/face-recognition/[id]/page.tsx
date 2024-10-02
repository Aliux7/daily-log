"use client";
import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

export default function page() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [faceMatcher, setFaceMatcher] = useState<faceapi.FaceMatcher | null>(
    null
  );

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);

        const refFace = await faceapi.fetchImage(
          "https://media.licdn.com/dms/image/v2/D5603AQFGSv1zjsHNAA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1721640614676?e=1733356800&v=beta&t=w3Xxgk3vIVqxlGuXiN388Q3LWs9vZQVaMCCqbpb-_To"
          // "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Michael_Jordan_in_2014.jpg/220px-Michael_Jordan_in_2014.jpg"
          // "https://media.licdn.com/dms/image/v2/D5603AQFWvalwfG08Aw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1716183311690?e=1731542400&v=beta&t=CRZNlAjCtOa-Cu-KR4dM7csf_Kw9KA-nG-0Bg5vDrmU"
        );

        const refFaceData = await faceapi
          .detectSingleFace(refFace)
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (refFaceData) {
          const refDescriptor = [refFaceData.descriptor];
          setFaceMatcher(new faceapi.FaceMatcher(refDescriptor));
        }

        startVideo();
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };

    const startVideo = () => {
      if (videoRef.current) {
        navigator.mediaDevices
          .getUserMedia({ video: {} })
          .then((stream) => {
            videoRef.current!.srcObject = stream;
          })
          .catch((err) => console.error("Error accessing camera:", err));
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
                  const label = bestMatch.toString();

                  // Draw the box and label with faceapi.draw.DrawBox
                  const drawBox = new faceapi.draw.DrawBox(
                    detection.detection.box,
                    { label: label } // This will display the label
                  );
                  drawBox.draw(canvas);
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
  return (
    <div className="w-full h-full relative flex justify-center items-start m-0 p-0">
      <div className="w-full h-fit relative flex justify-center items-center">
        <video
          className="rounded-xl"
          ref={videoRef}
          id="video"
          // Aspect Ratio = 1,285714285714286
          width="560"
          height="435.5"
          autoPlay
          muted
        />
        <div ref={canvasRef} className="absolute" />
      </div>
    </div>
  );
}
