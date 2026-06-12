import React, { useState } from "react";
import { Search, Plus, MoreVertical, ChevronLeft, ChevronRight, ChevronDown, ArrowDown } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { VoyageDetail } from "./voyage-detail";

const VOYAGE_DATA = [
  { id: 2712, number: "HLSD 2605", vessel: "HLS DIAMOND", status: "Preplanning", operationInCharge: "Aiswarya Admaren", tce: "$ 3.328,00", startDate: "25/04/2026", suez: "N/A", nsr: "N/A", createdBy: "Aiswarya Admaren", modifiedBy: "Nikhil Mathew", createdOn: "18/03/2026", modifiedOn: "23/03/2026", vesselType: "Dong Bang Deckcarrier", customsFiling: "Pending", agm: "Pending", armedGuards: "Pending", transitRequirements: "Pending", bunkerPlanning: "Pending" },
  { id: 2711, number: "HLG 2605", vessel: "HELGE", status: "Preplanning", operationInCharge: "Jacson Tom", tce: "$ 133.788.346,00", startDate: "13/12/2026", suez: "N/A", nsr: "N/A", createdBy: "Jacson Tom", modifiedBy: "Jacson Tom", createdOn: "17/03/2026", modifiedOn: "19/03/2026", vesselType: "Ocean Liner", customsFiling: "Pending", agm: "Pending", armedGuards: "Pending", transitRequirements: "Pending", bunkerPlanning: "Pending" },
  { id: 2710, number: "HLSD 2604", vessel: "HLS DIAMOND", status: "Preplanning", operationInCharge: "Aiswarya Admaren", tce: "$ 378.437.772,00", startDate: "25/04/2026", suez: "N/A", nsr: "N/A", createdBy: "Aiswarya Admaren", modifiedBy: "Jacson Tom", createdOn: "17/03/2026", modifiedOn: "23/03/2026", vesselType: "Dong Bang Deckcarrier", customsFiling: "Pending", agm: "Pending", armedGuards: "Pending", transitRequirements: "Pending", bunkerPlanning: "Pending" },
  { id: 2708, number: "HLG 2604", vessel: "HELGE", status: "Preplanning", operationInCharge: "Jacson Tom", tce: "$ 52.378.897,00", startDate: "11/10/2026", suez: "N/A", nsr: "N/A", createdBy: "Jacson Tom", modifiedBy: "Jacson Tom", createdOn: "16/03/2026", modifiedOn: "18/03/2026", vesselType: "Ocean Liner", customsFiling: "Pending", agm: "Pending", armedGuards: "Pending", transitRequirements: "Pending", bunkerPlanning: "Pending" },
  { id: 2706, number: "HLSD 2603", vessel: "HLS DIAMOND", status: "Preplanning", operationInCharge: "Aiswarya Admaren", tce: "$ 7.240,00", startDate: "10/03/2026", suez: "N/A", nsr: "N/A", createdBy: "Aiswarya Admaren", modifiedBy: "Aiswarya Admaren", createdOn: "12/03/2026", modifiedOn: "18/03/2026", vesselType: "Dong Bang Deckcarrier", customsFiling: "Pending", agm: "Pending", armedGuards: "Pending", transitRequirements: "Pending", bunkerPlanning: "Pending" },
  { id: 2703, number: "HLG 2602", vessel: "HELGE", status: "Active", operationInCharge: "Jacson Tom", tce: "$ 13.418,00", startDate: "29/06/2026", suez: "N/A", nsr: "N/A", createdBy: "Jacson Tom", modifiedBy: "Nikhil Mathew", createdOn: "12/03/2026", modifiedOn: "16/03/2026", vesselType: "Ocean Liner", customsFiling: "Pending", agm: "Pending", armedGuards: "Pending", transitRequirements: "Pending", bunkerPlanning: "Pending" },
  { id: 2702, number: "ZLMS 2609", vessel: "saa_ZEAL LUMOS", status: "Preplanning", operationInCharge: "-", tce: "$ 26.005,00", startDate: "05/12/2026", suez: "N/A", nsr: "N/A", createdBy: "Andreas Rolner", modifiedBy: "Nikhil Mathew", createdOn: "12/03/2026", modifiedOn: "16/03/2026", vesselType: "External Vessel Type", customsFiling: "Pending", agm: "Pending", armedGuards: "Pending", transitRequirements: "Pending", bunkerPlanning: "Pending" },
  { id: 2701, number: "HLG 2601", vessel: "HELGE", status: "Preplanning", operationInCharge: "Jacson Tom", tce: "$ 182.768,00", startDate: "02/01/2026", suez: "N/A", nsr: "N/A", createdBy: "Jacson Tom", modifiedBy: "Jacson Tom", createdOn: "12/03/2026", modifiedOn: "17/03/2026", vesselType: "Ocean Liner", customsFiling: "Pending", agm: "Pending", armedGuards: "Pending", transitRequirements: "Pending", bunkerPlanning: "Pending" },
  { id: 2700, number: "STE 2605", vessel: "Steller", status: "Preplanning", operationInCharge: "Adarshtestadarsh.ek@adm...", tce: "$ 188.778,00", startDate: "11/08/2042", suez: "N/A", nsr: "N/A", createdBy: "Edvin Thomas", modifiedBy: "Subin Benny", createdOn: "11/03/2026", modifiedOn: "16/03/2026", vesselType: "Bulk Carrier", customsFiling: "Pending", agm: "Pending", armedGuards: "Pending", transitRequirements: "Pending", bunkerPlanning: "Pending" },
  { id: 2699, number: "AQUA 2607", vessel: "AQUAGEMINI", status: "Preplanning", operationInCharge: "Safna Basheer", tce: "$ 71.708,00", startDate: "12/08/2027", suez: "N/A", nsr: "N/A", createdBy: "Safna Basheer", modifiedBy: "Safna Basheer", createdOn: "11/03/2026", modifiedOn: "18/03/2026", vesselType: "Bulk Carrier", customsFiling: "Pending", agm: "Pending", armedGuards: "Pending", transitRequirements: "Pending", bunkerPlanning: "Pending" },
  { id: 2698, number: "ADV 2606", vessel: "AIDADIVAN", status: "Preplanning", operationInCharge: "Adarshtestadarsh.ek@adm...", tce: "$ 11.350,00", startDate: "12/04/2027", suez: "N/A", nsr: "N/A", createdBy: "Edvin Thomas", modifiedBy: "Jacson Tom", createdOn: "11/03/2026", modifiedOn: "17/03/2026", vesselType: "Ocean Liner", customsFiling: "Pending", agm: "Pending", armedGuards: "Pending", transitRequirements: "Pending", bunkerPlanning: "Pending" },
  { id: 2697, number: "BOR 2671", vessel: "BOREALIS", status: "Preplanning", operationInCharge: "Safna Basheer", tce: "$ 5.663,00", startDate: "15/12/2038", suez: "N/A", nsr: "N/A", createdBy: "Safna Basheer", modifiedBy: "Nikhil Mathew", createdOn: "11/03/2026", modifiedOn: "19/03/2026", vesselType: "Bulk Carrier", customsFiling: "Pending", agm: "Pending", armedGuards: "Pending", transitRequirements: "Pending", bunkerPlanning: "Pending" },
  { id: 2096, number: "BOR 2670", vessel: "BOREALIS", status: "Active", operationInCharge: "Accounts Manager", tce: "$ 1.497,00", startDate: "18/01/2038", suez: "N/A", nsr: "N/A", createdBy: "Subin Benny", modifiedBy: "Nikhil Mathew", createdOn: "10/03/2026", modifiedOn: "18/03/2026", vesselType: "Bulk Carrier", customsFiling: "Pending", agm: "Pending", armedGuards: "Pending", transitRequirements: "Pending", bunkerPlanning: "Pending" },
  { id: 2695, number: "6 2601", vessel: "ASD12345", status: "Preplanning", operationInCharge: "Accounts Manager", tce: "$ 49,00", startDate: "27/11/2025", suez: "N/A", nsr: "N/A", createdBy: "Subin Benny", modifiedBy: "Nikhil Mathew", createdOn: "10/03/2026", modifiedOn: "16/03/2026", vesselType: "123", customsFiling: "Pending", agm: "Pending", armedGuards: "Pending", transitRequirements: "Pending", bunkerPlanning: "Pending" },
  { id: 2694, number: "AQUA 2606", vessel: "AQUAGEMINI", status: "Completed", operationInCharge: "Safna Basheer", tce: "$ 71.279,00", startDate: "06/08/2027", suez: "N/A", nsr: "N/A", createdBy: "Safna Basheer", modifiedBy: "Safna Basheer", createdOn: "10/03/2026", modifiedOn: "18/03/2026", vesselType: "Bulk Carrier", customsFiling: "Pending", agm: "Pending", armedGuards: "Pending", transitRequirements: "Pending", bunkerPlanning: "Pending" },
];

