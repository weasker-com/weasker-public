"use server";
import { revalidatePath, revalidateTag } from "next/cache";
export const revalidateByServerAction = async (path) => {
  try {
    if (path) {
      console.log("trying to revalidate path:", path);
      revalidatePath(path);
    } else {
      revalidatePath("/");
    }
  } catch (error) {
    console.error("revalidateByServerAction=> ", error);
  }
};

export const revalidateTagByServerAction = async (tag: string) => {
  try {
    revalidateTag(tag);
  } catch (error) {
    console.error("revalidateTagByServerAction=> ", error);
  }
};
