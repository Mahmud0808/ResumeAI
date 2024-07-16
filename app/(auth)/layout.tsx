import PageWrapper from "@/components/common/PageWrapper";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <PageWrapper>{children}</PageWrapper>
    </main>
  );
}
