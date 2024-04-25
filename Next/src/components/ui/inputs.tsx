import { ChangeEventHandler, FocusEventHandler, ReactNode } from "react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

interface TextInputProps {
  name: string;
  type: "text";
  label?: string;
  saved?: boolean;
  comment?: string;
  placeHolder?: string;
  className?: string;
  errorMessage?: string;
  labelClassName?: string;
  value?: string;
  maxLength?: number;
  description?: string | ReactNode;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
}

export const TextInput = ({
  name,
  placeHolder,
  className,
  label,
  value,
  type,
  saved,
  comment,
  errorMessage,
  description,
  labelClassName,
  maxLength,
  onChange,
  onBlur,
}: TextInputProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label
        className={`text-base font-bold uppercase ${labelClassName}`}
        htmlFor={name}
      >
        {label}
      </label>
      {description && (
        <div className={`text-weasker-grey text-sm normal-case `}>
          {description}
        </div>
      )}
      <input
        type={type}
        value={value}
        maxLength={maxLength}
        id={name}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        className={`flex flex-col w-full p-2 border rounded rounded-t-lg text-left ${className}`}
        placeholder={placeHolder}
      />
      <div className="flex flex-row items-center justify-between text-xs ">
        {comment && <span className="text-weasker-grey">{comment}</span>}
        {errorMessage && <span className="text-red-600">{errorMessage}</span>}
        <span
          className={`transition-opacity ease-in-out duration-300 flex flex-row items-center gap-1 self-end text-emerald-500 ${
            saved ? "opacity-100" : "opacity-0"
          }`}
        >
          <IoIosCheckmarkCircleOutline />
          Saved
        </span>
      </div>
    </div>
  );
};

interface TextAreaInputProps {
  name: string;
  label?: string;
  placeHolder?: string;
  className?: string;
  errorMessage?: string;
  value?: string;
  comment?: string;
  maxLength?: number;
  description?: string | ReactNode;
  labelClassName?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
  saved?: boolean;
  commentClassName?: string;
}

export const TextAreaInput = ({
  name,
  placeHolder,
  className,
  label,
  errorMessage,
  description,
  value,
  comment,
  maxLength,
  labelClassName,
  commentClassName,
  onChange,
  onBlur,
  saved,
}: TextAreaInputProps) => {
  return (
    <div className="flex flex-col w-full gap-1">
      <label className={`font-bold uppercase ${labelClassName}`} htmlFor={name}>
        {label}
      </label>
      <div className="text-weasker-grey text-sm normal-case">{description}</div>
      <textarea
        id={name}
        value={value}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        className={`flex flex-col w-full  p-2 border rounded rounded-t-lg text-left ${className}`}
        placeholder={placeHolder}
        maxLength={maxLength}
      />
      {(comment || errorMessage || saved) && (
        <div className="flex flex-row items-center justify-between text-xs">
          {comment && (
            <div className={`text-weasker-grey ${commentClassName}`}>
              {comment}
            </div>
          )}
          {errorMessage && <span className="text-red-600">{errorMessage}</span>}
          <span
            className={`transition-opacity ease-in-out duration-300 flex flex-row items-center gap-1 self-end text-emerald-500 ${
              saved ? "opacity-100" : "opacity-0"
            }`}
          >
            <IoIosCheckmarkCircleOutline />
            Saved
          </span>
        </div>
      )}
    </div>
  );
};

interface FileInputProps {
  name: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  className?: string;
  text?: string;
  icon?: ReactNode;
  label?: ReactNode;
}

export const FileInput = ({
  name,
  onChange,
  className,
  text,
  icon,
  label,
}: FileInputProps) => {
  return (
    <label htmlFor={name} className={className}>
      {label}
      {icon}
      {text}
      <input
        className="hidden max-h-12"
        type="file"
        name={name}
        id={name}
        onChange={onChange}
      />
    </label>
  );
};
