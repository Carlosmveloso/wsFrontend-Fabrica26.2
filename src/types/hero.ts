export interface Hero {
    key: string;
    name: string;
    portrait: string;
    role: HeroRole;
    subrole: string;
}

export interface Ability {
    name: string;
    description: string;
    icon: string;
}

export interface HeroDetails {
    name: string;
    description: string;
    portrait: string;
    role: HeroRole;
    subrole: string;
    location: string;
    birthday: string;
    age: number;
    abilities: Ability[];
    story: {
        summary: string;
    };
}

export type HeroRole = "damage" | "support" | "tank";