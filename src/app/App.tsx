import { useEffect, useState } from "react";
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
import { AppVersion, VersionProvider } from "./version-context";
import { Building2, Anchor, Building, FileText, BarChart3, FileSpreadsheet, DollarSign } from "lucide-react";

export type NavigationItem =
  | "company"
  | "port-canals"
  | "offices"
  | "hseq"
  | "insurance"
  | "claims-insurance"
  | "voyage"
  | "voyage-v2"
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
  const [version, setVersion] = useState<AppVersion>(
    () => (localStorage.getItem("coems-version") === "2.0" ? "2.0" : "1.0")
  );

  const handleVersionChange = (v: AppVersion) => {
    setVersion(v);
    localStorage.setItem("coems-version", v);
  };

  // Cross-module bridge: a linked claim clicked inside an Incident's Claims tab
  // dispatches this to jump to the Claims module; ClaimsInsurance itself opens
  // the specific claim's edit overlay by reading sessionStorage on mount.
  useEffect(() => {
    const openClaims = () => setActiveSection("claims-insurance");
    window.addEventListener("coems-open-claim", openClaims);
    return () => window.removeEventListener("coems-open-claim", openClaims);
  }, []);

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
      case "voyage-v2":
        return <Voyage version="v2" />;
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
    <VersionProvider value={version}>
      <div className="flex h-screen bg-[#f8f9fa]">
        <Sidebar activeSection={activeSection} onNavigate={setActiveSection} version={version} onVersionChange={handleVersionChange} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </VersionProvider>
  );
}