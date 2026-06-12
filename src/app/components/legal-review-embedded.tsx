import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Plus, Search, MoreVertical, ChevronDown, X, FileText } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { DatePicker } from "./ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// ─── Constants ────────────────────────────────────────────────────────────────

const REVIEW_STATUSES = [
  "To be reviewed by Legal",
  "Under Review",
  "Reviewed",
  "Not Required",
];

const STATUS_STYLES: Record<string, string> = {
  "Reviewed": "bg-green-100 text-green-700",
  "Under Review": "bg-yellow-100 text-yellow-700",
  "Not Required": "bg-gray-100 text-gray-700",
  "To be reviewed by Legal": "bg-red-100 text-red-700",
};

const TYPE_STYLES: Record<string, string> = {
  "Documents": "bg-blue-100 text-blue-700",
  "NDA": "bg-purple-100 text-purple-700",
};

const ITEMS_BY_CATEGORY: Record<string, string[]> = {
  Inquiry: ["CR-2026-272", "CR-2026-270", "CR-2026-262", "CR-2026-241"],
  Fixture: ["AEW-F-2026-407", "AEW-F-2026-405", "AEW-F-2026-401", "AEW-F-2026-398"],
  Scope: ["Scope A", "Scope B", "Scope C"],
  Insurance: ["INS-2026-001", "INS-2026-002", "INS-2026-003"],
  Claims: ["CLM-2024-001", "CLM-2024-002", "CLM-2024-003", "CLM-2024-004", "CLM-2024-005", "CLM-2024-006"],
};

const ITEM_NAMES: Record<string, string> = {
  "CR-2026-272": "Cargo sf 123456",
  "CR-2026-270": "Test",
  "CR-2026-262": "test Nvm",
  "CR-2026-241": "asd fixture",
  "AEW-F-2026-407": "NCK_Unemployed Days check 4",
  "AEW-F-2026-405": "Fixture Test 405",
  "AEW-F-2026-401": "Fixture Test 401",
  "AEW-F-2026-398": "Fixture Test 398",
  "Scope A": "Scope A",
  "Scope B": "Scope B",
  "Scope C": "Scope C",
};

const CATEGORY_STYLES: Record<string, string> = {
  Inquiry:   "bg-sky-100 text-sky-700",
  Fixture:   "bg-violet-100 text-violet-700",
  Scope:     "bg-orange-100 text-orange-700",
  Insurance: "bg-emerald-100 text-emerald-700",
  Claims:    "bg-rose-100 text-rose-700",
  Other:     "bg-gray-100 text-gray-600",
};

const USERS = [
  "Nikhil Mathew",
  "John Doe",
  "Tester Adminren",
  "Aiswaryaa Adminren",
  "Jacson Tom",
  "Safna Basheer",
];

