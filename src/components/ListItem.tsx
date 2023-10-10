import Image from "next/image";
import Link from "next/link";
import { listItem } from "../../types/listItem-type";
import { InternalLink } from "./links/InternalLink";

const ListItem = (props: listItem) => {
  return (
    <div className="flex flex-row w-full gap-2 sm:gap-5 my-5 sm:my-8 items-center capitalize">
      <InternalLink
        element={
          <div className="w-[65px]">
            <Image
              style={{
                width: "65px",
                height: "65px",
                borderRadius: "100px",
              }}
              src={props.image}
              alt={props.title}
              width={65}
              height={65}
            ></Image>
          </div>
        }
        href={`/question/${props.badge.slug}/${props.slug}`}
        eventName="ClickQuestionPage"
        target={props.title}
        locationOnPage="list"
      />
      <div className="flex flex-col">
        <InternalLink
          element={
            <>
              <Image
                src={props.badge.image}
                alt={props.badge.name}
                width={20}
                height={20}
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "100px",
                }}
              ></Image>
              <span className="text-sm">{props.badge.name}</span>
            </>
          }
          className="text-tl-dark-blue flex flex-row items-center gap-1"
          href={`/badge/${props.badge.slug}`}
          eventName="ClickBadgeName"
          target={props.badge.name}
          locationOnPage="list"
        />
        <InternalLink
          element={<p>{props.title}</p>}
          href={`/question/${props.badge.slug}/${props.slug}`}
          eventName="ClickQuestionPage"
          target={props.title}
          locationOnPage="list"
        />
      </div>
    </div>
  );
};

export default ListItem;
