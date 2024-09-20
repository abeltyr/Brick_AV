"use server";

import { createClient } from "@/lib/utils/supabase/server";

export const getUserAction = async () => {
  const supabase = createClient();
  const response = await supabase.auth.getUser();

  console.log("response", response);
  if (response.error) {
    return null;
  }
  return response.data;
};

export const refreshAccountToken = async () => {
  const supabase = createClient();
  const response = await supabase.auth.refreshSession();

  if (response.error) {
    throw new Error(JSON.stringify(response.error));
  }

  return response.data;
};
