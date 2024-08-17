"use server";

import { createClient } from "@/lib/utils/supabase/server";

export const updateUserAction = async (value: { key: string }) => {
  const supabase = createClient();

  const response = await supabase.auth.updateUser({
    data: {
      key: value.key,
    },
  });

  if (response.error) {
    throw new Error(JSON.stringify(response.error));
  }

  return response.data;
};
