"use server";

import { getPayloadClient } from "@/payload/payload-client";
import { User } from "@/payload/payload-types";
import { cookies } from "next/headers";

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
  uploadedImage: any;
}

export async function uploadUserPfp({
  user,
  uploadedImage,
}: UploadImageInterface): Promise<any> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.create({
      collection: "media",
      overrideAccess: true,
      user: user,
      data: {
        cloudinary: {},
      },
      file: uploadedImage,
    });

    if (result) {
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
      overrideAccess: true,
      id: user.id,
      data: {
        password: password,
      },
    });

    if (result) {
      return result;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to update password:", error);
  }
}

export async function forgotPassword(email: string): Promise<any> {
  try {
    const payload = await getPayloadClient();

    const token = await payload.forgotPassword({
      collection: "users",
      data: {
        email,
      },
    });

    if (token) {
      const url = `https://weasker.com/reset-password?token=${token}`;
      const sendEmail = await payload.sendEmail({
        to: email,
        from: "sender@example.com",
        subject: "Reset your Weasker password",
        html: `<h1>Thank you for your order!</h1>
        <p>Click this link</p>
         ${url}
        <p>Total: </p>
      `,
      });
      return sendEmail;
    } else {
      console.log("email failed");
      return null;
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
