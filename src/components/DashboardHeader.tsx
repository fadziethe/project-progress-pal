import { Search } from "lucide-react";

interface DashboardHeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  stats: { total: number; done: number; inProgress: number; overallProgress: number };
}

export function DashboardHeader({ searchQuery, setSearchQuery, stats }: DashboardHeaderProps) {
  const cards = [
    { label: "Total Tasks", value: stats.total, color: "text-foreground" },
    { label: "In Progress", value: stats.inProgress, color: "text-warning" },
    { label: "Completed", value: stats.done, color: "text-success" },
    { label: "Overall Progress", value: `${stats.overallProgress}%`, color: "text-primary" },
  ];

  return (
    <header className="border-b border-border px-6 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-lg text-foreground">Project Dashboard</h2>
          <p className="text-sm text-muted-foreground">Track your software development pipeline</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.label} className="glass rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">{c.label}</p>
            <p className={`text-2xl font-heading font-bold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>
    </header>
  );
}
