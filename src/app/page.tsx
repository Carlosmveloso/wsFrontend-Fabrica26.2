import { getHeroes } from "@/lib/overfast";
import { HeroFilters } from "@/components/hero-filters";
import { HeroCard } from "@/components/hero-card";
import { Pagination } from "@/components/pagination";
import type { HeroRole } from "@/types/hero";

const ITEMS_PER_PAGE = 12;

export default async function Home(props: PageProps<"/">) {
  const searchParams = await props.searchParams;
  const query = typeof searchParams.q === "string" ? searchParams.q : "";
  const role = typeof searchParams.role === "string" ? searchParams.role : "all";
  const page = Math.max(1, Number(searchParams.page) || 1);

  const heroes = await getHeroes(role !== "all" ? (role as HeroRole) : undefined);

  const filteredHeroes = heroes.filter((hero) =>
    hero.name.toLowerCase().includes(query.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filteredHeroes.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginatedHeroes = filteredHeroes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="">
      <main className="mx-auto px-5 pb-20">
        <section className="border-b border-border py-12 lg:py-14">
          <h1 className="text-2xl text-balance font-semibold tracking-tight">
            Explore os heróis de <span className="text-primary">Overwatch</span>
          </h1>
          <p className="max-w-xl mt-3 text-sm lg:text-base text-muted-foreground leading-relaxed ">
            Descubra personagens, funções, histórias e habilidades do universo
            de Overwatch.
          </p>
        </section>
        <section className="py-8 flex flex-col gap-4">
          <HeroFilters query={query} role={role} />
          <p className="text-sm text-muted-foreground">
            {filteredHeroes.length}{" "}
            {filteredHeroes.length === 1 ? "herói encontrado" : "heróis encontrados"}
            <span className="mx-2 text-border">|</span>
            Página {currentPage} de {totalPages}
          </p>
        </section>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12">
          {paginatedHeroes.map((hero) => (
            <HeroCard key={hero.key} hero={hero} />
          ))}
        </section>
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          query={query}
          role={role}
        />
      </main>
    </div>
  );
}
