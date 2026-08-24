"use client";

import Image from "next/image";
import { useModal } from "@/components/common/ModalProvider";
import ParallaxImage from "@/components/common/ParallaxImage";

// Migrated from ../aurexo/home-02.html lines 4308-4320 (`.section-video`). Source's `img.parallax`
// background gets a real scroll effect from `assets/js/simpleParallaxVanilla.umd.js` — see
// `common/ParallaxImage.tsx` for the reproduction. The play button opens a real `VideoModal` (a genuine
// YouTube embed URL from source, not a placeholder).
export default function VideoSection() {
  const { openModal } = useModal();

  return (
    <section className="section-video relative">
      <ParallaxImage src="/assets/images/banner/bg-video.jpg" />

      <div className="container text-center relative wow fadeIn">
        <Image
          className="mb-36 cursor-pointer"
          src="/assets/icons/video.svg"
          alt="video-play"
          width={80}
          height={80}
          onClick={() => openModal("VideoModal")}
        />
        <p className="text-56 text-white font-weight-600 mb-16 capitalize">Lots of cars at prices just for you.</p>
        <p className="text-white h7">Discover a wide range of cars tailored to your budget and needs.</p>
      </div>
    </section>
  );
}
