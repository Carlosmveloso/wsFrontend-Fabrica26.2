import Link from "next/link";

export default function HeroNotFound() {
  return (
    <main className="mx-auto px-5 py-20 flex flex-col items-center text-center gap-3">
      <h1 className="text-2xl font-semibold">Herói não encontrado</h1>
      <p className="text-muted-foreground max-w-md">
        Não encontramos nenhum herói com essa chave. Ele pode ter sido
        removido ou o link está incorreto.
      </p>
      <Link
        href="/"
        className="mt-2 text-sm text-primary hover:underline"
      >
        ← Voltar para heróis
      </Link>
    </main>
  );
}
