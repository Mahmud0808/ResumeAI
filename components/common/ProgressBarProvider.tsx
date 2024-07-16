"use client";

import { ReactNode } from "react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

interface ProvidersProps {
  children: ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <>
      <ProgressBar
        height="4px"
        color="#2e90fa"
        options={{ showSpinner: false }}
        shallowRouting
      />
      {children}
    </>
  );
};

export default Providers;
