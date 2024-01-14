import { InternalLink } from "./links/InternalLink";

const Navbar = () => {
  return (
    <div className="h-max py-1 border-b border-zinc-100 bg-white">
      <div className="text-4xl font-black font-extrabold smallCaps text-tl-dark-blue my-auto mx-3 max-w-[1000px] lg:mx-auto m-auto ">
        <InternalLink
          element={<>Weasker</>}
          className=""
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
