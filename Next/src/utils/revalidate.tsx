"use server";
import { revalidatePath } from "next/cache";
const revalidateByServerAction = async (path) => {
  try {
    if (path) {
      revalidatePath(path);
    } else {
      revalidatePath("/");
    }
  } catch (error) {
    console.error("revalidateByServerAction=> ", error);
  }
};
export default revalidateByServerAction;
