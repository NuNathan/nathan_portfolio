'use client';
import { motion } from "framer-motion";
import "./title.css"

const DivWrapper = ({mouseEnter, mouseLeave, hidden}) => {
  return (
    <div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full max-w-[65%]"
      style={{ pointerEvents: 'none' }}
      hidden={hidden}
    >
      <span
        className="text-8xl mb-6 block"
        style={{
          color: 'black',
          fontFamily: 'Rubik Doodle Shadow',
          whiteSpace: 'normal',
          overflowWrap: 'break-word',
        }}
      >
        Welcome to Nathan's
      </span>
      <motion.div
        className="relative inline-block overflow-hidden rounded-lg px-8 py-4 text-lg font-medium"
      >
        <span
          className="text-gradient relative z-10 text-[140px] mt-[-30px] inline-block"
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
          style={{
            pointerEvents: 'auto',
            fontFamily: 'Rubik Doodle Shadow'
          }}
        >
          Portfolio
        </span>
      </motion.div>
    </div>
  );
};

export default DivWrapper;
