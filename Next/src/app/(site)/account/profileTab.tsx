"use client";
import { useAuth } from "../../../providers/Auth/Auth";
import { useEffect, useState } from "react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { Media } from "@/payload/payload-types";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import { LiaCloudUploadAltSolid } from "react-icons/lia";
import { IoTrashOutline } from "react-icons/io5";
import Modal from "@/components/ui/Modal";
import ChangeEmailComp from "@/components/UpdateEmailComp";
import ChangePasswordComp from "@/components/UpdatePasswordComp";
import DeleteAccountComp from "@/components/DeleteAccountComp";
import Loading from "../loading";
import { GentleButton } from "@/components/ui/buttons";
import { badgeIcon, interviewIcon, profileIcon } from "@/utils/defaultIcons";
import { WideBox } from "@/components/ui/boxes";
import { TextAreaInput, TextInput } from "@/components/ui/inputs";
import { revalidateByServerAction } from "@/utils/revalidate";
import { usePathname } from "next/navigation";

interface ProfileTabProps {
  handleTabSelect: any;
  activeTab: string;
}

export const ProfileTab = ({ handleTabSelect, activeTab }: ProfileTabProps) => {
  const {
    user,
    setUser,
    updateUser,
    uploadImage,
    refreshAuthentication,
    updateUserLoading,
    uploadImageLoading,
    uploadImageError,
  } = useAuth();
  const pathname = usePathname();
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [displayNameSaved, setDisplayNameSaved] = useState(false);
  const [about, setAbout] = useState(user.seo.excerpt || "");
  const [aboutLength, setAboutLength] = useState(
    user?.seo?.excerpt?.length || 0
  );
  const [aboutSaved, setAboutSaved] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [imageObjectURL, setImageObjectURL] = useState(null);
  const [imageIsSaved, setImageIsSaved] = useState(false);
  const [imageButtonsShowing, setImageButtonsShowing] = useState(false);
  const [imageErrorMessage, setImageErrorMessage] = useState<null | string>(
    null
  );
  const [emailModalIsOpen, setEmailModalIsOpen] = useState(false);
  const [passwordModalIsOpen, setPasswordModalIsOpen] = useState(false);
  const [deleteAccountModalIsOpen, setDeleteAccountModalIsOpen] =
    useState(false);

  const handleDisplayNameBlur = async () => {
    if (displayName !== user.displayName) {
      const res = await updateUser(user, { displayName });

      if (res) {
        setDisplayNameSaved(true);
        setUser(res);
        setTimeout(() => {
          setDisplayNameSaved(false);
        }, 3000);
      }
    }
  };

  const handleAboutChange = (e) => {
    const newAbout = e.target.value;
    setAbout(newAbout);
    setAboutLength(newAbout.length);
  };

  const handleAboutBlur = async () => {
    if (about !== user.seo.excerpt) {
      const res = await updateUser(user, { seo: { excerpt: about } });

      if (res) {
        setUser(res);
        setAboutSaved(true);
        setTimeout(() => {
          setAboutSaved(false);
        }, 3000);
      }
    }
  };

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      if (i.type === "image/png" || i.type === "image/jpeg") {
        setNewImage(i);
        setImageButtonsShowing(true);
        setImageObjectURL(URL.createObjectURL(i));
        setImageErrorMessage(null);
      } else {
        setImageErrorMessage("Please upload a .png or .jpg image.");
      }
    }
  };

  const handleRemoveImageFromClient = () => {
    if (imageObjectURL) {
      setImageObjectURL(null);
      setImageButtonsShowing(false);
      setNewImage(null);
    }
  };

  const handleSaveImage = async () => {
    const body = new FormData();
    body.append("file", newImage);
    const uploadedImage = await uploadImage(body);
    if (uploadedImage.status == 201) {
      const image = uploadedImage.data.doc;
      updateUser(user, { seo: { image: image.id } });
      setImageButtonsShowing(false);
      setImageIsSaved(true);
      setTimeout(() => {
        setImageIsSaved(false);
        revalidateByServerAction(pathname);
        refreshAuthentication();
      }, 3000);
    }
  };

  useEffect(() => {
    if (uploadImageError) {
      if (uploadImageError.response.status === 400) {
        const errors = uploadImageError.response.data.errors;
        for (let error of errors) {
          if (error.name === "ValidationError") {
            const field = error.data[0].field;
            const message = error.data[0].message;
            if (field === "email" && message === "Value must be unique") {
              setImageErrorMessage("This Email address is already registered");
            }
          }
        }
      }
      if (uploadImageError.response.status === 500) {
        setImageErrorMessage("An error occurred. Please try again");
      }
    }
  }, [uploadImageError]);

  const handleChangeEmailClick = () => {
    setEmailModalIsOpen(true);
  };

  const handleChangePasswordClick = () => {
    setPasswordModalIsOpen(true);
  };

  const handleDeleteAccountClick = () => {
    setDeleteAccountModalIsOpen(true);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 max-w-[1000px] w-full">
      <WideBox className="lg:w-[70%] p-5 lg:p-10 gap-5">
        <h2 className="text-lg">Profile</h2>
        <div className="flex flex-col gap-8 w-full">
          <TextInput
            name={"displayName"}
            type="text"
            label={"Display name (optional)"}
            description={
              "Select a display name, your username remains the same"
            }
            placeHolder={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            value={displayName}
            onBlur={handleDisplayNameBlur}
            maxLength={30}
            saved={displayNameSaved}
          />
          <TextAreaInput
            name={about}
            label={"About"}
            description={
              "A brief description of yourself shown on your profile."
            }
            placeHolder={about}
            onChange={handleAboutChange}
            onBlur={handleAboutBlur}
            value={about}
            maxLength={300}
            comment={`${300 - aboutLength} characters left`}
            saved={aboutSaved}
          />

          <div className="flex flex-row justify-between">
            <div className="flex flex-col gap-1 w-full">
              <label className="text-base font-bold uppercase" htmlFor="image">
                Profile image
              </label>
              <span className="text-weasker-grey text-sm">
                Images must be .png or .jpg format
              </span>
              <span className="text-weasker-grey text-sm">
                Ideal size 400*400 px
              </span>
              <div className="flex flex-col gap-2 border rounded rounded-t-lg p-2">
                <div className="flex flex-row w-full gap-2">
                  {(user.seo.image as Media)?.cloudinary?.public_id &&
                    !imageObjectURL && (
                      <CldImage
                        width={200}
                        height={200}
                        src={(user.seo.image as Media).cloudinary.public_id}
                        crop="fill"
                        alt={user.userName}
                        className="w-[100px] h-[100px] cover rounded-full border-2 border-tl-light-blue"
                      />
                    )}
                  {imageObjectURL && (
                    <div className="flex flex-col items-center gap-2">
                      <Image
                        src={imageObjectURL}
                        width={200}
                        height={200}
                        alt={user.userName}
                        className="w-[100px] h-[100px] cover rounded-full border-2 border-tl-light-blue"
                      />
                    </div>
                  )}
                  <label
                    htmlFor="image"
                    className="flex flex-row gap-1 items-center m-auto max-h-12 border-2 border-tl-light-blue text-tl-light-blue rounded rounded-t-lg py-1 px-2 hover:cursor-pointer font-bold"
                  >
                    <LiaCloudUploadAltSolid size={30} />
                    Upload
                    <input
                      className="hidden max-h-12"
                      type="file"
                      name="myImage"
                      id="image"
                      onChange={uploadToClient}
                    />
                  </label>
                </div>
                {imageErrorMessage && (
                  <div className="text-xs text-red-600">
                    {imageErrorMessage}
                  </div>
                )}
                {(updateUserLoading && imageButtonsShowing) ||
                (imageButtonsShowing && uploadImageLoading) ? (
                  <div className="flex flex-row max-w-[100px] justify-start content-start">
                    <Loading />
                  </div>
                ) : (
                  <div
                    className={`flex flex-row gap-2 max-w-[100px] justify-start content-start ${
                      imageButtonsShowing ? "block" : "hidden"
                    }`}
                  >
                    <button
                      className="text-xs max-h-12 border border-tl-light-blue text-tl-light-blue rounded rounded-t-lg py-1 px-2 "
                      onClick={handleSaveImage}
                    >
                      Save
                    </button>
                    <button
                      onClick={handleRemoveImageFromClient}
                      className="text-xs max-h-12 border border-red-600 rounded rounded-t-lg py-1 px-2 text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div
                className={`transition-opacity ease-in-out duration-300 flex flex-row items-center gap-1 p-[2px] text-xs self-end text-emerald-500 border-emerald-500 border rounded ${
                  imageIsSaved ? "opacity-100" : "opacity-0"
                }`}
              >
                <IoIosCheckmarkCircleOutline />
                Saved
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col w-full">
              <div className="text-base font-bold">Email address</div>
              <span className="text-weasker-grey text-sm">{user.email}</span>
            </div>
            <div className="sm:w-full">
              <button
                onClick={handleChangeEmailClick}
                className="mx-auto border border-tl-light-blue text-tl-light-blue rounded rounded-t-lg py-2 px-5"
              >
                Change
              </button>
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col w-full">
              <div className="text-base font-bold">Change password</div>
              <span className="text-weasker-grey text-sm">********</span>
            </div>
            <div className="sm:w-full">
              <button
                onClick={handleChangePasswordClick}
                className="mx-auto border border-tl-light-blue text-tl-light-blue rounded rounded-t-lg py-2 px-5"
              >
                Change
              </button>
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col w-full">
              <span className="text-base font-bold">Danger zone</span>
              <hr />
              <div className="flex flex-row justify-between mt-2">
                <span className="text-weasker-grey text-sm">
                  Delete account
                </span>
                <div className="flex flex-row gap-1 items-center text-red-600">
                  <IoTrashOutline />
                  <span
                    onClick={handleDeleteAccountClick}
                    className="hover:cursor-pointer"
                  >
                    DELETE ACCOUNT
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center sm:w-full px-auto"></div>
          </div>
        </div>
      </WideBox>
      <div className="sticky z-10 top-2 h-max flex-col gap-2 hidden lg:flex w-[30%]">
        <WideBox className="p-3 sm:p-5">
          <div className="flex flex-row flex-wrap gap-2">
            <GentleButton
              className={`border border-tl-dark-blue ${
                (activeTab == "profile" || activeTab == null) &&
                "border-tl-light-blue text-tl-light-blue"
              }`}
              text={<>{profileIcon(20)} Profile</>}
              onClick={() => {
                handleTabSelect("profile");
              }}
            />
            <GentleButton
              className={`border border-tl-dark-blue ${
                activeTab == "badges" &&
                "border-tl-light-blue text-tl-light-blue"
              }`}
              text={<>{badgeIcon(20)} Badges</>}
              onClick={() => {
                handleTabSelect("badges");
              }}
            />
            <GentleButton
              className={`border border-tl-dark-blue ${
                activeTab == "interviews" &&
                "border-tl-light-blue text-tl-light-blue"
              }`}
              text={<>{interviewIcon(20)} Interviews</>}
              onClick={() => {
                handleTabSelect("interviews");
              }}
            />
          </div>
        </WideBox>
      </div>
      {emailModalIsOpen && (
        <Modal onclick={() => setEmailModalIsOpen(false)}>
          <ChangeEmailComp />
        </Modal>
      )}
      {passwordModalIsOpen && (
        <Modal onclick={() => setPasswordModalIsOpen(false)}>
          <ChangePasswordComp />
        </Modal>
      )}
      {deleteAccountModalIsOpen && (
        <Modal onclick={() => setDeleteAccountModalIsOpen(false)}>
          <DeleteAccountComp
            setDeleteAccountModalIsOpen={setDeleteAccountModalIsOpen}
          />
        </Modal>
      )}
    </div>
  );
};
