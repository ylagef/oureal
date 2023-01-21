import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://qnjsefzysabexpzkiqyr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuanNlZnp5c2FiZXhwemtpcXlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQzMjEyNTYsImV4cCI6MTk4OTg5NzI1Nn0.yaBPDHTqUfirMCOjhRRXp5bqJ6AE3RJCIR6cpS99Qlg"
);

interface Post {
  id: string;
  created_at: string;
  name: string;
  visible: boolean;
}

export const createPost = async ({
  name,
  visible,
  file,
}: {
  name: string;
  visible: boolean;
  file: ArrayBuffer;
}) => {
  const { data, error } = await supabase
    .from("posts")
    .insert({
      name,
      visible,
    })
    .select();

  console.log({ data, error });

  if (error || !data[0]) {
    throw error;
  }

  const post = data[0] as Post;

  await uploadPostFile({ id: post.id, file });

  return post;
};

export const uploadPostFile = async ({
  id,
  file,
}: {
  id: string;
  file: ArrayBuffer;
}) => {
  const { data, error } = await supabase.storage
    .from("posts")
    .upload(id, file, {
      contentType: `image/webp`,
    });

  if (error) {
    throw error;
  }

  return data;
};
