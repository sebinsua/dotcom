"use client";

import { useRef, useEffect } from "react";

export function ProfileImage() {
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const image = imageRef.current!;
    function handleImageLoaded() {
      image.style.opacity = "1.0";
    }

    if (image.complete) {
      handleImageLoaded();
      return;
    }

    image.addEventListener("load", handleImageLoaded);
    return () => {
      image.removeEventListener("load", handleImageLoaded);
    };
  }, []);

  // We're dropping the `next/image` as it isn't supported in Cloudflare anyway.
  //
  // <Image
  //   src="/assets/seb-insua.jpg"
  //   alt="Seb Insua, Japan (2019)"
  //   width={800 * 0.72}
  //   height={603 * 0.72}
  //   loader={({ src }) => src}
  //   unoptimized
  // />
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        src="/assets/seb-insua.jpg"
        alt="Seb Insua, Japan (2019)"
        width={800 * 0.72}
        height={603 * 0.72}
        loading="lazy"
        decoding="async"
        style={{
          color: "transparent",
          opacity: 0,
          transition: "opacity 0.3s ease-in-out",
        }}
      />
    </>
  );
}
