import type { AfterChangeHook } from "payload/dist/collections/config/types";
import { getPayloadClient } from "../../../payload-client";

export const emailAfterCreate: AfterChangeHook = async ({ operation, doc }) => {
  if (operation === "create") {
    try {
      const payload = await getPayloadClient();
      await payload.sendEmail({
        from: "applications@weasker.com",
        to: doc.user.email,
        subject: `Weasker badge application - ${doc.badge.singularName}`,
        html: `<h1>Your ${doc.badge.singularName} badge application is being reviewed</h1> 
        <p>Hey ${doc.user.userName},</p>
        <p> A community member will now review your application for the <a href="https://www.weasker.com/badge/${doc.badge.seo.slug}"> ${doc.badge.singularName} badge</a>. You can expect another email from us with the final answer shortly.</p>
        <p> If your application is approved, you&apos;ll be able to take all interviews related to the <a href="https://www.weasker.com/badge/${doc.badge.seo.slug}"> ${doc.badge.singularName} badge</a> 
       .</p>
        `,
      });
      await payload.sendEmail({
        from: "applications@weasker.com",
        to: "contact@weasker.com",
        subject: `Badge application - ${doc.badge.singularName} - ${doc.user.userName}`,
        html: `<h1>Badge application - ${doc.badge.singularName} - ${doc.user.userName}</h1>
      <p>Badge: <a href="https://www.weasker.com/badge/${doc.badge.seo.slug}"> ${doc.badge.singularName}</a></p>
      <p>User: <a href="https://www.weasker.com/user/${doc.user.seo.slug}"> ${doc.user.userName}</a></p>
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
