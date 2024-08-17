"use server";

import { createClient } from "@/lib/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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

  console.log(response);
  if (response.error) {
    throw new Error(JSON.stringify(response.error));
  }

  return response.data;
};
