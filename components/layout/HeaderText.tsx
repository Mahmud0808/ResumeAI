import React from "react";

const HeaderText = ({ title, subtitle }: { title: string; subtitle: string }) => {
  return (
    <>
      <h2 className="font-bold text-3xl">{title}</h2>
      <p className="text-slate-600">{subtitle}</p>
    </>
  );
};

export default HeaderText;
