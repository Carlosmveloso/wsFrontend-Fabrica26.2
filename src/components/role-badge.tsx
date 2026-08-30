import { cva, type VariantProps } from "class-variance-authority";
import { Shield, Swords, HeartPulse } from "lucide-react";
import type { HeroRole } from "@/types/hero";

const roleVariant = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      role: {
        tank: "bg-tank/12 border border-tank/35 text-tank",
        damage: "bg-damage/12 border border-damage/35 text-damage",
        support: "bg-support/12 border border-support/35 text-support",
      },
    },
  },
);

const roleIcon = {
  tank: Shield,
  damage: Swords,
  support: HeartPulse,
} satisfies Record<HeroRole, typeof Shield>;

const roleLabel = {
  tank: "Tank",
  damage: "Damage",
  support: "Support",
} satisfies Record<HeroRole, string>;

interface RoleBadgeProps extends VariantProps<typeof roleVariant> {
  role: HeroRole;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const Icon = roleIcon[role];

  return (
    <span className={roleVariant({ role })}>
      <Icon size={12} />
      {roleLabel[role]}
    </span>
  );
}
