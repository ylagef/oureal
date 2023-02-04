import React, { useEffect, useState } from 'react'
import { deletePost, getPosts, Post, supabase, updatePostVisibility } from '../utils/supabase'
import html2canvas from 'html2canvas'
import { OuRealLogo } from './OuRealLogo'
import Draggable from 'react-draggable'
import { ImagesLayout } from './ImagesLayout'
import { Loading } from './Loading'

const BASE_URL = 'https://qnjsefzysabexpzkiqyr.supabase.co/storage/v1/object/public/posts/'

export const PostsViewer = () => {
  const [superAdmin, setSuperAdmin] = useState<boolean>(false)

  const [myPostId, setMyPostId] = useState<string | null>(null)
  const [formattedPosts, setFormattedPosts] = useState<Post[]>([])
  const [confirmDelete, setConfirmDelete] = useState<string | null>()
  const [loading, setLoading] = useState<boolean>(true)

  const shareOnSocialMedia = async (post: Post) => {
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
    setLoading(true)

    await deletePost(id)
    if (id === myPostId) {
      localStorage.removeItem('postId')
      localStorage.removeItem('images')
      window.location.href = '/new'
    } else {
      window.location.reload()
    }
  }

  const handleUpdatePostVisibility = async (post: Post) => {
    setLoading(true)

    await updatePostVisibility(post.id, !post.visible)
    setFormattedPosts((posts) => posts.map((p) => (p.id === post.id ? { ...p, visible: !p.visible } : p)))
    setLoading(false)
  }

  useEffect(() => {
    setMyPostId(localStorage.getItem('postId'))

    supabase.auth.getSession().then(({ data, error }) => {
      console.log({ data, error })
      const isSuperAdmin = data?.session !== null
      setSuperAdmin(isSuperAdmin)

      getPosts(isSuperAdmin).then((posts) => {
        setLoading(false)
        setFormattedPosts(posts.map((post) => ({ ...post, swap: false })))
      })
    })
  }, [])

  return (
    <div className="flex grow flex-col gap-2 overflow-y-auto scrollbar-hide">
      <div className="sticky top-0 z-10 p-2 backdrop-blur-sm">
        <OuRealLogo />
      </div>

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex flex-col gap-8 px-2">
            {formattedPosts.map((post) => (
              <div key={post.id} className={`relative ${post.visible ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-full flex flex-col gap-2 ${confirmDelete === post.id ? 'opacity-20' : 'opacity-100'}`} id={post.id}>
                  <div className="flex justify-between items-center px-2 gap-2">
                    <div className="flex gap-2 items-center max-w-[50%]">
                      <img src="/user.svg" alt="User" className="w-5 border rounded-full" />
                      <span className="font-bold text-ellipsis overflow-hidden">{post.name}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="opacity-50 text-xs text-center">
                        {new Intl.DateTimeFormat('es-ES', {
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                          timeZone: 'Europe/Madrid'
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

                      {superAdmin && (
                        <button onClick={() => handleUpdatePostVisibility(post)}>
                          <img src={`${post.visible ? 'eye-off' : 'eye'}.svg`} alt="Visible" className=" w-5 opacity-70" />
                        </button>
                      )}
                    </div>
                  </div>

                  <ImagesLayout id={post.id} images={[`${BASE_URL}${post.id}/user.webp`, `${BASE_URL}${post.id}/environment.webp`]} />

                  {post.caption && (
                    <div className="px-2 opacity-80">
                      <p className="text-sm break-words">
                        <span className="font-bold mr-1">{post.name}</span>
                        {post.caption}
                      </p>
                    </div>
                  )}
                </div>
                {confirmDelete === post.id && (
                  <div className="absolute top-0 left-0 w-full h-full flex flex-col gap-2 items-center justify-center z-10">
                    <span className="text-center">¿Seguro que deseas eliminar {superAdmin ? 'este' : 'tu'} post?</span>
                    <span className="text-center mb-4 text-sm">Esta acción es irreversible</span>
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
        </>
      )}
    </div>
  )
}
