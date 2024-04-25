"use client";

import axios from "axios";

interface CreateProps {
  data: any;
  collection: "applications" | "users-interviews";
}

export async function create({ data, collection }: CreateProps) {
  const result = await axios({
    method: "POST",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/${collection}`,
    withCredentials: true,
    data,
  });

  if (result) {
    return result;
  }
}

interface UpdateByIdProps {
  data: any;
  collection: "applications" | "interviews" | "users-interviews";
  id: string;
}

export async function updateById({ data, collection, id }: UpdateByIdProps) {
  const result = await axios({
    method: "PATCH",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/${collection}/${id}`,
    withCredentials: true,
    data,
  });

  if (result) {
    return result;
  }
}

interface DeleteByIdProps {
  collection: "media" | "users-interviews";
  id: string;
}

export async function deleteById({ collection, id }: DeleteByIdProps) {
  const result = await axios({
    method: "DELETE",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/${collection}/${id}`,
    withCredentials: true,
  });

  if (result) {
    return result;
  }
}

export async function uploadImage(body: any): Promise<any> {
  const res = await axios({
    method: "POST",
    url: "/api/media",
    data: body,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
  if (res) {
    return res;
  }
}
