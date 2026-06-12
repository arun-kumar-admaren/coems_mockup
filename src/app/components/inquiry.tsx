import React, { useState } from "react";
import { Search, Plus, MoreVertical, ChevronLeft, ChevronRight, MessageSquare, LayoutGrid } from "lucide-react";
import { Input } from "./ui/input";
import { InquiryDetail } from "./inquiry-detail";

// Mock data based on the screenshot
const mockData = [
  { id: 4016, cargoNumber: "CR-2026-272", name: "Cargo sf 123456", indicationType: "GENCON fios", unitNumber: 20, description: "tesyuysdgjhgjczxbv,mzx...", totalVolume: 40, totalWeight: 50 },
  { id: 4015, cargoNumber: "CR-2026-271", name: "Test", indicationType: "", unitNumber: 0, description: "", totalVolume: 9, totalWeight: 8 },
  { id: 4014, cargoNumber: "CR-2026-270", name: "Test", indicationType: "HEAVYCON 2007", unitNumber: 0, description: "", totalVolume: 9, totalWeight: 8 },
  { id: 4007, cargoNumber: "CR-2026-263", name: "test", indicationType: "HEAVYLIFTVOY FOR CRANE ...", unitNumber: 0, description: "", totalVolume: 200, totalWeight: 100 },
  { id: 4006, cargoNumber: "CR-2026-262", name: "test Nvm", indicationType: "", unitNumber: 0, description: "", totalVolume: 200, totalWeight: 300 },
  { id: 4001, cargoNumber: "CR-2026-257", name: "test", indicationType: "HEAVYCON 2007", unitNumber: 0, description: "", totalVolume: 300, totalWeight: 400 },
  { id: 3985, cargoNumber: "CR-2026-241", name: "asd fixture", indicationType: "", unitNumber: 0, description: "", totalVolume: 5, totalWeight: 6 },
  { id: 3976, cargoNumber: "CR-2026-232", name: "test_26_02", indicationType: "", unitNumber: 0, description: "", totalVolume: 10, totalWeight: 20 },
  { id: 3975, cargoNumber: "CR-2026-231", name: "asd test cargo", indicationType: "GENCON fios", unitNumber: 390, description: "", totalVolume: 66, totalWeight: 481 },
  { id: 3958, cargoNumber: "CR-2026-214", name: "asd", indicationType: "HEAVYCON 2007", unitNumber: 0, description: "", totalVolume: 234, totalWeight: 342 },
  { id: 3957, cargoNumber: "CR-2026-213", name: "awef", indicationType: "HEAVYCON 2007", unitNumber: 0, description: "", totalVolume: 345, totalWeight: 353 },
  { id: 3956, cargoNumber: "CR-2026-212", name: "asd", indicationType: "HEAVYCON 2007", unitNumber: 0, description: "", totalVolume: 12, totalWeight: 12 },
  { id: 3948, cargoNumber: "CR-2026-204", name: "asd", indicationType: "HEAVYLIFTVOY", unitNumber: 0, description: "", totalVolume: 21, totalWeight: 23 },
  { id: 3947, cargoNumber: "CR-2026-203", name: "asd new fixture", indicationType: "", unitNumber: 0, description: "", totalVolume: 232, totalWeight: 1.244 },
  { id: 3943, cargoNumber: "CR-2026-199", name: "Fixture test", indicationType: "", unitNumber: 52, description: "", totalVolume: 757, totalWeight: 78.578 },
  { id: 3932, cargoNumber: "CR-2026-188", name: "Regression Test Voyage Inq...", indicationType: "", unitNumber: 0, description: "", totalVolume: 40, totalWeight: 20 },
  { id: 3930, cargoNumber: "CR-2026-186", name: "ASD CARGO", indicationType: "GENCON fios", unitNumber: 567, description: "", totalVolume: 567, totalWeight: 567 },
  { id: 3929, cargoNumber: "CR-2026-185", name: "ASD CARGO", indicationType: "GENCON fios", unitNumber: 567, description: "", totalVolume: 567, totalWeight: 567 },
];

