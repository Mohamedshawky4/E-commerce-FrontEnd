"use client";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Button from "@/components/Button";
import { ArrowUpDown } from "lucide-react";

type SortOption = {
  label: string;
  sortBy: string;
};

type SortDropdownProps = {
  onSort: (sortBy: string) => void;
};

export default function SortDropdown({ onSort }: SortDropdownProps) {
  const [selected, setSelected] = useState<string>("Sort");

  const handleSort = (value: SortOption) => {
    setSelected(value.label);
    onSort(value.sortBy);
  };

const options: SortOption[] = [
  { label: "Price Low to High", sortBy: "price" },
  { label: "Price High to Low", sortBy: "-price" },

  { label: "Discount Low to High", sortBy: "discountPercent" },
  { label: "Discount High to Low", sortBy: "-discountPercent" },
  { label: " Rating Low to High", sortBy: "averageRating" },
  { label: " Rating High to Low", sortBy: "-averageRating" },

  { label: "Brand (A-Z)", sortBy: "brand" },
  { label: "Brand (Z-A)", sortBy: "-brand" },
];


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* i want to be full rounded */}
        <Button variant="primary" className="flex items-center gap-2 rounded-full">
          <ArrowUpDown size={16} />
          {selected}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-lg shadow-md">
        <DropdownMenuLabel className="text-text-muted dark:text-text-muted-dark">
          Sort By
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {options.map((o) => (
          <DropdownMenuItem
            key={o.sortBy}
            onClick={() => handleSort(o)}
            className="
              relative overflow-hidden cursor-pointer
              text-text dark:text-text-dark
              px-4 py-2 rounded-md
              transition-all duration-300 ease-in-out
              hover:text-foreground dark:hover:text-foreground-dark
              before:absolute before:inset-0 before:translate-x-full before:bg-primary/20 dark:before:bg-primary-dark/20 before:transition-transform before:duration-300 before:ease-out
              hover:before:translate-x-0
            "
          >
            {o.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
