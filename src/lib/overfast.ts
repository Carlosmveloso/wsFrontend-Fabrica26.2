import type { Hero, HeroDetails, HeroRole } from "@/types/hero";
const API_URL = "https://overfast-api.tekrop.fr";

export async function getHeroes(role?: HeroRole): Promise<Hero[]> {
    const url = role ? `${API_URL}/heroes?role=${role}` : `${API_URL}/heroes`;
    const res = await fetch(url, { next: { revalidate: 3600 } });

    return res.json();
}

export async function getHeroDetail(key: string) : Promise<HeroDetails | null> {
    const url = `${API_URL}/heroes/${key}`;
    const res = await fetch(url, { next: { revalidate: 3600 }});

    if (!res.ok) {
        return null;
    }

    return res.json();
}