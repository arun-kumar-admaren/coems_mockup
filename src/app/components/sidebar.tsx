import { Building2, Anchor, Building, FileText, BarChart3, FileSpreadsheet, DollarSign, ShieldCheck, Shield, Ship, Settings, MoreVertical, LogOut, FileSearch, Scale, Banknote } from "lucide-react";
import { NavigationItem } from "../App";
import { cn } from "./ui/utils";

interface SidebarProps {
  activeSection: NavigationItem;
  onNavigate: (section: NavigationItem) => void;
}

const managementItems = [
  { id: "company" as NavigationItem, label: "Company", icon: Building2 },
  { id: "port-canals" as NavigationItem, label: "Port Agency", icon: Anchor },
  { id: "offices" as NavigationItem, label: "Offices", icon: Building },
];

const operationsItems = [
  { id: "voyage" as NavigationItem, label: "Voyage", icon: Ship, badge: "BETA" },
  { id: "voyage-v2" as NavigationItem, label: "Voyage", icon: Ship, badge: "NEW" },
  { id: "inquiry" as NavigationItem, label: "Inquiry", icon: FileSearch },
  { id: "fixtures" as NavigationItem, label: "Fixtures", icon: FileText },
  { id: "legal" as NavigationItem, label: "Legal Review", icon: Scale },
  { id: "hseq" as NavigationItem, label: "HSEQ", icon: ShieldCheck },
  { id: "insurance" as NavigationItem, label: "Insurance", icon: Shield },
  { id: "claims-insurance" as NavigationItem, label: "Claims", icon: Banknote },
  { id: "hseq-kpi" as NavigationItem, label: "HSEQ KPI", icon: BarChart3 },
  { id: "fixture-reports" as NavigationItem, label: "Fixture Reports", icon: BarChart3 },
  { id: "invoice-listing" as NavigationItem, label: "Invoice Listing", icon: FileSpreadsheet },
  { id: "income-expense-list" as NavigationItem, label: "Income Expense List", icon: DollarSign },
];

export function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 bg-[#1a1d29] flex flex-col h-screen text-white">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-700/50">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-normal text-white">COEMS</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3">
        {/* Management Section */}
        <div className="mb-4">
          <div className="px-5 py-2 mb-1">
            <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              MANAGEMENT
            </h3>
          </div>
          <ul className="space-y-0.5">
            {managementItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-5 py-2.5 transition-all text-left text-[13px] relative group",
                      isActive
                        ? "bg-blue-600/20 text-white"
                        : "text-gray-300 hover:bg-gray-700/30 hover:text-white"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500"></div>
                    )}
                    <Icon className="size-[18px] flex-shrink-0" />
                    <span className={isActive ? "font-medium" : "font-normal"}>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Operations Section */}
        <div>
          <ul className="space-y-0.5">
            {operationsItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-5 py-2.5 transition-all text-left text-[13px] relative group",
                      isActive
                        ? "bg-blue-600/20 text-white"
                        : "text-gray-300 hover:bg-gray-700/30 hover:text-white"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500"></div>
                    )}
                    <Icon className="size-[18px] flex-shrink-0" />
                    <div className="flex items-start">
                      <span className={isActive ? "font-medium" : "font-normal"}>{item.label}</span>
                      {item.badge && (
                        <span className="text-[8px] font-bold text-blue-500 ml-1 mt-0 tracking-wider leading-none uppercase">{item.badge}</span>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Footer - User Info */}
      <div className="px-5 py-4 border-t border-gray-700/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-white">TA</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Tester Adminren</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate("settings")}
            className={cn("p-1.5 hover:bg-gray-700/50 rounded transition-colors", activeSection === "settings" && "bg-gray-700/50")}
            title="Settings"
          >
            <Settings className="size-4 text-gray-400" />
          </button>
          <button className="p-1.5 hover:bg-gray-700/50 rounded transition-colors" title="More">
            <MoreVertical className="size-4 text-gray-400" />
          </button>
          <button className="p-1.5 hover:bg-gray-700/50 rounded transition-colors" title="Logout">
            <LogOut className="size-4 text-gray-400" />
          </button>
        </div>
        <p className="mt-2.5 text-[11px] text-gray-500">@Coems</p>
      </div>
    </aside>
  );
}