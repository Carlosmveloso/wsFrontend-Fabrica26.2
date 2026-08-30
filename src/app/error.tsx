"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto px-5 py-20 flex flex-col items-center text-center gap-3">
      <h1 className="text-2xl font-semibold">Algo deu errado</h1>
      <p className="text-muted-foreground max-w-md">
        Não foi possível carregar os dados da OverFast API. Tente novamente
        em instantes.
      </p>
      <button
        onClick={() => retry()}
        className="mt-2 rounded-lg border border-border px-4 py-2 text-sm hover:border-primary/40 transition-colors"
      >
        Tentar novamente
      </button>
    </main>
  );
}
