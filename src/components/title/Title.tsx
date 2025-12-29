'use client';
import "./title.css";
import TrackedCustomButton from "../ui/TrackedCustomButton";
import Link from 'next/link';

interface TitleProps {
  mouseEnter: () => void;
  mouseLeave: () => void;
  hidden: boolean;
  header?: string;
  subHeader?: string;
  resumeUrl?: string;
}

const DivWrapper = ({mouseEnter, mouseLeave, hidden, header, subHeader, resumeUrl}: TitleProps) => {
  return (
    <div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full max-w-[875px] px-4 z-10"
      style={{ pointerEvents: 'auto' }}
      hidden={hidden}
    >
      {/* Blur background that hugs the content */}
      <div
        className="absolute -inset-5 backdrop-blur-[1.5px] rounded-3xl z-9 "
        style={{
          background: 'rgba(173, 216, 230, 0.1)', // Very very light blue
          border: '1px solid rgba(173, 216, 230, 0.12)',
        }}
      />

      <div
        className="text-gradient-title text-[40px] sm:text-[60px] md:text-[75px] lg:text-[90px] leading-[1.1] text-center relative z-10"
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
        style={{
          fontFamily: 'Open Sans',
          fontWeight: 700,
          wordBreak: 'break-word',
        }}
        dangerouslySetInnerHTML={{
          __html: header || "Welcome to<br />Nathan's Portfolio"
        }}
      />
      <div className="text-dark text-[16px] sm:text-[18px] md:text-[20px] flex flex-col relative z-10 mt-4">
        <span
          dangerouslySetInnerHTML={{
            __html: subHeader || "Computer Science Student crafting digital experiences<br />with passion and precision"
          }}
        />
      </div>

      {/* Custom Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center relative z-10">
        <Link href="/main/projects" prefetch={true}>
          <TrackedCustomButton
            type="filled"
            text="Explore My Work"
          />
        </Link>
        <a href={resumeUrl || "#"} target="_blank" rel="noreferrer">
          <TrackedCustomButton
            type="outlined"
            text="Download Resume"
            trackingType="resume"
            location="homepage"
          />
        </a>
      </div>
    </div>
  );
};

export default DivWrapper;
