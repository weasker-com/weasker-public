"use server";

import { getPayloadClient } from "@/payload/payload-client";
import { User } from "@/payload/payload-types";
import { Media } from "@/payload/payload-types";
import { cookies } from "next/headers";
import { ClassificationType } from "typescript";

interface DisplayNameInterface {
  user: User;
  newDisplayName: string;
  userId: string;
}

export async function updateDisplayName({
  user,
  newDisplayName,
  userId,
}: DisplayNameInterface): Promise<User | null> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.update({
      user: user,
      collection: "users",
      id: userId,
      overrideAccess: false,
      data: {
        displayName: newDisplayName,
      },
    });

    if (result?.displayName == newDisplayName) {
      return result;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to update display name:", error);
  }
}

interface UploadImageInterface {
  user: User;
  image: Media;
}

export async function uploadUserPfp({
  user,
  image,
}: UploadImageInterface): Promise<any> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.update({
      collection: "users",
      user: user,
      id: user.id,
      overrideAccess: false,
      data: {
        seo: { image: image.id },
      },
    });

    if (result) {
      console.log(result);
      return result;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to upload file:", error);
  }
}

interface AboutInterface {
  user: User;
  userId: string;
  newAboutText: string;
}

export async function updateUserAbout({
  user,
  userId,
  newAboutText,
}: AboutInterface): Promise<User | null> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.update({
      user: user,
      collection: "users",
      id: userId,
      overrideAccess: false,
      data: {
        seo: { excerpt: newAboutText },
      },
    });

    if (result.seo.excerpt == newAboutText) {
      return result;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to update About:", error);
  }
}

interface changeEmailInterface {
  user: User;
  email: string;
}

export async function changeEmail({
  user,
  email,
}: changeEmailInterface): Promise<User | null> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.update({
      collection: "users",
      id: user.id,
      user: user,
      overrideAccess: false,
      data: {
        email: email,
      },
    });

    if (result) {
      return result;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to update email:", error);
  }
}

export async function updatePassword(
  user: User,
  password: string
): Promise<any> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.update({
      collection: "users",
      context: {
        validate: true,
      },
      overrideAccess: true,
      id: user.id,
      data: {
        password: password,
      },
    });

    if (result) {
      console.log("result", result);
      return result;
    } else {
      console.log("no result", result);
      return null;
    }
  } catch (error) {
    console.log("error updating password: ", error);
    console.error("Failed to update password:", error);
  }
}

export async function forgotPassword(email: string): Promise<any> {
  try {
    const payload = await getPayloadClient();
    const emailSent = await payload.forgotPassword({
      collection: "users",
      data: {
        email,
      },
    });
    if (emailSent) {
      return emailSent;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to update password:", error);
  }
}

interface ResetPasswordInterface {
  token: string;
  password: string;
}

export async function resetPassword({
  token,
  password,
}: ResetPasswordInterface): Promise<any> {
  try {
    const payload = await getPayloadClient();
    const resetPassword = await payload.resetPassword({
      collection: "users",
      overrideAccess: true,
      context: {
        validate: true,
      },
      data: {
        token,
        password,
      },
    });
    if (resetPassword) {
      return resetPassword;
    }
  } catch (error) {
    console.error("Failed to update password:", error);
  }
}

export async function deleteAccount(user: User): Promise<any> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.delete({
      collection: "users",
      overrideAccess: false,
      id: user.id,
      user: user,
    });

    if (result) {
      return result;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to delete user:", error);
  }
}
