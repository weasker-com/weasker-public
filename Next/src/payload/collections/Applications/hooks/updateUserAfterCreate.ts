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

      console.log("userId", userId);

      const user = await payload.findByID({
        collection: "users",
        id: userId,
        depth: 2,
      });

      console.log("user", user);

      const userApplicationsIds =
        user?.userApplications && user?.userApplications.length > 0
          ? user.userApplications.map((item) => {
              return (item as Application).id;
            })
          : [];

      console.log("userApplicationsIds", userApplicationsIds);

      console.log("doc", doc);
      console.log("doc.id", doc.id);

      const updateApplications = [...userApplicationsIds, doc.id];

      console.log("updateApplications", updateApplications);

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

      console.log("userApplication", userApplication);
    } catch (error) {
      console.log(
        "Failed updating user applications after creating application",
        error
      );
    }
  }
};
