import { useEffect, useState } from 'react'
import { getPosts, Post, supabase } from '../utils/supabase'
import { Loading } from './Loading'
import { OuRealLogo } from './OuRealLogo'
import { PostsView } from './PostView'

export const PostsViewer = () => {
  const [superAdmin, setSuperAdmin] = useState<boolean | null>(null)
  const [myPostId, setMyPostId] = useState<string | null>(null)
  const [formattedPosts, setFormattedPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const refreshPosts = async () => {
    if (superAdmin === null) return

    const posts = await getPosts(superAdmin)
    setFormattedPosts(posts.map((post) => ({ ...post, swap: false })))
    setLoading(false)
  }

  useEffect(() => {
    refreshPosts()
  }, [superAdmin])

  useEffect(() => {
    setMyPostId(localStorage.getItem('postId'))

    supabase.auth.getSession().then(({ data }) => {
      const isSuperAdmin = data?.session !== null
      setSuperAdmin(isSuperAdmin)
    })
  }, [])

  return (
    <div className="flex grow flex-col gap-2 overflow-y-auto scrollbar-hide">
      <div className="sticky top-0 z-10 p-2 backdrop-blur-sm">
        <OuRealLogo />
      </div>

      {loading || superAdmin === null ? (
        <Loading />
      ) : (
        <>
          <div className="flex flex-col gap-8 px-2">
            {formattedPosts.map((post) => (
              <PostsView key={post.id} post={post} superAdmin={superAdmin} myPostId={myPostId} refreshPosts={refreshPosts} />
            ))}
          </div>

          <span className="mt-2 mb-6 text-center opacity-50 text-xs">No hay más posts... Por ahora.</span>
        </>
      )}
    </div>
  )
}
