//Component in progress

"use client";
import { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { CldImage } from "next-cloudinary";

interface ImageSliderProps {
  clickedImage: string;
  imagesArray: string[];
}

const ImageSlider: React.FC<ImageSliderProps> = (tempArray, clickedImage) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  if (modalOpen)
    return (
      <>
        <div
          className="fixed top-0 left-0 w-screen z-10 h-screen bg-black opacity-75"
          onClick={() => setModalOpen(false)}
        ></div>
        <div className="fixed flex flex-col z-20 min-w-fit min-h-fit inset-y-32 inset-x-8 md:inset-x-48 lg:inset-x-96 ">
          <CldImage
            width={1000}
            height={1000}
            src={clickedImage}
            alt={"name"}
            className="h-[110px] w-[100px] sm:w-[300px] sm:h-[30px] cover  rounded-full border-2 border-weasker-grey"
          />
          <IoIosCloseCircleOutline
            size={30}
            className="absolute right-1 top-1 hover:cursor-pointer"
            onClick={() => setModalOpen(false)}
          />
        </div>
      </>
    );
};

export default ImageSlider;
