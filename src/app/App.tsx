import { useState } from "react";
import { Sidebar } from "./components/sidebar";
import { HSEQ } from "./components/hseq";
import { ClaimsInsurance } from "./components/claims-insurance";
import { Insurance } from "./components/insurance";
import { HSEQKPI } from "./components/hseq-kpi";
import { Voyage } from "./components/voyage";
import { Inquiry } from "./components/inquiry";
import { Legal } from "./components/legal";
import { Fixtures } from "./components/fixtures";
import { Settings } from "./components/settings";
import { INITIAL_DATA, Incident } from "./components/hseq-types";
import { Building2, Anchor, Building, FileText, BarChart3, FileSpreadsheet, DollarSign } from "lucide-react";

export type NavigationItem =
  | "company"
  | "port-canals"
  | "offices"
  | "hseq"
  | "insurance"
  | "claims-insurance"
  | "voyage"
  | "inquiry"
  | "legal"
  | "hseq-kpi"
  | "fixtures"
  | "fixture-reports"
  | "invoice-listing"
  | "income-expense-list"
  | "settings";

export default function App() {
  const [activeSection, setActiveSection] = useState<NavigationItem>("hseq");
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_DATA);

  const renderContent = () => {
    switch (activeSection) {
      case "hseq":
        return <HSEQ incidents={incidents} setIncidents={setIncidents} />;
      case "insurance":
        return <Insurance />;
      case "claims-insurance":
        return <ClaimsInsurance />;
      case "voyage":
        return <Voyage />;
      case "inquiry":
        return <Inquiry />;
      case "legal":
        return <Legal />;
      case "hseq-kpi":
        return <HSEQKPI incidents={incidents} />;
      case "fixtures":
        return <Fixtures />;
      case "settings":
        return <Settings onBack={() => setActiveSection("hseq")} />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-xl mb-2">
                {activeSection.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </h2>
              <p className="text-muted-foreground">This section is under development</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#f8f9fa]">
      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}