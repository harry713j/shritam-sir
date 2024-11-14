"use client";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { animated, useSpring, useSpringValue } from "@react-spring/web";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const opacity = useSpringValue(0, {
    config: {
      duration: 1000,
    },
  });

  useEffect(() => {
    opacity.start(1);
  }, [opacity]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  return (
    <animated.div
      style={{ opacity }}
      className="relative overflow-hidden xl:px-20 xl:py-8 md:px-12 md:py-6 sm:px-6 sm:py-4 p-4 py-3 flex flex-col "
    >
      {/* <AnimatedBackground /> */}
      <div className="absolute w-full h-full top-0 left-0 bg-gradient-to-br from-bg1 to-bg2"></div>

      <div className="absolute rg-one bg-radial-one rounded-full blur-2xl animate-moveVertical opacity-100 mix-blend-hard-light "></div>

      <div className="absolute rg-two bg-radial-two rounded-full blur-2xl animate-moveInCircleReverse opacity-100 mix-blend-hard-light "></div>

      <div className="absolute rg-three  bg-radial-three rounded-full blur-2xl animate-moveInCircle opacity-100 mix-blend-hard-light"></div>

      <div className="absolute rg-four bg-radial-four rounded-full blur-2xl animate-moveHorizontal opacity-70 mix-blend-hard-light "></div>

      <div className="absolute rg-five bg-radial-five rounded-full blur-2xl animate-moveInCircleEase opacity-100 mix-blend-hard-light "></div>
      <div
        className="absolute -top-1/2 -left-1/2 w-full h-full bg-radial-interactive rounded-full blur-2xl mix-blend-hard-light opacity-70"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: "transform 0.05s",
        }}
      ></div>

      <div className="z-10 flex flex-col  md:space-y-12 min-[700px]:space-y-11 sm:space-y-10 space-y-8">
        <section>
          <span>
            <Link href={"/"}>
              {/* <Image src="" alt="logo" /> */}
              <p className="text-2xl italic font-semibold">ShritamSir</p>
            </Link>
          </span>
        </section>
        <section className="flex sm:flex-row flex-col-reverse items-center xl:items-start sm:justify-around ">
          <div className="xl:w-2/5 md:w-1/2 mt-4 flex flex-col xl:py-6 py-4 px-2 space-y-4">
            <h1 className="xl:text-4xl md:text-[2rem] text-3xl font-semibold text-pink-200">
              Teaching Philosophy
            </h1>
            <p className="font-normal xl:text-base md:text-[15px] text-sm text-pink-200 select-none">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi
              exercitationem officiis dicta quis maxime, soluta non veniam ipsa
              ducimus illo? Quas maxime minima vero sit cum, harum quia est
              ea?orem, ipsum dolor sit amet consectetur adipisicing elit. Animi
              exercitationem officiis dicta quis maxime
            </p>
            <div className="relative overflow-hidden flex items-center justify-center cursor-pointer ease-in-out xl:w-2/5 w-1/2 px-3 py-1.5 rounded mt-4 transition-all  bg-orange-500 group">
              <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full bg-orange-400  rounded-md group-hover:translate-x-0"></span>
              <Link
                href={`/quiz`}
                className="font-medium text-white w-full text-center xl:text-base md:text-[15px] text-sm z-10"
              >
                Take a Quiz!
              </Link>
            </div>
          </div>
          <div>
            <span>
              {/* <Image src="" alt="picture" /> */}
              <span className="inline-block xl:w-[320px] xl:h-[320px] md:w-[280px] md:h-[280px]  w-[240px] h-[240px] rounded-full bg-gray-300"></span>
            </span>
          </div>
        </section>
        <section className="flex flex-col items-center mt-6 space-y-4">
          <p className="font-light text-xs text-slate-300 capitalize">
            Connect with me
          </p>
          <div className="flex items-center space-x-5">
            <span className="border border-blue-600 shadow-lg flex items-center justify-center p-1.5 rounded-full bg-[#316FF6]">
              <a
                href="www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-white w-5 h-5"
              >
                <Facebook className="w-full h-full" />
              </a>
            </span>
            <span className="border border-fuchsia-700 shadow-lg flex items-center justify-center p-1.5 rounded-full bg-gradient-to-b from-[#962fbf] via-[#d62976] to-[#fa7e1e]">
              <a
                href="www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-white w-5 h-5"
              >
                <Instagram className="w-full h-full" />
              </a>
            </span>
            <span className="border border-red-700 shadow-lg flex items-center justify-center p-1.5 rounded-full bg-[#BB001B]">
              <a
                href="www.gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-white w-5 h-5"
              >
                <Mail className="w-full h-full" />
              </a>
            </span>
          </div>
        </section>
      </div>
    </animated.div>
  );
}
