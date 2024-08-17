"use server";

import { createClient } from "@/lib/utils/supabase/server";

export const getUser = async () => {
  const supabase = createClient();
  const response = await supabase.auth.getUser();

  if (response.error) {
    throw new Error(JSON.stringify(response.error));
  }

  return response.data;
};
