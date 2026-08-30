# Diário de desenvolvimento: Heroes Explorer (réplica de overwatch-explorer.lovable.app)

Registro de como fui construindo o projeto, etapa por etapa: o que eu queria
alcançar em cada uma, o que implementei e as decisões que tomei pelo caminho.

Stack usada: Next.js 16 (App Router) + TypeScript + Tailwind v4 + shadcn/ui +
lucide-react.

Fonte de dados: **OverFast API** (pública, sem chave necessária)
- Lista de heróis: `https://overfast-api.tekrop.fr/heroes`
  - Filtro por função: `https://overfast-api.tekrop.fr/heroes?role=damage`
  - Retorna: `{ key, name, portrait, role, subrole, gamemodes }[]`
- Detalhe de um herói: `https://overfast-api.tekrop.fr/heroes/{key}`
  - Retorna: `{ name, description, portrait, role, location, birthday, age, abilities: [{ name, description, icon }], ... }`
- Funções/roles: `https://overfast-api.tekrop.fr/roles`
  - Retorna: `{ key, name, icon, description }[]` (tank, damage, support)

---

## Etapa 0 — Preparação ✅

Antes de codar, rodei `curl https://overfast-api.tekrop.fr/heroes/ashe` para
ver o JSON real e entender os campos que a API retorna.

Com isso em mãos, defini os tipos TypeScript em `src/types/hero.ts`
(nome que escolhi em vez de `overwatch.ts`): `Hero` (para a listagem),
`Ability`, `HeroDetails` (para o detalhe) e `HeroRole` como union type
(`"damage" | "support" | "tank"`), reaproveitado nos outros tipos.

---

## Etapa 1 — Função de acesso à API ✅

**Objetivo:** centralizar as chamadas à OverFast API num só lugar, para não
repetir `fetch` espalhado pelos componentes.

Criei `src/lib/overfast.ts` com duas funções, importando os tipos de
`src/types/hero.ts`:
- `getHeroes(role?)` → `Promise<Hero[]>`
- `getHeroDetail(key)` → `Promise<HeroDetails>`

Usei `fetch` nativo com `{ next: { revalidate: 3600 } }` (cache de 1h) —
como o App Router permite Server Components por padrão, dava pra chamar
essas funções direto dentro do componente da página, sem precisar de
`useEffect`. Testei com um `console.log(heroes)` em `page.tsx` e confirmei
no terminal do `next dev` um array de 53 heróis.

---

## Etapa 2 — Layout base e tema escuro ✅

**Objetivo:** cabeçalho fixo igual ao do site original.

Em `src/app/globals.css`, substituí as variáveis de cor (`:root`/`.dark`)
pela paleta real que extraí do CSS compilado do site de referência (oklch
dark-only, sem tema claro), incluindo tokens novos `--surface`, `--tank`,
`--damage`, `--support` (cores de função, registradas em `@theme inline`
como `bg-tank`/`bg-damage`/`bg-support`/`bg-surface`) e `--radius: .75rem`.

Criei `src/components/header.tsx`: ícone num badge (`bg-card` + `border` +
`rounded-lg`), título "Conheça seus Heróis" (adaptei em PT-BR em vez de
"Heroes Explorer") + subtítulo, link "Heróis" e ícone de link para o
GitHub. Usei `whitespace-nowrap` no título/subtítulo pra evitar quebra de
linha.

**Pendências que anotei para revisitar depois:**
- O badge "OverFast API" ficou implementado mas com classe `hidden` —
  ainda preciso decidir se mantenho oculto ou exibo, pra bater com o site
  original (que mostra o badge visível).
- Importei `<Header />` em `src/app/page.tsx`, não em `layout.tsx`.
  Funciona para a home, mas quando criar `/heroes/[key]` na Etapa 6, o
  header não vai aparecer lá — mover pro `layout.tsx` resolve isso.

---

## Etapa 3 — Home: título + grid de cards (sem busca ainda) ✅

**Objetivo:** listar os 53 heróis em cards, estático.

Em `src/app/page.tsx`, chamei `getHeroes()` num `async function Home()`
(Server Component). Adicionei o título "Explore os heróis de **Overwatch**"
(com a palavra "Overwatch" em laranja via `<span className="text-primary">`)
e o subtítulo — usei o mesmo texto fixo do `og:description` do site
original, em vez de gerar dinamicamente a partir de `heroes.length`.

Criei `src/components/role-badge.tsx` com `cva` (3 variantes de `role`),
reaproveitando o estilo "badge suave" que extraí do CSS do site original
(`bg-{role}/12 border border-{role}/35 text-{role}`) e os tokens
`--tank`/`--damage`/`--support` da Etapa 2. Tipei a prop `role` via
`VariantProps<typeof roleVariant>`.

