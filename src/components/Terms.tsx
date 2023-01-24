import { useState, useEffect } from 'react'
import { OuRealLogo } from './OuRealLogo'

export const Terms = () => {
  const [termsAccepted, setTermsAccepted] = useState(true)

  useEffect(() => {
    const lsTermsAccepted = localStorage.getItem('termsAccepted') === 'true'
    setTermsAccepted(lsTermsAccepted)
  }, [])

  const handleAccept = () => {
    localStorage.setItem('termsAccepted', 'true')
    window.location.href = '/new'
  }

  if (termsAccepted) return null

  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-background px-4">
      <OuRealLogo />

      <div className="w-full px-2 max-w-lg mx-auto">
        <img src="/alert-circle.svg" alt="Alert" className="w-16 mx-auto" />

        <div className="py-6 flex gap-4 flex-col">
          <p className="max-w-[60ch] text-justify mx-auto text-sm">
            Pulsando en "Aceptar y empezar" aceptas que tu imagen sea utilizada para fines no comerciales, siendo publicadas en esta web y visible por
            cualquier persona que acceda a la misma.
          </p>
          <p className="max-w-[60ch] text-justify mx-auto text-sm">
            OuReal o su creador no se responsabiliza de la utilización que se haga de las imágenes publicadas en esta web. Si no estás de acuerdo, no
            continúes.
          </p>
        </div>

        <div className="flex items-center justify-center mt-6">
          <button className="bg-white rounded-full py-2 px-4 text-xl text-black font-bold" onClick={handleAccept}>
            Aceptar y empezar
          </button>
        </div>
      </div>
    </div>
  )
}
