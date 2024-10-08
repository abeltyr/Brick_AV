"use server";

import { createClient } from "@/lib/utils/supabase/server";

export const ResetPasswordEmailAction = async (email: string) => {
  const supabase = createClient();
  const response = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
    },
  });

  if (response.error) {
    throw new Error(JSON.stringify(response.error));
  }

  return response.data;
};
