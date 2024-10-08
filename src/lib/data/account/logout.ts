"use server";

import { createClient } from "@/lib/utils/supabase/server";

export const logoutAction = async () => {
  const supabase = createClient();

  const response = await supabase.auth.signOut();

  console.log("response", response);

  if (response.error) {
    console.log(response.error);
    throw new Error();
  }

  return null;
};
