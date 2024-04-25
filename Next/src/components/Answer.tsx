"use client";

import "next-cloudinary/dist/cld-video-player.css";
import { CldImage } from "next-cloudinary";
import React, { useState } from "react";
import { Media, UsersInterview } from "@/payload/payload-types";
import Modal from "./ui/Modal";
import { WideBox } from "./ui/boxes";
import { leftArrowIcon, rightArrowIcon } from "@/utils/defaultIcons";

interface AnswerProps {
  answer: UsersInterview["answers"][number]["answer"];
}

const Answer: React.FC<AnswerProps> = ({ answer }) => {
  const [imagesModalOpen, setImagesModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imagesArray, setImagesArray] = useState<Media[] | null>();

  const currentImageIndex = imagesArray?.findIndex((item) => {
    return item.filename === currentImage;
  });

  const handleImageModalClose = () => {
    setImagesModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-3 max-w-[800px] sm:px-5">
      {(answer?.video as Media)?.filename && (
        <video
          key={(answer.video as Media).url}
          width="full"
          height="full"
          controls
          className="rounded rounded-t-lg max-h-[500px] bg-black"
        >
          <source src={(answer.video as Media).url} />
        </video>
      )}
      {answer.textAnswer && (
        <div
          className="break-words"
          dangerouslySetInnerHTML={{
            __html: answer.textAnswer.replace(/\n/g, "<br>"),
          }}
        ></div>
      )}
      {answer.images.length > 0 && (
        <div className="flex flex-row gap-2 flex-wrap ">
          {answer.images.map(
            (image, index) =>
              (image.image as Media)?.filename && (
                <CldImage
                  onClick={() => {
                    setCurrentImage((image.image as Media).filename);
                    setImagesArray(
                      answer.images?.map((item) => item.image as Media) ?? []
                    );
                    setImagesModalOpen(true);
                  }}
                  key={index}
                  alt={answer.questionSlug}
                  width={200}
                  height={200}
                  className="h-[100px] w-[100px] cover hover:cursor-pointer border rounded rounded-t-lg"
                  src={(image.image as Media).filename}
                />
              )
          )}
          {imagesModalOpen && currentImage && imagesArray && (
            <Modal onclick={handleImageModalClose}>
              <WideBox className="bg-black items-center bg-black relative">
                <CldImage
                  width={1000}
                  height={1000}
                  src={currentImage}
                  alt={"name"}
                  className="h-[100%] w-auto rounded rounded-t-lg w-full"
                />
                {imagesArray.length > 1 && (
                  <div
                    className="absolute right-1 sm:right-2 top-1/2 text-black hover:cursor-pointer bg-white rounded-full"
                    onClick={() => {
                      if (currentImageIndex !== undefined) {
                        const nextIndex =
                          (currentImageIndex + 1) % imagesArray.length;
                        setCurrentImage(imagesArray[nextIndex].filename);
                      }
                    }}
                  >
                    {rightArrowIcon(20, "text-tl-dark-blue")}
                  </div>
                )}
                {imagesArray.length > 1 && (
                  <div
                    className="absolute left-1 sm:left-2 top-1/2 text-black hover:cursor-pointer bg-white rounded-full"
                    onClick={() => {
                      if (currentImageIndex !== undefined) {
                        const prevIndex =
                          (currentImageIndex - 1 + imagesArray.length) %
                          imagesArray.length;
                        setCurrentImage(imagesArray[prevIndex].filename);
                      }
                    }}
                  >
                    {leftArrowIcon(20, "text-tl-dark-blue")}
                  </div>
                )}
              </WideBox>
            </Modal>
          )}
        </div>
      )}
    </div>
  );
};

export default Answer;
