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
      <div className="w-screen h-screen relative">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: "user",
          }}
        />

        <button onClick={handleTake}>Take</button>
      </div>
    </div>
  );
};
