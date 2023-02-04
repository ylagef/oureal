import { useState, useEffect, useRef } from 'react'
import Webcam from 'react-webcam'
import { createPost } from '../utils/supabase'
import { ImagesLayout } from './ImagesLayout'
import { OuRealLogo } from './OuRealLogo'
import { Loading } from './Loading'

export interface Images {
  user: string | null
  environment: string | null
}

export const CreatePost = () => {
  const userWebcamRef = useRef<Webcam>(null)
  const environmentWebcamRef = useRef<Webcam>(null)

  const [swapped, setSwapped] = useState<boolean>(false)
  const [images, setImages] = useState<Images>({ user: null, environment: null })
  const [name, setName] = useState('')
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)

  const [videoDevices, setVideoDevices] = useState<MediaTrackSettings[]>([])

  const handleTake = async () => {
    const currentUserWebcam = userWebcamRef.current
    const currentEnvironmentWebcam = environmentWebcamRef.current

    setImages({
      user: currentUserWebcam ? currentUserWebcam?.getScreenshot() : null,
      environment: currentEnvironmentWebcam ? currentEnvironmentWebcam?.getScreenshot() : null
    })
  }

  useEffect(() => {
    if (images.user && images.environment) localStorage.setItem('images', JSON.stringify(images))
  }, [images])

  const handleCreatePost = async () => {
    if (images.user && images.environment) {
      setLoading(true)
      const post = await createPost({
        name,
        caption,
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

  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCaption(e.target.value)
  }

  function textAreaAdjust(element: HTMLTextAreaElement) {
    element.style.height = '1px'
    element.style.height = 5 + element.scrollHeight + 'px'
  }

  useEffect(() => {
    // log all video devices
    navigator.mediaDevices.getUserMedia({ video: true }).then((display) => {
      const settings = display.getVideoTracks().map((track) => {
        return track.getSettings()
      })
      console.log({ settings })
      setVideoDevices(settings)
    })

    let lsImages = localStorage.getItem('images')
    if (lsImages) {
      const imagesObj = JSON.parse(lsImages) as Images
      setImages(imagesObj)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="sticky top-0 z-10 p-2 backdrop-blur-sm w-full">
          <OuRealLogo />
        </div>
        <Loading />
      </div>
    )
  }

  if (images.user && images.environment) {
    return (
      <div className="flex flex-col gap-6 items-center px-2">
        <div className="sticky top-0 z-10 p-2 backdrop-blur-sm w-full">
          <OuRealLogo />
        </div>

        <div className="flex flex-col gap-2">
          <button
            className="w-full text-center py-2 px-4 rounded border border-white"
            onClick={() => {
              setImages({
                user: null,
                environment: null
              })
              localStorage.removeItem('images')
            }}
          >
            Repetir foto
          </button>

          <ImagesLayout id="test" images={[images.user, images.environment]} />
        </div>

        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-1">
            <label className="" htmlFor="name">
              ¿Cómo te llamas? *
            </label>
            <input
              id="name"
              className="w-full bg-transparent border border-brdr rounded py-2 px-4 text-center"
              maxLength={25}
              placeholder="Tu nombre"
              value={name}
              onChange={handleNameChange}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="" htmlFor="caption">
              ¿Qué está pasando?
            </label>
            <textarea
              id="caption"
              className="w-full bg-transparent border border-brdr rounded py-2 px-4 text-center resize-none h-[45px]"
              maxLength={100}
              placeholder="Descripción (opcional)"
              value={caption}
              onChange={handleCaptionChange}
              onKeyUp={(e) => textAreaAdjust(e.target as HTMLTextAreaElement)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 items-center w-full mb-8">
          <button
            className="bg-white py-2 px-4 font-bold text-black text-xl rounded-full tracking-wide disabled:opacity-50"
            onClick={handleCreatePost}
            disabled={!name || name === ''}
          >
            CREAR
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-bckg">
      <div className="w-full h-full relative grid items-center">
        <Webcam
          ref={swapped ? userWebcamRef : environmentWebcamRef}
          audio={false}
          mirrored={swapped}
          className="h-full object-cover"
          screenshotFormat="image/webp"
          screenshotQuality={1}
          forceScreenshotSourceSize
          minScreenshotWidth={1080}
          imageSmoothing
          videoConstraints={{
            width: videoDevices[0]?.width,
            height: videoDevices[0]?.height,
            aspectRatio: videoDevices[0]?.aspectRatio,
            facingMode: swapped ? 'user' : 'environment'
          }}
        />

        <Webcam
          ref={swapped ? environmentWebcamRef : userWebcamRef}
          audio={false}
          mirrored={!swapped}
          className="absolute top-2 left-2 w-32 object-cover rounded"
          screenshotFormat="image/webp"
          screenshotQuality={1}
          forceScreenshotSourceSize
          minScreenshotWidth={1080}
          imageSmoothing
          videoConstraints={{
            width: videoDevices[0]?.width,
            height: videoDevices[0]?.height,
            aspectRatio: videoDevices[0]?.aspectRatio,
            facingMode: swapped ? 'environment' : 'user'
          }}
          onClick={() => setSwapped((prev) => !prev)}
        />

        <button onClick={handleTake} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white opacity-50 rounded-full p-4">
          <img src="/camera.svg" className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}
