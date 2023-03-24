export function ProfileImage() {
  // We're dropping the `next/image` as it isn't supported in Cloudflare anyway,
  // and we end up having a client component due to the `loader` property we require
  // for our custom usage.
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
        src="/assets/seb-insua.jpg"
        alt="Seb Insua, Japan (2019)"
        width={800 * 0.72}
        height={603 * 0.72}
        loading="lazy"
        decoding="async"
        style={{ color: "transparent" }}
      />
    </>
  );
}
