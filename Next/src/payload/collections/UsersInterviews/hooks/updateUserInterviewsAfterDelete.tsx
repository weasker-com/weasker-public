import { getPayloadClient } from "../../../payload-client";
import { AfterDeleteHook } from "payload/dist/collections/config/types";

export const updateUserInterviewsAfterDelete: AfterDeleteHook = async ({
  doc,
}) => {
  const payload = await getPayloadClient();
  try {
    const userId = doc.user?.id ? doc.user.id : doc.user;

    const updatedUserInterviews = await payload.find({
      collection: "users-interviews",
      where: { user: { equals: userId } },
    });

    const updatedUserInterviewsIds = updatedUserInterviews.docs.map((item) => {
      return item.id;
    });

    const updateUser = await payload.update({
      collection: "users",
      id: userId,
      data: {
        userInterviews: updatedUserInterviewsIds,
      },
    });

    if (updateUser) {
      console.log("success updating user-interviews after deletion");
    }
  } catch (error) {
    console.log("No success updating user-interviews after deletion");
  }
};
