"use client";

import {
  Badge,
  Interview,
  Media,
  User,
  UsersInterview,
} from "../../../../../../payload/payload-types";
import React, { useState, useEffect, ReactNode } from "react";
import { WideBox } from "@/components/ui/boxes";
import { ImageAndText } from "@/components/elements/ImageAndText";
import { FileInput, TextAreaInput } from "@/components/ui/inputs";
import { isEqual } from "lodash";
import {
  imageIcon,
  infoIcon,
  internalLinkIcon,
  notSavedIcon,
  successIcon,
  videoIcon,
} from "@/utils/defaultIcons";
import { BigButton, GentleButton } from "@/components/ui/buttons";
import { InternalLink } from "@/components/links/InternalLink";
import Modal from "@/components/ui/Modal";
import { CldImage } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";
import Image from "next/image";
import { deleteById, updateById, uploadImage, create } from "@/utils/restReq";
import Hero from "@/components/Hero";
import NoAuth from "@/components/NoAuth";
import { usePathname } from "next/navigation";
import { revalidateByServerAction } from "@/utils/revalidate";
import { defaultImages } from "@/utils/defaultImages";

interface EditInterviewProps {
  data: { data: { UsersInterviews: { docs: UsersInterview[] } } };
  params: { badge: string; user: string; interview: string };
  operation: "create" | "update";
  user: User;
}

