import React from "react";

interface WhiteBoxProps {
  children: React.JSX.Element | React.JSX.Element[];
  className?: string;
  id?: string;
}

export const WhiteBox: React.FC<WhiteBoxProps> = ({
  children,
  id,
  className,
}) => {
  return (
    <div
      id={id || ""}
      className={`flex flex-col items-start gap-1 bg-white p-10 rounded rounded-t-lg sm:max-w-[500px] min-h-[300px] mx-1 sm:m-0 max-h-[90vh] overflow-y-auto shadow ${className}`}
    >
      {children}
    </div>
  );
};

export const WideBox: React.FC<WhiteBoxProps> = ({
  children,
  className,
  id,
}) => {
  return (
    <div
      id={id || ""}
      className={`flex flex-col items-start gap-3 bg-white rounded rounded-t-lg max-w-screen sm:w-full mx-1 sm:m-0 shadow ${className}`}
    >
      {children}
    </div>
  );
};
