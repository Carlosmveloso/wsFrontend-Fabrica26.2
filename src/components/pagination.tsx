import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  query: string;
  role: string;
}

function buildHref(page: number, query: string, role: string) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (role && role !== "all") params.set("role", role);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}

export function Pagination({ page, totalPages, query, role }: PaginationProps) {
  if (totalPages <= 1) return null;

  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav className="flex items-center justify-center gap-2 pb-12">
      {hasPrevious ? (
        <Link
          href={buildHref(page - 1, query, role)}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors px-3 py-1.5"
        >
          <ChevronLeft size={16} /> Anterior
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground/40 px-3 py-1.5">
          <ChevronLeft size={16} /> Anterior
        </span>
      )}

      <div className="hidden sm:flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <Link
            key={n}
            href={buildHref(n, query, role)}
            className={
              n === page
                ? "flex items-center justify-center size-8 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
                : "flex items-center justify-center size-8 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
            }
          >
            {n}
          </Link>
        ))}
      </div>

      {hasNext ? (
        <Link
          href={buildHref(page + 1, query, role)}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors px-3 py-1.5"
        >
          Próximo <ChevronRight size={16} />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground/40 px-3 py-1.5">
          Próximo <ChevronRight size={16} />
        </span>
      )}
    </nav>
  );
}