export function Inquiry() {
  const [activeOwnerFilter, setActiveOwnerFilter] = useState("Mine");
  const [activeTypeFilter, setActiveTypeFilter] = useState("Inquiry");
  const [activeStatusFilter, setActiveStatusFilter] = useState("List");
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between p-4 bg-[#f8f9fa] border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search" 
              className="pl-2 pr-8 py-1.5 bg-transparent border-b border-gray-300 focus:outline-none focus:border-gray-500 text-sm w-64 placeholder:text-gray-500"
            />
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
          </div>
          <button className="flex items-center gap-2 bg-[#fde047] hover:bg-[#facc15] text-gray-900 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
            <Plus className="size-4" />
            Add Filter
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Toggle Group 1 */}
          <div className="flex bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm">
            {["Mine", "Office", "All"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveOwnerFilter(tab)}
                className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeOwnerFilter === tab 
                    ? "bg-gray-100 text-gray-900" 
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Toggle Group 2 */}
          <div className="flex bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm">
            {["Inquiry", "Indicated", "All"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTypeFilter(tab)}
                className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeTypeFilter === tab 
                    ? "text-gray-900 bg-white" 
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Toggle Group 3 */}
          <div className="flex bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm">
            {["List", "Trash"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveStatusFilter(tab)}
                className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeStatusFilter === tab 
                    ? "bg-gray-100 text-gray-900" 
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button className="bg-[#fde047] hover:bg-[#facc15] text-gray-900 px-4 py-1.5 rounded-md text-sm font-medium shadow-sm transition-colors">
            New Inquiry
          </button>

          <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-md transition-colors">
            <MoreVertical className="size-5" />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto">
        <table className="w-full min-w-[1200px] border-collapse text-sm">
          <thead className="sticky top-0 bg-white shadow-sm z-10">
            <tr className="text-left text-xs font-semibold text-gray-500 border-b border-gray-200">
              <th className="py-4 px-6 font-medium tracking-wider uppercase w-24">ID</th>
              <th className="py-4 px-6 font-medium tracking-wider uppercase">CARGO NUMBER</th>
              <th className="py-4 px-6 font-medium tracking-wider uppercase">NAME</th>
              <th className="py-4 px-6 font-medium tracking-wider uppercase">INDICATION TYPE</th>
              <th className="py-4 px-6 font-medium tracking-wider uppercase">UNIT NUMBER</th>
              <th className="py-4 px-6 font-medium tracking-wider uppercase">DESCRIPTION</th>
              <th className="py-4 px-6 font-medium tracking-wider uppercase">TOTAL VOLUME</th>
              <th className="py-4 px-6 font-medium tracking-wider uppercase">TOTAL WEIGHT</th>
              <th className="py-4 px-6 w-12 text-center">
                <LayoutGrid className="size-4 inline-block text-gray-400" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y border-t border-gray-100 divide-gray-100">
            {mockData.map((row) => (
              <tr 
                key={row.id} 
                className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                onClick={() => setSelectedInquiry(row)}
              >
                <td className="py-3 px-6 text-gray-600">{row.id}</td>
                <td className="py-3 px-6 text-gray-900">{row.cargoNumber}</td>
                <td className="py-3 px-6 text-gray-900">{row.name}</td>
                <td className="py-3 px-6 text-gray-600 uppercase text-xs">{row.indicationType}</td>
                <td className="py-3 px-6 text-gray-600">{row.unitNumber}</td>
                <td className="py-3 px-6 text-gray-500 truncate max-w-[200px]" title={row.description}>{row.description}</td>
                <td className="py-3 px-6 text-gray-900">{row.totalVolume}</td>
                <td className="py-3 px-6 text-gray-900">{row.totalWeight}</td>
                <td className="py-3 px-6 text-center"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 bg-white border-t border-gray-200 text-xs text-gray-500 sticky bottom-0">
        <div>Found 287 records</div>
        
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span>Items per page:</span>
            <select className="bg-transparent border-none outline-none font-medium text-gray-700 cursor-pointer">
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
          
          <div className="flex items-center gap-4">
            <span>1 – 25 of 287</span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded hover:bg-gray-100 text-gray-400 disabled:opacity-50">
                <ChevronLeft className="size-4" />
              </button>
              <button className="p-1 rounded hover:bg-gray-100 text-gray-600">
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="absolute bottom-16 right-6 bg-slate-500 hover:bg-slate-600 text-white p-3 rounded-md shadow-lg transition-transform hover:scale-105 active:scale-95">
        <MessageSquare className="size-5" fill="currentColor" />
      </button>

      {/* Detail Overlay */}
      {selectedInquiry && (
        <InquiryDetail 
          inquiry={selectedInquiry} 
          onClose={() => setSelectedInquiry(null)} 
        />
      )}
    </div>
  );
}