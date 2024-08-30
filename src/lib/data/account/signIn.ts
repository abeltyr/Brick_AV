"use server";

import { createClient } from "@/lib/utils/supabase/server";

export const signInWithPasswordAction = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const supabase = createClient();

  const response = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (response.error) {
    throw new Error(JSON.stringify(response.error));
  }

  return response.data;
};
