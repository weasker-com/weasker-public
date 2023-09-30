import Image from "next/image";
import Link from "next/link";
import { listItem } from "../../types/listItem-type";

const ListItem = (props: listItem) => {
  return (
    <div className="flex flex-row w-full gap-2 sm:gap-5 my-5 sm:my-8 items-center capitalize">
      <Link href={`/question/${props.badge.slug}/${props.slug}`}>
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
      </Link>
      <div className="flex flex-col">
        <Link
          href={`/badge/${props.badge.slug}`}
          className="text-tl-dark-blue flex flex-row items-center gap-1"
        >
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
        </Link>
        <Link href={`/question/${props.badge.slug}/${props.slug}`}>
          <p>{props.title}</p>
        </Link>
      </div>
    </div>
  );
};

export default ListItem;
