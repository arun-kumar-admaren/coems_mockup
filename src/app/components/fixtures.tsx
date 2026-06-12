import React, { useState } from "react";
import { Search, Plus, MoreVertical, ChevronLeft, ChevronRight, ChevronDown, ArrowDown } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FixtureDetail } from "./fixture-detail";

const FIXTURES_DATA = [
  { id: 4122, number: "AEW-F-2026-407", vessel: "HLS DIAMOND", status: "Fixed", charterer: "Global Shipping Co", laycan: "15/05/2026 - 20/05/2026", loadPort: "Durban", dischargePort: "Luanda", freightRate: "$ 45.50/mt", cargo: "Steel Coils", createdBy: "Jacson Tom", createdOn: "18/03/2026", modifiedOn: "23/03/2026" },
  { id: 4121, number: "FIX-2604", vessel: "HELGE", status: "Pending", charterer: "Nordic Transport", laycan: "01/06/2026 - 10/06/2026", loadPort: "Houston", dischargePort: "Rotterdam", freightRate: "$ 28.00/mt", cargo: "Grains", createdBy: "Jacson Tom", createdOn: "17/03/2026", modifiedOn: "19/03/2026" },
  { id: 4120, number: "FIX-2603", vessel: "HLS DIAMOND", status: "Completed", charterer: "East Asia Traders", laycan: "10/04/2026 - 15/04/2026", loadPort: "Shanghai", dischargePort: "Los Angeles", freightRate: "$ 55.20/mt", cargo: "Machinery", createdBy: "Aiswarya Admaren", createdOn: "15/03/2026", modifiedOn: "20/03/2026" },
  { id: 4119, number: "FIX-2602", vessel: "HELGE", status: "Fixed", charterer: "Mediterranean Lines", laycan: "22/05/2026 - 28/05/2026", loadPort: "Genoa", dischargePort: "Alexandria", freightRate: "$ 18.75/mt", cargo: "Fertilizer", createdBy: "Jacson Tom", createdOn: "12/03/2026", modifiedOn: "14/03/2026" },
  { id: 4118, number: "FIX-2601", vessel: "saa_ZEAL LUMOS", status: "Pending", charterer: "Pacific Bulk", laycan: "05/07/2026 - 15/07/2026", loadPort: "Newcastle", dischargePort: "Qingdao", freightRate: "$ 12.50/mt", cargo: "Coal", createdBy: "Andreas Rolner", createdOn: "10/03/2026", modifiedOn: "16/03/2026" },
  { id: 4117, number: "FIX-2600", vessel: "Steller", status: "Fixed", charterer: "Atlantic Resources", laycan: "11/08/2026 - 20/08/2026", loadPort: "Santos", dischargePort: "Rotterdam", freightRate: "$ 24.30/mt", cargo: "Sugar", createdBy: "Edvin Thomas", createdOn: "09/03/2026", modifiedOn: "16/03/2026" },
  { id: 4116, number: "FIX-2599", vessel: "AQUAGEMINI", status: "Completed", charterer: "Global Shipping Co", laycan: "01/03/2026 - 05/03/2026", loadPort: "Durban", dischargePort: "Mogadishu", freightRate: "$ 32.10/mt", cargo: "Wheat", createdBy: "Safna Basheer", createdOn: "25/02/2026", modifiedOn: "10/03/2026" },
  { id: 4115, number: "FIX-2598", vessel: "AIDADIVAN", status: "Fixed", charterer: "Nordic Transport", laycan: "15/04/2026 - 22/04/2026", loadPort: "Bremerhaven", dischargePort: "New York", freightRate: "$ 48.00/mt", cargo: "Vehicles", createdBy: "Edvin Thomas", createdOn: "05/03/2026", modifiedOn: "12/03/2026" },
  { id: 4114, number: "FIX-2597", vessel: "BOREALIS", status: "Pending", charterer: "Mediterranean Lines", laycan: "10/06/2026 - 18/06/2026", loadPort: "Barcelona", dischargePort: "Istanbul", freightRate: "$ 21.40/mt", cargo: "Steel Billets", createdBy: "Safna Basheer", createdOn: "01/03/2026", modifiedOn: "08/03/2026" },
  { id: 4113, number: "FIX-2596", vessel: "BOREALIS", status: "Completed", charterer: "Pacific Bulk", laycan: "15/01/2026 - 25/01/2026", loadPort: "Vancouver", dischargePort: "Tokyo", freightRate: "$ 29.50/mt", cargo: "Lumber", createdBy: "Subin Benny", createdOn: "10/12/2025", modifiedOn: "30/01/2026" },
];

