"use client";

import React, { useEffect, useState } from "react";
import { BigButton } from "./ui/buttons";
import { WhiteBox } from "./ui/boxes";
import { useAuth } from "../providers/Auth/Auth";
import { successIcon } from "../utils/defaultIcons";
import { revalidateByServerAction } from "@/utils/revalidate";
import { usePathname, useRouter } from "next/navigation";

interface RemoveBadgeCompProps {
  userBadges: any;
  removeBadge: any;
}

export const RemoveBadgeComp: React.FC<RemoveBadgeCompProps> = ({
  userBadges,
  removeBadge,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, updateUser, refreshAuthentication } = useAuth();
  const [checkMarkIsChecked, setCheckMarkIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setCheckMarkIsChecked(false);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    try {
      const updatedUserBadges = userBadges
        .filter((badge) => badge.id !== removeBadge.id)
        .map((badge) => ({
          ...badge,
          badge: badge.badge.id,
        }));

      const res = await updateUser(user, { userBadges: updatedUserBadges });

      if (res) {
        revalidateByServerAction(pathname);
        refreshAuthentication();
        router.refresh();
        setLoading(false);
        setSuccess(true);
      } else {
        setLoading(false);
        setErrorMessage("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error(error);
    }
  }
  if (success) {
    return (
      <WhiteBox>
        <div className="flex flex-col items-center text-center gap-5 bg-white rounded-t max-w-[500px]">
          {successIcon(50, "text-emerald-500")}
          <span className="text-xl font-bold">Badge removed</span>
          <span>
            The badge {removeBadge.badge.singularName} was successfully removed
            from your list of badges.
          </span>
        </div>
      </WhiteBox>
    );
  } else {
    return (
      <WhiteBox>
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          className="flex flex-col gap-5 w-full"
        >
          <h1 className="flex flex-row flex-wrap gap-2 text-lg font-extrabold smallCaps text-tl-dark-blue">
            <span>Confirm badge removal -</span>
            <span>{removeBadge.badge.singularName}</span>
          </h1>
          <span className="text-sm font-light text-weasker-grey">
            By removing this badge, all associated interviews and answers will
            be hidden from your profile. If you wish to edit or display them
            again, you must reapply for the badge.
          </span>
          <div className="flex flex-row gap-2 items-start">
            <div className="flex flex-col pt-1">
              <input
                type="checkbox"
                id="checkbox"
                name="checkbox"
                className="border rounded w-5"
                onChange={() => setCheckMarkIsChecked(!checkMarkIsChecked)}
              />
            </div>
            <label htmlFor="checkbox" className="text-sm">
              I understand that by removing this badge, I will lose all its
              associated features.
            </label>
          </div>
          <BigButton
            text="REMOVE BADGE"
            loading={loading}
            className="mt-3 w-full bg-red-600"
            disabled={!checkMarkIsChecked}
          />
          {errorMessage && <span className="text-red-600">{errorMessage}</span>}
        </form>
      </WhiteBox>
    );
  }
};