export const EditInterview: React.FC<EditInterviewProps> = ({
  data,
  operation,
  user,
  params,
}) => {
  const [activeUser, setActiveUser] = useState(false);
  const [answers, setAnswers] = useState<UsersInterview["answers"] | null>([]);
  const [savedAnswers, setSavedAnswers] = useState<
    UsersInterview["answers"] | null
  >([]);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [allSaved, setAllSaved] = useState(true);
  const [newImageObjects, setNewImageObjects] = useState<
    {
      questionSlug: string;
      imageUrl: string;
    }[]
  >([]);
  const [newImages, setNewImages] = useState([]);
  const [newVideos, setNewVideos] = useState([]);
  const [errorMessages, setErrorMessages] = useState<
    | {
        questionSlug: string;
        element: string;
        message: string;
      }[]
    | null
  >([]);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<boolean | ReactNode>(false);
  const userInterview = data.data.UsersInterviews.docs[0];
  const interview = userInterview.interview as Interview;
  const [removedVideoIds, setRemovedVideoIds] = useState<string[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);

  const [notAllSavedTooltip, setNotAllSavedTooltip] = useState(false);
  const [errorListOpen, setErrorListOpen] = useState(false);
  const pathname = usePathname();
  const relevantBadge = user.userBadges.filter((item) => {
    return (item.badge as Badge).seo.slug == params.badge;
  })[0];

  useEffect(() => {
    if (data.data.UsersInterviews) {
      const answered = data.data.UsersInterviews.docs[0].answers;

      const notAnswered = (
        data.data.UsersInterviews.docs[0].interview as Interview
      ).questions
        .filter(
          (question) =>
            !answered.some(
              (answer) =>
                question.question.seo.slug === answer.answer.questionSlug
            )
        )
        .map((question) => {
          return {
            answer: {
              questionSlug: question.question.seo.slug,
              textAnswer: "",
              video: null,
              images: [],
            },
          };
        });

      setAnswers([...answered, ...notAnswered]);
      setSavedAnswers(data.data.UsersInterviews.docs[0].answers);
    }
  }, [data.data.UsersInterviews]);

  const handleNotAllSavedClick = () => {
    setNotAllSavedTooltip(!notAllSavedTooltip);
  };

  useEffect(() => {
    const isAllSaved = isEqual(answers, savedAnswers);

    setAllSaved(isAllSaved);
  }, [answers, savedAnswers]);

  const handleDismissErrorMessage = (questionSlug, type) => {
    setErrorMessages(
      errorMessages.filter((errorMessage) => {
        return !(
          errorMessage.questionSlug === questionSlug &&
          errorMessage.element === type
        );
      })
    );
  };

  const handleErrorInfoClick = () => {
    setErrorListOpen(!errorListOpen);
  };

  const handleTextAnswerChange = (questionSlug, textAnswer) => {
    setAnswers((prevAnswers) =>
      prevAnswers.map((answer) =>
        answer.answer.questionSlug === questionSlug
          ? {
              ...answer,
              answer: { ...answer.answer, textAnswer: textAnswer },
            }
          : answer
      )
    );
  };

  const handleModalOpen = (slug: string) => {
    setModalIsOpen(true);
    setActiveModal(slug);
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
    setActiveModal(null);
  };

  const handleUploadImageToClient = (questionSlug) => (event) => {
    setErrorMessages(
      errorMessages.filter((errorMessage) => {
        return !(
          errorMessage.questionSlug === questionSlug &&
          errorMessage.element === "images"
        );
      })
    );

    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      const isSupportedFileType =
        i.type === "image/png" ||
        i.type === "image/jpeg" ||
        i.type === "image/heic" ||
        i.type === "image/webp";
      const isFileSizeValid = i.size <= 2000000;

      if (isSupportedFileType && isFileSizeValid) {
        const imageURL = URL.createObjectURL(i);
        setNewImageObjects([
          ...newImageObjects,
          { questionSlug, imageUrl: imageURL },
        ]);
        setNewImages([...newImages, { questionSlug, i, imageUrl: imageURL }]);
      } else {
        if (!isSupportedFileType) {
          setErrorMessages([
            ...errorMessages,
            {
              questionSlug,
              element: "images",
              message: "Please upload .png .jpg .webp or .heic images only",
            },
          ]);
        }
        if (!isFileSizeValid) {
          setErrorMessages([
            ...errorMessages,
            {
              questionSlug,
              element: "images",
              message: "Maximum image size is 2MB",
            },
          ]);
        }

        console.log("error uploading image");
      }
    }
  };

  const handleUploadVideoToClient = (questionSlug) => (event) => {
    setErrorMessages(
      errorMessages.filter((errorMessage) => {
        return !(
          errorMessage.questionSlug === questionSlug &&
          errorMessage.element === "video"
        );
      })
    );

    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      const isSupportedFileType =
        i.type === "video/mp4" ||
        i.type === "video/quicktime" ||
        i.type === "video/mpeg" ||
        i.type === "video/x-msvideo" ||
        i.type === "video/3gpp";

      const isFileSizeValid = i.size <= 500000000;

      if (isSupportedFileType && isFileSizeValid) {
        const videoURL = URL.createObjectURL(i);
        setNewVideos([...newVideos, { questionSlug, i, videoUrl: videoURL }]);
      } else {
        let errorMessage =
          "Error: we had an issue uploading the video. please try again.";
        if (!isSupportedFileType) {
          errorMessage =
            "Unsupported file format. Please upload a video in one of the following formats: MP4, MPEG, QuickTime, AVI (X-MSVIDEO), or 3GPP.";
        }
        if (!isFileSizeValid) {
          errorMessage =
            "File size exceeds the 500 MB limit. Please upload a smaller video.";
        }

        setErrorMessages([
          ...errorMessages,
          {
            questionSlug,
            element: "video",
            message: errorMessage,
          },
        ]);
        console.log("error uploading video");
      }
    }
  };

  const handleRemovePublishedImage = (questionSlug, imageId) => (e) => {
    e.preventDefault();
    setErrorMessages(
      errorMessages.filter((errorMessage) => {
        return !(
          errorMessage.questionSlug === questionSlug &&
          errorMessage.element === "images"
        );
      })
    );

    setAnswers((prevAnswers) =>
      prevAnswers.map((answer) => {
        if (answer.answer.questionSlug === questionSlug) {
          const filteredImages = answer.answer.images.filter(
            (img) => (img.image as Media).id !== imageId
          );

          return {
            ...answer,
            answer: { ...answer.answer, images: filteredImages },
          };
        }
        return answer;
      })
    );

    setRemovedImageIds((prevIds) => {
      if (!prevIds.includes(imageId)) {
        return [...prevIds, imageId];
      }
      return prevIds;
    });
  };

  const handleRemoveClientImage = (questionSlug, imageToRemove) => (e) => {
    e.preventDefault();
    setErrorMessages(
      errorMessages.filter((errorMessage) => {
        return !(
          errorMessage.questionSlug === questionSlug &&
          errorMessage.element === "images"
        );
      })
    );

    setNewImageObjects((prevImageObjects) =>
      prevImageObjects.filter(
        (imageObject) =>
          !(
            imageObject.questionSlug === questionSlug &&
            imageObject.imageUrl === imageToRemove.imageUrl
          )
      )
    );

    setNewImages((prevImages) =>
      prevImages.filter(
        (image) =>
          !(
            image.questionSlug === questionSlug &&
            image.imageUrl === imageToRemove.imageUrl
          )
      )
    );
  };

  const handleRemoveClientVideo = (questionSlug, videoToRemove) => (e) => {
    e.preventDefault();
    setErrorMessages(
      errorMessages.filter((errorMessage) => {
        return !(
          errorMessage.questionSlug === questionSlug &&
          errorMessage.element === "video"
        );
      })
    );

    setNewVideos((prevVideos) =>
      prevVideos.filter(
        (video) =>
          !(
            video.questionSlug === questionSlug &&
            video.videoUrl === videoToRemove.videoUrl
          )
      )
    );
  };

  const handleRemovePublishedVideo = (questionSlug) => (e) => {
    setErrorMessages(
      errorMessages.filter((errorMessage) => {
        return !(
          errorMessage.questionSlug === questionSlug &&
          errorMessage.element === "video"
        );
      })
    );

    e.preventDefault();
    setAnswers((prevAnswers) => {
      const updatedAnswers = prevAnswers.map((answer) => {
        if (
          answer.answer.questionSlug === questionSlug &&
          answer.answer.video
        ) {
          setRemovedVideoIds((prevIds) => [
            ...prevIds,
            (answer.answer.video as Media).id,
          ]);
          return {
            ...answer,
            answer: { ...answer.answer, video: null },
          };
        }
        return answer;
      });
      return updatedAnswers;
    });
  };

  async function deleteMedia(id) {
    try {
      const deleteResponse = await deleteById({
        collection: "media",
        id: id,
      });

      if (deleteResponse.status === 200) {
        console.log("Success deleting media");
      } else {
        console.error("Error deleting media", deleteResponse);
      }
    } catch (error) {
      console.error("Error in deleting media", error);
    }
  }

  async function uploadImages(images) {
    const uploadPromises = images.map(async (image) => {
      try {
        const body = new FormData();
        body.append("file", image.i);
        const response = await uploadImage(body);
        if (response.status === 201) {
          return {
            success: true,
            image: response.data.doc,
            questionSlug: image.questionSlug,
          };
        } else {
          return { success: false, error: "Upload failed", image: image };
        }
      } catch (error) {
        return { success: false, error: error, image: image };
      }
    });
    return await Promise.all(uploadPromises);
  }

  async function uploadVideos(videos) {
    const uploadPromises = videos.map(async (video) => {
      try {
        const body = new FormData();
        body.append("file", video.i);
        const response = await uploadImage(body);
        if (response.status === 201) {
          return {
            success: true,
            video: response.data.doc,
            questionSlug: video.questionSlug,
          };
        } else {
          return { success: false, error: "Upload failed", video: video };
        }
      } catch (error) {
        return { success: false, error: error, video: video };
      }
    });
    return await Promise.all(uploadPromises);
  }

  async function updateContentWithMedia(
    uploadedImages,
    uploadedVideos,
    originalAnswers
  ) {
    const updatedAnswers = originalAnswers.map((answer) => {
      const updatedImages = uploadedImages
        .filter(
          (img) =>
            img.success && answer.answer.questionSlug === img.questionSlug
        )
        .map((img) => ({ image: img.image }));
      const preparedImages = [...answer.answer.images, ...updatedImages].map(
        (image) => ({ image: image.image.id })
      );

      const videoUpdate = uploadedVideos.find(
        (video) =>
          video.success && answer.answer.questionSlug === video.questionSlug
      );
      const updatedVideoAnswer = videoUpdate
        ? videoUpdate.video.id
        : answer.answer.video?.id || null;

      return {
        ...answer,
        answer: {
          ...answer.answer,
          images: preparedImages,
          video: updatedVideoAnswer,
        },
      };
    });

    return updatedAnswers;
  }

  async function finalizeContentUpdate(updatedAnswers) {
    const answersForUpdate = updatedAnswers.map((answer) => ({
      ...answer,
      answer: {
        ...answer.answer,
        images: answer.answer.images.map((image) => {
          return { image: image.image };
        }),
      },
    }));

    if (operation == "update") {
      try {
        const updateResponse = await updateById({
          collection: "users-interviews",
          id: userInterview.id,
          data: { answers: answersForUpdate },
        });

        if (updateResponse.status === 200) {
          console.log("Success updating interview");
        } else {
          console.error("Error updating interview:", updateResponse.statusText);
        }
      } catch (error) {
        console.error("Error in finalizeContentUpdate:", error);
      }
    }

    if (operation == "create") {
      try {
        const createResponse = await create({
          collection: "users-interviews",
          data: {
            answers: answersForUpdate,
            user: user.id,
            interview: interview.id,
            badge: interview.badge,
            _status: "published",
          },
        });

        if (createResponse.status === 200) {
          console.log("Success updating interview");
        } else {
          console.log("error", createResponse.statusText);
          console.error("Error creating interview:", createResponse.statusText);
        }
      } catch (error) {
        console.log("error", error);
        console.error("Error in finalizeContentUpdate:", error);
      }
    }
  }

  const handleInterviewSubmit = async (e) => {
    setSaving(true);
    e.preventDefault();

    const uploadedImages = await uploadImages(newImages);
    const uploadedVideos = await uploadVideos(newVideos);

    let newErrorMessages = [];

    const allVideosUploaded = uploadedVideos.every((upload) => upload.success);
    if (!allVideosUploaded) {
      const videoErrorMessages = uploadedVideos
        .filter((video) => !video.success)
        .map((failedVideo) => ({
          message:
            failedVideo?.error?.response?.data?.errors[0]?.data[0]?.message ||
            "We had an issue uploading this file. Please try again",
          element: "video",
          questionSlug: failedVideo.video.questionSlug,
        }));
      newErrorMessages = [...newErrorMessages, ...videoErrorMessages];
    }

    const allImagesUploaded = uploadedImages.every((upload) => upload.success);
    if (!allImagesUploaded) {
      const imageErrorMessages = uploadedImages
        .filter((image) => !image.success)
        .map(
          (failedImage) => (
            console.log(
              "failedImage",
              failedImage.error.response.data.errors[0].data[0].message
            ),
            {
              message:
                failedImage?.error?.response?.data?.errors[0]?.data[0]
                  ?.message ||
                "We had an issue uploading this file. Please try again",
              element: "images",
              questionSlug: failedImage.image.questionSlug,
            }
          )
        );
      newErrorMessages = [...newErrorMessages, ...imageErrorMessages];
    }

    if (newErrorMessages.length > 0) {
      setErrorMessages((prevErrorMessages) => [
        ...prevErrorMessages,
        ...newErrorMessages,
      ]);
      setSaving(false);
      return;
    }

    const answersForUpdate = await updateContentWithMedia(
      uploadedImages,
      uploadedVideos,
      answers
    );

    for (const videoId of removedVideoIds) {
      await deleteMedia(videoId);
    }

    for (const imageId of removedImageIds) {
      await deleteMedia(imageId);
    }

    await finalizeContentUpdate(answersForUpdate);

    setRemovedVideoIds([]);
    setRemovedImageIds([]);
    setSaving(false);
    setSuccess(
      <div className="flex flex-row gap-1 text-emerald-500">
        <span>{successIcon(20)}</span>
        <span>SAVED</span>
      </div>
    );

    setNewImages([]);
    setNewVideos([]);
    setNewImageObjects([]);

    revalidateByServerAction(pathname);

    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  const ctaButton = (
    <InternalLink
      href={`/interview/${params.badge}/${user.seo.slug}/${params.interview}`}
      newTab={true}
      element={
        <BigButton
          className="bg-tl-dark-blue"
          text={
            <div className="flex flex-row gap-1 items-center">
              {`View Live Interview`}
              {internalLinkIcon(20)}
            </div>
          }
        />
      }
    ></InternalLink>
  );

  useEffect(() => {
    if (user) {
      setActiveUser(true);
    } else setActiveUser(false);
  }, [user]);

  if (!activeUser || !user) {
    return <NoAuth />;
  }

  return (
    <>
      <Hero
        title={interview.name}
        longTitle={true}
        preTitle={
          <>
            Editing: Interview with&nbsp;
            <InternalLink
              element={user.displayName || user.userName}
              style={"inherit"}
              className="underline"
              href={`/user/${user.seo.slug}`}
            />
          </>
        }
        image={
          (user.seo.image as Media)?.filename || defaultImages.defaultUserImage
        }
        about={
          <div className="flex flex-col gap-2">
            <div>
              {" "}
              {interview.seo.excerpt ||
                relevantBadge?.bio ||
                user.seo.excerpt ||
                ""}
            </div>
          </div>
        }
        cta={ctaButton}
      />
      <div className="flex flex-col sm:flex-row gap-3 max-w-[1000px] mt-2 w-full">
        <div className="lg:w-[70%] flex flex-col w-full">
          <div className="flex flex-col gap-2 w-full">
            {answers.length > 0 &&
              interview.questions.map((item, index) => {
                const question = item.question;
                const questionSlug = question.seo.slug;
                const relevantAnswer = answers.filter((answer) => {
                  return answer.answer.questionSlug == questionSlug;
                })[0].answer;
                const uploadedImages = newImageObjects.filter((item) => {
                  return item.questionSlug == questionSlug;
                });

                const relevantSavedAnswer = savedAnswers?.filter(
                  (savedAnswer) => {
                    return savedAnswer.answer.questionSlug == questionSlug;
                  }
                )[0]?.answer;

                const videoSaved =
                  relevantAnswer.video === relevantSavedAnswer?.video &&
                  !newVideos.some((video) => {
                    return video.questionSlug === questionSlug;
                  });

                const allImagesSaved =
                  relevantAnswer.images == relevantSavedAnswer?.images &&
                  !newImages.some((image) => {
                    return image.questionSlug === questionSlug;
                  });

                const textSaved =
                  relevantAnswer.textAnswer == relevantSavedAnswer?.textAnswer;

                const videoUploadedToClient = newVideos.find(
                  (item) => item.questionSlug === questionSlug
                );

                const entireAnswerSaved =
                  allImagesSaved && videoSaved && textSaved;

                const answerVideoError = errorMessages?.filter(
                  (errorMessage) => {
                    return (
                      errorMessage.questionSlug == questionSlug &&
                      errorMessage.element == "video"
                    );
                  }
                );

                const questionHasAnswer =
                  relevantAnswer.video !== null ||
                  relevantAnswer.images.length !== 0 ||
                  relevantAnswer.textAnswer !== "";

                const answerImagesError = errorMessages?.filter(
                  (errorMessage) => {
                    return (
                      errorMessage.questionSlug == questionSlug &&
                      errorMessage.element == "images"
                    );
                  }
                );

                return (
                  <WideBox key={index} className="p-5" id={question.seo.slug}>
                    <div className="flex flex-col gap-5 w-full relative">
                      <div className="flex flex-col gap-2">
                        {questionHasAnswer &&
                          (entireAnswerSaved ? (
                            <div className="absolute top-[-10px] right-[-10px] group">
                              {successIcon(
                                20,
                                "bg-white rounded-full border text-emerald-500"
                              )}{" "}
                              <span className="transition-opacity ease-in-out duration-300 opacity-0 group-hover:opacity-100 absolute top-5 right-5 rounded rounded-t-lg shadow-lg p-1 bg-white z-50 text-xs border ">
                                Answer saved
                              </span>
                            </div>
                          ) : (
                            <div className="absolute top-[-10px] right-[-10px] group">
                              {notSavedIcon(20, "bg-white")}{" "}
                              <span className="transition-opacity ease-in-out duration-300 opacity-0 group-hover:opacity-100 absolute top-5 right-5 rounded rounded-t-lg shadow-lg p-1 bg-white z-50 text-xs border ">
                                Answer not saved
                              </span>
                            </div>
                          ))}
                        <ImageAndText
                          number={index + 1}
                          title={<h2>{question.shortQuestion}</h2>}
                        />
                        <span className="text-base">
                          {question.longQuestion}
                        </span>
                      </div>
                      <div className="flex flex-col gap-5 relative">
                        <div>
                          {relevantAnswer.video && questionHasAnswer ? (
                            <>
                              <div className="absolute top-1 right-1 text-emerald-500 z-20">
                                {successIcon(
                                  15,
                                  "bg-white rounded-full border"
                                )}
                              </div>
                              {(relevantAnswer.video as Media).url && (
                                <div className="flex flex-col gap-2 p-2 border rounded rounded-t-lg ">
                                  <video
                                    width="1920"
                                    height="1080"
                                    controls
                                    className="rounded rounded-t-lg"
                                  >
                                    <source
                                      src={(relevantAnswer.video as Media).url}
                                    />
                                  </video>

                                  <GentleButton
                                    onClick={handleRemovePublishedVideo(
                                      questionSlug
                                    )}
                                    text={"Remove video"}
                                  />
                                </div>
                              )}
                            </>
                          ) : videoUploadedToClient ? (
                            <div className="flex flex-col gap-2 p-2 border rounded rounded-t-lg">
                              <video width="1920" height="1080" controls>
                                <source
                                  src={videoUploadedToClient.videoUrl}
                                  type="video/mp4"
                                />
                                Your browser does not support the video tag.
                              </video>
                              <span className="text-xs">
                                This is a preview. The video will play more
                                smoothly after being saved.
                              </span>
                              <GentleButton
                                onClick={handleRemoveClientVideo(
                                  questionSlug,
                                  videoUploadedToClient
                                )}
                                text={"Remove video"}
                              />
                            </div>
                          ) : (
                            <FileInput
                              name={`video-${item.question.seo.slug}`}
                              onChange={handleUploadVideoToClient(questionSlug)}
                              label={
                                <div className="flex flex-col gap-2 p-2 border rounded rounded-t-lg hover:cursor-pointer centerAbsolute">
                                  <div className="flex flex-col sm:flex-row items-center gap-10">
                                    <div className="flex flex-col gap-2 p-2 border rounded rounded-t-lg centerAbsolute">
                                      <div className="flex flex-col sm:h-[100px] sm:w-[100px] h-[80px] w-[80px] cover border w-full rounded rounded-t-lg centerAbsolute">
                                        <div>{videoIcon(80)}</div>
                                      </div>
                                      <div
                                        className={`flex flex-row gap-1 centerAbsolute rounded rounded-t-lg text-tl-dark-blue border text-xs  sm:text-sm py-1 px-2 hover:opacity-70`}
                                      >
                                        Upload video
                                      </div>
                                    </div>
                                    <div className="flex flex-col gap-2 text-xs text-weasker-grey text-left">
                                      <div>
                                        Supported file format: MP4, MPEG,
                                        QuickTime, AVI (X-MSVIDEO), or 3GPP
                                      </div>
                                      <div>Maximum file size: 500 MB</div>
                                    </div>
                                  </div>
                                </div>
                              }
                            />
                          )}
                          {errorMessages && answerVideoError.length > 0 && (
                            <div className="flex flex-col gap-1 items-start">
                              <span className="text-red-600 text-xs">
                                {answerVideoError[0].message}
                              </span>
                              <GentleButton
                                onClick={() =>
                                  handleDismissErrorMessage(
                                    questionSlug,
                                    "video"
                                  )
                                }
                                text="Got it"
                              />
                            </div>
                          )}
                        </div>
                        <div className="relative">
                          {textSaved && questionHasAnswer && (
                            <div className="absolute right-[-5px] text-emerald-500 z-10">
                              {successIcon(15, "bg-white rounded-full border")}
                            </div>
                          )}
                          <TextAreaInput
                            value={relevantAnswer.textAnswer || ""}
                            maxLength={1000}
                            comment={`${
                              1000 - relevantAnswer.textAnswer.length
                            } characters left`}
                            commentClassName="text-xs"
                            placeHolder={
                              relevantAnswer.textAnswer ||
                              "Type your answer here..."
                            }
                            onChange={(e) =>
                              handleTextAnswerChange(
                                questionSlug,
                                e.target.value
                              )
                            }
                            name="textAnswer"
                            className="h-48 resize-none"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-row flex-wrap gap-2 w-full justify-start justify-items-start content-start">
                            {relevantAnswer.images &&
                              relevantAnswer.images.map((item, index) => {
                                return (
                                  <div
                                    className="flex flex-col gap-2 p-2 border rounded rounded-t-lg relative"
                                    key={index}
                                  >
                                    <div className="absolute top-1 right-1 text-emerald-500">
                                      {successIcon(
                                        15,
                                        "bg-white rounded-full border"
                                      )}
                                    </div>
                                    <CldImage
                                      alt={questionSlug}
                                      width={200}
                                      height={200}
                                      className="sm:h-[100px] sm:w-[100px] h-[80px] w-[80px] cover hover:cursor-pointer border rounded rounded-t-lg"
                                      src={(item.image as Media).filename}
                                    />
                                    <GentleButton
                                      text={"Remove"}
                                      onClick={handleRemovePublishedImage(
                                        questionSlug,
                                        (item.image as Media).id
                                      )}
                                    />
                                  </div>
                                );
                              })}
                            {uploadedImages.length > 0 &&
                              uploadedImages.map((item, index) => {
                                return (
                                  <div
                                    className="flex flex-col gap-2 p-2 border rounded rounded-t-lg"
                                    key={index}
                                  >
                                    <Image
                                      src={item.imageUrl}
                                      width={200}
                                      height={200}
                                      alt={questionSlug}
                                      className="sm:h-[100px] sm:w-[100px] h-[80px] w-[80px] cover hover:cursor-pointer border rounded rounded-t-lg"
                                    />

                                    <GentleButton
                                      onClick={handleRemoveClientImage(
                                        questionSlug,
                                        item
                                      )}
                                      text={"Remove"}
                                    />
                                  </div>
                                );
                              })}
                            {uploadedImages.length +
                              relevantAnswer.images.length <
                              5 && (
                              <FileInput
                                name={`image-${item.question.seo.slug}`}
                                onChange={handleUploadImageToClient(
                                  questionSlug
                                )}
                                label={
                                  <div className="flex flex-col gap-2 p-2 border rounded rounded-t-lg hover:cursor-pointer centerAbsolute">
                                    <div className="flex flex-col sm:h-[100px] sm:w-[100px] h-[80px] w-[80px] cover border rounded rounded-t-lg centerAbsolute">
                                      <div>{imageIcon(80)}</div>
                                    </div>
                                    <div
                                      className={`flex flex-row gap-1 centerAbsolute rounded rounded-t-lg text-tl-dark-blue border text-xs  sm:text-sm py-1 px-2 hover:opacity-70`}
                                    >
                                      Upload img
                                    </div>
                                  </div>
                                }
                              />
                            )}
                          </div>
                          <div>
                            {errorMessages && answerImagesError.length > 0 && (
                              <div className="flex flex-row gap-1 items-center">
                                <span className="text-xs text-red-600">
                                  {answerImagesError[0].message}
                                </span>
                                <GentleButton
                                  onClick={() =>
                                    handleDismissErrorMessage(
                                      questionSlug,
                                      "images"
                                    )
                                  }
                                  text="Got it"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-weasker-grey">
                          {uploadedImages.length + relevantAnswer.images.length}
                          /5 images
                        </span>
                      </div>
                    </div>
                  </WideBox>
                );
              })}
          </div>
          <div className="fixed flex flex-col gap-2 items-center bottom-0 left-0 z-10 h-max lg:hidden w-full py-3 px-1 bg-white mt-2 border-t">
            {notAllSavedTooltip && (
              <span className="text-tl-light-blue">
                You have unsaved changes
              </span>
            )}
            {errorListOpen && (
              <div className="flex flex-col py-3">
                <ul className="flex flex-col text-left text-sm gap-2 w-full text-red-600">
                  {errorMessages.map((message, index) => {
                    const questionIndex = interview.questions.findIndex(
                      (q) => q.question.seo.slug === message.questionSlug
                    );

                    const displayMessage = `Error with ${
                      message.element
                    } in question ${questionIndex + 1}`;

                    return (
                      <li key={index} className="flex flex-row gap-1">
                        <span>{infoIcon(20)}</span>
                        <InternalLink
                          href={`#${message.questionSlug}`}
                          element={displayMessage}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            <div className="flex flex-wrap gap-5 justify-center">
              <GentleButton
                onClick={() => handleModalOpen("questions")}
                disabled={saving}
                className="h-10 border-2 border-tl-dark-blue font-semibold"
                text="QUESTION LIST"
              />
              <div className="flex flex-row gap-1 items-center">
                <GentleButton
                  loading={saving}
                  disabled={
                    saving ||
                    success !== false ||
                    (allSaved &&
                      newImages.length == 0 &&
                      newVideos.length == 0) ||
                    errorMessages.length > 0
                  }
                  success={success}
                  className="h-10 border-2 border-tl-light-blue text-tl-light-blue font-semibold disabled:border-weasker-grey hover:opacity-100"
                  text="SAVE & PUBLISH"
                  onClick={handleInterviewSubmit}
                />
                {errorMessages.length > 0 && (
                  <div onClick={handleErrorInfoClick} className="text-red-600">
                    {infoIcon(30)}
                  </div>
                )}
                {(!allSaved ||
                  newImages.length !== 0 ||
                  newVideos.length !== 0) &&
                  errorMessages.length > 0 && (
                    <div
                      onClick={handleNotAllSavedClick}
                      className="text-tl-light-blue"
                    >
                      {infoIcon(30)}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
        <div className="sticky z-10 top-2 h-max flex-col gap-2 hidden lg:flex w-[30%]">
          {errorMessages.length > 0 && (
            <WideBox className="p-5 justify-center items-center">
              <div className="flex flex-col gap-3">
                Errors
                <ul className="flex flex-col gap-1 text-left text-sm gap-5 w-full text-red-600">
                  {errorMessages.map((message, index) => {
                    const questionIndex = interview.questions.findIndex(
                      (q) => q.question.seo.slug === message.questionSlug
                    );

                    const displayMessage = `Error with ${
                      message.element
                    } in question ${questionIndex + 1}`;

                    return (
                      <li key={index} className="flex flex-row gap-1">
                        <span>{infoIcon(20)}</span>
                        <InternalLink
                          href={`#${message.questionSlug}`}
                          element={displayMessage}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            </WideBox>
          )}
          {(!allSaved || newImages.length !== 0 || newVideos.length !== 0) &&
            errorMessages.length > 0 && (
              <WideBox className="p-5 justify-center items-center">
                <div className="flex flex-row items-center gap-2 w-full text-tl-light-blue">
                  {infoIcon(20)}
                  <span>You have unsaved changes</span>
                </div>
              </WideBox>
            )}
          <WideBox className="p-5 justify-center items-center">
            <div className="flex flex-row gap-2 w-full">
              <div className="min-w-[50%]">
                <GentleButton
                  onClick={() => handleModalOpen("questions")}
                  disabled={saving}
                  className="h-10 border-2 border-tl-dark-blue font-semibold"
                  text="Question List"
                />
              </div>
              <div className="min-w-[50%]">
                <GentleButton
                  loading={saving}
                  disabled={
                    (allSaved &&
                      newImages.length == 0 &&
                      newVideos.length == 0) ||
                    saving ||
                    success !== false ||
                    errorMessages.length > 0
                  }
                  success={success}
                  className="h-10 border-2 border-tl-light-blue text-tl-light-blue font-semibold w-full disabled:border-weasker-grey hover:opacity-100"
                  text="Save & Publish"
                  onClick={handleInterviewSubmit}
                />
              </div>
            </div>
          </WideBox>
        </div>
      </div>

      {modalIsOpen && activeModal == "questions" && (
        <Modal onclick={handleModalClose}>
          <WideBox className="p-3 sm:p-5">
            <div className="flex flex-col gap-5">
              <span className="smallCaps text-base font-bold">
                Question list
              </span>

              <ul className="flex flex-col gap-3 text-sm">
                {interview.questions.map((question, index) => {
                  const hasError = errorMessages.some(
                    (errorMessage) =>
                      errorMessage.questionSlug === question.question.seo.slug
                  );

                  return (
                    <li
                      key={index}
                      className={`hover:pointer-cursor hover:text-tl-light-blue ${
                        hasError ? "text-red-500" : " "
                      }`}
                      onClick={() => setModalIsOpen(false)}
                    >
                      {
                        <InternalLink
                          href={`#${question.question.seo.slug}`}
                          element={
                            <div className="flex flex-row gap-1">
                              <div className="font-bold">{index + 1}.</div>
                              <span>{question.question.shortQuestion}</span>
                            </div>
                          }
                        />
                      }
                    </li>
                  );
                })}
              </ul>
            </div>
          </WideBox>
        </Modal>
      )}
    </>
  );
};
