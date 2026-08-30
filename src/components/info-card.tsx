import type { LucideIcon } from "lucide-react";

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export function InfoCard({ icon: Icon, label, value }: InfoCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wide">
        <Icon size={14} className="text-primary" />
        {label}
      </div>
      <span className="font-medium">{value}</span>
    </div>
  );
}
