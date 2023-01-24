import React, { useEffect, useState } from 'react'
import Draggable from 'react-draggable'
import type { PostWithSwap } from './PostsViewer'

const BASE_URL = 'https://qnjsefzysabexpzkiqyr.supabase.co/storage/v1/object/public/posts/'

export const ImagesLayout = ({ post, handleSwap }: { post: PostWithSwap; handleSwap: (post: PostWithSwap) => void }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false)
  return (
    <div className="relative w-full">
      <img
        className="rounded"
        src={`${BASE_URL}${post.id}/${post.swap ? 'environment' : 'user'}.webp`}
        loading="lazy"
        width={1000}
        height={200}
        id={`${post.swap ? 'environment' : 'user'}-${post.id}`}
      />

      <div id={`drag-container-${post.id}`} className="absolute top-0 left-0 w-full h-full p-2" />

      <Draggable
        position={{ x: 0, y: 0 }}
        bounds={`#drag-container-${post.id}`}
        onStop={() => {
          if (!isDragging) handleSwap(post)
          setIsDragging(false)
        }}
        onDrag={() => {
          setIsDragging(true)
        }}
      >
        <img
          className="absolute top-2 left-2 rounded"
          src={`${BASE_URL}${post.id}/${!post.swap ? 'environment' : 'user'}.webp`}
          id={`${!post.swap ? 'environment' : 'user'}-${post.id}`}
          loading="lazy"
          width={100}
          height={200}
        />
      </Draggable>
    </div>
  )
}
