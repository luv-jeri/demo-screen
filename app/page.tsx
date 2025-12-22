"use client";

import { SearchBar } from "@/components/search-bar";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <SearchBar userName="there" />
    </div>
  );
}
