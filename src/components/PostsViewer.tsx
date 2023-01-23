import React, { useEffect } from 'react'
import type { Post } from '../utils/supabase'
import html2canvas from 'html2canvas'

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
    // `element` is the HTML element you want to share.
    // `backgroundColor` is the desired background color.
    const element = document.getElementById(post.id)
    if (!element) {
      alert('Element not found')
      return
    }
    const canvas = await html2canvas(element, {
      imageTimeout: 5000,
      backgroundColor: '#151515'
    })
    canvas.toBlob(async (blob) => {
      if (!blob) return

      // Even if you want to share just one file you need to
      // send them as an array of files.
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
            <img
              className="w-full rounded"
              src={`https://qnjsefzysabexpzkiqyr.supabase.co/storage/v1/object/public/posts/${post.id}/${post.swap ? 'environment' : 'user'}.webp`}
            />
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
              src={`https://qnjsefzysabexpzkiqyr.supabase.co/storage/v1/object/public/posts/${post.id}/${!post.swap ? 'environment' : 'user'}.webp`}
            />
          </div>

          <button onClick={() => shareOnSocialMedia(post)}>share</button>
        </div>
      ))}

      <span className="py-6 text-center">¡No hay más posts!</span>
    </div>
  )
}
