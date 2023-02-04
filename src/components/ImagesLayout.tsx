import { useState } from 'react'
import Draggable from 'react-draggable'

export const ImagesLayout = ({ id, images }: { id: string; images: string[] }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [swapped, setSwapped] = useState<boolean>(false)
  const [position, setPosition] = useState<'left' | 'right'>('left')

  return (
    <div className="relative w-full">
      <img
        className="rounded"
        src={images[swapped ? 1 : 0]}
        loading="lazy"
        width={1000}
        height={200}
        id={`${swapped ? 'environment' : 'user'}-${id}`}
      />

      <div id={`drag-container-${id}`} className="absolute top-0 left-0 w-full h-full p-2" />

      <Draggable
        position={{ x: 0, y: 0 }}
        bounds={`#drag-container-${id}`}
        onStop={(ev) => {
          if (!isDragging) {
            setSwapped((prev) => !prev)
          } else {
            setIsDragging(false)

            const containerWidth = document.getElementById(`drag-container-${id}`)?.offsetWidth || 1000
            const event = ev as TouchEvent
            console.log('1', event.changedTouches)
            if (!event.changedTouches) return
            const touch = event.changedTouches[0]
            console.log('2', touch.clientX > containerWidth / 2 ? 'right' : 'left')

            setPosition(touch.clientX > containerWidth / 2 ? 'right' : 'left')
          }
        }}
        onDrag={() => {
          setIsDragging(true)
        }}
      >
        <img
          className={`absolute top-2 ${position === 'left' ? 'left-2' : 'right-2'} rounded`}
          src={images[swapped ? 0 : 1]}
          id={`${!swapped ? 'environment' : 'user'}-${id}`}
          loading="lazy"
          width={100}
          height={200}
        />
      </Draggable>
    </div>
  )
}
