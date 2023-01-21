import { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";

export const CreatePostModal = () => {
  const webcamRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const lsAcceptedTerms = localStorage.getItem("acceptedTerms") === "true";
    const lsImageTaken = localStorage.getItem("imageTaken") === "true";

    console.log({ lsAcceptedTerms, lsImageTaken });
    setShowModal(lsAcceptedTerms && !lsImageTaken);
  }, []);

  const handleTake = () => {
    if (!webcamRef.current) return;
    const currentWebcam = webcamRef.current as any;
    const imageSrc = currentWebcam.getScreenshot();
    console.log({ imageSrc });
    localStorage.setItem("imageTaken", "true");
    localStorage.setItem("imageBase64", imageSrc);

    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-background">
      <div className="w-screen h-screen relative grid items-center">
        <Webcam
          ref={webcamRef}
          mirrored
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: "user",
            height: 1920,
            aspectRatio: 1920 / 1080,
          }}
        />

        <button
          onClick={handleTake}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white opacity-70 rounded-full p-4"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#151515"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
            <circle cx="12" cy="13" r="3" />
          </svg>
        </button>
      </div>
    </div>
  );
};
