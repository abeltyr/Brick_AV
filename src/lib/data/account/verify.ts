"use server";

import { createClient } from "@/lib/utils/supabase/server";

export const verifyEmailAction = async ({
  email,
  token,
}: {
  token: string;
  email: string;
}) => {
  const supabase = createClient();

  const response = await supabase.auth.verifyOtp({
    email: email,
    token: token,
    type: "email",
  });

  if (response.error) {
    throw new Error(JSON.stringify(response.error));
  }

  return response.data;
};
