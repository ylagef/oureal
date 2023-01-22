import { useState, useEffect, useRef } from 'react'
import Webcam from 'react-webcam'
import { decode } from 'base64-arraybuffer'
import { createPost } from '../utils/supabase'

interface Images {
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

  const showTimer = async (value: number) => {
    return new Promise((resolve) => {
      setTimer(value)

      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === null) {
            clearInterval(interval)
            resolve(null)
          }

          if (prev !== null && prev > 1) {
            return prev - 1
          }

          return null
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
    const imagesObj: Images = {
      user: imageBase64User,
      environment: imageBase64Environment
    }

    setImages(imagesObj)
    localStorage.setItem('images', JSON.stringify(imagesObj))

    setFacingMode('user')
  }

  const handleCreatePost = async () => {
    if (images.user && images.environment) {
      await createPost({
        name: 'test',
        visible: true,
        images
      })
    }
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
      <div className="relative">
        {images.user && <img src={images.user} className="w-full object-cover" />}

        {images.environment && <img src={images.environment} className="absolute top-0 left-0 w-14 object-cover" />}

        <button
          onClick={() => {
            setImages({
              user: null,
              environment: null
            })
            localStorage.removeItem('images')
          }}
        >
          reset
        </button>

        <button onClick={handleCreatePost}>create</button>
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
          mirrored
          audio={false}
          className="h-full object-cover"
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode
          }}
        />

        <button onClick={handleTake} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white opacity-50 rounded-full p-4">
          <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="#151515" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
            <circle cx="12" cy="13" r="3" />
          </svg>
        </button>
      </div>
    </div>
  )
}
