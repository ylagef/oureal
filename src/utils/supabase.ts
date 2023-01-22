import { decode } from "base64-arraybuffer";
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
  images,
}: {
  name: string;
  visible: boolean;
  images: {
    user: string | null;
    environment: string | null;
  };
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

  await uploadPostFile({ id: post.id, images });

  return post;
};

export const uploadPostFile = async ({
  id,
  images,
}: {
  id: string;
  images: {
    user: string | null;
    environment: string | null;
  };
}) => {
  if (!images.user || !images.environment) return;

  const { data: dataUser, error: errorUser } = await supabase.storage
    .from("posts")
    .upload(`${id}-user.jpeg`, decode(images.user), {
      contentType: `image/jpeg`,
    });

  if (errorUser) {
    throw errorUser;
  }

  const { data: dataEnvironment, error: errorEnvironment } =
    await supabase.storage
      .from("posts")
      .upload(`${id}-environment.jpeg`, decode(images.environment), {
        contentType: `image/jpeg`,
      });

  if (errorEnvironment) {
    throw errorEnvironment;
  }

  return { dataUser, dataEnvironment };
};
