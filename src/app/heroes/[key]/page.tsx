import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { User, Cake, Heart, MapPin, Zap } from "lucide-react";
import { RoleBadge } from "@/components/role-badge";
import { InfoCard } from "@/components/info-card";
import { getHeroDetail } from "@/lib/overfast";

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export async function generateMetadata(
  props: PageProps<"/heroes/[key]">,
): Promise<Metadata> {
  const { key } = await props.params;
  const hero = await getHeroDetail(key);

  if (!hero) {
    return { title: "Herói não encontrado — Heroes Explorer" };
  }

  return {
    title: `${hero.name} — Heroes Explorer`,
    description: hero.description,
  };
}

export default async function HeroPage(props: PageProps<"/heroes/[key]">) {
  const { key } = await props.params;
  const hero = await getHeroDetail(key);

  if (!hero) {
    notFound();
  }

  const lastAbilityIndex = hero.abilities.length - 1;

  return (
    <main className="mx-auto px-5 py-8">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        ← Voltar para heróis
      </Link>
      <div className="mt-6 flex flex-col md:flex-row gap-6">
        <Image
          src={hero.portrait}
          alt={hero.name}
          width={280}
          height={280}
          priority
          className="w-full h-auto max-w-70 rounded-lg border border-border shrink-0"
        />
        <div className="flex flex-col gap-3 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-extrabold uppercase tracking-tight wrap-break-word">
              {hero.name}
            </h1>
            <RoleBadge role={hero.role} />
          </div>
          <p className="max-w-xl text-muted-foreground leading-relaxed wrap-break-word">
            {hero.description}
          </p>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard icon={User} label="Função" value={capitalize(hero.role)} />
            <InfoCard icon={Cake} label="Aniversário" value={hero.birthday} />
            <InfoCard icon={Heart} label="Idade" value={`${hero.age} anos`} />
            <InfoCard icon={MapPin} label="Base de operações" value={hero.location} />
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-bold mb-4">Habilidades</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hero.abilities.map((ability, index) => {
            const isUltimate = index === lastAbilityIndex;

            return (
              <div
                key={ability.name}
                className={
                  isUltimate
                    ? "rounded-xl border border-primary/50 bg-card p-4 flex gap-4 items-start"
                    : "rounded-xl border border-border bg-card p-4 flex gap-4 items-start"
                }
              >
                <div className="size-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Image
                    src={ability.icon}
                    alt={ability.name}
                    width={24}
                    height={24}
                    className="size-6 object-contain"
                  />
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{ability.name}</h3>
                    {isUltimate && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-primary/35 bg-primary/12 px-2 py-0.5 text-xs font-medium text-primary">
                        <Zap size={12} /> Ultimate
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {ability.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {hero.story?.summary && (
        <section className="mt-10 max-w-3xl">
          <h2 className="text-xl font-bold mb-4">Sobre</h2>
          <p className="text-muted-foreground leading-relaxed">
            {hero.story.summary}
          </p>
        </section>
      )}
    </main>
  );
}
