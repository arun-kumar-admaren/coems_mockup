import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Search, ChevronDown, FileSearch, MoreVertical } from "lucide-react";
import { Claim, INITIAL_CLAIMS_DATA } from "./claims-types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  Open:  "bg-blue-100 text-blue-700",
  Close: "bg-green-100 text-green-700",
};

const PRIORITY_STYLES: Record<string, string> = {
  High:    "bg-red-100 text-red-700",
  Medium:  "bg-amber-100 text-amber-700",
  Low:     "bg-gray-100 text-gray-500",
  Overdue: "bg-red-200 text-red-800",
};

function fmt(val: number): string {
  if (!val) return "—";
  return val.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function getContext(claim: Claim): "Incident Related" | "Standalone" {
  return claim.incidentLinked ? "Incident Related" : "Standalone";
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ClaimsIncidentEmbeddedProps {
  incidentNumber: string;
  initialLinkedIds?: string[];
}

export function ClaimsIncidentEmbedded({
  incidentNumber,
  initialLinkedIds = [],
}: ClaimsIncidentEmbeddedProps) {

  const [linkedIds, setLinkedIds] = useState<string[]>(() => {
    // Auto-include claims whose incidentNo matches this incident
    const autoLinked = INITIAL_CLAIMS_DATA
      .filter(c => c.incidentLinked && c.incidentNo === incidentNumber)
      .map(c => c.id);
    return [...new Set([...initialLinkedIds, ...autoLinked])];
  });

  const [linkSearch, setLinkSearch]   = useState("");
  const [isLinkOpen, setIsLinkOpen]   = useState(false);
  const [openKebabId, setOpenKebabId] = useState<string | null>(null);
  const [unlinkId, setUnlinkId]       = useState<string | null>(null);

  // ── Derived ───────────────────────────────────────────────────────────────

  const linkedClaims = linkedIds
    .map(id => INITIAL_CLAIMS_DATA.find(c => c.id === id))
    .filter(Boolean) as Claim[];

  const linkable = INITIAL_CLAIMS_DATA.filter(
    c =>
      !linkedIds.includes(c.id) &&
      !c.archived &&
      !c.deleted &&
      (linkSearch === "" ||
        c.claimNo.toLowerCase().includes(linkSearch.toLowerCase()) ||
        c.description.toLowerCase().includes(linkSearch.toLowerCase()) ||
        c.claimType.toLowerCase().includes(linkSearch.toLowerCase()) ||
        c.claimant.toLowerCase().includes(linkSearch.toLowerCase()) ||
        c.vessel.toLowerCase().includes(linkSearch.toLowerCase()))
  );

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleLink = (claim: Claim) => {
    setLinkedIds(prev => [claim.id, ...prev]);
    setIsLinkOpen(false);
    setLinkSearch("");
  };

  const handleUnlink = () => {
    if (unlinkId) {
      setLinkedIds(prev => prev.filter(id => id !== unlinkId));
      setUnlinkId(null);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full">

      {/* ── Header bar ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
        <span className="text-sm font-medium text-gray-700">
          Linked Claims
          {linkedClaims.length > 0 && (
            <span className="ml-2 text-xs text-gray-400 font-normal">
              {linkedClaims.length} {linkedClaims.length === 1 ? "claim" : "claims"}
            </span>
          )}
        </span>

        {/* Link Claim dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsLinkOpen(v => !v)}
            className="flex items-center gap-2 border border-gray-300 hover:border-gray-400 bg-white text-gray-700 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
          >
            <Search className="size-3.5" />
            Link Claim
            <ChevronDown className="size-3.5 text-gray-400" />
          </button>

          {isLinkOpen && (
            <div className="absolute right-0 top-full mt-1 w-[480px] bg-white border border-gray-200 rounded-lg shadow-xl z-[200]">
              <div className="p-2 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search by Claim No, type, claimant, vessel..."
                    value={linkSearch}
                    onChange={e => setLinkSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {linkable.length === 0 ? (
                  <div className="py-6 text-center text-sm text-gray-400">
                    No claims available to link
                  </div>
                ) : (
                  linkable.map(c => (
                    <button
                      key={c.id}
                      onClick={() => handleLink(c)}
                      className="w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-gray-900">{c.claimNo}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${STATUS_STYLES[c.status] ?? "bg-gray-100 text-gray-600"}`}>
                          {c.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-700 font-medium mt-0.5 truncate">
                        {c.claimType} · {c.vessel}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5 truncate">{c.description}</div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {isLinkOpen && (
          <div className="fixed inset-0 z-[199]" onClick={() => { setIsLinkOpen(false); setLinkSearch(""); }} />
        )}
      </div>

      {/* ── Claims cards list ────────────────────────────────────────────── */}
      <div className="p-4 overflow-y-auto flex-1">
        {linkedClaims.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-3 text-gray-400">
            <FileSearch className="size-10 opacity-30" />
            <p className="text-sm font-medium">No claims linked</p>
            <p className="text-xs">Use "Link Claim" to associate claims with this incident.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {linkedClaims.map(claim => {
              const context = getContext(claim);
              return (
                <div key={claim.id} className="border border-gray-200 rounded-lg bg-white overflow-hidden">

                  {/* Card header */}
                  <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <span className="text-sm font-semibold text-blue-600 shrink-0">
                      {claim.claimNo}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium shrink-0 ${
                      context === "Incident Related"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}>
                      {context}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium shrink-0 ${STATUS_STYLES[claim.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {claim.status === "Close" ? "Closed" : "Open"}
                    </span>
                    {claim.priority !== "None" && PRIORITY_STYLES[claim.priority] && (
                      <span className={`text-xs px-2 py-0.5 rounded font-medium shrink-0 ${PRIORITY_STYLES[claim.priority]}`}>
                        {claim.priority}
                      </span>
                    )}

                    {/* Kebab */}
                    <div className="ml-auto relative shrink-0" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setOpenKebabId(openKebabId === claim.id ? null : claim.id)}
                        className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      >
                        <MoreVertical className="size-4" />
                      </button>
                      {openKebabId === claim.id && (
                        <>
                          <div className="fixed inset-0 z-[199]" onClick={() => setOpenKebabId(null)} />
                          <div className="absolute right-0 top-7 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-[200] py-1">
                            <button
                              onClick={() => { setOpenKebabId(null); setUnlinkId(claim.id); }}
                              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              Unlink
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="px-4 py-3 space-y-3">
                    {/* Description */}
                    {claim.description && (
                      <p className="text-sm text-gray-700 line-clamp-2">{claim.description}</p>
                    )}

                    {/* Details grid */}
                    <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Type of Claim</p>
                        <p className="text-xs text-gray-800 font-medium mt-0.5 truncate">{claim.claimType || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Claimant</p>
                        <p className="text-xs text-gray-800 font-medium mt-0.5 truncate">{claim.claimant || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Claim Estimate</p>
                        <p className="text-xs text-gray-800 font-medium mt-0.5">
                          {claim.claimEstimate ? `USD ${fmt(claim.claimEstimate)}` : "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Vessel</p>
                        <p className="text-xs text-gray-800 font-medium mt-0.5 truncate">{claim.vessel || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Date of Incident</p>
                        <p className="text-xs text-gray-800 font-medium mt-0.5">{claim.dateOfIncident || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Type of Cover</p>
                        <p className="text-xs text-gray-800 font-medium mt-0.5 truncate">{claim.typeOfCover || "—"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Unlink confirmation ──────────────────────────────────────────── */}
      {unlinkId && createPortal(
        <>
          <div className="fixed inset-0 bg-black/30 z-[400]" />
          <div className="fixed inset-0 flex items-center justify-center z-[410]">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-[380px]">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Unlink Claim</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to unlink this claim from the incident? The claim record itself will not be deleted.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setUnlinkId(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  No
                </button>
                <button
                  onClick={handleUnlink}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
