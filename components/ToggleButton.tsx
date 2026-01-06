"use client";

import React, { useState } from "react";
import { m } from "framer-motion";

interface ToggleButtonProps {
  arrayOfLabels?: [string, string];
  onToggle?: (selectedIndex: number) => void;
  selectedIndex?: number;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  arrayOfLabels = ["Login", "Register"],
  onToggle,
  selectedIndex = 0,
}) => {
  const [selected, setSelected] = useState(selectedIndex);

  const handleToggle = (index: number) => {
    setSelected(index);
    if (onToggle) onToggle(index);
  };

  // Sync internal state with prop changes
  React.useEffect(() => {
    setSelected(selectedIndex);
  }, [selectedIndex]);

  return (
    <div
      className="relative flex w-[260px] rounded-full p-1 
                  border border-primary/40 shadow-md glass-effect hover:shadow-lg transition-all duration-300 group bg-background/20"
    >
      {/* Sliding Highlight */}
      <m.div
        layout
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full 
                   gradient-primary pointer-events-none"
        style={{
          left: selected === 0 ? "4px" : "calc(50% + 0px)",
        }}
      />

      {/* Buttons */}
      {arrayOfLabels.map((label, index) => (
        <button
          key={index}
          onClick={() => handleToggle(index)}
          className={`relative z-20 flex-1 text-center font-semibold py-2 px-4 rounded-full transition-all duration-300 cursor-pointer
          ${selected === index
            ? "text-white"
            : "text-foreground/70 hover:text-foreground"
          }`}
          type="button"
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default ToggleButton;
