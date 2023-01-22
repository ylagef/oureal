import { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { decode } from "base64-arraybuffer";
import { createPost } from "../utils/supabase";

export const CreatePost = () => {
  const webcamRef = useRef(null);
  const [timer, setTimer] = useState<number | null>(null);
  const [imageSrc, setImageSrc] = useState<{
    user: string | null;
    environment: string | null;
  }>({
    user: null,
    environment: null,
  });
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  const showTimer = async (value: number) => {
    return new Promise((resolve) => {
      setTimer(value);

      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === null) {
            clearInterval(interval);
            resolve(null);
          }

          if (prev !== null && prev > 1) {
            return prev - 1;
          }

          return null;
        });
      }, 1000);
    });
  };

  const handleTake = async () => {
    if (!webcamRef.current) return;
    await showTimer(3);
    const currentWebcam = webcamRef.current as any;
    const imageBase64User = currentWebcam.getScreenshot();

    setFacingMode("environment");
    await showTimer(3);

    setTimeout(() => {
      const imageBase64Environment = currentWebcam.getScreenshot();
      localStorage.setItem("imageBase64", imageBase64User);
      setImageSrc({
        user: imageBase64User,
        environment: imageBase64Environment,
      });

      setFacingMode("user");
    }, 2000);
  };

  const handleCreatePost = async () => {
    if (!imageSrc.user) return;

    await createPost({
      name: "test",
      visible: true,
      file: decode(imageSrc.user),
    });
  };

  useEffect(() => {
    setImageSrc({
      user: localStorage.getItem("imageBase64"),
      environment: null,
    });
  }, []);

  if (imageSrc.user)
    return (
      <>
        {imageSrc.user && (
          <img src={imageSrc.user} className=" w-50 h-100 object-cover" />
        )}
        {imageSrc.environment && (
          <img
            src={imageSrc.environment}
            className=" w-50 h-100 object-cover"
          />
        )}
        <button
          onClick={() => {
            setImageSrc({
              user: null,
              environment: null,
            });
            localStorage.removeItem("imageBase64");
          }}
        >
          reset
        </button>

        <button onClick={handleCreatePost}>create</button>
      </>
    );

  return (
    <div className="w-full h-full bg-background">
      <div className="w-full h-full relative grid items-center">
        {timer !== null && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-50 z-10">
            <span className="text-6xl font-bold">{timer}</span>
          </div>
        )}

        <Webcam
          ref={webcamRef}
          mirrored
          audio={false}
          className="h-full object-cover"
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode,
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
