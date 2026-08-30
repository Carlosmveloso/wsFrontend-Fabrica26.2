# Guia: Heroes Explorer (réplica de overwatch-explorer.lovable.app)

Passo a passo para você implementar sozinho. Cada etapa tem o objetivo, os
arquivos que você vai criar/mexer e dicas — mas o código é seu. Marque os
checkboxes conforme for concluindo.

Stack já disponível no projeto: Next.js 16 (App Router) + TypeScript +
Tailwind v4 + shadcn/ui + lucide-react.

Fonte de dados: **OverFast API** (pública, sem chave necessária)
- Lista de heróis: `https://overfast-api.tekrop.fr/heroes`
  - Filtro por função: `https://overfast-api.tekrop.fr/heroes?role=damage`
  - Retorna: `{ key, name, portrait, role, subrole, gamemodes }[]`
- Detalhe de um herói: `https://overfast-api.tekrop.fr/heroes/{key}`
  - Retorna: `{ name, description, portrait, role, location, birthday, age, abilities: [{ name, description, icon }], ... }`
- Funções/roles: `https://overfast-api.tekrop.fr/roles`
  - Retorna: `{ key, name, icon, description }[]` (tank, damage, support)

---

## Etapa 0 — Preparação ✅ concluída

- [x] Rode `curl https://overfast-api.tekrop.fr/heroes/ashe` no terminal (ou
      abra a URL no navegador) para ver o JSON real e entender os campos.
- [x] Crie uma pasta `src/types/` com um arquivo `overwatch.ts` definindo os
      tipos TypeScript `Hero` (lista) e `HeroDetail` (detalhe), baseado no
      JSON que você viu.

> Feito em `src/types/hero.ts` (nome do arquivo diferente do sugerido, sem
> problema): tipos `Hero`, `Ability`, `HeroDetails` e `HeroRole` (union type
> `"damage" | "support" | "tank"`, reaproveitado nos outros dois).

---

## Etapa 1 — Função de acesso à API ✅ concluída

**Objetivo:** centralizar as chamadas à OverFast API num só lugar, para não
repetir `fetch` espalhado pelos componentes.

- [x] Crie `src/lib/overfast.ts` com duas funções (importando os tipos de
      `src/types/hero.ts`):
  - `getHeroes(role?: string): Promise<Hero[]>`
  - `getHeroDetail(key: string): Promise<HeroDetails>`
- [x] Use `fetch` nativo (Next.js já dá cache/revalidate de graça em Server
      Components).
- [x] Teste chamando essas funções dentro do `page.tsx` atual, com um
      `console.log`, só para confirmar que os dados chegam.

> Feito em `src/lib/overfast.ts`: `getHeroes(role?)` e `getHeroDetail(key)`,
> ambas com `fetch(url, { next: { revalidate: 3600 } })` (cache de 1h).
> Testado em `page.tsx` com `console.log(heroes)` — array de 53 heróis
> confirmado no terminal do `next dev`.

> Dica: como o App Router permite Server Components por padrão, essas
> funções podem ser `async` e chamadas direto dentro do componente da
> página — sem precisar de `useEffect`.

---

## Etapa 2 — Layout base e tema escuro ✅ concluída

**Objetivo:** cabeçalho fixo igual ao do site original.

- [x] Em `src/app/layout.tsx`, garanta que o fundo é escuro (classe no
      `<body>`, ex: `bg-neutral-950 text-white`, ou defina no `globals.css`).
- [x] Crie `src/components/header.tsx`: logo/ícone (pode usar um ícone do
      `lucide-react`) + título "Heroes Explorer" + subtítulo "Overwatch
      character database" + à direita um badge "OverFast API" e um link
      "Heroes".
- [x] Importe o `<Header />` no `layout.tsx`, acima de `{children}`.

