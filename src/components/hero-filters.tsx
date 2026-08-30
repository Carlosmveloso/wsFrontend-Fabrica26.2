"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface HeroFiltersProps {
  query: string;
  role: string;
}

const roleLabels: Record<string, string> = {
  all: "Todos",
  tank: "Tank",
  damage: "Damage",
  support: "Support",
};

function buildHref(query: string, role: string) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (role && role !== "all") params.set("role", role);
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}

export function HeroFilters({ query, role }: HeroFiltersProps) {
  const router = useRouter();
  const [search, setSearch] = useState(query);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search !== query) {
        router.push(buildHref(search, role));
      }
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <Input
        placeholder="Buscar herói por nome..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Select
        value={role}
        onValueChange={(value) => router.push(buildHref(search, value as string))}
      >
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Todos">
            {(value: string) => roleLabels[value] ?? "Todos"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="tank">Tank</SelectItem>
          <SelectItem value="damage">Damage</SelectItem>
          <SelectItem value="support">Support</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
