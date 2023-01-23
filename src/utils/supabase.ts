import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://qnjsefzysabexpzkiqyr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuanNlZnp5c2FiZXhwemtpcXlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQzMjEyNTYsImV4cCI6MTk4OTg5NzI1Nn0.yaBPDHTqUfirMCOjhRRXp5bqJ6AE3RJCIR6cpS99Qlg'
)

export interface Post {
  id: string
  created_at: string
  name: string
  visible: boolean
}

export const getPosts = async () => {
  const { data, error } = await supabase.from('posts').select().order('created_at', { ascending: false })

  if (error) throw error

  return data
}

export const deletePost = async (id: string) => {
  console.log('deleting post', id)
  const { data, error } = await supabase.from('posts').delete().match({ id })
  console.log({ data, error })

  if (error) throw error

  const { data: dataStorage, error: errorStorage } = await supabase.storage.from('posts').remove([`${id}/user.webp`, `${id}/environment.webp`])

  console.log({ dataStorage, errorStorage })
  if (errorStorage) throw errorStorage

  return data
}

export const createPost = async ({
  name,
  visible,
  images
}: {
  name: string
  visible: boolean
  images: {
    user: string | null
    environment: string | null
  }
}) => {
  const { data, error } = await supabase
    .from('posts')
    .insert({
      name,
      visible
    })
    .select()

  console.log({ data, error })

  if (error || !data[0]) throw error

  const post = data[0] as Post

  await uploadPostFile({ id: post.id, images })

  return post
}

export const uploadPostFile = async ({
  id,
  images
}: {
  id: string
  images: {
    user: string | null
    environment: string | null
  }
}) => {
  if (!images.user || !images.environment) return
  console.log('uploading images', { id, images })

  const { data: dataUser, error: errorUser } = await supabase.storage
    .from('posts')
    .upload(`${id}/user.webp`, dataURLtoFile({ base64File: images.user, name: 'user.webp' }), {
      contentType: `image/webp`
    })

  if (errorUser) throw errorUser

  const { data: dataEnvironment, error: errorEnvironment } = await supabase.storage
    .from('posts')
    .upload(`${id}/environment.webp`, dataURLtoFile({ base64File: images.environment, name: 'environment.webp' }), {
      contentType: `image/webp`
    })

  if (errorEnvironment) throw errorEnvironment

  return { dataUser, dataEnvironment }
}

const dataURLtoFile = ({ base64File, name }: { base64File: string; name: string }) => {
  const arr = base64File.split(',')

  const mime = arr[0].match(/:(.*?);/)
  if (!mime) throw new Error('Invalid base64 file')

  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new File([u8arr], name, { type: mime[1] })
}
