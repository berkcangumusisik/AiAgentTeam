"use client";

import { SearchInput } from "@/components/shared/search-input";

interface AgentSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function AgentSearch({ value, onChange }: AgentSearchProps) {
  return (
    <SearchInput
      value={value}
      onChange={onChange}
      placeholder="Ajan ara (isim, açıklama veya etiket)..."
      className="w-full max-w-sm"
    />
  );
}
