import React, { useState } from "react";
import { MoreVertical, EyeOff, RefreshCw, Mail, X, ChevronRight, Trash2, Plus, Info, MessageSquare } from "lucide-react";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { DatePicker } from "./ui/date-picker";
import { Label } from "./ui/label";
import { LegalReviewEmbedded } from "./legal-review-embedded";
import { InsuranceEmbedded } from "./insurance-embedded";

interface FixtureDetailProps {
  fixture: any;
  onClose: () => void;
  defaultTab?: string;
}

export function FixtureDetail({ fixture, onClose, defaultTab = "Overview" }: FixtureDetailProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  const tabs = [
    "Overview", "Fixture", "Chartering", "Accounting", "Port calls", "HSEQ/Rating", "Handover", "Estimates", "Legal Review", "Insurance"
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/5 z-40 animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 w-full max-w-[850px] bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.1)] z-50 flex flex-col font-sans animate-in slide-in-from-right duration-300">
        {/* Top Action Bar */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-gray-200 text-gray-400 shrink-0">
        <div className="flex items-center gap-4">
          <button className="hover:text-gray-700 hover:bg-gray-100 p-1 rounded transition-colors"><MoreVertical className="size-4" /></button>
          <button className="hover:text-gray-700 hover:bg-gray-100 p-1 rounded transition-colors"><EyeOff className="size-4" /></button>
          <button className="hover:text-gray-700 hover:bg-gray-100 p-1 rounded transition-colors"><RefreshCw className="size-4" /></button>
          <button className="hover:text-gray-700 hover:bg-gray-100 p-1 rounded transition-colors"><Mail className="size-4" /></button>
        </div>
        <button onClick={onClose} className="hover:text-gray-900 hover:bg-gray-100 p-1.5 rounded transition-colors">
          <X className="size-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Header Summary */}
        <div className="p-6">
          <div className="text-sm text-gray-500 mb-1">Fixture No:</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{fixture?.number || "AEW-F-2026-407"}</h1>

          <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-[13px]">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="flex">
                <span className="text-gray-500 w-28 shrink-0">Cargo Name</span>
                <span className="text-gray-400 mx-2">:</span>
                <span className="text-gray-900 font-medium truncate">NCK_Unemployed Days ch...</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 w-28 shrink-0">Account</span>
                <span className="text-gray-400 mx-2">:</span>
                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">1 Head Account</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 w-28 shrink-0">Vessel</span>
                <span className="text-gray-400 mx-2">:</span>
                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">HLS DIAMOND</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 w-28 shrink-0">Ports</span>
                <span className="text-gray-400 mx-2">:</span>
                <div className="text-gray-900 font-medium leading-tight">
                  <div>Durban (L)</div>
                  <div>Luanda (D)</div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="flex">
                <span className="text-gray-500 w-28 shrink-0">Fixture Status</span>
                <span className="text-gray-400 mx-2">:</span>
                <span className="text-gray-900 font-medium">Loaded</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 w-28 shrink-0">Charter Signed</span>
                <span className="text-gray-400 mx-2">:</span>
                <span className="bg-[#e11d48] text-white px-2 py-0.5 rounded text-xs font-medium">No</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 w-28 shrink-0">Invoice Status</span>
                <span className="text-gray-400 mx-2">:</span>
                <span className="bg-[#fbbf24] text-white px-2 py-0.5 rounded text-xs font-medium">To Be Issued</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 w-28 shrink-0">Modified By</span>
                <span className="text-gray-400 mx-2">:</span>
                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium text-xs">Jacson Tom</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 w-28 shrink-0">Created By</span>
                <span className="text-gray-400 mx-2">:</span>
                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium text-xs">Jacson Tom</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-gray-200">
          <div className="flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-[13px] font-medium transition-colors relative ${
                  activeTab === tab
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ffd700]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content - Overview */}
        {activeTab === "Overview" && (
          <div className="p-6 space-y-8 text-[13px]">
            {/* Overview Section */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Overview</h3>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-gray-400 mb-1">Cargo Name</div>
                  <div className="text-gray-900 font-medium">NCK_Unemployed Days check 4</div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Account</div>
                  <div className="text-gray-900 font-medium">1 Head Account</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-gray-400 mb-1">Cargo Description</div>
                <div className="text-gray-900 font-medium">None</div>
              </div>
            </div>

            {/* Vessel Details Section */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Vessel Details</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <div className="text-gray-400 mb-1">Intended Vessel Type</div>
                  <div className="text-gray-900 font-medium">None</div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Intended Vessel</div>
                  <div className="text-gray-900 font-medium">None</div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Voyage No</div>
                  <div className="text-gray-900 font-medium">HLSD 2604</div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Final Performer</div>
                  <div className="text-gray-900 font-medium">HLS DIAMOND</div>
                </div>
              </div>
            </div>

            {/* Port of Loading Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Port of Loading</h3>
                <button className="text-gray-500 hover:text-gray-900"><Plus className="size-4" /></button>
              </div>
              <div className="bg-gray-50 rounded-md p-3 flex items-center justify-between border border-gray-100 group">
                <div className="flex items-center gap-2">
                  <ChevronRight className="size-4 text-gray-400" />
                  <span className="text-gray-900 font-medium">Durban (South Afr...</span>
                </div>
                <div className="flex items-center gap-16">
                  <span className="text-gray-600">L/C: 01/02/2026 - 27/03/2026</span>
                  <span className="text-gray-600 w-16">8 days</span>
                  <span className="text-gray-900 font-medium w-28 text-right">$ 133.900.000</span>
                  <button className="text-gray-400 hover:text-gray-700 ml-4"><Trash2 className="size-4" /></button>
                </div>
              </div>
            </div>

            {/* Port of Discharge Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Port of Discharge</h3>
                <button className="text-gray-500 hover:text-gray-900"><Plus className="size-4" /></button>
              </div>
              <div className="bg-gray-50 rounded-md p-3 flex items-center justify-between border border-gray-100 group">
                <div className="flex items-center gap-2">
                  <ChevronRight className="size-4 text-gray-400" />
                  <span className="text-gray-900 font-medium">Luanda (Angola)</span>
                </div>
                <div className="flex items-center gap-16">
                  <span className="text-gray-600">LA: 09/03/2026</span>
                  <span className="text-gray-600 w-16">8 days</span>
                  <span className="text-gray-900 font-medium w-28 text-right">$ 0</span>
                  <button className="text-gray-400 hover:text-gray-700 ml-4"><Trash2 className="size-4" /></button>
                </div>
              </div>
            </div>

            {/* Freight Details Section */}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">Freight Details</h3>
                <Info className="size-4 text-gray-400" />
                <Switch className="ml-2 data-[state=checked]:bg-[#ffd700]" defaultChecked />
              </div>
            </div>

            {/* Sell Out Details Section */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Sell Out Details</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <div className="text-gray-400 mb-1">Freight Calc Type</div>
                  <div className="text-gray-900 font-medium">Lumpsum</div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Freight Currency</div>
                  <div className="text-gray-900 font-medium">US Dollar ($)</div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Freight Rate</div>
                  <div className="text-gray-900 font-medium">$ 6.214.721.563</div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Gross Amount</div>
                  <div className="text-gray-900 font-medium">$ 6.214.721.563</div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <div>
                <div className="text-gray-400 mb-1">Transit Requirements</div>
                <div className="text-gray-900 font-medium">None</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Comments</div>
                <div className="text-gray-900 font-medium">None</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Payment Terms</div>
                <div className="text-gray-900 font-medium">None</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content - Legal Review */}
        {activeTab === "Legal Review" && (
          <LegalReviewEmbedded moduleType="Fixture" moduleId={fixture?.number ?? "AEW-F-2026-407"} />
        )}

        {/* Tab Content - Insurance */}
        {activeTab === "Insurance" && (
          <InsuranceEmbedded moduleType="Fixture" moduleId={fixture?.number ?? "AEW-F-2026-407"} />
        )}
      </div>

        <button className="absolute bottom-6 right-6 bg-slate-600 hover:bg-slate-700 text-white p-3 rounded shadow-lg transition-transform hover:scale-105 active:scale-95">
          <MessageSquare className="size-5" fill="currentColor" />
        </button>
      </div>
    </>
  );
}