> Feito em `src/app/globals.css`: variáveis de cor (`:root`/`.dark`)
> substituídas pela paleta real extraída do CSS compilado do site de
> referência (oklch dark-only, sem tema claro), incluindo tokens novos
> `--surface`, `--tank`, `--damage`, `--support` (cores de função,
> registradas em `@theme inline` como `bg-tank`/`bg-damage`/`bg-support`/
> `bg-surface`) e `--radius: .75rem`.
>
> Feito em `src/components/header.tsx`: ícone num badge (`bg-card` +
> `border` + `rounded-lg`), título "Conheça seus Heróis" (adaptado em
> PT-BR em vez de "Heroes Explorer") + subtítulo, link "Heróis" e ícone
> de link (GitHub). `whitespace-nowrap` no título/subtítulo evita quebra
> de linha.
>
> **Pendências/observações para revisitar:**
> - Badge "OverFast API" está implementado mas com classe `hidden`
>   (linha 20) — decidir se mantém oculto ou exibe pra bater com o site
>   original, que mostra o badge visível.
> - `<Header />` está importado em `src/app/page.tsx`, não em
>   `layout.tsx` como sugerido aqui. Funciona para a home, mas quando a
>   Etapa 6 criar `/heroes/[key]`, o header não vai aparecer lá — mover
>   pro `layout.tsx` resolve isso.

---

## Etapa 3 — Home: título + grid de cards (sem busca ainda) ✅ concluída

**Objetivo:** listar os 53 heróis em cards, estático.

- [x] Em `src/app/page.tsx`, chame `getHeroes()` (Server Component, pode ser
      `async function Home()`).
- [x] Adicione o título "Explore os heróis de **Overwatch**" (a palavra
      "Overwatch" em laranja — use uma `<span>` com cor customizada) e o
      subtítulo.
- [x] Crie `src/components/hero-card.tsx` recebendo um `Hero` como prop:
      imagem (`portrait`), nome, badge colorido da função, link "Ver
      detalhes →" apontando para `/heroes/[key]`.
- [x] Crie `src/components/role-badge.tsx`: badge com cor por função
      (tank = azul, damage = vermelho, support = verde) — pode usar
      `class-variance-authority` (já está no projeto) pra variantes.
- [x] Monte o grid em `page.tsx` com Tailwind (`grid grid-cols-1
      sm:grid-cols-2 lg:grid-cols-4 gap-6`), mapeando os heróis para
      `<HeroCard />`.

> Feito em `src/app/page.tsx`: título com `<span className="text-primary">`
> e subtítulo (texto fixo, igual ao `og:description` do site original, em
> vez de usar `heroes.length` dinamicamente). `console.log(heroes)` da
> Etapa 1 ainda não foi removido.
>
> Feito em `src/components/role-badge.tsx`: `cva` com 3 variantes de
> `role`, usando o estilo "badge suave" extraído do CSS do site original
> (`bg-{role}/12 border border-{role}/35 text-{role}`, aproveitando os
> tokens `--tank`/`--damage`/`--support` da Etapa 2). Tipo da prop `role`
> derivado via `VariantProps<typeof roleVariant>`.
>
> Feito em `src/components/hero-card.tsx`: `next/image` pra foto
> (`hero.portrait`), nome, `<RoleBadge role={hero.role} />` e
> `<Link href={/heroes/${hero.key}}>` (aponta pra rota da Etapa 6, ainda
> não criada — 404 esperado por enquanto). Estilização do card ainda vai
> ser refeita pelo usuário.
>
> Feito em `next.config.ts`: `images.remotePatterns` liberando
> `https://d15f34w2p8l1cc.cloudfront.net/**` (host das imagens da OverFast
> API), usando a sintaxe nova do Next 16 (`new URL(...)` em vez do objeto
> `{ protocol, hostname, pathname }`).

---

## Etapa 4 — Busca por nome + filtro por função ✅ concluída

**Objetivo:** campo de busca client-side e dropdown de função.

- [x] Estratégia escolhida: via query param na URL (`?q=ana&role=support`),
      igual ao site original — permite compartilhar link e mantém a
      filtragem no Server Component.
