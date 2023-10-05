import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="bg-tl-dark-blue text-white flex sm:flex-row flex-col gap-5 sm:justify-between px-5 py-5 font-light text-sm mt-10">
      <div>© {currentYear} All rights reserved weasker.com</div>
      <div>
        <Link href="/about">About / Contact Us</Link>
      </div>
    </div>
  );
};

export default Footer;
