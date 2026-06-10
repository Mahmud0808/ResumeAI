import React, { ReactNode } from "react";

const PageWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative min-h-screen w-full">
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-slate-50/80 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none print:hidden"
      >
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-primary-300/50 to-purple-400/40 blur-[120px]" />
        <div className="absolute top-10 right-0 h-72 w-72 rounded-full bg-gradient-to-r from-cyan-400/40 to-sky-300/40 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-gradient-to-tr from-rose-300/30 to-amber-200/30 blur-[120px]" />
      </div>
      {children}
    </div>
  );
};

export default PageWrapper;
