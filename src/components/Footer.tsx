import React from "react";

type FooterProps = {
  className?: string;
};

function Footer({ className }: FooterProps) {
  return (
    <footer
      className={`${className} xl:px-12 px-1 sm:px-3 md:px-4 pt-1 pb-1 flex items-center justify-between font-light text-slate-600 xl:text-xs md:text-[11px] sm:text-[10px] text-[9px] bg-extralight-sky`}
    >
      <p>
        &copy;{new Date().getFullYear()} Shritam Mohanty. All rights reserved.
      </p>
      <p className="xl:text-[10px] text-[7px] sm:text-[8px] md:text-[9px]">
        Design & Developed by{" "}
        <a
          href="https://github.com/harry713j"
          target="_blank"
          rel="noopener noreferrer"
          className="text-rose-400 ease-linear transition hover:underline hover:text-rose-400/90"
        >
          Harihara
        </a>
      </p>
    </footer>
  );
}

export { Footer };