- [x] `searchParams` lido na própria página (`PageProps<'/'>`), sem estado
      client para os dados.
- [x] UI do input de busca e do dropdown de função.
- [x] Criado `src/components/hero-filters.tsx` como **Client Component**,
      com input de busca e `<Select>` de função, atualizando a URL via
      `useRouter().push`.
- [x] Em `page.tsx`, `searchParams.q` e `searchParams.role` filtram a lista
      de heróis antes de paginar/renderizar o grid.
- [x] Contador "X heróis encontrados" (com singular/plural) reflete o
      filtro aplicado.

> Feito em `src/components/hero-filters.tsx`: input com debounce de 300ms
> (evita navegar a cada tecla) e `<Select>` controlado (`value={role}`),
> corrigindo um bug que já existia — o `<Select defaultValue="Todos">`
> nunca batia com o `value="all"` dos itens. `SelectValue` agora recebe
> uma função de children pra mapear `all/tank/damage/support` → rótulo
> exibido, já que o Base UI não faz esse mapeamento sozinho.
>
> `getHeroes(role)` já filtra por função direto na API; a busca por nome
> (`q`) é feita em memória sobre o resultado.

---

## Etapa 5 — Paginação ✅ concluída

**Objetivo:** 12 heróis por página, com números clicáveis.

- [x] `ITEMS_PER_PAGE = 12` em `page.tsx` (bate com os "53 heróis / 5
      páginas" do original).
- [x] `searchParams.page` lido (default `1`) e `slice()` aplicado sobre o
      array já filtrado.
- [x] Criado `src/components/pagination.tsx`: "Previous"/"Next" sempre
      visíveis (desabilitados nas pontas) e números de página (ocultos
      em telas pequenas, `hidden sm:flex`, igual ao comportamento mobile
      do site original), cada um um `<Link>` preservando `q` e `role`.

---

## Etapa 6 — Página de detalhe do herói ✅ concluída

**Objetivo:** rota dinâmica `/heroes/[key]`.

- [x] `src/app/heroes/[key]/page.tsx` já existia (link "← Voltar",
      imagem, nome + badge, descrição); completado nesta etapa.
- [x] `PageProps<'/heroes/[key]'>` usado para tipar `params`.
- [x] Criado `src/components/info-card.tsx` (ícone + label + valor) e
      usado para Função / Aniversário / Idade / Base de operações.
- [x] Seção "Habilidades": grid com `abilities` (ícone da API + nome +
      descrição). A última habilidade do array é destacada como
      "Ultimate" (borda + badge) — a API não marca isso explicitamente,
      mas a ultimate é sempre a última da lista.
- [x] `key` inválida tratada: `getHeroDetail` retorna `null` em respostas
      não-ok e a página chama `notFound()`, com `not-found.tsx` próprio
      pra essa rota.
- [x] Bônus fora do guia original: seção "Sobre" com `story.summary`,
      campo que a OverFast API já retorna e que aparece no site de
      referência (sem os capítulos/vídeo, fora de escopo).

---

## Etapa 7 — Polimento (opcional) ✅ concluída

- [x] `loading.tsx` na home e em `/heroes/[key]` (skeletons).
- [x] `error.tsx` para falha na API — atenção: nesta versão do Next o
      prop do error boundary é `retry`, não `reset`.
- [x] Hover/transições nos cards (`scale-105` na imagem, borda destacada).
- [x] `generateMetadata` dinâmico em `/heroes/[key]` (título/descrição por
      herói) e `metadata` estática no `layout.tsx` raiz.

---

## Ordem sugerida

Etapa 0 → 1 → 2 → 3 → 6 (detalhe funcionando com poucos heróis já é
motivador) → 4 → 5 → 7.

Sempre que terminar uma etapa, me chame — eu reviso o que você fez e tiro
dúvidas antes de você seguir pra próxima.
