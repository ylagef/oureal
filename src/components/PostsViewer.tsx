import React, { useEffect } from 'react'
import type { Post } from '../utils/supabase'
import html2canvas from 'html2canvas'
import { OuRealLogo } from './OuRealLogo'

const BASE_URL = 'https://qnjsefzysabexpzkiqyr.supabase.co/storage/v1/object/public/posts/'

type PostWithSwap = Post & { swap: boolean }

export const PostsViewer = ({ posts }: { posts: Post[] }) => {
  const [formattedPosts, setFormattedPosts] = React.useState<PostWithSwap[]>([])

  useEffect(() => {
    setFormattedPosts(posts.map((post) => ({ ...post, swap: false })))
  }, [])

  const shareOnSocialMedia = async (post: Post) => {
    if (!('share' in navigator)) {
      alert('Sharing not supported')
      return
    }

    const element = document.getElementById(post.id)

    if (!element) {
      alert('Element not found')
      return
    }
    const canvas = await html2canvas(element, {
      backgroundColor: '#151515',
      useCORS: true,

      ignoreElements: (el) => el.id === 'share-container'
    })
    document.body.appendChild(canvas)
    canvas.toBlob(async (blob) => {
      if (!blob) return

      const files = [new File([blob], 'oureal.png', { type: blob.type })]
      const shareData = {
        text: 'Oureal - Entroido',
        title: 'Oureal - Entroido',
        files
      }
      if (navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData)
        } catch (err) {
          alert('Sharing failed')
          console.error(err)
        }
      } else {
        alert('Sharing not supported')
        console.warn('Sharing not supported', shareData)
      }
    })
  }

  return (
    <div className="flex grow flex-col gap-4 overflow-y-auto">
      {formattedPosts.map((post) => (
        <div className="w-full flex flex-col p-2 gap-2" key={post.id} id={post.id}>
          <div className="flex justify-between items-center px-2 gap-2">
            <span className="font-bold">{post.name}</span>
            <span className="opacity-50 text-xs">
              {new Intl.DateTimeFormat('es-ES', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              }).format(new Date(post.created_at))}
            </span>
          </div>

          <div className="relative w-full">
            <img className="w-full rounded" src={`${BASE_URL}${post.id}/${post.swap ? 'environment' : 'user'}.webp`} />
            <img
              onClick={() => {
                setFormattedPosts((prev) =>
                  prev.map((p) => {
                    if (p.id === post.id) {
                      return {
                        ...p,
                        swap: !p.swap
                      }
                    }

                    return p
                  })
                )
              }}
              className="absolute w-20 top-2 left-2 rounded border-2 border-black"
              src={`${BASE_URL}${post.id}/${!post.swap ? 'environment' : 'user'}.webp`}
            />
          </div>

          <div id="share-container" className="w-full flex items-center">
            <button onClick={() => shareOnSocialMedia(post)}>share</button>
          </div>
        </div>
      ))}

      <span className="py-6 text-center">¡No hay más posts!</span>
    </div>
  )
}
