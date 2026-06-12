import React, { useState } from "react";
import { MoreVertical, X, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { DatePicker } from "./ui/date-picker";
import { Label } from "./ui/label";
import { LegalReviewEmbedded } from "./legal-review-embedded";

interface InquiryDetailProps {
  inquiry: any;
  onClose: () => void;
  defaultTab?: string;
}

export function InquiryDetail({ inquiry, onClose, defaultTab = "Cargo" }: InquiryDetailProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const tabs = [
    "Cargo", "Chartering", "Client", "Port Calls", "Voyage", "General Details", "Accounting", "Indications", "Voyage Estimates", "Legal Review"
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
          <button className="hover:text-gray-700 hover:bg-gray-100 p-1 rounded transition-colors">
            <MoreVertical className="size-5" />
          </button>
          <button onClick={onClose} className="hover:text-gray-900 hover:bg-gray-100 p-1.5 rounded transition-colors">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-24">
          {/* Header Summary */}
          <div className="p-6">
            <div className="grid grid-cols-2 gap-x-12">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">CARGO NO</div>
                  <h1 className="text-xl font-bold text-gray-900">{inquiry?.cargoNumber || "CR-2026-272"}</h1>
                </div>
                <div className="flex items-center text-[13px]">
                  <span className="text-gray-500 w-32 shrink-0">Account</span>
                  <span className="text-gray-400 mx-2">:</span>
                  <span className="text-gray-900 font-medium">2 Account</span>
                </div>
                <div className="flex items-center text-[13px]">
                  <span className="text-gray-500 w-32 shrink-0">Intended Vessel</span>
                  <span className="text-gray-400 mx-2">:</span>
                  <span className="text-gray-900 font-medium uppercase">CARNIVAL LUMINOSA</span>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3 pt-2 text-[13px]">
                <div className="flex items-center">
                  <span className="text-gray-500 w-24 shrink-0">Created By</span>
                  <span className="text-gray-400 mx-2">:</span>
                  <span className="bg-gray-200 px-2 py-0.5 rounded text-gray-700 font-medium">Nikhil Mathew</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 w-24 shrink-0">Created On</span>
                  <span className="text-gray-400 mx-2">:</span>
                  <span className="text-gray-900 font-medium">04/03/2026</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 w-24 shrink-0">Modified By</span>
                  <span className="text-gray-400 mx-2">:</span>
                  <span className="bg-gray-200 px-2 py-0.5 rounded text-gray-700 font-medium">Nikhil Mathew</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 w-24 shrink-0">Modified On</span>
                  <span className="text-gray-400 mx-2">:</span>
                  <span className="text-gray-900 font-medium">04/03/2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6 border-b border-gray-200">
            <div className="flex space-x-6 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-[13px] font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === tab
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#facc15]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content - Cargo */}
          {activeTab === "Cargo" && (
            <div className="p-6 space-y-8 text-[13px]">
              
              {/* Indication Type */}
              <div>
                <div className="text-gray-400 mb-1">Indication Type</div>
                <div className="text-gray-900 font-medium">GENCON fios</div>
              </div>

              {/* Cargo Details */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4 text-sm">Cargo Details</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <div className="text-gray-400 mb-1">Cargo Name</div>
                    <div className="text-gray-900 font-medium">{inquiry?.name || "Cargo sf 123456"}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Cargo Description</div>
                    <div className="text-gray-900 font-medium">{inquiry?.description || "tesyuysdgjhgjczxbv,mzx...", "mzxvkbnckxbvnb kv"}</div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-6">
                  <div>
                    <div className="text-gray-400 mb-1">Unit/Number</div>
                    <div className="text-gray-900 font-medium">{inquiry?.unitNumber || "20"} nos.</div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Total Volume</div>
                    <div className="text-gray-900 font-medium">{inquiry?.totalVolume || "40"} cbm</div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Total Weight</div>
                    <div className="text-gray-900 font-medium">{inquiry?.totalWeight || "50"} mts</div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Freight Ton</div>
                    <div className="text-gray-900 font-medium">1,000 frts</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-8 mt-6">
                  <div>
                    <div className="text-gray-400 mb-1">Cargo Type</div>
                    <div className="text-gray-900 font-medium">Breakbulk / Generals</div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Cargo Type Subcategory</div>
                    <div className="text-gray-900 font-medium">container cargo</div>
                  </div>
                </div>
              </div>

              {/* Freight Details */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4 text-sm">Freight Details</h3>
                
                <div className="mb-6">
                  <div className="text-gray-400 mb-3">Freight Calc Type</div>
                  <div className="flex items-center gap-6">
                    {['Lumpsum', 'Units', 'Volume', 'Weight', 'Freight Ton'].map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer group">
                        <div className={`size-4 rounded-full border flex items-center justify-center ${type === 'Volume' ? 'border-[#facc15]' : 'border-gray-400 group-hover:border-gray-500'}`}>
                          {type === 'Volume' && <div className="size-2 rounded-full bg-[#facc15]" />}
                        </div>
                        <span className="text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-8 mb-6">
                  <div>
                    <div className="text-gray-400 mb-1">Freight Currency</div>
                    <div className="text-gray-900 font-medium">US Dollar</div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Freight Rate</div>
                    <div className="text-gray-900 font-medium">$ 20,000</div>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-gray-700">Gross Amount: </span>
                  <span className="text-gray-900 font-medium">$ 800,000</span>
                </div>

                <div className="mb-6">
                  <div className="text-gray-400 mb-1">Transit Requirements</div>
                  <div className="text-gray-900 font-medium">None</div>
                </div>

                <div className="grid grid-cols-2 gap-x-8">
                  <div>
                    <div className="text-gray-400 mb-1">Payment Terms</div>
                    <div className="text-gray-900 font-medium">jhdaaoasfioashfioaifiiigtyyjuuy</div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Freight Payment Schedule</div>
                    <div className="text-gray-900 font-medium">dffkldsjgvlidshglsfhgghhfhj</div>
                  </div>
                </div>
              </div>

              {/* Cargo Dimensions */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4 text-sm">Cargo Dimensions</h3>
                
                <button className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-800 font-medium rounded-md mb-6">
                  Add Cargo Dimensions
                </button>

                <div className="space-y-6">
                  {/* Cargo 1 */}
                  <fieldset className="border border-gray-200 rounded-md p-5 relative">
                    <legend className="px-2 text-xs text-gray-500 font-medium ml-2 bg-white">Cargo 1</legend>
                    <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
                      <Trash2 className="size-4" />
                    </button>
                    
                    <div className="grid grid-cols-3 gap-6 mb-6 pr-8">
                      <div>
                        <div className="text-gray-400 mb-1 text-xs">Cargo Name</div>
                        <div className="text-gray-900 font-medium">asd</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1 text-xs">Stowage</div>
                        <div className="text-gray-900 font-medium">Both</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1 text-xs">Stackable</div>
                        <div className="text-gray-900 font-medium">No</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-4 border-t border-gray-100 pt-4">
                      <div>
                        <div className="text-gray-400 mb-1 text-xs">Length</div>
                        <div className="text-gray-900 font-medium">23 m</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1 text-xs">Breadth</div>
                        <div className="text-gray-900 font-medium">234 m</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1 text-xs">Height</div>
                        <div className="text-gray-900 font-medium">435 m</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1 text-xs">Volume</div>
                        <div className="text-gray-900 font-medium">2,341,170 cbm</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1 text-xs">Weight</div>
                        <div className="text-gray-900 font-medium">34 mts</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1 text-xs">No of Units</div>
                        <div className="text-gray-900 font-medium">435 nos</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1 text-xs">Sqm</div>
                        <div className="text-gray-900 font-medium">4 m²</div>
                      </div>
                    </div>
                  </fieldset>

                  {/* Cargo 2 */}
                  <fieldset className="border border-gray-200 rounded-md p-5 relative">
                    <legend className="px-2 text-xs text-gray-500 font-medium ml-2 bg-white">Cargo 2</legend>
                    <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
                      <Trash2 className="size-4" />
                    </button>
                    
                    <div className="grid grid-cols-3 gap-6 mb-6 pr-8">
                      <div>
                        <div className="text-gray-400 mb-1 text-xs">Cargo Name</div>
                        <div className="text-gray-900 font-medium">asd</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1 text-xs">Stowage</div>
                        <div className="text-gray-900 font-medium">Both</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1 text-xs">Stackable</div>
                        <div className="text-gray-900 font-medium">No</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-4 border-t border-gray-100 pt-4">
                      <div>
                        <div className="text-gray-400 mb-1 text-xs">Length</div>
                        <div className="text-gray-900 font-medium">7 m</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1 text-xs">Breadth</div>
                        <div className="text-gray-900 font-medium">23 m</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1 text-xs">Height</div>
                        <div className="text-gray-900 font-medium">435 m</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1 text-xs">Volume</div>
                        <div className="text-gray-900 font-medium">70,035 cbm</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1 text-xs">Weight</div>
                        <div className="text-gray-900 font-medium">34 mts</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1 text-xs">No of Units</div>
                        <div className="text-gray-900 font-medium">435 nos</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1 text-xs">Sqm</div>
                        <div className="text-gray-900 font-medium">4 m²</div>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>

            </div>
          )}

          {/* Tab Content - Legal Review */}
          {activeTab === "Legal Review" && (
            <LegalReviewEmbedded moduleType="Inquiry" moduleId={inquiry?.cargoNumber ?? "CR-2026-272"} />
          )}
        </div>

        {/* Floating Action Button */}
        <button className="absolute bottom-6 right-6 bg-slate-500 hover:bg-slate-600 text-white size-10 flex items-center justify-center rounded-md shadow-lg transition-transform hover:scale-105 active:scale-95">
          <span className="font-bold text-lg">!</span>
        </button>
      </div>
    </>
  );
}