Criei `src/components/hero-card.tsx`: `next/image` pra foto
(`hero.portrait`), nome, `<RoleBadge role={hero.role} />` e um
`<Link href={/heroes/${hero.key}}>` — na hora ainda apontava pra uma rota
que só existiria na Etapa 6, então dava 404 temporariamente (esperado).

Montei o grid em `page.tsx` com Tailwind
(`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`).

Também configurei `next.config.ts`: `images.remotePatterns` liberando
`https://d15f34w2p8l1cc.cloudfront.net/**` (host das imagens da OverFast
API), usando a sintaxe nova do Next 16 (`new URL(...)` em vez do objeto
`{ protocol, hostname, pathname }`).

---

## Etapa 4 — Busca por nome + filtro por função ✅

**Objetivo:** campo de busca client-side e dropdown de função.

Optei por guardar o estado do filtro na URL via query param
(`?q=ana&role=support`), igual ao site original — assim dá pra
compartilhar o link e a filtragem continua acontecendo no Server
Component (leio `searchParams` direto na página, tipada com
`PageProps<'/'>`, sem precisar de estado client para os dados).

Criei `src/components/hero-filters.tsx` como Client Component, com input
de busca (debounce de 300ms, pra não navegar a cada tecla digitada) e um
`<Select>` controlado (`value={role}`) que atualiza a URL via
`useRouter().push`. No caminho corrigi um bug que já existia — o
`<Select defaultValue="Todos">` nunca batia com o `value="all"` dos itens.
`SelectValue` agora recebe uma função de children pra mapear
`all/tank/damage/support` → rótulo exibido, já que o Base UI não faz esse
mapeamento sozinho.

Em `page.tsx`, `searchParams.q` e `searchParams.role` filtram a lista
antes de paginar/renderizar o grid — `getHeroes(role)` já filtra por
função direto na API, e a busca por nome (`q`) faço em memória sobre o
resultado. Adicionei o contador "X heróis encontrados" (com
singular/plural) refletindo o filtro aplicado.

---

## Etapa 5 — Paginação ✅

**Objetivo:** 12 heróis por página, com números clicáveis.

Defini `ITEMS_PER_PAGE = 12` em `page.tsx` (bate com os "53 heróis / 5
páginas" do original), li `searchParams.page` (default `1`) e apliquei
`slice()` sobre o array já filtrado.

Criei `src/components/pagination.tsx`: "Previous"/"Next" sempre visíveis
(desabilitados nas pontas) e números de página ocultos em telas pequenas
(`hidden sm:flex`, igual ao comportamento mobile do site original), cada
um como `<Link>` preservando `q` e `role`.

---

## Etapa 6 — Página de detalhe do herói ✅

**Objetivo:** rota dinâmica `/heroes/[key]`.

`src/app/heroes/[key]/page.tsx` já tinha o esqueleto (link "← Voltar",
imagem, nome + badge, descrição); completei o resto nesta etapa, tipando
`params` com `PageProps<'/heroes/[key]'>`.

Criei `src/components/info-card.tsx` (ícone + label + valor) e usei pra
Função / Aniversário / Idade / Base de operações. Montei a seção
"Habilidades" com um grid sobre `abilities` (ícone da API + nome +
descrição) — destaco a última habilidade do array como "Ultimate" (borda
+ badge), já que a API não marca isso explicitamente, mas a ultimate é
sempre a última da lista.

Tratei `key` inválida: `getHeroDetail` retorna `null` em respostas
não-ok e a página chama `notFound()`, com um `not-found.tsx` próprio
para essa rota.

Bônus fora do escopo original: adicionei a seção "Sobre" com
`story.summary`, campo que a OverFast API já retorna e que aparece no
site de referência (sem os capítulos/vídeo, que ficaram fora de escopo).

---

## Etapa 7 — Polimento ✅

- `loading.tsx` na home e em `/heroes/[key]` (skeletons).
- `error.tsx` para falha na API — nesta versão do Next o prop do error
  boundary é `retry`, não `reset`, então ajustei pra isso.
- Hover/transições nos cards (`scale-105` na imagem, borda destacada).
- `generateMetadata` dinâmico em `/heroes/[key]` (título/descrição por
  herói) e `metadata` estática no `layout.tsx` raiz.

---

## Ordem que segui

Etapa 0 → 1 → 2 → 3 → 6 → 4 → 5 → 7.

Priorizei chegar na página de detalhe (Etapa 6) logo depois do grid
básico, com poucos heróis, porque ver a navegação ponta a ponta
funcionando cedo ajudou a manter o rumo antes de entrar em busca,
filtros e paginação.
