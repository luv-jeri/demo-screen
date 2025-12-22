"use client";

import { SearchBar } from "@/components/search-bar";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <SearchBar
        onSearch={(query, category) => {
          console.log("Searching:", { query, category });
        }}
      />
    </div>
  );
}
