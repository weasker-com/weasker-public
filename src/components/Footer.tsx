import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="bg-tl-dark-blue text-white flex flex-row justify-between px-8 py-5 font-light text-sm mt-10">
      <div>© {currentYear} All rights reserved weasker.com</div>
      <div>
        <Link href="/about">About / Contact Us</Link>
      </div>
    </div>
  );
};

export default Footer;