const getItemCategory = (item: string): string => {
  for (const [cat, items] of Object.entries(ITEMS_BY_CATEGORY)) {
    if (items.includes(item)) return cat;
  }
  return "Other";
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface Review {
  id: string;
  seqId: string;
  reviewNumber: string;
  relatedTo: string[];
  reviewType: string;
  description: string;
  legalReviewStatus: string;
  eFilingNumber: string;
  dueDate: string;
  reviewRaisedBy: string;
  toBeReviewedBy: string;
  createdAt: string;
  tasks: any[];
}

interface ReviewForm {
  relatedTo: string[];
  reviewType: string;
  description: string;
  legalReviewStatus: string;
  eFilingNumber: string;
  dueDate: string;
  reviewRaisedBy: string;
  toBeReviewedBy: string;
}

const EMPTY_FORM: ReviewForm = {
  relatedTo: [],
  reviewType: "",
  description: "",
  legalReviewStatus: "",
  eFilingNumber: "",
  dueDate: "",
  reviewRaisedBy: "",
  toBeReviewedBy: "",
};

const generateReviewNumber = (count: number) =>
  `REV-2026-${String(count).padStart(4, "0")}`;

// ─── Props ────────────────────────────────────────────────────────────────────

interface LegalReviewEmbeddedProps {
  moduleType: "Inquiry" | "Fixture" | "Scope" | "Insurance" | "Claims";
  moduleId: string;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function LegalReviewEmbedded({ moduleType, moduleId }: LegalReviewEmbeddedProps) {
  const storageKey = `legal-review-links-${moduleType}-${moduleId}`;

  // ── State ──────────────────────────────────────────────────────────────────

  const [allReviews, setAllReviews] = useState<Review[]>(() => {
    try { return JSON.parse(localStorage.getItem("legal-reviews") ?? "[]"); } catch { return []; }
  });
  const [nextCount, setNextCount] = useState<number>(() => {
    try { return parseInt(localStorage.getItem("legal-reviews-count") ?? "1", 10); } catch { return 1; }
  });
  const [linkedIds, setLinkedIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) ?? "[]"); } catch { return []; }
  });

  // Sheet state
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ReviewForm>(EMPTY_FORM);

  // Related To split field (category selector + number search)
  const [relatedToSearch, setRelatedToSearch] = useState("");
  const [relatedToCategory, setRelatedToCategory] = useState<string>(moduleType);
  const [relatedToDropdownOpen, setRelatedToDropdownOpen] = useState(false);
  const relatedToInputRef = useRef<HTMLInputElement>(null);
  const relatedToContainerRef = useRef<HTMLDivElement>(null);
  const [relatedToPos, setRelatedToPos] = useState({ top: 0, left: 0, width: 0 });

  const openRelatedToDropdown = () => {
    if (relatedToContainerRef.current) {
      const rect = relatedToContainerRef.current.getBoundingClientRect();
      setRelatedToPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
    setRelatedToDropdownOpen(true);
  };

  // Link review dropdown
  const [linkSearch, setLinkSearch] = useState("");
  const [isLinkOpen, setIsLinkOpen] = useState(false);

  // Re-read allReviews from localStorage whenever the link dropdown opens
  useEffect(() => {
    if (isLinkOpen) {
      try {
        const fresh = JSON.parse(localStorage.getItem("legal-reviews") ?? "[]");
        setAllReviews(fresh);
      } catch { /* keep existing state */ }
    }
  }, [isLinkOpen]);

  // Kebab menu state
  const [openKebabId, setOpenKebabId] = useState<string | null>(null);

  // Unassign confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // ── Persistence ────────────────────────────────────────────────────────────

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(linkedIds));
  }, [linkedIds, storageKey]);

  useEffect(() => {
    localStorage.setItem("legal-reviews", JSON.stringify(allReviews));
  }, [allReviews]);

  useEffect(() => {
    localStorage.setItem("legal-reviews-count", String(nextCount));
  }, [nextCount]);

  // ── Derived ────────────────────────────────────────────────────────────────

  const linkedReviews = linkedIds
    .map((id) => allReviews.find((r) => r.id === id))
    .filter(Boolean) as Review[];

  const unlinkableReviews = allReviews.filter(
    (r) =>
      !linkedIds.includes(r.id) &&
      (r.reviewNumber.toLowerCase().includes(linkSearch.toLowerCase()) ||
        r.reviewType.toLowerCase().includes(linkSearch.toLowerCase()) ||
        r.legalReviewStatus.toLowerCase().includes(linkSearch.toLowerCase()))
  );

  const editingReview = allReviews.find((r) => r.id === editingId);
  const canSave = form.reviewType !== "" && form.legalReviewStatus !== "";

  // ── Handlers ───────────────────────────────────────────────────────────────

  const openCreate = () => {
    setEditingId(null);
    setRelatedToSearch("");
    setRelatedToDropdownOpen(false);
    setRelatedToCategory(moduleType);
    setForm({ ...EMPTY_FORM, relatedTo: [moduleId] });
    setIsSheetOpen(true);
  };

  const openEdit = (review: Review) => {
    setEditingId(review.id);
    setRelatedToSearch("");
    setRelatedToDropdownOpen(false);
    setRelatedToCategory(moduleType);
    setForm({
      relatedTo: review.relatedTo ?? [],
      reviewType: review.reviewType,
      description: review.description,
      legalReviewStatus: review.legalReviewStatus,
      eFilingNumber: review.eFilingNumber,
      dueDate: review.dueDate ?? "",
      reviewRaisedBy: review.reviewRaisedBy ?? "",
      toBeReviewedBy: review.toBeReviewedBy ?? "",
    });
    setIsSheetOpen(true);
  };

  const handleCreate = () => {
    const newReview: Review = {
      id: `rev-${nextCount}`,
      seqId: String(nextCount).padStart(4, "0"),
      reviewNumber: generateReviewNumber(nextCount),
      relatedTo: form.relatedTo,
      reviewType: form.reviewType,
      description: form.description,
      legalReviewStatus: form.legalReviewStatus,
      eFilingNumber: form.eFilingNumber,
      dueDate: form.dueDate,
      reviewRaisedBy: form.reviewRaisedBy,
      toBeReviewedBy: form.toBeReviewedBy,
      createdAt: new Date().toISOString().slice(0, 10),
      tasks: [],
    };
    setAllReviews((prev) => [newReview, ...prev]);
    setLinkedIds((prev) => [newReview.id, ...prev]);
    setNextCount((c) => c + 1);
    setIsSheetOpen(false);
  };

  const handleSave = () => {
    setAllReviews((prev) =>
      prev.map((r) => r.id === editingId ? { ...r, ...form } : r)
    );
    setIsSheetOpen(false);
  };

  const handleLink = (review: Review) => {
    setLinkedIds((prev) => [review.id, ...prev]);
    setIsLinkOpen(false);
    setLinkSearch("");
  };

  const confirmDelete = (id: string) => setDeleteId(id);

  const handleDelete = () => {
    if (deleteId) {
      setLinkedIds((prev) => prev.filter((id) => id !== deleteId));
      setDeleteId(null);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="p-6">

      {/* Action bar */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#fde047] hover:bg-[#facc15] text-gray-900 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
        >
          <Plus className="size-4" />
          Add New Review
        </button>

        {/* Link Review dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsLinkOpen((v) => !v)}
            className="flex items-center gap-2 border border-gray-300 hover:border-gray-400 bg-white text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
          >
            <Search className="size-4" />
            Link Review
            <ChevronDown className="size-4 text-gray-400" />
          </button>

          {isLinkOpen && (
            <div className="absolute left-0 top-full mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-[200]">
              <div className="p-2 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search reviews..."
                    value={linkSearch}
                    onChange={(e) => setLinkSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-gray-400"
                  />
                </div>
              </div>
              <div className="max-h-56 overflow-y-auto">
                {unlinkableReviews.length === 0 ? (
                  <div className="py-6 text-center text-sm text-gray-400">No reviews available</div>
                ) : (
                  unlinkableReviews.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleLink(r)}
                      className="w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{r.reviewNumber}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${TYPE_STYLES[r.reviewType] ?? "bg-gray-100 text-gray-600"}`}>
                          {r.reviewType}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${STATUS_STYLES[r.legalReviewStatus] ?? "bg-gray-100 text-gray-600"}`}>
                          {r.legalReviewStatus}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Backdrop to close link dropdown */}
        {isLinkOpen && (
          <div className="fixed inset-0 z-[199]" onClick={() => { setIsLinkOpen(false); setLinkSearch(""); }} />
        )}
      </div>

      {/* Cards */}
      {linkedReviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3 text-gray-400">
          <FileText className="size-10 opacity-30" />
          <p className="text-sm font-medium">No reviews linked yet</p>
          <p className="text-xs">Use "Add New Review" or "Link Review" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {linkedReviews.map((review) => (
            <div
              key={review.id}
              onClick={() => openEdit(review)}
              className="relative bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer group"
            >
              {/* Kebab menu */}
              <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setOpenKebabId(openKebabId === review.id ? null : review.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-all"
                >
                  <MoreVertical className="size-4" />
                </button>

                {openKebabId === review.id && (
                  <>
                    <div
                      className="fixed inset-0 z-[199]"
                      onClick={() => setOpenKebabId(null)}
                    />
                    <div className="absolute right-0 top-7 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-[200] py-1">
                      <button
                        onClick={() => { setOpenKebabId(null); confirmDelete(review.id); }}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Unassign
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Card header */}
              <div className="flex items-center gap-2 mb-3 pr-8">
                <span className="text-sm font-semibold text-gray-900">{review.reviewNumber}</span>
                {review.reviewType && (
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${TYPE_STYLES[review.reviewType] ?? "bg-gray-100 text-gray-600"}`}>
                    {review.reviewType}
                  </span>
                )}
                {review.legalReviewStatus && (
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${STATUS_STYLES[review.legalReviewStatus] ?? "bg-gray-100 text-gray-600"}`}>
                    {review.legalReviewStatus}
                  </span>
                )}
              </div>

              {/* Card fields */}
              <div className="grid grid-cols-3 gap-x-6 gap-y-2 text-[12px]">
                <div>
                  <span className="text-gray-400">Related To</span>
                  <div className="text-gray-700 font-medium mt-0.5">{review.relatedTo?.join(", ") || "—"}</div>
                </div>
                <div>
                  <span className="text-gray-400">E Filing No</span>
                  <div className="text-gray-700 font-medium mt-0.5">{review.eFilingNumber || "—"}</div>
                </div>
                <div>
                  <span className="text-gray-400">Due Date</span>
                  <div className="text-gray-700 font-medium mt-0.5">{review.dueDate || "—"}</div>
                </div>
                <div>
                  <span className="text-gray-400">Review Raised By</span>
                  <div className="text-gray-700 font-medium mt-0.5">{review.reviewRaisedBy || "—"}</div>
                </div>
                <div>
                  <span className="text-gray-400">To Be Reviewed By</span>
                  <div className="text-gray-700 font-medium mt-0.5">{review.toBeReviewedBy || "—"}</div>
                </div>
                <div>
                  <span className="text-gray-400">Created</span>
                  <div className="text-gray-700 font-medium mt-0.5">{review.createdAt || "—"}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Related To dropdown portal ──────────────────────────────────────── */}
      {relatedToDropdownOpen && createPortal(
        <>
          <div className="fixed inset-0 z-[400]" onClick={() => { setRelatedToDropdownOpen(false); setRelatedToSearch(""); }} />
          <div
            className="fixed z-[410] bg-white border border-gray-200 rounded-lg shadow-xl overflow-y-auto"
            style={{ top: relatedToPos.top, left: relatedToPos.left, width: relatedToPos.width, maxHeight: 216 }}
          >
            {(() => {
              const q = relatedToSearch.toLowerCase();
              const results = (ITEMS_BY_CATEGORY[relatedToCategory] ?? [])
                .filter((item) => !form.relatedTo.includes(item) && (!q || item.toLowerCase().includes(q) || (ITEM_NAMES[item] ?? "").toLowerCase().includes(q)))
                .map((item) => ({ item, cat: relatedToCategory }));
              if (results.length === 0) return (
                <div className="px-3 py-3 text-sm text-gray-400 text-center">No results found</div>
              );
              return results.map(({ item, cat }) => (
                <div
                  key={item}
                  className="flex items-center justify-between px-3 py-2.5 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setForm((f) => ({ ...f, relatedTo: [...f.relatedTo, item] }));
                    setRelatedToSearch("");
                    setRelatedToDropdownOpen(false);
                  }}
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item}</div>
                    {ITEM_NAMES[item] && <div className="text-xs text-gray-500">{ITEM_NAMES[item]}</div>}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${CATEGORY_STYLES[cat]}`}>{cat}</span>
                </div>
              ));
            })()}
          </div>
        </>,
        document.body
      )}

      {/* ── Edit / Create Sheet (Portal) ──────────────────────────────────────── */}
      {isSheetOpen && createPortal(
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-[300]"
            onClick={() => setIsSheetOpen(false)}
          />

          {/* Sheet panel */}
          <div className="fixed inset-y-0 right-0 w-[560px] bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.15)] z-[310] flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? "Edit Review" : "Create New Review"}
              </h2>
              <button
                onClick={() => setIsSheetOpen(false)}
                className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">

              {/* Review Number */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Review Number</Label>
                <Input
                  value={editingId ? (editingReview?.reviewNumber ?? "") : generateReviewNumber(nextCount)}
                  disabled
                  className="bg-gray-50 text-gray-500 font-medium"
                />
              </div>

              {/* Related To — phone-number-style split field */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Related To</Label>
                {form.relatedTo.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-1.5">
                    {form.relatedTo.map((item) => {
                      const cat = getItemCategory(item);
                      return (
                        <span key={item} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${CATEGORY_STYLES[cat]}`}>
                          {item}
                          <button
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, relatedTo: f.relatedTo.filter((x) => x !== item) }))}
                            className="ml-0.5 hover:opacity-70 leading-none"
                          >×</button>
                        </span>
                      );
                    })}
                  </div>
                )}
                {/* Split field: category selector (left) + number search (right) */}
                <div
                  ref={relatedToContainerRef}
                  className="flex border border-gray-200 rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-blue-300 focus-within:border-blue-300"
                >
                  {/* Left — category selector */}
                  <div className="relative shrink-0 border-r border-gray-200 bg-gray-50">
                    <select
                      value={relatedToCategory}
                      onChange={(e) => {
                        setRelatedToCategory(e.target.value);
                        setRelatedToSearch("");
                        setRelatedToDropdownOpen(false);
                      }}
                      className="appearance-none bg-transparent pl-3 pr-7 py-2 text-sm font-medium text-gray-700 focus:outline-none cursor-pointer h-full"
                    >
                      <option value="Inquiry">Inquiry</option>
                      <option value="Fixture">Fixture</option>
                      <option value="Scope">Scope</option>
                      <option value="Insurance">Insurance</option>
                    </select>
                    <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-500 pointer-events-none" />
                  </div>
                  {/* Right — number search */}
                  <input
                    ref={relatedToInputRef}
                    type="text"
                    placeholder={`Search ${relatedToCategory} number...`}
                    value={relatedToSearch}
                    onChange={(e) => { setRelatedToSearch(e.target.value); openRelatedToDropdown(); }}
                    onFocus={openRelatedToDropdown}
                    className="flex-1 px-3 py-2 text-sm bg-white focus:outline-none"
                  />
                </div>
                <p className="text-xs text-gray-400">Select Inquiry / Fixture / Scope / Insurance</p>
              </div>

              {/* Review Type */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">
                  Review Type <span className="text-red-500">*</span>
                </Label>
                <Select value={form.reviewType} onValueChange={(v) => setForm((f) => ({ ...f, reviewType: v }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select review type" />
                  </SelectTrigger>
                  <SelectContent className="z-[600]">
                    <SelectItem value="Documents">Documents</SelectItem>
                    <SelectItem value="NDA">NDA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">Description</Label>
                  <span className="text-xs text-gray-400">{form.description.length} / 10,000</span>
                </div>
                <Textarea
                  value={form.description}
                  onChange={(e) => {
                    if (e.target.value.length <= 10000)
                      setForm((f) => ({ ...f, description: e.target.value }));
                  }}
                  placeholder="Enter description..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              {/* Legal Review Status */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">
                  Legal Review Status <span className="text-red-500">*</span>
                </Label>
                <Select value={form.legalReviewStatus} onValueChange={(v) => setForm((f) => ({ ...f, legalReviewStatus: v }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="z-[600]">
                    {REVIEW_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* E Filing Number */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">E Filing Number</Label>
                  <span className="text-xs text-gray-400">{form.eFilingNumber.length} / 50</span>
                </div>
                <Input
                  value={form.eFilingNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 50);
                    setForm((f) => ({ ...f, eFilingNumber: val }));
                  }}
                  placeholder="Alphanumeric only"
                />
              </div>

              {/* Due Date */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Due Date</Label>
                <DatePicker
                  value={form.dueDate ? new Date(form.dueDate) : undefined}
                  onChange={(d) => setForm((f) => ({ ...f, dueDate: d ? d.toISOString().slice(0, 10) : "" }))}
                  placeholder="Select due date"
                />
              </div>

              {/* Review Raised By */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Review Raised By</Label>
                <Select value={form.reviewRaisedBy} onValueChange={(v) => setForm((f) => ({ ...f, reviewRaisedBy: v }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent className="z-[600]">
                    {USERS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* To Be Reviewed By */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">To Be Reviewed By</Label>
                <Select value={form.toBeReviewedBy} onValueChange={(v) => setForm((f) => ({ ...f, toBeReviewedBy: v }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent className="z-[600]">
                    {USERS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Created Date (edit mode only) */}
              {editingId && editingReview && (
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Created Date</Label>
                  <Input value={editingReview.createdAt} disabled className="bg-gray-50 text-gray-500" />
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white">
              <button
                onClick={() => setIsSheetOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingId ? handleSave : handleCreate}
                disabled={!canSave}
                className="px-4 py-2 text-sm font-medium text-gray-900 bg-[#fde047] hover:bg-[#facc15] rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {editingId ? "Save Changes" : "Create Review"}
              </button>
            </div>
          </div>
        </>,
        document.body
      )}

      {/* ── Delete Confirmation Dialog (Portal) ──────────────────────────────── */}
      {deleteId && createPortal(
        <>
          <div className="fixed inset-0 bg-black/30 z-[400]" />
          <div className="fixed inset-0 flex items-center justify-center z-[410]">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-[380px]">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Unassign Review</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to unassign this review from the {moduleType}? The review record will not be deleted.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  No
                </button>
                <button
                  onClick={handleDelete}
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
