import type { AfterChangeHook } from "payload/dist/collections/config/types";
import { getPayloadClient } from "../../../payload-client";

export const emailAfterCreate: AfterChangeHook = async ({ operation, doc }) => {
  if (operation === "create") {
    try {
      const payload = await getPayloadClient();
      await payload.sendEmail({
        from: "contact@weasker.com",
        to: doc.user.email,
        subject: `Weasker badge application - ${doc.badge.singularName}`,
        html: `<h1>Your ${doc.badge.singularName} badge application is being reviewed</h1> <p>Hey ${doc.user.userName},</p>
        <p> A community member will review your application, and you&apos;ll
        receive another email with a final answer from us shortly</p>
        <p> If your application is approved, you&apos;ll
        be able to take all interviews related to the awarded badge.</p>
        `,
      });
      await payload.sendEmail({
        from: "contact@weasker.com",
        to: "contact@weasker.com",
        subject: `Badge application - ${doc.badge.singularName} - ${doc.user.userName}`,
        html: `<h1>Badge application - ${doc.badge.singularName} - ${doc.user.userName}</h1>
      
         <h2>Links provided</h2>
         <p><a href="${doc.links.linkOne}">${doc.links.linkOne}</a></p>
         <p><a href="${doc.links.linkTwo}">${doc.links.linkTwo}</a></p>
         <p><a href="${doc.links.linkThree}">${doc.links.linkThree}</a></p>
        <h2>To approve/decline the application :</h2>
        <a href="https://www.weasker.com/admin/collections/applications/${doc.id}">Click here</a>
        `,
      });
    } catch (error) {
      console.error("Failed to application received email", error);
    }
  }
};
