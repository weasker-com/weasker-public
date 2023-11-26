import Image from "next/image";
import logo from "../../public/logo/tl-logo-sep-23.png";
import { InternalLink } from "./links/InternalLink";

const Navbar = () => {
  return (
    <div className="border-bottom h-max py-4 border-b border-grey border-zinc-100">
      <div className="text-4xl my-auto m-auto w-max">
        <InternalLink
          element={
            <>
              <Image
                width={55}
                height={55}
                className="rounded-full"
                src={logo}
                alt="weasker logo"
                style={{ objectFit: "cover", width: "55px", height: "55px" }}
              />{" "}
              weasker
            </>
          }
          className="flex flex-row items-center gap-2 font-bold"
          href="/"
          eventName="ClickInnerPage"
          target="HP"
          locationOnPage="Navbar"
        />
      </div>
    </div>
  );
};

export default Navbar;
