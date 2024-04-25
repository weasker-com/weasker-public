import type { AfterChangeHook } from "payload/dist/collections/config/types";
import { getPayloadClient } from "../../../payload-client";
import { User } from "@/payload/payload-types";

export const actionAfterStatusChange: AfterChangeHook = async ({
  operation,
  doc,
  previousDoc,
}) => {
  if (operation === "update") {
    if (
      (previousDoc.status === "pending" && doc.status === "approved") ||
      (previousDoc.status === "denied" && doc.status === "approved")
    ) {
      try {
        const payload = await getPayloadClient();
        const userDetails = await payload.findByID({
          collection: "users",
          id: doc.user,
          depth: 2,
        });

        const isNewBadgeForUser = userDetails.userBadges.every(
          // @ts-ignore
          (badge) => badge.badge.id !== doc.badge
        );

        const badgeDetails = await payload.findByID({
          collection: "badges",
          id: doc.badge,
          depth: 2,
        });

        if (isNewBadgeForUser) {
          const updatedUserBadges = [
            ...userDetails.userBadges.map((badge) => ({
              // @ts-ignore
              badge: badge.badge.id,
            })),
            {
              badge: doc.badge,
              bio: doc.about,
              links: {
                linkOne: doc.links.linkOne,
                linkTwo: doc.links.linkTwo,
                linkThree: doc.links.linkThree,
                linkFour: null,
                linkFive: null,
              },
            },
          ];

          const updatedBadgeUsers = badgeDetails.users
            ? [
                ...badgeDetails.users.map((user) => {
                  return (user as User).id;
                }),
                doc.user,
              ]
            : [doc.user];

          const updateUserBadges = await payload.update({
            collection: "users",
            id: doc.user,
            data: {
              userBadges: updatedUserBadges,
            },
          });

          const updateBadgeUsers = await payload.update({
            collection: "badges",
            id: doc.badge,
            data: {
              users: updatedBadgeUsers,
            },
          });

          if (updateUserBadges && updateBadgeUsers) {
            await payload.sendEmail({
              from: "applications@weasker.com",
              to: userDetails.email,
              subject: `Application approved - ${badgeDetails.singularName}`,
              html: `<h1>Your ${badgeDetails.singularName} badge application is now approved</h1> <p>Hey ${userDetails.userName},</p>
          <p> A community member approved your application, you are now
          able to take all interviews related to the <a href="https://www.weasker.com/badge/${badgeDetails.seo.slug}"> ${badgeDetails.singularName} badge</a>.</p>
          <a href="https://www.weasker.com/badge/${badgeDetails.seo.slug}?tab=interviews">
         Click here to view all interviews for ${badgeDetails.pluralName}
          </a>
          `,
            });
          }
        } else {
          await payload.sendEmail({
            from: "applications@weasker.com",
            to: userDetails.email,
            subject: `Application - ${badgeDetails.singularName}`,
            html: `<h1>Badge Already Awarded: ${badgeDetails.singularName}</h1>
            <p>Dear ${userDetails.userName},</p>
            <p>You've applied for the ${badgeDetails.singularName} badge, but it appears you already possess it. You're all set to participate in related interviews.</p>
            <a href="https://www.weasker.com/badge/${badgeDetails.seo.slug}?tab=interviews">
            Click here to view all interviews for ${badgeDetails.pluralName}
             </a>
            <p>If you did not reapply for the badge, please disregard this email.</p>
            `,
          });
        }
      } catch (error) {
        console.error("Failed to send application approval email", error);
      }
    }
    if (previousDoc.status === "pending" && doc.status === "denied") {
      try {
        const payload = await getPayloadClient();
        const userDetails = await payload.findByID({
          collection: "users",
          id: doc.user,
          depth: 2,
        });

        const badgeDetails = await payload.findByID({
          collection: "badges",
          id: doc.badge,
          depth: 2,
        });

        await payload.sendEmail({
          from: "moreply@weasker.com",
          to: userDetails.email,
          subject: `Application denied - ${badgeDetails.singularName} badge`,
          html: `<h1>Your ${badgeDetails.singularName} badge application was denied</h1> <p>Hey ${userDetails.userName},</p>
          <p>Unfortunately your application for the ${badgeDetails.singularName} was denied because it did not stand with badge terms.</p>`,
        });
      } catch (error) {
        console.error("Failed to send application denial email", error);
      }
    }
  }
};
