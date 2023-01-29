import { useState, useEffect, useRef } from 'react'
import Webcam from 'react-webcam'
import { createPost } from '../utils/supabase'
import { ImagesLayout } from './ImagesLayout'
import { OuRealLogo } from './OuRealLogo'

export interface Images {
  user: string | null
  environment: string | null
}

export const CreatePost = () => {
  const webcamRef = useRef<Webcam>(null)
  const [userMediaLoaded, setUserMediaLoaded] = useState<boolean>(false)
  const [timer, setTimer] = useState<number | null>(null)
  const [images, setImages] = useState<Images>({
    user: null,
    environment: null
  })
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')
  const [name, setName] = useState('')

  const swapFacingMode = () => {
    setUserMediaLoaded(false)
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

    setImages((prev) => ({
      ...prev,
      [facingMode]: currentWebcam.getScreenshot()
    }))

    swapFacingMode()
    await showTimer(1)

    setImages((prev) => ({
      ...prev,
      [facingMode === 'user' ? 'environment' : 'user']: currentWebcam.getScreenshot()
    }))

    setFacingMode('user')
  }

  useEffect(() => {
    if (images.user && images.environment) localStorage.setItem('images', JSON.stringify(images))
  }, [images])

  const handleCreatePost = async () => {
    if (images.user && images.environment) {
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

        <ImagesLayout id="test" images={[images.user, images.environment]} />

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
          onUserMedia={(ev) => {
            console.log('onUserMedia', ev)
            setUserMediaLoaded(true)
          }}
        />
        <Webcam
          ref={webcamRef}
          audio={facingMode === 'user'}
          className="absolute top-2 left-2 w-40 object-cover rounded"
          screenshotFormat="image/webp"
          videoConstraints={{
            facingMode: facingMode === 'user' ? 'environment' : 'user'
          }}
          onUserMedia={(ev) => {
            console.log('onUserMedia', ev)
            setUserMediaLoaded(true)
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
