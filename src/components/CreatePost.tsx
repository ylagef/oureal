import { useState, useEffect, useRef } from 'react'
import Webcam from 'react-webcam'
import { createPost } from '../utils/supabase'
import { OuRealLogo } from './OuRealLogo'

export interface Images {
  user: string | null
  environment: string | null
}

export const CreatePost = () => {
  const webcamRef = useRef(null)
  const [timer, setTimer] = useState<number | null>(null)
  const [images, setImages] = useState<Images>({
    user: null,
    environment: null
  })
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')
  const [name, setName] = useState('')

  const showTimer = async (value: number) => {
    return new Promise((resolve) => {
      setTimer(value)

      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev !== null && prev > 1) {
            return prev - 1
          } else {
            clearInterval(interval)
            resolve(null)
            return null
          }
        })
      }, 1000)
    })
  }

  const handleTake = async () => {
    if (!webcamRef.current) return
    await showTimer(3)
    const currentWebcam = webcamRef.current as any
    const imageBase64User = currentWebcam.getScreenshot()

    setFacingMode('environment')
    await showTimer(3)

    const imageBase64Environment = currentWebcam.getScreenshot()

    setImages({
      user: imageBase64User,
      environment: imageBase64Environment
    })
    setFacingMode('user')
  }

  const handleCreatePost = async () => {
    if (images.user && images.environment) {
      localStorage.setItem('images', JSON.stringify(images))
      await createPost({
        name,
        visible: true,
        images
      })

      window.location.href = '/feed'
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  useEffect(() => {
    let lsImages = localStorage.getItem('images')
    if (lsImages) {
      const imagesObj = JSON.parse(lsImages) as Images
      setImages(imagesObj)
    }
  }, [])

  if (images.user && images.environment) {
    return (
      <div className="flex flex-col gap-4 items-center p-2">
        <OuRealLogo />

        <div className="relative">
          {images.user && <img src={images.user} className="w-full object-cover rounded" />}

          {images.environment && <img src={images.environment} className="absolute top-2 left-2 rounded w-20 object-cover" />}
        </div>

        <input
          className="w-48 max-w-full bg-transparent border border-white rounded py-2 px-4 text-center"
          maxLength={10}
          placeholder="Tu nombre"
          value={name}
          onChange={handleNameChange}
        />

        <div className="flex flex-col gap-2 items-center">
          <button
            className="bg-white py-2 px-4 font-bold text-black text-xl rounded-xl tracking-wide disabled:opacity-50"
            onClick={handleCreatePost}
            disabled={!name || name === ''}
          >
            CREAR
          </button>

          <button
            className="text-xs underline"
            onClick={() => {
              setImages({
                user: null,
                environment: null
              })
              localStorage.removeItem('images')
            }}
          >
            Volver a intentar
          </button>
        </div>
      </div>
    )
  }

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
          audio={false}
          mirrored={facingMode === 'user'}
          className="h-full object-cover"
          screenshotFormat="image/webp"
          videoConstraints={{
            facingMode
          }}
        />

        {timer === null && (
          <button onClick={handleTake} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white opacity-50 rounded-full p-4">
            <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="#151515" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
