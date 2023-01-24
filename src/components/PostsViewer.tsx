import React, { useEffect, useState } from 'react'
import { deletePost, getPosts, Post, supabase } from '../utils/supabase'
import html2canvas from 'html2canvas'
import { OuRealLogo } from './OuRealLogo'

const BASE_URL = 'https://qnjsefzysabexpzkiqyr.supabase.co/storage/v1/object/public/posts/'

type PostWithSwap = Post & { swap: boolean }

export const PostsViewer = () => {
  const [superAdmin, setSuperAdmin] = useState<boolean>(false)

  const [myPostId, setMyPostId] = useState<string | null>(null)
  const [formattedPosts, setFormattedPosts] = useState<PostWithSwap[]>([])
  const [confirmDelete, setConfirmDelete] = useState<string | null>()

  const shareOnSocialMedia = async (post: PostWithSwap) => {
    if (!('share' in navigator)) {
      alert('Sharing not supported')
      return
    }

    const postElement = document.getElementById(post.id)

    const userImg = postElement?.querySelector(`#user-${post.id}`)?.cloneNode(true) as HTMLImageElement
    const environmentImg = postElement?.querySelector(`#environment-${post.id}`)?.cloneNode(true) as HTMLImageElement
    const ourRealLogo = document.getElementById('oureal-logo')?.cloneNode(true) as HTMLDivElement

    console.log({ userImg, environmentImg })

    const element = document.createElement('div')
    element.id = 'oureal-share-aux'
    element.style.width = window.innerWidth + 'px'
    element.style.height = window.innerHeight + 'px'
    element.style.backgroundColor = '#151515'
    element.style.padding = '1rem'
    element.style.position = 'relative'
    element.style.display = 'flex'
    element.style.flexDirection = 'column'
    element.style.justifyContent = 'center'

    element.appendChild(ourRealLogo)

    const innerElement = document.createElement('div')
    innerElement.style.width = '100%'
    innerElement.style.position = 'relative'
    innerElement.style.margin = '2rem 0'

    innerElement.appendChild(userImg)
    innerElement.appendChild(environmentImg)

    element.appendChild(innerElement)

    const hashtag = document.createElement('span')
    hashtag.innerText = '#OuReal2023'
    hashtag.style.width = '100%'
    hashtag.style.textAlign = 'center'
    hashtag.style.fontSize = '.8em'
    element.appendChild(hashtag)

    if (!element) {
      alert('Element not found')
      return
    }

    const shareHelper = document.getElementById('share-helper')
    shareHelper?.append(element)

    const canvas = await html2canvas(element, {
      backgroundColor: '#151515',
      useCORS: true
    })

    canvas.toBlob(async (blob) => {
      if (!blob) return

      const files = [new File([blob], 'oureal.png', { type: blob.type })]
      const shareData: ShareData = {
        text: 'OuReal - Entroido',
        title: 'OuReal - Entroido',
        url: 'https://oureal.netlify.app',
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

      element?.remove()
    })

    element?.remove()
  }

  const handleDeletePost = (id: string) => async () => {
    await deletePost(id)
    if (id === myPostId) {
      localStorage.removeItem('postId')
      localStorage.removeItem('images')
      window.location.href = '/new'
    } else {
      window.location.reload()
    }
  }

  useEffect(() => {
    setMyPostId(localStorage.getItem('postId'))

    getPosts().then((posts) => {
      setFormattedPosts(posts.map((post) => ({ ...post, swap: false })))
    })

    supabase.auth.getSession().then(({ data, error }) => {
      console.log({ data, error })
      setSuperAdmin(data?.session !== null)
    })
  }, [])
  return (
    <div className="flex grow flex-col gap-4 overflow-y-auto scrollbar-hide">
      <div className="sticky top-0 z-10 p-2">
        <OuRealLogo />
      </div>

      <div className="flex flex-col gap-8">
        {formattedPosts.map((post) => (
          <div key={post.id} className="relative">
            <div className={`w-full flex flex-col px-2 gap-2 ${confirmDelete === post.id ? 'opacity-20' : 'opacity-100'}`} id={post.id}>
              <div className="flex justify-between items-center px-2 gap-2">
                <div className="flex gap-2 items-center">
                  <img src="/user.svg" alt="User" className="w-5 border rounded-full" />
                  <span className="font-bold">{post.name}</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="opacity-50 text-xs">
                    {new Intl.DateTimeFormat('es-ES', {
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    }).format(new Date(post.created_at))}
                  </span>

                  <button onClick={() => shareOnSocialMedia(post)}>
                    <img src="/share.svg" alt="Share" className="w-5 opacity-70" />
                  </button>

                  {(superAdmin || myPostId === post.id) && (
                    <button onClick={() => setConfirmDelete(post.id)}>
                      <img src="/delete.svg" alt="Delete" className="w-5 opacity-70" />
                    </button>
                  )}
                </div>
              </div>

              <div className="relative w-full">
                <img
                  className="rounded"
                  src={`${BASE_URL}${post.id}/${post.swap ? 'environment' : 'user'}.webp`}
                  loading="lazy"
                  width={1000}
                  height={200}
                  id={`${post.swap ? 'environment' : 'user'}-${post.id}`}
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
                  className="absolute top-2 left-2 rounded"
                  src={`${BASE_URL}${post.id}/${!post.swap ? 'environment' : 'user'}.webp`}
                  id={`${!post.swap ? 'environment' : 'user'}-${post.id}`}
                  loading="lazy"
                  width={100}
                  height={200}
                />
              </div>
            </div>

            {confirmDelete === post.id && (
              <div className="absolute top-0 left-0 w-full h-full flex flex-col gap-2 items-center justify-center z-10">
                <span className="text-center mb-4">¿Seguro que deseas eliminar tu post?</span>
                <button className="font-bold bg-red-500 py-2 px-4 rounded-full" onClick={handleDeletePost(post.id)}>
                  Confirmar
                </button>
                <button
                  className="text-xs"
                  onClick={() => {
                    setConfirmDelete(null)
                  }}
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <span className="mt-2 mb-6 text-center opacity-50 text-xs">No hay más posts... Por ahora.</span>
    </div>
  )
}
