import { SignIn } from "@clerk/nextjs";
import React from "react";

const Page = () => {
  return (
    <div className="flex h-screen items-center justify-center flex-col p-10">
      <SignIn forceRedirectUrl={"/dashboard"} routing="hash" />
    </div>
  );
};

export default Page;
