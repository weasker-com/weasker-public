"use server";

import { getPayloadClient } from "@/payload/payload-client";
import { User } from "@/payload/payload-types";

export async function find(collection: "users", where: {}) {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection,
      depth: 2,
      page: 1,
      limit: 10,
      where,
      overrideAccess: false,
    });

    if (result) {
      return result;
    }
  } catch (error) {
    console.error(error);
  }
}

interface ApplyForBadgeParams {
  data: any;
  user: User;
  collection: "applications";
}

export async function create({ data, collection, user }: ApplyForBadgeParams) {
  const payload = await getPayloadClient();
  const result = await payload.create({
    collection,
    user,
    data,
    overrideAccess: false,
  });
  if (result) {
    return result;
  }
}
