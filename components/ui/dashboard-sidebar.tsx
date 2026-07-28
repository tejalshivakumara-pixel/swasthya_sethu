import React, { useState } from 'react';
import { 
  Search, 
  LayoutDashboard, 
  Stethoscope, 
  Calendar, 
  FileText, 
  Pill, 
  AlertTriangle, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Activity, 
  Heart, 
  Bell, 
  X, 
  Sparkles
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type NavItemData = {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number | string }>;
  badge?: number | string;
  shortcut?: string;
  children?: NavItemData[];
};

export type NavGroupData = {
  heading?: string;
  items: NavItemData[];
};

const mockNavGroups: NavGroupData[] = [
  {
    heading: 'Navigation',
    items: [
      { id: 'home', title: 'Dashboard', icon: LayoutDashboard },
      { id: 'symptom_checker', title: 'AI Symptom Checker', icon: Stethoscope, badge: 'AI' },
      { id: 'appointments', title: 'Doctor Appointments', icon: Calendar },
      { id: 'reminders', title: 'Medicine Reminders', icon: Pill, badge: 3 },
      { id: 'records', title: 'Health Records', icon: FileText },
      { id: 'scanner', title: 'Prescription Scanner', icon: FileText },
      { id: 'emergency', title: 'Emergency Help', icon: AlertTriangle },
    ]
  }
];

const mockBottomItems: NavItemData[] = [
  { id: 'settings', title: 'Settings', icon: Settings, shortcut: '⌘,' },
  { id: 'logout', title: 'Log out', icon: LogOut },
];

export interface NavItemProps {
  item: NavItemData;
  activeId: string;
  onSelect: (id: string) => void;
  level?: number;
}

export function NavItem({ 
  item, 
  activeId, 
  onSelect,
  level = 0
}: NavItemProps) {
  const isActive = activeId === item.id;
  const hasChildren = !!item.children;
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else {
      onSelect(item.id);
    }
  };

  const Icon = item.icon;

  return (
    <div className="flex flex-col w-full">
      <div 
        className={cn(
          "group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 select-none",
          isActive 
            ? "bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-600/20" 
            : "text-slate-700 dark:text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300"
        )}
        style={{ paddingLeft: `${level * 12 + 12}px` }}
        onClick={handleClick}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Icon 
            className={cn(
              "w-[18px] h-[18px] shrink-0 transition-colors",
              isActive ? "text-white" : "text-emerald-600/80 dark:text-emerald-400/90 group-hover:text-emerald-600 dark:group-hover:text-emerald-300"
            )} 
            strokeWidth={1.75} 
          />
          <span className="text-[14px] tracking-tight truncate">
            {item.title}
          </span>
        </div>
        
        <div className="flex items-center gap-1.5 shrink-0">
          {item.shortcut && (
             <kbd className={cn(
               "hidden group-hover:inline-flex items-center justify-center h-5 px-1.5 text-[10px] font-mono rounded-md border",
               isActive ? "bg-white/20 border-white/30 text-white" : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
             )}>
               {item.shortcut}
             </kbd>
          )}
          {item.badge && (
            <span className={cn(
              "flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold rounded-full",
              isActive 
                ? "bg-white/20 text-white" 
                : item.badge === 'AI'
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
            )}>
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <ChevronRight 
              className={cn(
                "w-3.5 h-3.5 transition-transform duration-200",
                isOpen ? "rotate-90" : "",
                isActive ? "text-white" : "text-slate-400"
              )} 
              strokeWidth={2}
            />
          )}
        </div>
      </div>

      {hasChildren && (
        <div 
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden min-h-0 relative flex flex-col gap-0.5 mt-0.5">
            <div 
              className="absolute top-0 bottom-0 border-l-2 border-emerald-500/20"
              style={{ left: `${level * 12 + 19}px` }}
            />
            {item.children!.map(child => (
              <NavItem 
                key={child.id} 
                item={child} 
                activeId={activeId} 
                onSelect={onSelect} 
                level={level + 1} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export interface SidebarNavProps {
  className?: string;
  activeId?: string;
  onSelect?: (id: string) => void;
}

export function SidebarNav({ 
  className = '',
  activeId,
  onSelect
}: SidebarNavProps) {
  const [internalId, setInternalId] = useState('home');
  const currentId = activeId !== undefined ? activeId : internalId;
  const handleSelect = onSelect || setInternalId;

  return (
    <div className={cn("flex flex-col w-[270px] h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r border-slate-200 dark:border-slate-800 p-4 font-sans shadow-sm", className)}>
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 py-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25">
          <Heart className="w-5 h-5 fill-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-[17px] tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-1">
            Swasthya<span className="text-emerald-600 dark:text-emerald-400">Setu</span>
          </span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Health Portal</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-4">
        {mockNavGroups.map((group, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            {group.heading && (
              <span className="px-3 mb-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                {group.heading}
              </span>
            )}
            {group.items.map(item => (
              <NavItem 
                key={item.id} 
                item={item} 
                activeId={currentId} 
                onSelect={handleSelect} 
              />
            ))}
          </div>
        ))}
      </div>

      {/* User Badge Footer */}
      <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
          TS
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">Tejal S</span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Logged In</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-0.5">
        {mockBottomItems.map(item => (
          <NavItem 
            key={item.id} 
            item={item} 
            activeId={currentId} 
            onSelect={handleSelect} 
          />
        ))}
      </div>
    </div>
  );
}

const allItems = [...mockNavGroups.flatMap(g => g.items), ...mockBottomItems];
const flattenItems = (items: NavItemData[]): NavItemData[] => {
  return items.reduce((acc, item) => {
    acc.push(item);
    if (item.children) acc.push(...flattenItems(item.children));
    return acc;
  }, [] as NavItemData[]);
};
const flatMockData = flattenItems(allItems);

export function SidebarNavPreview() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeId, setActiveId] = useState('home');

  const activeItem = flatMockData.find(i => i.id === activeId);
  const activeTitle = activeItem ? activeItem.title : 'Dashboard';

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[750px] bg-slate-100 dark:bg-slate-950 p-4 md:p-6 font-sans">
      <div className="relative w-full max-w-6xl h-[720px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex overflow-hidden shadow-2xl">
        <div className={cn("h-full shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800", isOpen ? "w-[270px]" : "w-0 overflow-hidden")}>
          <SidebarNav activeId={activeId} onSelect={setActiveId} />
        </div>
      </div>
    </div>
  );
}

export default SidebarNavPreview;
