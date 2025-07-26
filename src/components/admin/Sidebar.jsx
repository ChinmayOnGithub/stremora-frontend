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
    <aside className="w-72 bg-white border-r flex flex-col py-6 px-4">
      <div className="text-2xl font-bold mb-8 tracking-tight">Admin Panel</div>
      <nav className="flex-1 space-y-2">
        {nav.map((item) => {
          const Icon = ICONS[item.key];
          return (
            <Tooltip key={item.key} delayDuration={300}>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    "w-full text-left px-4 py-3 rounded transition font-medium flex items-center gap-3",
                    section === item.key
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100 text-gray-700"
                  )}
                  onClick={() => setSection(item.key)}
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  <div>
                    <div>{item.label}</div>
                    <div className="text-xs text-gray-500 font-normal">
                      {item.route}
                    </div>
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-[200px]">
                <p>{item.description}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
    </aside>
  );
} 