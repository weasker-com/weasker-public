import Image from "next/image";
import Link from "next/link";
import logo from "../../public/logo/tl-logo-sep-23.png";

const Navbar = () => {
  return (
    <div className="border-bottom h-max py-4 border-b border-grey border-zinc-100">
      <div className="text-4xl my-auto m-auto w-max">
        <Link href="/" className="flex flex-row items-center gap-2 font-bold">
          <Image
            width={55}
            height={55}
            className="rounded-full"
            src={logo}
            alt="weasker logo"
            style={{ objectFit: "cover", width: "55px", height: "55px" }}
          />{" "}
          weasker
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
