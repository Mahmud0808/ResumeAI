import React, { useEffect, useRef, FC } from "react";
import { gsap } from "gsap";
import "./GridMotion.css";

interface GridMotionProps {
  items?: string[];
  // Removed gradientColor prop as it's no longer needed
}

const GridMotion: FC<GridMotionProps> = ({
  items = [],
  // Removed gradientColor parameter
}) => {
  // ...existing code...

  return (
    <div className="noscroll loading" ref={gridRef}>
      <section className="intro">
        {/* Removed style prop with gradient */}
        <div className="gridMotion-container">
          {/* ...existing code... */}
        </div>
        <div className="fullview"></div>
      </section>
    </div>
  );
};

export default GridMotion;
