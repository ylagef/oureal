import { useState, useEffect } from "react";
import { OuRealLogo } from "./OuRealLogo";

export const TermsModal = () => {
  const [termsAccepted, setTermsAccepted] = useState(true);

  useEffect(() => {
    const lsTermsAccepted = localStorage.getItem("termsAccepted") === "true";
    setTermsAccepted(lsTermsAccepted);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("termsAccepted", "true");
    window.location.href = "/new";
  };

  if (termsAccepted) return null;

  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-background px-4">
      <OuRealLogo />

      <div className="w-full border border-white rounded-xl p-6 max-w-lg mx-auto">
        <h1 className="text-5xl text-center text-red-500 mb-4">⚠️</h1>
        <div className="py-6 flex gap-4 flex-col">
          <p className="max-w-[60ch] text-justify mx-auto text-sm">
            Pulsando en "CREAR" aceptas que tu imagen sea utilizada para fines
            no comerciales, siendo publicadas en esta web y visible por
            cualquier persona que acceda a la misma.
          </p>
          <p className="max-w-[60ch] text-justify mx-auto text-sm">
            OuReal o su creador no se responsabiliza de la utilización que se
            haga de las imágenes publicadas en esta web. Si no estás de acuerdo,
            no continúes.
          </p>
        </div>

        <div className="flex items-center justify-center mt-6">
          <button
            className="bg-white rounded-lg py-2 px-4 text-xl text-black font-bold"
            onClick={handleAccept}
          >
            Aceptar y crear
          </button>
        </div>
      </div>
    </div>
  );
};
