"use client";
import { useState } from "react";

type SwitchProps = {
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  bg?: string;
  dot?: string;
  borderColor?: string;
};

export default function SwitchComponent({
  defaultChecked = false,
  onChange,
  bg = "bg-teal-400",
  dot = "bg-white",
  borderColor = "border-teal-400",
}: SwitchProps) {
  const [enabled, setEnabled] = useState(defaultChecked);

  const toggle = () => {
    setEnabled(!enabled);
    onChange?.(!enabled);
  };

  return (
    <div
      onClick={toggle}
      className={`w-[36px] h-[18.5px] flex items-center rounded-full border transition-colors
      ${enabled ? bg : dot} ${borderColor}`}
    >
      <div
        className={`w-[13.5px] h-[13.5px] rounded-full shadow-md transform transition-transform duration-200
        ${enabled ? `${dot} translate-x-[18px]` : `${bg} translate-x-[2px]`}`}
      />
    </div>
  );
}