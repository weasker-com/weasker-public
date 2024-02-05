"use client";
import {
  updateDisplayName,
  updateUserAbout,
  uploadUserPfp,
} from "@/utils/profileCRUD";
import { useAuth } from "../../../providers/Auth/Auth";
import { useEffect, useState } from "react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { Media } from "@/payload/payload-types";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import { LiaCloudUploadAltSolid } from "react-icons/lia";
import { IoTrashOutline } from "react-icons/io5";
import Modal from "@/components/Modal";
import ChangeEmailComp from "@/components/ChangeEmailComp";
import ChangePasswordComp from "@/components/ChangePasswordComp";
import DeleteAccountComp from "@/components/DeleteAccountComp";
import axios from "axios";
import Loading from "../loading";

export const ProfileTab = () => {
  const { user, refreshAuthentication } = useAuth();
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [displayNameSaved, setDisplayNameSaved] = useState(false);
  const [about, setAbout] = useState(user.seo.excerpt || "");
  const [aboutLength, setAboutLength] = useState(
    user?.seo?.excerpt?.length || 0
  );
  const [aboutSaved, setAboutSaved] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [imageObjectURL, setImageObjectURL] = useState(null);
  const [imageIsUploading, setImageIsUploading] = useState(false);
  const [imageIsSaved, setImageIsSaved] = useState(false);
  const [imageButtonsShowing, setImageButtonsShowing] = useState(false);
  const [emailModalIsOpen, setEmailModalIsOpen] = useState(false);
  const [passwordModalIsOpen, setPasswordModalIsOpen] = useState(false);
  const [deleteAccountModalIsOpen, setDeleteAccountModalIsOpen] =
    useState(false);

  useEffect(() => {
    refreshAuthentication();
  }, [imageIsSaved]);

  const handleDisplayNameBlur = async () => {
    if (displayName !== user.displayName) {
      const result = await updateDisplayName({
        user,
        newDisplayName: displayName,
        userId: user.id,
      });

      if (result) {
        setDisplayNameSaved(true);
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
      const result = await updateUserAbout({
        user,
        newAboutText: about,
        userId: user.id,
      });

      if (result) {
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
      setNewImage(i);
      setImageButtonsShowing(true);
      setImageObjectURL(URL.createObjectURL(i));
    }
  };

  const handleRemoveImageFromClient = () => {
    if (imageObjectURL) {
      setImageObjectURL(null);
      setImageButtonsShowing(false);
      setNewImage(null);
    }
  };

  const handleSaveImageNew = async (event) => {
    setImageIsUploading(true);
    const body = new FormData();
    body.append("file", newImage);
    try {
      const uploadImage = await axios.post("/api/media", body, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      if (uploadImage?.data?.doc?.filename) {
        const image = uploadImage.data.doc;
        const uploadImageToDB = uploadUserPfp({ user, image });
        setImageButtonsShowing(false);
        setImageIsUploading(false);
        setImageIsSaved(true);
        setTimeout(() => {
          setImageIsSaved(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

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
    <div className="flex flex-col sm:flex-row gap-3 max-w-[1000px] mt-2 w-full">
      <div className="flex flex-col w-full bg-white flex-grow p-5 lg:p-10 gap-5">
        <h2 className="text-lg">Profile</h2>
        <div className="flex flex-col gap-8">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col w-full gap-1">
              <label className="text-base font-bold" htmlFor="displayName">
                Display name (optional)
              </label>
              <span className="text-weasker-grey text-sm">
                Select a display name, your username remains the same.
              </span>
              <input
                type="text"
                id="displayName"
                name="displayName"
                className="text-weasker-grey text-sm border p-2 mt-3"
                placeholder={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                value={displayName}
                onBlur={handleDisplayNameBlur}
                maxLength={30}
              />

              <div
                className={`transition-opacity ease-in-out duration-300 flex flex-row items-center gap-1 p-[2px] text-xs self-end text-emerald-500 border-emerald-500 border rounded ${
                  displayNameSaved ? "opacity-100" : "opacity-0"
                }`}
              >
                <IoIosCheckmarkCircleOutline />
                Saved
              </div>
            </div>
            <div className="flex items-center sm:w-full px-auto"></div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col w-full gap-1">
              <label className="text-base font-bold" htmlFor="about">
                About
              </label>
              <span className="text-weasker-grey text-sm">
                A brief description of yourself shown on your profile.
              </span>
              <textarea
                id="about"
                name="about"
                className="text-weasker-grey text-sm border p-2 mt-3"
                placeholder={about}
                onChange={handleAboutChange}
                onBlur={handleAboutBlur}
                value={about}
                maxLength={300}
              />
              <div className="flex flex-row justify-between text-xs">
                <span className="text-weasker-grey">
                  {300 - aboutLength} characters left
                </span>
                <div
                  className={`transition-opacity ease-in-out duration-300 flex flex-row items-center gap-1 p-[2px] self-end text-emerald-500 border-emerald-500 border rounded ${
                    aboutSaved ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <IoIosCheckmarkCircleOutline />
                  Saved
                </div>
              </div>
            </div>
            <div className="flex items-center sm:w-full px-auto"></div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col gap-1 w-full">
              <label className="text-base font-bold" htmlFor="image">
                Profile image
              </label>
              <span className="text-weasker-grey text-sm">
                Images must be .png or .jpg format
              </span>
              <span className="text-weasker-grey text-sm">
                Ideal size 400*400 px
              </span>
              <div className="flex flex-col gap-2 border p-2">
                <div className="flex flex-row w-full gap-2">
                  {(user.seo.image as Media)?.cloudinary?.public_id &&
                    !imageObjectURL && (
                      <CldImage
                        width={200}
                        height={200}
                        src={(user.seo.image as Media).cloudinary.public_id}
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
                    className="flex flex-row gap-1 items-center m-auto max-h-12 border-2 border-tl-light-blue text-tl-light-blue rounded-lg py-1 px-2 hover:cursor-pointer font-bold"
                  >
                    <LiaCloudUploadAltSolid size={30} />
                    Upload
                    <input
                      className="hidden max-h-12 "
                      type="file"
                      name="myImage"
                      id="image"
                      onChange={uploadToClient}
                    />
                  </label>
                </div>
                {imageIsUploading ? (
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
                      className="text-xs max-h-12 border border-tl-light-blue text-tl-light-blue rounded-lg py-1 px-2 "
                      onClick={handleSaveImageNew}
                    >
                      Save
                    </button>
                    <button
                      onClick={handleRemoveImageFromClient}
                      className="text-xs max-h-12 border border-red-600 rounded-lg py-1 px-2 text-red-600"
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
            <div className="flex items-center sm:w-full px-auto"></div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col w-full">
              <div className="text-base font-bold">Email address</div>
              <span className="text-weasker-grey text-sm">{user.email}</span>
            </div>
            <div className="sm:w-full">
              <button
                onClick={handleChangeEmailClick}
                className="mx-auto border border-tl-light-blue text-tl-light-blue rounded-lg py-2 px-5"
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
                className="mx-auto border border-tl-light-blue text-tl-light-blue rounded-lg py-2 px-5"
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
      </div>
      {emailModalIsOpen && (
        <Modal onclick={() => setEmailModalIsOpen(false)}>
          <ChangeEmailComp setEmailModalIsOpen={setEmailModalIsOpen} />
        </Modal>
      )}
      {passwordModalIsOpen && (
        <Modal onclick={() => setPasswordModalIsOpen(false)}>
          <ChangePasswordComp setPasswordModalIsOpen={setPasswordModalIsOpen} />
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
