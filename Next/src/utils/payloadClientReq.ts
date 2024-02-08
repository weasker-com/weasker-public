"use server";

import { getPayloadClient } from "@/payload/payload-client";

export async function find(collection: "users", where: {}) {
  console.time("findTime");
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection,
      depth: 2,
      page: 1,
      limit: 10,
      where,
    });

    if (result) {
      console.timeEnd("findTime");
      return result;
    }
  } catch (error) {
    console.error(error);
    console.timeEnd("findTime");
  }
}
