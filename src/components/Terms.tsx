import { useState, useEffect } from 'react'
import { OuRealLogo } from './OuRealLogo'

export const Terms = () => {
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleStart = () => {
    localStorage.setItem('termsAccepted', 'true')
    window.location.href = '/new'
  }

  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-bckg px-4">
      <OuRealLogo />

      <img src="/alert-circle.svg" alt="Alert" className="w-16 mx-auto" />

      <div className="flex gap-2 items-center justify-center mt-6">
        <input
          type="checkbox"
          id="terms"
          className="w-4 h-4"
          checked={termsAccepted}
          onChange={(e) => {
            setTermsAccepted(e.target.checked)
          }}
        />
        <label htmlFor="terms">
          Acepto los{' '}
          <button
            onClick={() => {
              setExpanded((prev) => !prev)
            }}
            className="underline"
          >
            términos y condiciones
          </button>
        </label>
      </div>

      {expanded && (
        <div className="w-full p-4 max-w-lg mx-auto mt-4 border rounded-xl">
          <h3 className="font-bold text-center text-lg">Términos y condiciones</h3>

          <div className="py-6 flex gap-4 flex-col">
            <p className="max-w-[60ch] text-justify mx-auto text-sm">
              Pulsando en "Empezar" aceptas que tu imagen sea utilizada para fines no comerciales, siendo publicadas las fotos tomadas en esta web y
              visibles por cualquier persona que acceda a la misma.
            </p>
            <p className="max-w-[60ch] text-justify mx-auto text-sm">
              OuReal o su creador no se responsabiliza de la utilización que se haga de las imágenes publicadas en esta web.
            </p>
            <p className="max-w-[60ch] text-justify mx-auto text-sm">
              Idea basada en la app{' '}
              <a href="https://bere.al/" target="_blank" className="underline">
                BeReal
              </a>{' '}
              con fines no comerciales y de entretenimiento para su uso como disfraz en el Entroido de Ourense 2023.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center mt-6">
        <button
          className="bg-white rounded-full py-2 px-4 text-xl text-black font-bold disabled:opacity-50"
          onClick={handleStart}
          disabled={!termsAccepted}
        >
          Empezar
        </button>
      </div>
    </div>
  )
}
