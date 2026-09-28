import Image from "next/image";

// A full, uncropped app screenshot inside a simple phone frame: a dark bezel, rounded corners
// and a thin outline so it reads on both themes.
export function PhoneFrame({
  src,
  alt,
  width,
  height,
  sizes,
  priority,
  className = "",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`rounded-[2.2rem] bg-[#0b0b0c] p-[7px] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.55)] ring-1 ring-line ${className}`}>
      <div className="overflow-hidden rounded-[1.8rem]">
        <Image src={src} alt={alt} width={width} height={height} sizes={sizes} priority={priority} className="block h-auto w-full" />
      </div>
    </div>
  );
}
