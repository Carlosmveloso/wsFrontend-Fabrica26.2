import { Crosshair, FolderGit2 } from "lucide-react";

export function Header() {
  return (
    <header className="w-full justify-between items-center flex flex-wrap gap-x-4 gap-y-2 px-5 py-3.5 border-b">
      <div className="flex items-center gap-3">
        <span className="border bg-card rounded-lg p-2">
          <Crosshair size={18} className="text-primary" />
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold whitespace-nowrap">
            Conheça seus Heróis
          </span>
          <span className="text-[11px] text-muted-foreground whitespace-nowrap">
            Overwatch character database
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-xs text-muted-foreground border border-border rounded-full px-3 py-1">
          OverFast API
        </span>
        <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors px-3">
          Heróis
        </a>
        <a href="#" aria-label="GitHub" className="inline-flex items-center justify-center rounded-md px-2">
          <FolderGit2 size={18}/>
        </a>
      </div>
    </header>
  );
}
