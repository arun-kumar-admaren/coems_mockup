import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { SettingsVessels } from "./settings-vessels";

// ─── Types ────────────────────────────────────────────────────────────────────

type SettingsView = "home" | "vessels";

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    title: "Administration",
    items: [
      { id: "users",             label: "Users",             desc: "List of User" },
      { id: "user-groups",       label: "User Groups",       desc: "List of User Groups" },
      { id: "offices",           label: "Offices",           desc: "List of Offices" },
      { id: "customers",         label: "Customers",         desc: "List of Customers" },
      { id: "port-agency",       label: "Port Agency",       desc: "List of Port Agency" },
      { id: "account-heads",     label: "Account Heads",     desc: "List of Account Heads" },
      { id: "chartering-terms",  label: "Chartering Terms",  desc: "List of Chartering Term Types" },
      { id: "cp-types",          label: "CP Types",          desc: "List of CP Types" },
      { id: "preferences",       label: "Preferences",       desc: "Update user preferences" },
    ],
  },
  {
    title: "General",
    items: [
      { id: "vessel-category", label: "Vessel Category", desc: "List of Vessel Category" },
      { id: "vessel-types",    label: "Vessel Type",     desc: "List of Vessel Types" },
      { id: "own-vessels",     label: "Own Vessels",     desc: "List of Vessels" },
      { id: "ports",           label: "Ports",           desc: "List of Ports" },
      { id: "task-status",     label: "Task Status",     desc: "List of Task Status" },
    ],
  },
  {
    title: "Fixture",
    items: [
      { id: "fixture-cargo-category",    label: "Fixture Cargo Category",    desc: "List of Fixture Cargo Categories" },
      { id: "fixture-cargo-subcategory", label: "Fixture Cargo Subcategory", desc: "List of Fixture Cargo Subcategories" },
    ],
  },
  {
    title: "Project",
    items: [
      { id: "project-cargo-type", label: "Project Cargo Type", desc: "List of Project Cargo Types" },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface SettingsProps {
  onBack: () => void;
}

export function Settings({ onBack }: SettingsProps) {
  const [view, setView] = useState<SettingsView>("home");

  const handleCardClick = (id: string) => {
    if (id === "own-vessels") setView("vessels");
    // other cards: placeholder — no-op for now
  };

  if (view === "vessels") {
    return <SettingsVessels onBack={() => setView("home")} />;
  }

  return (
    <div className="flex flex-col h-full bg-[#efefef]">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-8 py-3 flex items-center">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-[13px] text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          <ChevronLeft className="size-4" />
          BACK
        </button>
      </div>

      {/* Card grid */}
      <div className="flex-1 overflow-y-auto p-8 space-y-10">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="text-[18px] font-semibold text-gray-800 mb-4">{section.title}</h2>
            <div className="grid grid-cols-4 gap-4">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleCardClick(item.id)}
                  className="bg-white border border-gray-200 rounded-lg p-5 text-left hover:border-blue-300 hover:shadow-sm transition-all group"
                >
                  <div className="text-[15px] font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {item.label}
                  </div>
                  <div className="text-[13px] text-gray-500">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
