import Loading from "@/app/(site)/loading";
import React, { MouseEventHandler, ReactNode } from "react";

interface buttonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  text: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  success?: ReactNode;
}

export const BigButton = ({
  onClick,
  className,
  text,
  disabled,
  loading,
}: buttonProps) => {
  return (
    <button
      disabled={disabled ? disabled : null}
      onClick={onClick}
      className={`flex flex-row gap-1 centerAbsolute rounded rounded-t-lg text-white text-xs disabled:bg-slate-100 disabled:text-weasker-grey sm:text-base py-2 px-3 disabled:hover:opacity-100 hover:opacity-80 ${className}`}
    >
      {loading ? <Loading /> : text}
    </button>
  );
};

export const GentleButton = ({
  onClick,
  className,
  text,
  disabled,
  loading,
  success,
}: buttonProps) => {
  return (
    <button
      disabled={disabled ? disabled : null}
      onClick={onClick}
      className={`flex flex-row gap-1 centerAbsolute rounded rounded-t-lg text-tl-dark-blue border text-xs disabled:bg-slate-100 disabled:text-weasker-grey sm:text-sm py-2 px-3 disabled:hover:opacity-100 hover:opacity-70  ${className}`}
    >
      {loading ? (
        <div className="centerAbsolute">
          <Loading />
        </div>
      ) : success ? (
        success
      ) : (
        <>{text}</>
      )}
    </button>
  );
};
