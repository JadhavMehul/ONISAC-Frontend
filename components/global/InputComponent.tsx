import React from "react";

type InputProps = {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

export default function InputComponent({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
}: InputProps) {
  return (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`border-[1px] border-gray-200 rounded-2xl px-5 py-3.5 ${className}`}
      />
  );
}