export function Voyage() {
  const [archived, setArchived] = useState(false);
  const [listType, setListType] = useState<"Lists" | "Trash">("Lists");
  const [selectedVoyage, setSelectedVoyage] = useState<any | null>(null);

  if (selectedVoyage) {
    return <VoyageDetail voyage={selectedVoyage} onClose={() => setSelectedVoyage(null)} />;
  }

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] w-full">
      {/* Top Tabs */}
      <div className="px-6 border-b border-gray-200 bg-[#f8f9fa]">
        <div className="flex items-center">
          <button className="py-4 px-6 text-sm font-medium text-gray-900 border-b-2 border-[#ffd700]">
            All Voyages
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#f8f9fa]">
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Input
              type="text"
              placeholder="Search"
              className="pl-3 pr-8 py-2 h-9 bg-white border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-gray-500 shadow-none text-sm"
            />
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          </div>
          
          <Button 
            className="bg-[#ffd700] hover:bg-[#e6c200] text-black font-medium h-9 px-4 gap-2 border-0 rounded"
          >
            <Plus className="size-4" />
            Add Filter
          </Button>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center bg-gray-100 rounded p-1">
            <button 
              className={`px-4 py-1 text-sm font-medium rounded ${listType === 'Lists' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setListType('Lists')}
            >
              Lists
            </button>
            <button 
              className={`px-4 py-1 text-sm font-medium rounded ${listType === 'Trash' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setListType('Trash')}
            >
              Trash
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Switch 
              checked={archived} 
              onCheckedChange={setArchived}
              className="data-[state=checked]:bg-[#ffd700]"
            />
            <span className="text-sm font-medium text-gray-600">Archived</span>
          </div>

          <Button 
            className="bg-[#ffd700] hover:bg-[#e6c200] text-black font-medium h-9 px-5 rounded border-0"
          >
            New Voyage
          </Button>

          <button className="p-1 hover:bg-gray-100 rounded text-gray-600">
            <MoreVertical className="size-5" />
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto bg-white mx-6 rounded-t-md shadow-sm border border-gray-200">
        <div className="min-w-max">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-gray-200 text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4 whitespace-nowrap cursor-pointer group hover:bg-gray-100 transition-colors w-[100px]">
                  <div className="flex items-center gap-1">
                    ID
                    <ArrowDown className="size-3 text-gray-400 group-hover:text-gray-700" />
                  </div>
                </th>
                <th className="px-6 py-4 whitespace-nowrap w-[150px]">Number</th>
                <th className="px-6 py-4 whitespace-nowrap w-[180px]">Vessel</th>
                <th className="px-6 py-4 whitespace-nowrap w-[150px]">Status</th>
                <th className="px-6 py-4 whitespace-nowrap w-[200px]">Operation in Charge</th>
                <th className="px-6 py-4 whitespace-nowrap w-[150px]">TCE</th>
                <th className="px-6 py-4 whitespace-nowrap w-[120px]">Start Date</th>
                <th className="px-6 py-4 whitespace-nowrap w-[150px]">Suez Canal Rebate</th>
                <th className="px-6 py-4 whitespace-nowrap w-[120px]">NSR Permit</th>
                <th className="px-6 py-4 whitespace-nowrap w-[180px]">Created By</th>
                <th className="px-6 py-4 whitespace-nowrap w-[180px]">Modified By</th>
                <th className="px-6 py-4 whitespace-nowrap w-[120px]">Created On</th>
                <th className="px-6 py-4 whitespace-nowrap w-[120px]">Modified On</th>
                <th className="px-6 py-4 whitespace-nowrap w-[180px]">Vessel Type</th>
                <th className="px-6 py-4 whitespace-nowrap w-[150px]">Customs Filing</th>
                <th className="px-6 py-4 whitespace-nowrap w-[120px]">AGM</th>
                <th className="px-6 py-4 whitespace-nowrap w-[150px]">Armed Guards</th>
                <th className="px-6 py-4 whitespace-nowrap w-[200px]">Transit Requirements</th>
                <th className="px-6 py-4 whitespace-nowrap w-[180px]">Bunker Planning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[13px] text-gray-700 bg-white">
              {VOYAGE_DATA.map((row) => (
                <tr 
                  key={row.id} 
                  className="hover:bg-gray-50 transition-colors group cursor-pointer"
                  onClick={() => setSelectedVoyage(row)}
                >
                  <td className="px-6 py-3.5 whitespace-nowrap">{row.id}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap">{row.number}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap">{row.vessel}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap">{row.status}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap truncate max-w-[200px]" title={row.operationInCharge}>{row.operationInCharge}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap">{row.tce}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap">{row.startDate}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap">{row.suez}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap">{row.nsr}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap truncate max-w-[180px]" title={row.createdBy}>{row.createdBy}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap truncate max-w-[180px]" title={row.modifiedBy}>{row.modifiedBy}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap">{row.createdOn}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap">{row.modifiedOn}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap truncate max-w-[180px]">{row.vesselType}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap">{row.customsFiling}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap">{row.agm}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap">{row.armedGuards}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap">{row.transitRequirements}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap">{row.bunkerPlanning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer / Pagination */}
      <div className="h-14 px-6 border-t border-gray-200 bg-white flex items-center justify-between text-xs text-gray-500">
        <div>
          Found <span className="font-medium text-gray-900">1821</span> records
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <button className="p-1 hover:bg-gray-100 rounded text-gray-400 disabled:opacity-50">
              <ChevronLeft className="size-4" />
            </button>
            <span>Page 1 of 73</span>
            <button className="p-1 hover:bg-gray-100 rounded text-gray-600">
              <ChevronRight className="size-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <button className="flex items-center gap-1 font-medium text-gray-700 hover:bg-gray-50 px-2 py-1 rounded border-b border-gray-300">
              25
              <ChevronDown className="size-3 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
