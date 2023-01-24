import { useState, useEffect, useRef } from 'react'
import Webcam from 'react-webcam'
import { createPost } from '../utils/supabase'
import { OuRealLogo } from './OuRealLogo'

export interface Images {
  user: string | null
  environment: string | null
}

export const CreatePost = () => {
  const webcamRef = useRef<Webcam>(null)
  const [timer, setTimer] = useState<number | null>(null)
  const [images, setImages] = useState<Images>({
    user: null,
    environment: null
  })
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')
  const [name, setName] = useState('')

  const swapFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
  }

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
    const currentWebcam = webcamRef.current
    if (!currentWebcam) return

    await showTimer(3)

    setImages((prev) => ({
      ...prev,
      [facingMode]: currentWebcam.getScreenshot()
    }))

    swapFacingMode()
    await showTimer(3)

    setImages((prev) => ({
      ...prev,
      [facingMode === 'user' ? 'environment' : 'user']: currentWebcam.getScreenshot()
    }))

    setFacingMode('user')
  }

  useEffect(() => {
    console.log(images)
  }, [images])

  const handleCreatePost = async () => {
    if (images.user && images.environment) {
      localStorage.setItem('images', JSON.stringify(images))
      const post = await createPost({
        name,
        visible: true,
        images
      })
      localStorage.setItem('postId', post.id)

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
      <div className="flex flex-col gap-6 items-center p-2">
        <OuRealLogo />

        <div className="relative">
          {images.user && <img src={images.user} className="w-full object-cover rounded" />}
          {images.environment && <img src={images.environment} className="absolute top-2 left-2 rounded w-20 object-cover" />}
        </div>

        <input
          className="w-full bg-transparent border border-brdr rounded py-2 px-4 text-center"
          maxLength={10}
          placeholder="Tu nombre"
          value={name}
          onChange={handleNameChange}
        />

        <div className="flex flex-col gap-2 items-center w-full">
          <button
            className="bg-white py-2 px-4 font-bold text-black text-xl rounded-full tracking-wide disabled:opacity-50"
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
            Volver a intentarlo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-bckg">
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
          <>
            <button onClick={handleTake} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white opacity-50 rounded-full p-4">
              <img src="/camera.svg" className="w-6 h-6" />
            </button>

            <button onClick={swapFacingMode} className="absolute bottom-8 right-8 border opacity-50 rounded-full p-4">
              <img src="/camera-rotate.svg" className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
