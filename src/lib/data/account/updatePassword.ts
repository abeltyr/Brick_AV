"use server";

import { createClient } from "@/lib/utils/supabase/server";

export const updatePasswordAction = async ({
  email,
  token,
  password,
}: {
  email: string;
  token: string;
  password: string;
}) => {
  const supabase = createClient();

  const response = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (response.error) {
    throw new Error(JSON.stringify(response.error));
  }

  const updateResponse = await supabase.auth.updateUser({
    password,
  });

  if (updateResponse.error) {
    throw new Error(JSON.stringify(updateResponse.error));
  }

  return response.data;
};
