"use client";
import { useAuth } from "../../providers/Auth/Auth";
import { CldImage } from "next-cloudinary";
import { WhiteBox } from "../ui/boxes";
import { TextAreaInput, TextInput } from "../ui/inputs";
import { BigButton } from "../ui/buttons";
import { useEffect, useState } from "react";
import { create } from "@/utils/restReq";
import { isValidUrl } from "../../helpers/validateUrl";
import { Application, Badge, Media } from "@/payload/payload-types";
import { pendingIcon, successIcon } from "@/utils/defaultIcons";
import { InternalLink } from "../links/InternalLink";
import { defaultImages } from "@/utils/defaultImages";
import AuthComp from "../AuthComp";

interface BadgeApplyCompProps {
  badge: Badge;
  termsText: string;
  next?: string;
  buttonText?: string;
}

const BadgeApplyComp = ({
  badge,
  termsText,
  next,
  buttonText,
}: BadgeApplyCompProps) => {
  const { user, refreshAuthentication } = useAuth();
  const [userHasBadge, setUserHasBadge] = useState(false);
  const [userHasPendingApplication, setUserHasPendingApplication] =
    useState(false);
  const [linkOne, setLinkOne] = useState<string | null>(null);
  const [linkTwo, setLinkTwo] = useState<string | null>(null);
  const [linkThree, setLinkThree] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [linkOneErrorMessage, setLinkOneErrorMessage] = useState<string | null>(
    null
  );
  const [linkTwoErrorMessage, setLinkTwoErrorMessage] = useState<string | null>(
    null
  );
  const [linkThreeErrorMessage, setLinkThreeErrorMessage] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (
      user &&
      badge.seo.slug &&
      user.userBadges.some((item) => {
        return (item.badge as Badge).seo.slug === badge.seo.slug;
      })
    ) {
      setUserHasBadge(true);
    }
  }, [user, badge.seo.slug]);

  useEffect(() => {
    if (
      user &&
      badge.id &&
      user.userApplications?.some((item) => {
        const application = item as Application;
        return (
          (application?.badge as Badge).id == badge.id &&
          application.status == "pending"
        );
      })
    ) {
      setUserHasPendingApplication(true);
    }
  }, [user, badge.id]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [about, setAbout] = useState("");
  const [aboutLength, setAboutLength] = useState(0);

  const handleAboutChange = (e) => {
    const newAbout = e.target.value;
    setAbout(newAbout);
    setAboutLength(newAbout.length);
  };

  const handleChangeLinkOne = (e) => {
    const url = e.target.value;
    setErrorMessage(null);
    setLinkOne(url);
    if (url && !isValidUrl(url)) {
      setLinkOneErrorMessage(
        "URL is not valid. Make sure it starts with https://"
      );
    } else {
      setLinkOneErrorMessage(null);
    }
  };

  const handleChangeLinkTwo = (e) => {
    const url = e.target.value;
    setErrorMessage(null);
    setLinkTwo(url);
    if (url && !isValidUrl(url)) {
      setLinkTwoErrorMessage(
        "URL is not valid. Make sure it starts with https://"
      );
    } else {
      setLinkTwoErrorMessage(null);
    }
  };

  const handleChangeLinkThree = (e) => {
    const url = e.target.value;
    setErrorMessage(null);
    setLinkThree(url);
    if (url && !isValidUrl(url)) {
      setLinkThreeErrorMessage(
        "URL is not valid. Make sure it starts with https://"
      );
    } else {
      setLinkThreeErrorMessage(null);
    }
  };

  async function handleSubmit(e) {
    setLoading(true);
    e.preventDefault();
    setErrorMessage(null);
    if (user) {
      try {
        const res = await create({
          data: {
            user: user.id,
            badge: badge.id,
            about: about,
            links: {
              linkOne,
              linkTwo,
              linkThree,
            },
          },
          collection: "applications",
        });
        if (res) {
          setLoading(false);
          setSuccess(true);
          refreshAuthentication();
        } else {
          setErrorMessage("An error occurred. Please try again.");
        }
      } catch (error) {
        setLoading(false);
        if (error?.response?.data?.errors?.[0]?.data?.[0]?.message) {
          setErrorMessage(error.response.data.errors[0].data[0].message);
        }
        console.error(error);
      }
    } else setErrorMessage("You must be logged in to apply for a badge");
  }

  if (!user) {
    return <AuthComp location={"modal"} />;
  }

  if (userHasBadge) {
    return (
      <WhiteBox>
        <div className="flex flex-col centerAbsolute gap-5 w-full">
          {successIcon(50, "text-emerald-500")}
          <span className="text-xl font-bold w-full">Badge approved</span>
          {next && buttonText && (
            <InternalLink
              href={next}
              element={
                <BigButton
                  text={buttonText}
                  className="bg-tl-dark-blue w-full"
                ></BigButton>
              }
            />
          )}
        </div>
      </WhiteBox>
    );
  }

  if (userHasPendingApplication) {
    return (
      <WhiteBox>
        <div className="flex flex-col centerAbsolute gap-5 w-full">
          {pendingIcon(50, "text-emerald-500")}
          <span className="text-xl font-bold w-full">Application pending</span>
        </div>
      </WhiteBox>
    );
  }

  if (success) {
    return (
      <WhiteBox>
        <div className="flex flex-col items-center text-center gap-5 bg-white rounded-t max-w-[500px]">
          {successIcon(50, "text-emerald-500")}
          <span className="text-xl font-bold">Application sent</span>
          <span>
            A community member will review your application, and you&apos;ll
            receive an email from us shortly at: {user.email}
          </span>
        </div>
      </WhiteBox>
    );
  } else
    return (
      <WhiteBox>
        <div className="flex flex-col gap-5 w-full">
          <h1 className="flex flex-col sm:flex-row gap-3 text-lg font-extrabold smallCaps text-tl-dark-blue">
            Application
          </h1>
          <span className="flex flex-row items-center gap-1 ">
            <CldImage
              width={60}
              height={60}
              src={
                (badge.seo?.image as Media)?.filename ||
                defaultImages.defaultBadgeImage
              }
              alt={badge.singularName}
              className="w-[40px] h-[40px] cover rounded-full border border-weasker-grey"
            />
            {badge.singularName}
          </span>
          <span className="text-sm ">{termsText}</span>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="flex flex-col gap-3 w-full"
          >
            <TextAreaInput
              name="about"
              label="About"
              value={about}
              onChange={handleAboutChange}
              placeHolder="Your relevant experience for this badge"
              labelClassName="text-xs"
              className="text-sm h-24 resize-none"
              maxLength={200}
              comment={`${200 - aboutLength} characters left`}
            />
            <TextInput
              type={"text"}
              label="Link 1"
              name="linkOne"
              placeHolder="https://www.example.com/my-service-1"
              onChange={(e) => handleChangeLinkOne(e)}
              errorMessage={linkOneErrorMessage}
              labelClassName="text-xs"
              className="lowercase"
            />
            <TextInput
              type={"text"}
              label="Link 2"
              name="linkTwo"
              placeHolder="https://www.example.com/my-service-2"
              onChange={(e) => handleChangeLinkTwo(e)}
              errorMessage={linkTwoErrorMessage}
              labelClassName="text-xs"
              className="lowercase"
            />
            <TextInput
              type={"text"}
              label="Link 3"
              name="linkThree"
              placeHolder="https://www.example.com/my-service-3"
              onChange={(e) => handleChangeLinkThree(e)}
              errorMessage={linkThreeErrorMessage}
              labelClassName="text-xs"
              className="lowercase"
            />
            <BigButton
              className={"bg-tl-dark-blue"}
              disabled={
                success == true ||
                errorMessage !== null ||
                linkOneErrorMessage !== null ||
                linkTwoErrorMessage !== null ||
                linkThreeErrorMessage !== null ||
                ((linkOne == null || linkOne == "") &&
                  (linkTwo == null || linkTwo == "") &&
                  (linkThree == null || linkThree == "")) ||
                about == "" ||
                about == null
              }
              text="APPLY FOR BADGE"
              loading={loading}
            />
            {errorMessage && (
              <span className="text-sm text-red-600">{errorMessage}</span>
            )}
          </form>
        </div>
      </WhiteBox>
    );
};

export default BadgeApplyComp;
