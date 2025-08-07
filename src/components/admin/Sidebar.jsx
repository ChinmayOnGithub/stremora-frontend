import { cn } from "../ui/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  Users,
  Video,
  ListMusic,
  MessageSquare,
  History,
  ThumbsUp,
  UserCheck,
  MessageCircle,
} from "lucide-react";
import { ThemeToggle } from "../theme/theme-toggle2";

const ICONS = {
  users: Users,
  videos: Video,
  playlists: ListMusic,
  comments: MessageSquare,
  history: History,
  likes: ThumbsUp,
  subscriptions: UserCheck,
  tweets: MessageCircle,
};

export function Sidebar({ nav, section, setSection }) {
  return (
    <aside className="w-72 border-r bg-background flex flex-col py-6 px-5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-black dark:text-white/90 tracking-tight">Admin Panel</h2>
        <ThemeToggle />
      </div>

      <nav className="space-y-2 flex-1 overflow-y-auto">
        {nav.map((item) => {
          const Icon = ICONS[item.key];
          return (
            <button
              key={item.key}
              className={cn(
                "w-full px-4 py-2 rounded-md flex items-start gap-3 transition-colors group text-left",
                section === item.key
                  ? "bg-muted text-primary"
                  : "hover:bg-muted text-muted-foreground"
              )}
              onClick={() => setSection(item.key)}
            >
              {Icon && <Icon className="w-5 h-5 mt-1" />}
              <div className="flex flex-col">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-xs text-muted-foreground">{item.route}</span>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
