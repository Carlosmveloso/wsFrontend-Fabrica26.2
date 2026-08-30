import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/types/hero";
import { RoleBadge } from "@/components/role-badge";

interface HeroCardProps {
  hero: Hero;
}

export function HeroCard({ hero }: HeroCardProps) {
  return (
    <Link
      href={`/heroes/${hero.key}`}
      className="group rounded-xl border border-border bg-card overflow-hidden transition-colors hover:border-primary/40"
    >
      <div className="aspect-square overflow-hidden">
        <Image
          src={hero.portrait}
          alt={hero.name}
          width={300}
          height={300}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold uppercase tracking-tight truncate">
            {hero.name}
          </h3>
          <RoleBadge role={hero.role} />
        </div>
        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground group-hover:text-primary transition-colors">
          Ver detalhes <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}
