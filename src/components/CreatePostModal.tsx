import { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { decode } from "base64-arraybuffer";
import { createPost } from "../utils/supabase";

export const CreatePostModal = () => {
  const webcamRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    const lsAcceptedTerms = localStorage.getItem("acceptedTerms") === "true";
    const lsImageTaken = localStorage.getItem("imageTaken") === "true";
    const lsImageBase64 = localStorage.getItem("imageBase64");
    if (lsImageBase64) setImageSrc(lsImageBase64);

    setShowModal(lsAcceptedTerms && !lsImageTaken);
  }, []);

  const handleTake = async () => {
    if (!webcamRef.current) return;
    const currentWebcam = webcamRef.current as any;
    const imageSrc = currentWebcam.getScreenshot();
    setImageSrc(imageSrc);
    // localStorage.setItem("imageTaken", "true");
    // localStorage.setItem("imageBase64", imageSrc);

    await createPost({
      name: "test",
      visible: true,
      file: decode(imageSrc),
    });
  };

  console.log({ imageSrc });

  if (!showModal) return null;

  if (imageSrc)
    return (
      <>
        <h1>he</h1>
        <img
          src={imageSrc}
          className="absolute top-0 left-0 w-50 h-100 object-cover"
        />
      </>
    );

  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-background">
      <div className="w-screen h-screen relative grid items-center">
        <Webcam
          ref={webcamRef}
          mirrored
          audio={false}
          className="h-full object-cover"
          videoConstraints={{
            facingMode: "user",
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
            strokeWidth="1.5"
            stroke="#151515"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
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
