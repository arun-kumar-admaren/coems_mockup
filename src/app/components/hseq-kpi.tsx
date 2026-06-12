import { useState, useMemo } from "react";
import { Activity, ShieldCheck, BarChart, History, ListTree, FileText, Info, Check } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Incident, IncidentStatus, IncidentSeverity } from "./hseq-types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Collapsible, CollapsibleContent } from "./ui/collapsible";
import { cn } from "./ui/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface HSEQKPIProps {
  incidents: Incident[];
}

export function HSEQKPI({ incidents }: HSEQKPIProps) {
  // KPI Filter State
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedQuarter, setSelectedQuarter] = useState(`Q${Math.floor(new Date().getMonth() / 3) + 1}`);
  const [selectedVessel, setSelectedVessel] = useState<string>("all");

  const [showExposureBreakdown, setShowExposureBreakdown] = useState(false);
  const [exposureBreakdown, setExposureBreakdown] = useState({ crew: 0, shore: 0, contractor: 0 });
  const [totalExposureHours, setTotalExposureHours] = useState<number | null>(null);

  const [kpiFilters, setKpiFilters] = useState({
    includeLTI: true,
    includeTRC: true,
    includeAll: true,
    excludeNearMiss: true
  });

  // Mock Trend Data
  const trendData = [
    { name: 'Q1 2025', ltif: 0.0, trcf: 1.2 },
    { name: 'Q2 2025', ltif: 0.5, trcf: 0.8 },
    { name: 'Q3 2025', ltif: 0.0, trcf: 0.5 },
    { name: 'Q4 2025', ltif: 1.1, trcf: 1.5 },
    { name: 'Q1 2026', ltif: 0.0, trcf: 0.2 },
  ];

  const getQuarter = (dateStr: string) => {
    if (!dateStr) return "Q1";
    const month = new Date(dateStr).getMonth();
    return `Q${Math.floor(month / 3) + 1}`;
  };

  const getYear = (dateStr: string) => {
    if (!dateStr) return new Date().getFullYear();
    return new Date(dateStr).getFullYear();
  };

  // Filter incidents based on selection
  const scopedIncidents = useMemo(() => {
    return incidents.filter(inc => {
      const incYear = getYear(inc.date).toString();
      const incQuarter = getQuarter(inc.date);
      
      if (selectedYear && incYear !== selectedYear) return false;
      if (selectedQuarter && incQuarter !== selectedQuarter) return false;
      if (selectedVessel !== "all" && inc.vessel !== selectedVessel) return false;
      
      return true;
    });
  }, [incidents, selectedYear, selectedQuarter, selectedVessel]);

  // Calculate KPI stats
  const kpiStats = useMemo(() => {
    let ltiCount = 0;
    let trcCount = 0;
    let totalCount = 0;
    
    scopedIncidents.forEach(inc => {
      const isNearMiss = inc.incidentCategory === "Near-Miss";
      if (kpiFilters.excludeNearMiss && isNearMiss) return;

      // Determine classification based on logic
      const isLTI = 
        inc.eventSeverity?.includes("Fatality") || 
        inc.eventSeverity?.includes("Permanent Total") || 
        inc.eventSeverity?.includes("Lost/Restricted") ||
        inc.severity === "Critical";

      const isTRC = isLTI || inc.eventSeverity?.includes("Medical Treatment") || inc.severity === "High";

      if (isLTI) ltiCount++;
      if (isTRC) trcCount++;
      totalCount++;
    });

    return { ltiCount, trcCount, totalCount, incidents: scopedIncidents };
  }, [scopedIncidents, kpiFilters]);

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] p-6 overflow-y-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">HSEQ KPI Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Monitor safety performance and incident trends</p>
        </div>
        
        {/* Global Filters */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
           <Select value={selectedYear} onValueChange={setSelectedYear}>
             <SelectTrigger className="w-[100px] h-8 text-xs">
               <SelectValue placeholder="none" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="2026">2026</SelectItem>
               <SelectItem value="2025">2025</SelectItem>
             </SelectContent>
           </Select>

           <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
             <SelectTrigger className="w-[100px] h-8 text-xs">
               <SelectValue placeholder="none" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="Q1">Q1</SelectItem>
               <SelectItem value="Q2">Q2</SelectItem>
               <SelectItem value="Q3">Q3</SelectItem>
               <SelectItem value="Q4">Q4</SelectItem>
             </SelectContent>
           </Select>

           <Select value={selectedVessel} onValueChange={setSelectedVessel}>
             <SelectTrigger className="w-[140px] h-8 text-xs">
               <SelectValue placeholder="none" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="all">All Vessels</SelectItem>
               <SelectItem value="UHL F900">UHL F900</SelectItem>
               <SelectItem value="UHL FAITH">UHL FAITH</SelectItem>
               <SelectItem value="UHL FORCE">UHL FORCE</SelectItem>
               {/* Add other vessels as needed */}
             </SelectContent>
           </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
        {/* Card A: Exposure Hours */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 md:col-span-1 relative">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              Exposure Hours
            </h4>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-medium px-2 py-0.5 bg-red-50 text-red-600 rounded-full border border-red-100">Mandatory</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                      <History className="w-3.5 h-3.5 text-gray-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="w-64 p-3">
                    <div className="space-y-2">
                      <h5 className="font-semibold text-xs border-b pb-1 mb-1">Change Log</h5>
                      <div className="text-[10px] space-y-1 text-gray-500">
                        <div className="flex justify-between">
                          <span>Updated by:</span>
                          <span className="font-medium text-gray-700">Capt. Erik Hansen</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Date:</span>
                          <span className="font-medium text-gray-700">25 Jan 2026</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Previous Value:</span>
                          <span className="font-mono text-gray-700">120,000</span>
                        </div>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs px-3 py-2 bg-blue-50/50 rounded-md border border-blue-100">
               <span className="text-gray-500 font-medium">Selected Period:</span>
               <span className="font-bold text-blue-700">{selectedQuarter} {selectedYear}</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <Label htmlFor="exposureHours" className="text-xs font-medium text-gray-700">
                  Total Quarterly Hours
                </Label>
                {showExposureBreakdown && (
                  <span className="text-[10px] text-blue-600 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Auto-calculated
                  </span>
                )}
              </div>
              
              <div className="relative rounded-md shadow-sm group">
                <Input
                  id="exposureHours"
                  type="number"
                  min="0"
                  placeholder="e.g., 125000"
                  className={cn(
                    "pr-12 text-right font-mono transition-colors",
                    showExposureBreakdown 
                      ? "bg-gray-100 text-gray-600 border-gray-200 cursor-not-allowed focus-visible:ring-0" 
                      : "bg-white border-gray-300 focus:border-blue-500"
                  )}
                  value={totalExposureHours ?? ""}
                  onChange={(e) => {
                    if (!showExposureBreakdown) {
                      setTotalExposureHours(e.target.value === "" ? null : parseFloat(e.target.value));
                    }
                  }}
                  readOnly={showExposureBreakdown}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-xs font-medium">hrs</span>
                </div>
              </div>
              <p className="mt-1.5 text-[10px] text-gray-500 leading-tight">
                Total hours worked in period (crew + shore, as applicable). <span className="text-red-500/80">Exclude leave/non-working hours.</span>
              </p>
            </div>

            {/* Breakdown Toggle Section */}
            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <Label htmlFor="breakdown-mode" className="text-xs font-medium text-gray-700 flex items-center gap-1.5 cursor-pointer">
                  <ListTree className="w-3.5 h-3.5 text-gray-500" />
                  Detailed Breakdown Mode
                </Label>
                <Switch
                  id="breakdown-mode"
                  checked={showExposureBreakdown}
                  onCheckedChange={(checked) => {
                    setShowExposureBreakdown(checked);
                    if (checked) {
                      const total = (exposureBreakdown.crew || 0) + (exposureBreakdown.shore || 0) + (exposureBreakdown.contractor || 0);
                      setTotalExposureHours(total);
                    }
                  }}
                  className="scale-75 origin-right"
                />
              </div>
              
              <Collapsible open={showExposureBreakdown}>
                <CollapsibleContent className="space-y-3 animate-in slide-in-from-top-2 fade-in duration-200">
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200 space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-50 to-transparent -mr-8 -mt-8 rounded-full pointer-events-none" />
                    
                    <div className="grid grid-cols-2 items-center gap-2">
                      <Label className="text-xs text-gray-600 pl-1 border-l-2 border-blue-400">Crew Hours</Label>
                      <Input 
                        type="number" 
                        className="h-8 text-xs text-right bg-white shadow-sm" 
                        placeholder="0"
                        value={exposureBreakdown.crew || ""}
                        onChange={(e) => {
                          const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
                          const newBreakdown = { ...exposureBreakdown, crew: val };
                          setExposureBreakdown(newBreakdown);
                          const total = val + (newBreakdown.shore || 0) + (newBreakdown.contractor || 0);
                          setTotalExposureHours(total);
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-2 items-center gap-2">
                      <Label className="text-xs text-gray-600 pl-1 border-l-2 border-indigo-400">Shore/Office</Label>
                      <Input 
                        type="number" 
                        className="h-8 text-xs text-right bg-white shadow-sm" 
                        placeholder="0"
                        value={exposureBreakdown.shore || ""}
                        onChange={(e) => {
                          const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
                          const newBreakdown = { ...exposureBreakdown, shore: val };
                          setExposureBreakdown(newBreakdown);
                          const total = (newBreakdown.crew || 0) + val + (newBreakdown.contractor || 0);
                          setTotalExposureHours(total);
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-2 items-center gap-2">
                      <Label className="text-xs text-gray-600 pl-1 border-l-2 border-orange-400 flex items-center justify-between w-full pr-1">
                        Contractor
                        <span className="text-[9px] text-gray-400 bg-white px-1 rounded border">Optional</span>
                      </Label>
                      <Input 
                        type="number" 
                        className="h-8 text-xs text-right bg-white shadow-sm" 
                        placeholder="0"
                        value={exposureBreakdown.contractor || ""}
                        onChange={(e) => {
                          const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
                          const newBreakdown = { ...exposureBreakdown, contractor: val };
                          setExposureBreakdown(newBreakdown);
                          const total = (newBreakdown.crew || 0) + (newBreakdown.shore || 0) + val;
                          setTotalExposureHours(total);
                        }}
                      />
                    </div>
                    
                    <div className="pt-2 mt-1 border-t border-dashed border-gray-200 flex justify-between items-center">
                      <span className="text-[10px] text-gray-400 italic">Auto-sum updates total above</span>
                      <span className="text-xs font-bold text-gray-700 font-mono">
                        = {(exposureBreakdown.crew || 0) + (exposureBreakdown.shore || 0) + (exposureBreakdown.contractor || 0)}
                      </span>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>

        {/* Card B: KPI Results */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 md:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <BarChart className="w-4 h-4 text-purple-600" />
              KPI Results
            </h4>
            <Button variant="ghost" size="sm" className="h-6 text-[10px] text-gray-500">
              <Info className="w-3 h-3 mr-1" />
              View Calc
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* LTIF Tile */}
            <div className="bg-blue-50/50 border border-blue-100 rounded p-3 relative group hover:border-blue-300 transition-colors">
              <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">LTIF</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900">
                  {totalExposureHours ? ((kpiStats?.ltiCount || 0) * 1000000 / totalExposureHours).toFixed(2) : "—"}
                </span>
              </div>
              <span className="text-[10px] text-gray-500 block mt-1">per 1M hours</span>
            </div>

            {/* TRCF Tile */}
            <div className="bg-orange-50/50 border border-orange-100 rounded p-3 relative group hover:border-orange-300 transition-colors">
              <span className="text-[10px] uppercase font-bold text-orange-600 tracking-wider">TRCF</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900">
                  {totalExposureHours ? ((kpiStats?.trcCount || 0) * 1000000 / totalExposureHours).toFixed(2) : "—"}
                </span>
              </div>
              <span className="text-[10px] text-gray-500 block mt-1">per 1M hours</span>
            </div>
            
            {/* Incident Frequency Tile (Full Width) */}
            <div className="col-span-2 bg-green-50/50 border border-green-100 rounded p-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-green-600 tracking-wider">Incident Frequency</span>
                <div className="mt-1">
                  <span className="text-xl font-bold text-gray-900">
                    {totalExposureHours ? ((kpiStats?.totalCount || 0) * 1000000 / totalExposureHours).toFixed(2) : "—"}
                  </span>
                  <span className="text-[10px] text-gray-500 ml-2">per 1M hours</span>
                </div>
              </div>
              <div className="text-right">
                 <div className="text-xs font-medium text-gray-900">{kpiStats?.totalCount} Incidents</div>
                 <div className="text-[10px] text-gray-500">used in calc</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card C: Trend & Benchmark */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 md:col-span-2">
           <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <History className="w-4 h-4 text-gray-500" />
              Quarterly Trend
            </h4>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="text-[10px] text-gray-500">LTIF</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                <span className="text-[10px] text-gray-500">TRCF</span>
              </div>
            </div>
          </div>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart id="kpi-trend-chart" data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  key="x-axis"
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: '#6b7280' }} 
                  axisLine={false} 
                  tickLine={false}
                />
                <YAxis 
                  key="y-axis"
                  tick={{ fontSize: 10, fill: '#6b7280' }} 
                  axisLine={false} 
                  tickLine={false}
                />
                <RechartsTooltip 
                  key="tooltip"
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Line key="trcf-line" type="monotone" dataKey="trcf" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line key="ltif-line" type="monotone" dataKey="ltif" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card D: Included Incidents */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 md:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              Included Incidents
            </h4>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Period:</span>
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                  {selectedQuarter} {selectedYear}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
             {/* Filters */}
             <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-gray-100 bg-gray-50/50 p-3 rounded-md">
               <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                 <span className="text-xs font-semibold text-gray-700">Include types:</span>
                 <div className="flex items-center gap-4">
                   <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="includeLTI" 
                        checked={kpiFilters.includeLTI}
                        onCheckedChange={(checked) => setKpiFilters(prev => ({ ...prev, includeLTI: checked as boolean }))}
                      />
                      <label htmlFor="includeLTI" className="text-xs text-gray-600">LTIs</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="includeTRC" 
                        checked={kpiFilters.includeTRC}
                        onCheckedChange={(checked) => setKpiFilters(prev => ({ ...prev, includeTRC: checked as boolean }))}
                      />
                      <label htmlFor="includeTRC" className="text-xs text-gray-600">Total Recordables (TRC)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="includeAll" 
                        checked={kpiFilters.includeAll}
                        onCheckedChange={(checked) => setKpiFilters(prev => ({ ...prev, includeAll: checked as boolean }))}
                      />
                      <label htmlFor="includeAll" className="text-xs text-gray-600">All Incidents</label>
                    </div>
                 </div>
               </div>
               
               <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
                  <label
                    htmlFor="excludeNearMiss"
                    className="text-xs font-medium text-gray-700 cursor-pointer"
                  >
                    Exclude Near Misses?
                  </label>
                  <Switch
                    id="excludeNearMiss"
                    checked={kpiFilters.excludeNearMiss}
                    onCheckedChange={(checked) => setKpiFilters(prev => ({ ...prev, excludeNearMiss: checked }))}
                    className="scale-75"
                  />
                </div>
             </div>

             {/* Incident Table Preview */}
             <div className="border rounded-md overflow-hidden">
               <table className="w-full text-xs text-left">
                 <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                   <tr>
                     <th className="px-3 py-2 w-[100px]">Incident No.</th>
                     <th className="px-3 py-2 w-[90px]">Date</th>
                     <th className="px-3 py-2">Vessel / Voyage</th>
                     <th className="px-3 py-2 w-[80px]">Severity</th>
                     <th className="px-3 py-2">Classification</th>
                     <th className="px-3 py-2 w-[80px]">Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {kpiStats.incidents.length > 0 ? (
                     kpiStats.incidents.map((inc: Incident, idx: number) => {
                       const isNearMiss = inc.incidentCategory === "Near-Miss";
                       if (kpiFilters.excludeNearMiss && isNearMiss) return null;
                       
                       // Determine Classification String
                       let classification = "First Aid";
                       if (inc.eventSeverity?.includes("Fatality") || inc.eventSeverity?.includes("Lost")) classification = "LTI";
                       else if (inc.severity === "High" || inc.eventSeverity?.includes("Medical")) classification = "Recordable";
                       else if (isNearMiss) classification = "Near Miss";

                       // Filter Logic based on checkboxes
                       if (classification === "LTI" && !kpiFilters.includeLTI) return null;
                       if (classification === "Recordable" && !kpiFilters.includeTRC) return null;
                       if (!kpiFilters.includeAll && classification !== "LTI" && classification !== "Recordable") return null;


                       return (
                         <tr key={inc.id ? `inc-${inc.id}-${idx}` : `inc-idx-${idx}`} className="hover:bg-gray-50 transition-colors group">
                           <td className="px-3 py-2 font-medium text-blue-600 group-hover:underline cursor-pointer">{inc.incidentNumber || "New"}</td>
                           <td className="px-3 py-2 text-gray-500">{inc.date}</td>
                           <td className="px-3 py-2 text-gray-700">
                              <div className="flex flex-col">
                                <span>{inc.vessel}</span>
                                <span className="text-[10px] text-gray-400">{inc.voyage}</span>
                              </div>
                           </td>
                           <td className="px-3 py-2">
                              <span className={cn(
                                "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border",
                                inc.severity === "Critical" ? "bg-red-50 text-red-700 border-red-100" :
                                inc.severity === "High" ? "bg-orange-50 text-orange-700 border-orange-100" :
                                inc.severity === "Medium" ? "bg-yellow-50 text-yellow-700 border-yellow-100" :
                                "bg-green-50 text-green-700 border-green-100"
                              )}>
                                {inc.severity}
                              </span>
                           </td>
                           <td className="px-3 py-2">
                             <span className={cn(
                                "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium",
                                classification === "LTI" ? "bg-red-100 text-red-800" :
                                classification === "Recordable" ? "bg-orange-100 text-orange-800" :
                                classification === "Near Miss" ? "bg-gray-100 text-gray-800" :
                                "bg-blue-50 text-blue-700"
                              )}>
                                {classification}
                              </span>
                           </td>
                           <td className="px-3 py-2">
                              <div className="flex items-center gap-1.5">
                                <div className={cn("w-1.5 h-1.5 rounded-full", inc.status === "Closed" ? "bg-green-500" : "bg-blue-500")} />
                                <span className="text-xs text-gray-600">{inc.status || "Draft"}</span>
                              </div>
                           </td>
                         </tr>
                       );
                     })
                   ) : (
                     <tr>
                       <td colSpan={6} className="px-3 py-8 text-center text-gray-500">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <FileText className="w-8 h-8 text-gray-200" />
                            <span className="text-xs font-medium text-gray-400">No incidents found matching these filters</span>
                          </div>
                       </td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
