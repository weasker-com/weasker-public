import type { AfterChangeHook } from "payload/dist/collections/config/types";
import { getPayloadClient } from "../../../payload-client";
import { Application } from "@/payload/payload-types";

export const updateUserAfterCreate: AfterChangeHook = async ({
  operation,
  doc,
}) => {
  if (operation === "create") {
    try {
      const payload = await getPayloadClient();

      const userId = doc.user?.id ? doc.user?.id : doc.user;

      const user = await payload.findByID({
        collection: "users",
        id: userId,
        depth: 2,
      });

      const userApplicationsIds =
        user?.userApplications && user?.userApplications.length > 0
          ? user.userApplications.map((item) => {
              return (item as Application).id;
            })
          : [];

      const updateApplications = [...userApplicationsIds, doc.id];

      const userApplication = await payload.update({
        collection: "users",
        id: userId,
        data: { userApplications: updateApplications },
        depth: 2,
      });

      if (userApplication) {
        console.log(
          "Success updating user applications after creating application"
        );
      }
    } catch (error) {
      console.log(
        "Failed updating user applications after creating application",
        error
      );
    }
  }
};
