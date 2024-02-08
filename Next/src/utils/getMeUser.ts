import { cookies } from "next/headers";
import type { User } from "../payload/payload-types";
import axios from "axios";

export const getMeUser = async (): Promise<User> => {
  const cookieStore = cookies();
  const token = cookieStore.get("payload-token")?.value;

  try {
    const res = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/users/me`,
      headers: {
        Authorization: `JWT ${token}`,
      },
    });

    if (res.data.user) {
      const loginUser = res.data.user;
      return loginUser;
    }
  } catch (error) {
    console.error("Login failed:", error);
  }
};
