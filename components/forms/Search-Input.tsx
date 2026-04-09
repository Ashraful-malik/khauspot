"use client";
import { SearchIcon } from "lucide-react";

export default function SearchInput() {
  return (
    <div
      className="
        flex items-center gap-2 h-10 px-3 rounded-xl
        bg-gray-100/70
        
        transition-all duration-200
        hover:bg-gray-100
        focus-within:bg-white focus-within:shadow-sm focus-within:ring-2 focus-within:ring-primary/35
      "
    >
      <SearchIcon className="text-gray-400" size={18} />

      <input
        type="text"
        placeholder="Search street food..."
        className="
          w-full bg-transparent outline-none text-sm
          placeholder:text-gray-400
        "
      />
    </div>
  );
}