export function Fixtures() {
  const [listType, setListType] = useState<"Lists" | "Trash">("Lists");
  const [selectedFixture, setSelectedFixture] = useState<any | null>(null);

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] w-full relative">
      {/* Top Tabs */}
      <div className="px-6 border-b border-gray-200 bg-[#f8f9fa]">
        <div className="flex items-center gap-6">
          <button 
            className={`py-4 text-sm font-medium border-b-2 ${listType === "Lists" ? "border-[#ffd700] text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            onClick={() => setListType("Lists")}
          >
            Lists
          </button>
          <button 
            className={`py-4 text-sm font-medium border-b-2 ${listType === "Trash" ? "border-[#ffd700] text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            onClick={() => setListType("Trash")}
          >
            Trash
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#f8f9fa]">
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 size-4 text-gray-400" />
            <Input 
              placeholder="Search..." 
              className="pl-9 bg-white border-gray-200 h-9 text-sm focus-visible:ring-1 focus-visible:ring-[#ffd700]"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-9 border-gray-200 bg-white text-gray-700 font-medium">
            Reports
          </Button>
          <Button size="sm" className="h-9 bg-[#111827] hover:bg-[#1f2937] text-white font-medium px-4 flex items-center gap-2">
            <Plus className="size-4" />
            New Fixture
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto bg-white border-y border-gray-200">
        <div className="min-w-max w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-gray-200 text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4 whitespace-nowrap cursor-pointer group hover:bg-gray-100 transition-colors w-[100px]">
                  <div className="flex items-center gap-1">
                    ID
                    <ArrowDown className="size-3 text-gray-400 group-hover:text-gray-700" />
                  </div>
                </th>
                <th className="px-6 py-4 whitespace-nowrap w-[150px]">Fixture No</th>
                <th className="px-6 py-4 whitespace-nowrap w-[180px]">Vessel</th>
                <th className="px-6 py-4 whitespace-nowrap w-[150px]">Status</th>
                <th className="px-6 py-4 whitespace-nowrap w-[200px]">Charterer</th>
                <th className="px-6 py-4 whitespace-nowrap w-[150px]">Cargo</th>
                <th className="px-6 py-4 whitespace-nowrap w-[180px]">Laycan</th>
                <th className="px-6 py-4 whitespace-nowrap w-[150px]">Load Port</th>
                <th className="px-6 py-4 whitespace-nowrap w-[150px]">Discharge Port</th>
                <th className="px-6 py-4 whitespace-nowrap w-[150px]">Freight Rate</th>
                <th className="px-6 py-4 whitespace-nowrap w-[180px]">Created By</th>
                <th className="px-6 py-4 whitespace-nowrap w-[120px]">Created On</th>
                <th className="px-6 py-4 whitespace-nowrap w-[120px]">Modified On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[13px] text-gray-700 bg-white">
              {FIXTURES_DATA.map((row) => (
                <tr 
                  key={row.id} 
                  className="hover:bg-gray-50 transition-colors group cursor-pointer"
                  onClick={() => setSelectedFixture(row)}
                >
                  <td className="px-6 py-3.5 whitespace-nowrap">{row.id}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap font-medium text-[#111827]">{row.number}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap">{row.vessel}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
                      row.status === "Fixed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                      row.status === "Pending" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                      "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap truncate max-w-[200px]" title={row.charterer}>{row.charterer}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap">{row.cargo}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap">{row.laycan}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap">{row.loadPort}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap">{row.dischargePort}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap">{row.freightRate}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap truncate max-w-[180px]" title={row.createdBy}>{row.createdBy}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap">{row.createdOn}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap">{row.modifiedOn}</td>
                </tr>
              ))}
              {FIXTURES_DATA.length === 0 && (
                <tr>
                  <td colSpan={13} className="px-6 py-8 text-center text-gray-500">
                    No fixtures found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer / Pagination */}
      <div className="h-14 px-6 border-t border-gray-200 bg-white flex items-center justify-between text-xs text-gray-500 shrink-0">
        <div>
          Found <span className="font-medium text-gray-900">{FIXTURES_DATA.length}</span> records
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <button className="p-1 hover:bg-gray-100 rounded text-gray-400 disabled:opacity-50" disabled>
              <ChevronLeft className="size-4" />
            </button>
            <span>Page 1 of 1</span>
            <button className="p-1 hover:bg-gray-100 rounded text-gray-400 disabled:opacity-50" disabled>
              <ChevronRight className="size-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <button className="flex items-center gap-1 border border-gray-200 rounded px-2 py-1 hover:bg-gray-50 bg-white">
              10
              <ChevronDown className="size-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Overlay */}
      {selectedFixture && (
        <FixtureDetail fixture={selectedFixture} onClose={() => setSelectedFixture(null)} />
      )}
    </div>
  );
}