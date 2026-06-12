import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, Plus, MoreVertical, ChevronLeft, ChevronRight, MessageSquare, FileText, ChevronDown, Trash2, Archive, ArchiveRestore } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { DatePicker } from "./ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { type Task } from "./legal-review-tab";
import { Switch } from "./ui/switch";

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

const INITIAL_TASK: Partial<Task> = {
  name: "",
  labels: "none",
  description: "",
  reporter: "Nikhil Mathew",
  startDate: null,
  flagged: "No",
  isDeliverable: "none",
  timezone: "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi",
  priority: "Medium",
  status: "TODO",
  assignee: "none",
  dueDate: null,
  estimation: "",
};

// ─── Types ────────────────────────────────────────────────────────────────────

const ITEMS_BY_CATEGORY: Record<string, string[]> = {
  Inquiry: ["CR-2026-272", "CR-2026-270", "CR-2026-262", "CR-2026-241"],
  Fixture: ["AEW-F-2026-407", "AEW-F-2026-405", "AEW-F-2026-401", "AEW-F-2026-398"],
  Scope: ["Scope A", "Scope B", "Scope C"],
};

const USERS = [
  "Nikhil Mathew",
  "John Doe",
  "Tester Adminren",
  "Aiswaryaa Adminren",
  "Jacson Tom",
  "Safna Basheer",
];

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
  tasks: Task[];
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
  tasks: Task[];
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
  tasks: [],
};

const generateReviewNumber = (count: number) =>
  `REV-2026-${String(count).padStart(4, "0")}`;

// ─── Component ────────────────────────────────────────────────────────────────

export function Legal() {
  // Listing state
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem("legal-reviews");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [nextCount, setNextCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("legal-reviews-count");
      return saved ? parseInt(saved, 10) : 1;
    } catch { return 1; }
  });
  const [activeStatusFilter, setActiveStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Header controls
  const [activeListTab, setActiveListTab] = useState<"Lists" | "Trash">("Lists");
  const [isArchived, setIsArchived] = useState(false);
  const [isKebabOpen, setIsKebabOpen] = useState(false);
  const kebabBtnRef = useRef<HTMLButtonElement>(null);
  const [kebabPos, setKebabPos] = useState({ top: 0, right: 0 });

  const openKebab = () => {
    if (kebabBtnRef.current) {
      const rect = kebabBtnRef.current.getBoundingClientRect();
      setKebabPos({ top: rect.bottom + 6, right: window.innerWidth - rect.right });
    }
    setIsKebabOpen(true);
  };

  // Sheet state
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ReviewForm>(EMPTY_FORM);

  // Related To split field state
  const [relatedToSearch, setRelatedToSearch] = useState("");
  const [relatedToCategory, setRelatedToCategory] = useState<string>("Fixture");
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

  // Task modal state (add / new subtask)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState<Partial<Task>>(INITIAL_TASK);
  const [createAnother, setCreateAnother] = useState(false);
  const [addingSubtaskForId, setAddingSubtaskForId] = useState<string | null>(null);
  const [expandedTaskIds, setExpandedTaskIds] = useState<Set<string>>(new Set());

  // Task view/detail overlay state
  const [isViewTaskOpen, setIsViewTaskOpen] = useState(false);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [activityTab, setActivityTab] = useState<"Comments" | "History" | "Work log">("Comments");

  // Expand / collapse related items per review row
  const [expandedReviewIds, setExpandedReviewIds] = useState<Set<string>>(new Set());
  const toggleReviewExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedReviewIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Helper: determine category of an item
  const getItemCategory = (item: string): string => {
    for (const [cat, items] of Object.entries(ITEMS_BY_CATEGORY)) {
      if (items.includes(item)) return cat;
    }
    return "Other";
  };

  const CATEGORY_STYLES: Record<string, string> = {
    Inquiry:  "bg-sky-100 text-sky-700",
    Fixture:  "bg-violet-100 text-violet-700",
    Scope:    "bg-orange-100 text-orange-700",
    Other:    "bg-gray-100 text-gray-600",
  };

  // Display names for related items
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

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("legal-reviews", JSON.stringify(reviews));
  }, [reviews]);
  useEffect(() => {
    localStorage.setItem("legal-reviews-count", String(nextCount));
  }, [nextCount]);

  // ── Filtering ──────────────────────────────────────────────────────────────

  const statuses = ["All", ...REVIEW_STATUSES];

  const filtered = reviews.filter((r) => {
    const matchesStatus =
      activeStatusFilter === "All" || r.legalReviewStatus === activeStatusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      r.reviewNumber.toLowerCase().includes(q) ||
      r.reviewType.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.legalReviewStatus.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // ── Review CRUD ────────────────────────────────────────────────────────────

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setIsSheetOpen(true);
  };

  const openEdit = (review: Review) => {
    setEditingId(review.id);
    setRelatedToSearch("");
    setRelatedToDropdownOpen(false);
    setRelatedToCategory("Fixture");
    setForm({
      relatedTo: review.relatedTo ?? [],
      reviewType: review.reviewType,
      description: review.description,
      legalReviewStatus: review.legalReviewStatus,
      eFilingNumber: review.eFilingNumber,
      dueDate: review.dueDate ?? "",
      reviewRaisedBy: review.reviewRaisedBy ?? "",
      toBeReviewedBy: review.toBeReviewedBy ?? "",
      tasks: review.tasks ?? [],
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
      tasks: form.tasks,
    };
    setReviews((prev) => [newReview, ...prev]);
    setNextCount((c) => c + 1);
    setForm(EMPTY_FORM);
    setIsSheetOpen(false);
  };

  const handleSave = () => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === editingId
          ? {
              ...r,
              relatedTo: form.relatedTo,
              reviewType: form.reviewType,
              description: form.description,
              legalReviewStatus: form.legalReviewStatus,
              eFilingNumber: form.eFilingNumber,
              dueDate: form.dueDate,
              reviewRaisedBy: form.reviewRaisedBy,
              toBeReviewedBy: form.toBeReviewedBy,
              tasks: form.tasks,
            }
          : r
      )
    );
    setIsSheetOpen(false);
  };

  const editingReview = reviews.find((r) => r.id === editingId);

  // ── Task CRUD ──────────────────────────────────────────────────────────────

  const openAddTask = (parentId?: string) => {
    setTaskForm(INITIAL_TASK);
    setCreateAnother(false);
    setAddingSubtaskForId(parentId ?? null);
    setIsTaskModalOpen(true);
  };

  const openEditTask = (task: Task) => {
    setViewingTask(task);
    setActivityTab("Comments");
    setIsViewTaskOpen(true);
  };

  const closeViewTask = () => {
    setViewingTask(null);
    setIsViewTaskOpen(false);
  };

  const addSubtaskFromView = () => {
    if (viewingTask) {
      const parentId = viewingTask.id;
      closeViewTask();
      setTimeout(() => openAddTask(parentId), 0);
    }
  };

  const toggleExpand = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  };

  const handleSaveTask = () => {
    if (!taskForm.name || !taskForm.estimation || taskForm.isDeliverable === "none") return;

    if (taskForm.id) {
      // Edit existing task — compute updated tasks outside the updater
      const updatedTasks = form.tasks.map((t) =>
        t.id === taskForm.id ? { ...t, ...taskForm } as Task : t
      );
      setForm((f) => ({ ...f, tasks: updatedTasks }));
      if (editingId) {
        setReviews((prev) =>
          prev.map((r) => r.id === editingId ? { ...r, tasks: updatedTasks } : r)
        );
      }
      setIsTaskModalOpen(false);
    } else {
      // Create new task
      const saved: Task = {
        id: Math.random().toString(36).substr(2, 9),
        name: taskForm.name ?? "",
        labels: taskForm.labels ?? "none",
        description: taskForm.description ?? "",
        reporter: taskForm.reporter ?? "none",
        assignee: taskForm.assignee ?? "none",
        startDate: taskForm.startDate ?? null,
        dueDate: taskForm.dueDate ?? null,
        flagged: taskForm.flagged ?? "none",
        isDeliverable: taskForm.isDeliverable ?? "none",
        timezone: taskForm.timezone ?? "none",
        priority: taskForm.priority ?? "none",
        status: taskForm.status ?? "none",
        estimation: taskForm.estimation ?? "",
      };

      // Compute updated tasks outside the updater — no side effects inside setState
      let updatedTasks: Task[];
      if (addingSubtaskForId) {
        updatedTasks = form.tasks.map((t) =>
          t.id === addingSubtaskForId
            ? { ...t, subtasks: [...(t.subtasks ?? []), saved] }
            : t
        );
        setExpandedTaskIds((prev) => new Set([...prev, addingSubtaskForId!]));
      } else {
        updatedTasks = [...form.tasks, saved];
      }

      setForm((f) => ({ ...f, tasks: updatedTasks }));
      if (editingId) {
        setReviews((prev) =>
          prev.map((r) => r.id === editingId ? { ...r, tasks: updatedTasks } : r)
        );
      }

      if (createAnother) {
        setTaskForm(INITIAL_TASK);
      } else {
        setIsTaskModalOpen(false);
      }
    }
  };

  const handleCancelTask = () => {
    setTaskForm(INITIAL_TASK);
    setIsTaskModalOpen(false);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#f8f9fa] border-b border-gray-200 sticky top-0 z-10">

        {/* Left — Search + Add Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-2 pr-8 py-1.5 bg-transparent border-b border-gray-300 focus:outline-none focus:border-gray-500 text-sm w-56 placeholder:text-gray-500"
            />
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
          </div>
          <button className="flex items-center gap-1.5 bg-[#fde047] hover:bg-[#facc15] text-gray-900 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
            <Plus className="size-4" />
            Add Filter
          </button>
        </div>

        {/* Right — Lists/Trash + Archived toggle + Add Review + Kebab */}
        <div className="flex items-center gap-3">

          {/* Lists | Trash button group */}
          <div className="flex bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm text-sm font-medium">
            {(["Lists", "Trash"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveListTab(tab)}
                className={`px-4 py-1.5 transition-colors whitespace-nowrap ${
                  activeListTab === tab
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Archived toggle */}
          <div className="flex items-center gap-2">
            <Switch
              checked={isArchived}
              onCheckedChange={setIsArchived}
              className="data-[state=checked]:bg-[#facc15]"
            />
            <span className="text-sm font-medium text-gray-700">Archived</span>
          </div>

          {/* Add Review button */}
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 bg-[#fde047] hover:bg-[#facc15] text-gray-900 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
          >
            <Plus className="size-4" />
            Add Review
          </button>

          {/* Kebab button */}
          <button
            ref={kebabBtnRef}
            onClick={openKebab}
            className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-md transition-colors"
          >
            <MoreVertical className="size-5" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 text-gray-400">
            <FileText className="size-12 opacity-30" />
            <p className="text-sm font-medium">No reviews yet</p>
            <p className="text-xs">Click "Add Review" to create the first one.</p>
          </div>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 bg-white shadow-sm z-10">
              <tr className="text-left text-xs font-semibold text-gray-500 border-b border-gray-200">
                <th className="py-4 pl-4 pr-0 w-8"></th>
                <th className="py-4 px-6 font-medium tracking-wider uppercase w-24">ID</th>
                <th className="py-4 px-6 font-medium tracking-wider uppercase">REVIEW NUMBER</th>
                <th className="py-4 px-6 font-medium tracking-wider uppercase">REVIEW TYPE</th>
                <th className="py-4 px-6 font-medium tracking-wider uppercase">DESCRIPTION</th>
                <th className="py-4 px-6 font-medium tracking-wider uppercase">LEGAL REVIEW STATUS</th>
                <th className="py-4 px-6 font-medium tracking-wider uppercase">E FILING NUMBER</th>
                <th className="py-4 px-6 font-medium tracking-wider uppercase">DUE DATE</th>
                <th className="py-4 px-6 font-medium tracking-wider uppercase">REVIEW RAISED BY</th>
                <th className="py-4 px-6 font-medium tracking-wider uppercase">TO BE REVIEWED BY</th>
                <th className="py-4 px-6 font-medium tracking-wider uppercase">CREATED DATE</th>
              </tr>
            </thead>
            <tbody className="divide-y border-t border-gray-100 divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-gray-400 text-sm">
                    No reviews match the current filter.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => {
                  const hasItems = (row.relatedTo ?? []).length > 0;
                  const isExpanded = expandedReviewIds.has(row.id);

                  // Group related items by their category for display
                  const groupedItems = (row.relatedTo ?? []).reduce((acc, item) => {
                    const cat = getItemCategory(item);
                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(item);
                    return acc;
                  }, {} as Record<string, string[]>);

                  return (
                    <React.Fragment key={row.id}>
                      {/* ── Main review row ── */}
                      <tr
                        className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                        onClick={() => openEdit(row)}
                      >
                        {/* Expand toggle */}
                        <td className="py-3 pl-4 pr-0 text-center w-8">
                          {hasItems ? (
                            <button
                              onClick={(e) => toggleReviewExpand(row.id, e)}
                              className="p-0.5 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              {isExpanded
                                ? <ChevronDown className="size-3.5" />
                                : <ChevronRight className="size-3.5" />}
                            </button>
                          ) : <span />}
                        </td>
                        <td className="py-3 px-6 text-gray-600">{row.seqId}</td>
                        <td className="py-3 px-6 text-gray-900 font-medium">{row.reviewNumber}</td>
                        <td className="py-3 px-6">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${TYPE_STYLES[row.reviewType] ?? "bg-gray-100 text-gray-700"}`}>
                            {row.reviewType}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-gray-600 max-w-xs truncate">
                          {row.description || <span className="text-gray-300 italic">—</span>}
                        </td>
                        <td className="py-3 px-6">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_STYLES[row.legalReviewStatus] ?? "bg-gray-100 text-gray-700"}`}>
                            {row.legalReviewStatus}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-gray-600">{row.eFilingNumber || <span className="text-gray-300">—</span>}</td>
                        <td className="py-3 px-6 text-gray-600">{row.dueDate || <span className="text-gray-300">—</span>}</td>
                        <td className="py-3 px-6 text-gray-600">{row.reviewRaisedBy || <span className="text-gray-300">—</span>}</td>
                        <td className="py-3 px-6 text-gray-600">{row.toBeReviewedBy || <span className="text-gray-300">—</span>}</td>
                        <td className="py-3 px-6 text-gray-500">{row.createdAt}</td>
                      </tr>

                      {/* ── Expanded related items ── */}
                      {hasItems && isExpanded && (
                        <>
                          {/* Section header */}
                          <tr className="bg-gray-50 border-b border-gray-100">
                            <td colSpan={11} className="py-1.5 pl-12 pr-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              Related Items
                            </td>
                          </tr>

                          {/* Sub-header */}
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <td colSpan={2} />
                            <td className="py-2 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Item</td>
                            <td className="py-2 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Type</td>
                            <td className="py-2 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Name</td>
                            <td colSpan={6} />
                          </tr>

                          {/* One row per related item */}
                          {Object.entries(groupedItems).map(([cat, items]) =>
                            items.map((item) => (
                              <tr
                                key={`${row.id}-${item}`}
                                className="bg-gray-50/60 hover:bg-blue-50/40 transition-colors border-b border-gray-100"
                              >
                                <td className="py-2.5 pl-4 pr-0">
                                  <span className="block w-3 border-l-2 border-b-2 border-gray-200 h-3 ml-3 rounded-bl" />
                                </td>
                                <td />
                                <td className="py-2.5 px-6 text-sm font-medium text-gray-700">{item}</td>
                                <td className="py-2.5 px-6">
                                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${CATEGORY_STYLES[cat] ?? "bg-gray-100 text-gray-600"}`}>
                                    {cat}
                                  </span>
                                </td>
                                <td className="py-2.5 px-6 text-sm text-gray-600">{ITEM_NAMES[item] ?? "—"}</td>
                                <td colSpan={6} />
                              </tr>
                            ))
                          )}
                        </>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 bg-white border-t border-gray-200 text-xs text-gray-500 sticky bottom-0">
        <div>Found {filtered.length} record{filtered.length !== 1 ? "s" : ""}</div>
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
            <span>{filtered.length > 0 ? `1 – ${filtered.length}` : "0"} of {filtered.length}</span>
            <div className="flex items-center gap-1">
              <button disabled className="p-1 rounded hover:bg-gray-100 text-gray-400 disabled:opacity-50">
                <ChevronLeft className="size-4" />
              </button>
              <button disabled className="p-1 rounded hover:bg-gray-100 text-gray-400 disabled:opacity-50">
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating chat button */}
      <button className="absolute bottom-16 right-6 bg-slate-500 hover:bg-slate-600 text-white p-3 rounded-md shadow-lg transition-transform hover:scale-105 active:scale-95">
        <MessageSquare className="size-5" fill="currentColor" />
      </button>

      {/* ── Kebab dropdown (portal) ───────────────────────────────────────────── */}
      {isKebabOpen && createPortal(
        <>
          <div className="fixed inset-0 z-[100]" onClick={() => setIsKebabOpen(false)} />
          <div
            className="fixed z-[110] w-56 bg-white border border-gray-200 rounded-lg shadow-xl py-1"
            style={{ top: kebabPos.top, right: kebabPos.right }}
          >
            <button
              onClick={() => setIsKebabOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Trash2 className="size-4 text-gray-400" />
              Delete Selected Review
            </button>
            <button
              onClick={() => setIsKebabOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Archive className="size-4 text-gray-400" />
              Archive Selected Reviews
            </button>
            <button
              onClick={() => setIsKebabOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ArchiveRestore className="size-4 text-gray-400" />
              Unarchive Selected Reviews
            </button>
          </div>
        </>,
        document.body
      )}

      {/* ── Review Sheet ─────────────────────────────────────────────────────── */}
      {/* Manual backdrop — needed because modal={false} skips Radix's overlay */}
      {isSheetOpen && (
        <div className="fixed inset-0 bg-black/60 z-[49]" onClick={() => setIsSheetOpen(false)} />
      )}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen} modal={false}>
        <SheetContent
          side="right"
          className="!max-w-none w-full sm:w-[560px] flex flex-col h-full overflow-hidden p-0"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{editingId ? "Edit Review" : "Create New Review"}</SheetTitle>
            <SheetDescription>{editingId ? "Update the review details below." : "Fill in the details below to create a new legal review."}</SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <h2 className="text-xl font-semibold text-gray-900">{editingId ? "Edit Review" : "Create New Review"}</h2>

            {/* Review Number */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Review Number</Label>
              <Input
                value={editingId ? (editingReview?.reviewNumber ?? "") : generateReviewNumber(nextCount)}
                disabled
                className="bg-gray-50 text-gray-500 font-medium"
              />
            </div>

            {/* Related To — phone-number-style split field */}
            <div className="space-y-2">
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
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Review Type <span className="text-red-500">*</span>
              </Label>
              <Select value={form.reviewType} onValueChange={(v) => setForm((f) => ({ ...f, reviewType: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select review type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Documents">Documents</SelectItem>
                  <SelectItem value="NDA">NDA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Description</Label>
              <Textarea
                placeholder="Enter description..."
                value={form.description}
                maxLength={10000}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="min-h-[100px] resize-none"
              />
              <p className="text-xs text-gray-400 text-right">{form.description.length}/10000</p>
            </div>

            {/* Legal Review Status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Legal Review Status <span className="text-red-500">*</span>
              </Label>
              <Select value={form.legalReviewStatus} onValueChange={(v) => setForm((f) => ({ ...f, legalReviewStatus: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {REVIEW_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* E Filing Number */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">E Filing Number</Label>
              <Input
                placeholder="e.g. EF2026ABC"
                value={form.eFilingNumber}
                onChange={(e) => setForm((f) => ({ ...f, eFilingNumber: e.target.value.replace(/[^a-zA-Z0-9]/g, "") }))}
                maxLength={50}
              />
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Due Date</Label>
              <DatePicker
                value={form.dueDate}
                onChange={(d) => setForm((f) => ({ ...f, dueDate: d ?? "" }))}
                placeholder="Select due date"
              />
            </div>

            {/* Review Raised By */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Review Raised By</Label>
              <Select value={form.reviewRaisedBy} onValueChange={(v) => setForm((f) => ({ ...f, reviewRaisedBy: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {USERS.map((u) => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* To Be Reviewed By */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">To Be Reviewed By</Label>
              <Select value={form.toBeReviewedBy} onValueChange={(v) => setForm((f) => ({ ...f, toBeReviewedBy: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {USERS.map((u) => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* ── Tasks Section ──────────────────────────────────────────────── */}
            {editingId && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Tasks</h3>
                <button
                  onClick={() => openAddTask()}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1.5 text-[13px] bg-blue-50 px-3 py-1.5 rounded transition-colors"
                >
                  <Plus className="size-3.5" /> Add Task
                </button>
              </div>

              {form.tasks.length === 0 ? (
                <div className="text-center py-5 bg-gray-50 border border-dashed border-gray-200 rounded-lg">
                  <p className="text-gray-400 text-sm">No tasks added yet.</p>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
                  <div style={{overflowX:"auto"}}>
                    <table style={{minWidth:"1160px",width:"100%",borderCollapse:"collapse",fontSize:"12px"}}>
                      <colgroup>
                        <col style={{width:"32px"}} />   {/* expand */}
                        <col style={{width:"130px"}} />  {/* Name */}
                        <col style={{width:"80px"}} />   {/* Labels */}
                        <col style={{width:"110px"}} />  {/* Reporter */}
                        <col style={{width:"90px"}} />   {/* Start Date */}
                        <col style={{width:"70px"}} />   {/* Flagged */}
                        <col style={{width:"90px"}} />   {/* Is Deliverable */}
                        <col style={{width:"130px"}} />  {/* Timezone */}
                        <col style={{width:"80px"}} />   {/* Priority */}
                        <col style={{width:"90px"}} />   {/* Status */}
                        <col style={{width:"110px"}} />  {/* Assignee */}
                        <col style={{width:"90px"}} />   {/* Due Date */}
                        <col style={{width:"74px"}} />   {/* Estimation */}
                      </colgroup>

                      {/* ── Header ── */}
                      <thead>
                        <tr style={{background:"#f9fafb",borderBottom:"1px solid #e5e7eb"}}>
                          <th style={{padding:"8px 4px"}}></th>
                          {["Name","Labels","Reporter","Start Date","Flagged","Is Deliverable","Timezone","Priority","Status","Assignee","Due Date","Estimation"].map(h => (
                            <th key={h} style={{padding:"8px 8px",textAlign:"left",fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.05em",whiteSpace:"nowrap",fontSize:"11px"}}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      {/* ── Rows ── */}
                      <tbody>
                        {form.tasks.map((task) => {
                          const hasSubtasks = (task.subtasks?.length ?? 0) > 0;
                          const isExpanded = expandedTaskIds.has(task.id);
                          const fmtDate = (d: any) => d && d !== "none" ? new Date(d).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"2-digit"}) : "—";
                          const fmtVal = (v: string | undefined | null) => (!v || v === "none") ? "—" : v;
                          return (
                            <React.Fragment key={task.id}>
                              {/* Task row */}
                              <tr
                                onClick={() => openEditTask(task)}
                                style={{borderBottom:"1px solid #f3f4f6",cursor:"pointer"}}
                                onMouseEnter={e => (e.currentTarget.style.background="#f9fafb")}
                                onMouseLeave={e => (e.currentTarget.style.background="")}
                              >
                                {/* Expand */}
                                <td style={{padding:"10px 4px",textAlign:"center"}}>
                                  {hasSubtasks ? (
                                    <button onClick={(e) => toggleExpand(task.id, e)}
                                      style={{background:"none",border:"none",cursor:"pointer",padding:"2px",borderRadius:"3px",color:"#9ca3af",display:"flex",alignItems:"center"}}>
                                      {isExpanded ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
                                    </button>
                                  ) : <span />}
                                </td>
                                {/* Name */}
                                <td style={{padding:"10px 8px"}}>
                                  <span style={{fontWeight:500,color:"#111827",display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={task.name}>{task.name}</span>
                                </td>
                                {/* Labels */}
                                <td style={{padding:"10px 8px",color:"#6b7280"}}>{fmtVal(task.labels)}</td>
                                {/* Reporter */}
                                <td style={{padding:"10px 8px",color:"#6b7280",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{fmtVal(task.reporter)}</td>
                                {/* Start Date */}
                                <td style={{padding:"10px 8px",color:"#6b7280",whiteSpace:"nowrap"}}>{fmtDate(task.startDate)}</td>
                                {/* Flagged */}
                                <td style={{padding:"10px 8px",color:"#6b7280"}}>{fmtVal(task.flagged)}</td>
                                {/* Is Deliverable */}
                                <td style={{padding:"10px 8px",color:"#6b7280"}}>{fmtVal(task.isDeliverable)}</td>
                                {/* Timezone */}
                                <td style={{padding:"10px 8px",color:"#6b7280",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"130px"}} title={task.timezone !== "none" ? task.timezone : ""}>
                                  {fmtVal(task.timezone)}
                                </td>
                                {/* Priority */}
                                <td style={{padding:"10px 8px"}}>
                                  <span style={{display:"inline-flex",alignItems:"center",padding:"2px 7px",borderRadius:"4px",fontSize:"11px",fontWeight:600,
                                    background: task.priority==="High"?"#fef2f2": task.priority==="Medium"?"#fefce8":"#f0fdf4",
                                    color: task.priority==="High"?"#dc2626": task.priority==="Medium"?"#ca8a04":"#16a34a"}}>
                                    {task.priority==="none"?"—":task.priority}
                                  </span>
                                </td>
                                {/* Status */}
                                <td style={{padding:"10px 8px"}}>
                                  <span style={{display:"inline-flex",alignItems:"center",padding:"2px 7px",borderRadius:"4px",fontSize:"11px",fontWeight:600,background:"#f3f4f6",color:"#374151"}}>
                                    {task.status==="none"?"—":task.status}
                                  </span>
                                </td>
                                {/* Assignee */}
                                <td style={{padding:"10px 8px",color:"#6b7280",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                                  {task.assignee==="none"?"Unassigned":task.assignee}
                                </td>
                                {/* Due Date */}
                                <td style={{padding:"10px 8px",whiteSpace:"nowrap"}}>
                                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"4px"}}>
                                    <span style={{color:"#6b7280"}}>{fmtDate(task.dueDate)}</span>
                                    <button title="Add Sub Task"
                                      onClick={(e) => { e.stopPropagation(); openAddTask(task.id); }}
                                      style={{flexShrink:0,width:"18px",height:"18px",borderRadius:"3px",border:"none",background:"none",cursor:"pointer",color:"#9ca3af",display:"flex",alignItems:"center",justifyContent:"center"}}
                                      onMouseEnter={e=>{e.currentTarget.style.background="#dbeafe";e.currentTarget.style.color="#2563eb"}}
                                      onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color="#9ca3af"}}>
                                      <Plus className="size-3" />
                                    </button>
                                  </div>
                                </td>
                                {/* Estimation */}
                                <td style={{padding:"10px 8px",color:"#6b7280"}}>{task.estimation||"—"}</td>
                              </tr>

                              {/* Subtask rows */}
                              {hasSubtasks && isExpanded && (
                                <>
                                  <tr style={{background:"#f9fafb",borderBottom:"1px solid #e5e7eb"}}>
                                    <td colSpan={13} style={{padding:"4px 12px 4px 32px",fontSize:"10px",fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.08em"}}>
                                      Subtasks
                                    </td>
                                  </tr>
                                  {task.subtasks!.map(sub => (
                                    <tr key={sub.id}
                                      onClick={(e) => { e.stopPropagation(); openEditTask(sub); }}
                                      style={{borderBottom:"1px solid #f3f4f6",cursor:"pointer",background:"#fafafa"}}
                                      onMouseEnter={e => (e.currentTarget.style.background="#f1f5f9")}
                                      onMouseLeave={e => (e.currentTarget.style.background="#fafafa")}
                                    >
                                      <td style={{padding:"8px 4px"}}>
                                        <span style={{display:"block",width:"12px",height:"1px",borderBottom:"1px solid #d1d5db",marginLeft:"16px"}} />
                                      </td>
                                      <td style={{padding:"8px 8px 8px 16px"}}>
                                        <span style={{color:"#374151",display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={sub.name}>{sub.name}</span>
                                      </td>
                                      <td style={{padding:"8px 8px",color:"#6b7280"}}>{fmtVal(sub.labels)}</td>
                                      <td style={{padding:"8px 8px",color:"#6b7280",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{fmtVal(sub.reporter)}</td>
                                      <td style={{padding:"8px 8px",color:"#6b7280",whiteSpace:"nowrap"}}>{fmtDate(sub.startDate)}</td>
                                      <td style={{padding:"8px 8px",color:"#6b7280"}}>{fmtVal(sub.flagged)}</td>
                                      <td style={{padding:"8px 8px",color:"#6b7280"}}>{fmtVal(sub.isDeliverable)}</td>
                                      <td style={{padding:"8px 8px",color:"#6b7280",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={sub.timezone!=="none"?sub.timezone:""}>{fmtVal(sub.timezone)}</td>
                                      <td style={{padding:"8px 8px"}}>
                                        <span style={{display:"inline-flex",alignItems:"center",padding:"2px 6px",borderRadius:"4px",fontSize:"10px",fontWeight:600,
                                          background: sub.priority==="High"?"#fef2f2":sub.priority==="Medium"?"#fefce8":"#f0fdf4",
                                          color: sub.priority==="High"?"#dc2626":sub.priority==="Medium"?"#ca8a04":"#16a34a"}}>
                                          {sub.priority==="none"?"—":sub.priority}
                                        </span>
                                      </td>
                                      <td style={{padding:"8px 8px"}}>
                                        <span style={{display:"inline-flex",alignItems:"center",padding:"2px 6px",borderRadius:"4px",fontSize:"10px",fontWeight:600,background:"#f3f4f6",color:"#374151"}}>
                                          {sub.status==="none"?"—":sub.status}
                                        </span>
                                      </td>
                                      <td style={{padding:"8px 8px",color:"#6b7280",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                                        {sub.assignee==="none"?"Unassigned":sub.assignee}
                                      </td>
                                      <td style={{padding:"8px 8px",color:"#6b7280",whiteSpace:"nowrap"}}>{fmtDate(sub.dueDate)}</td>
                                      <td style={{padding:"8px 8px",color:"#6b7280"}}>{sub.estimation||"—"}</td>
                                    </tr>
                                  ))}
                                </>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            )}
          </div>

          {/* Sheet footer */}
          <div className="border-t border-gray-200 p-4 bg-white flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsSheetOpen(false)}>Cancel</Button>
            <Button
              disabled={!form.reviewType || !form.legalReviewStatus}
              onClick={editingId ? handleSave : handleCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {editingId ? "Save Changes" : "Create Review"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Add / Edit Task Modal ── */}
      {isTaskModalOpen && createPortal(
        <div style={{position:"fixed",inset:0,zIndex:500,display:"flex",alignItems:"center",justifyContent:"center"}}>
          {/* Backdrop */}
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)"}} onClick={handleCancelTask} />
          {/* Modal box */}
          <div style={{position:"relative",background:"#fff",borderRadius:"8px",boxShadow:"0 25px 50px -12px rgba(0,0,0,.25)",display:"flex",flexDirection:"column",width:"680px",maxHeight:"90vh",overflow:"hidden"}}>

            {/* Header */}
            <div style={{padding:"18px 24px",borderBottom:"1px solid #e5e7eb",flexShrink:0}}>
              <h2 style={{fontSize:"17px",fontWeight:600,color:"#111827",margin:0}}>
                {taskForm.id ? "Edit Task" : addingSubtaskForId ? "Add Sub Task" : "Add New Task"}
              </h2>
            </div>

            {/* Body */}
            <div style={{overflowY:"auto",padding:"24px",flex:1}}>
              <div style={{display:"flex",gap:"40px"}}>

                {/* ── LEFT COLUMN ── */}
                <div style={{flex:1,display:"flex",flexDirection:"column",gap:"20px"}}>

                  {/* Name */}
                  <div>
                    <div style={{fontSize:"12px",color:"#6b7280",marginBottom:"6px"}}>Name <span style={{color:"#ef4444"}}>*</span></div>
                    <input
                      type="text"
                      value={taskForm.name ?? ""}
                      onChange={e => setTaskForm({...taskForm, name: e.target.value})}
                      style={{width:"100%",outline:"none",fontSize:"14px",paddingBottom:"4px",background:"transparent",borderTop:"none",borderLeft:"none",borderRight:"none",borderBottom:`1px solid ${!taskForm.name ? "#ef4444" : "#d1d5db"}`}}
                    />
                  </div>

                  {/* Add Labels */}
                  <div>
                    <div style={{fontSize:"12px",color:"#6b7280",marginBottom:"6px"}}>Add Labels</div>
                    <select value={taskForm.labels ?? "none"} onChange={e => setTaskForm({...taskForm, labels: e.target.value})}
                      style={{width:"100%",outline:"none",fontSize:"14px",paddingBottom:"4px",background:"transparent",borderTop:"none",borderLeft:"none",borderRight:"none",borderBottom:"1px solid #d1d5db",cursor:"pointer"}}>
                      {["none","Label 1","Label 2"].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <div style={{fontSize:"12px",color:"#6b7280",marginBottom:"6px"}}>Description</div>
                    <textarea
                      value={taskForm.description ?? ""}
                      onChange={e => setTaskForm({...taskForm, description: e.target.value})}
                      rows={3}
                      style={{width:"100%",outline:"none",fontSize:"14px",padding:"4px 0",background:"transparent",border:"none",borderBottom:"1px solid #d1d5db",resize:"vertical",fontFamily:"inherit"}}
                    />
                  </div>

                  {/* Reporter */}
                  <div>
                    <div style={{fontSize:"12px",color:"#6b7280",marginBottom:"6px"}}>Reporter</div>
                    <select value={taskForm.reporter ?? "none"} onChange={e => setTaskForm({...taskForm, reporter: e.target.value})}
                      style={{width:"100%",outline:"none",fontSize:"14px",paddingBottom:"4px",background:"transparent",borderTop:"none",borderLeft:"none",borderRight:"none",borderBottom:"1px solid #d1d5db",cursor:"pointer"}}>
                      {["none",...USERS].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>

                  {/* Select Start Date */}
                  <div>
                    <div style={{fontSize:"12px",color:"#6b7280",marginBottom:"6px"}}>Select Start Date</div>
                    <input type="date" value={typeof taskForm.startDate === "string" ? taskForm.startDate : ""}
                      onChange={e => setTaskForm({...taskForm, startDate: e.target.value as any})}
                      style={{width:"100%",outline:"none",fontSize:"14px",paddingBottom:"4px",background:"transparent",borderTop:"none",borderLeft:"none",borderRight:"none",borderBottom:"1px solid #d1d5db",cursor:"pointer"}} />
                  </div>

                  {/* Flagged */}
                  <div>
                    <div style={{fontSize:"12px",color:"#6b7280",marginBottom:"6px"}}>Flagged</div>
                    <select value={taskForm.flagged ?? "No"} onChange={e => setTaskForm({...taskForm, flagged: e.target.value})}
                      style={{width:"100%",outline:"none",fontSize:"14px",paddingBottom:"4px",background:"transparent",borderTop:"none",borderLeft:"none",borderRight:"none",borderBottom:"1px solid #d1d5db",cursor:"pointer"}}>
                      {["none","Yes","No"].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>

                </div>

                {/* ── RIGHT COLUMN ── */}
                <div style={{flex:1,display:"flex",flexDirection:"column",gap:"20px"}}>

                  {/* Is Deliverable */}
                  <div>
                    <div style={{fontSize:"12px",color:"#ef4444",marginBottom:"6px"}}>Is Deliverable</div>
                    <select value={taskForm.isDeliverable ?? "none"} onChange={e => setTaskForm({...taskForm, isDeliverable: e.target.value})}
                      style={{width:"100%",outline:"none",fontSize:"14px",paddingBottom:"4px",background:"transparent",borderTop:"none",borderLeft:"none",borderRight:"none",borderBottom:`1px solid ${taskForm.isDeliverable==="none"?"#ef4444":"#d1d5db"}`,cursor:"pointer",color:taskForm.isDeliverable==="none"?"#ef4444":"inherit"}}>
                      {["none","Yes","No"].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>

                  {/* Timezone */}
                  <div>
                    <div style={{fontSize:"12px",color:"#6b7280",marginBottom:"6px"}}>Timezone</div>
                    <select value={taskForm.timezone ?? ""} onChange={e => setTaskForm({...taskForm, timezone: e.target.value})}
                      style={{width:"100%",outline:"none",fontSize:"14px",paddingBottom:"4px",background:"transparent",borderTop:"none",borderLeft:"none",borderRight:"none",borderBottom:"1px solid #d1d5db",cursor:"pointer"}}>
                      {["none","(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi","(UTC+00:00) London","(UTC-05:00) New York","(UTC+06:00) Omsk"].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <div style={{fontSize:"12px",color:"#6b7280",marginBottom:"6px"}}>Priority</div>
                    <select value={taskForm.priority ?? "Medium"} onChange={e => setTaskForm({...taskForm, priority: e.target.value})}
                      style={{width:"100%",outline:"none",fontSize:"14px",paddingBottom:"4px",background:"transparent",borderTop:"none",borderLeft:"none",borderRight:"none",borderBottom:"1px solid #d1d5db",cursor:"pointer"}}>
                      {["none","Low","Medium","High"].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <div style={{fontSize:"12px",color:"#6b7280",marginBottom:"6px"}}>Status</div>
                    <select value={taskForm.status ?? "TODO"} onChange={e => setTaskForm({...taskForm, status: e.target.value})}
                      style={{width:"100%",outline:"none",fontSize:"14px",paddingBottom:"4px",background:"transparent",borderTop:"none",borderLeft:"none",borderRight:"none",borderBottom:"1px solid #d1d5db",cursor:"pointer"}}>
                      {["none","TODO","IN PROGRESS","DONE"].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>

                  {/* Assignee */}
                  <div>
                    <div style={{fontSize:"12px",color:"#6b7280",marginBottom:"6px"}}>Assignee</div>
                    <select value={taskForm.assignee ?? "none"} onChange={e => setTaskForm({...taskForm, assignee: e.target.value})}
                      style={{width:"100%",outline:"none",fontSize:"14px",paddingBottom:"4px",background:"transparent",borderTop:"none",borderLeft:"none",borderRight:"none",borderBottom:"1px solid #d1d5db",cursor:"pointer"}}>
                      {["none",...USERS].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>

                  {/* Select Due Date */}
                  <div>
                    <div style={{fontSize:"12px",color:"#6b7280",marginBottom:"6px"}}>Select Due Date</div>
                    <input type="date" value={typeof taskForm.dueDate === "string" ? taskForm.dueDate : ""}
                      onChange={e => setTaskForm({...taskForm, dueDate: e.target.value as any})}
                      style={{width:"100%",outline:"none",fontSize:"14px",paddingBottom:"4px",background:"transparent",borderTop:"none",borderLeft:"none",borderRight:"none",borderBottom:"1px solid #d1d5db",cursor:"pointer"}} />
                  </div>

                  {/* Estimation */}
                  <div>
                    <div style={{fontSize:"12px",color:"#ef4444",marginBottom:"6px"}}>
                      Estimation <span style={{color:"#ef4444"}}>*</span>
                      <span style={{fontSize:"11px",color:"#9ca3af",marginLeft:"6px",fontWeight:"normal"}}>2w 4d 6h 45m</span>
                    </div>
                    <input
                      type="text"
                      value={taskForm.estimation ?? ""}
                      onChange={e => setTaskForm({...taskForm, estimation: e.target.value})}
                      placeholder="2w 4d 6h 45m"
                      style={{width:"100%",outline:"none",fontSize:"14px",paddingBottom:"4px",background:"transparent",borderTop:"none",borderLeft:"none",borderRight:"none",borderBottom:`1px solid ${!taskForm.estimation?"#ef4444":"#d1d5db"}`}}
                    />
                  </div>

                  {/* Parent Task — read-only when adding subtask */}
                  {addingSubtaskForId && (
                    <div>
                      <div style={{fontSize:"12px",color:"#6b7280",marginBottom:"6px"}}>Parent Task</div>
                      <div style={{borderBottom:"1px solid #d1d5db",padding:"4px 0",fontSize:"14px",color:"#6b7280",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                        {form.tasks.find(t => t.id === addingSubtaskForId)?.name ?? "—"}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{padding:"12px 24px",borderTop:"1px solid #e5e7eb",display:"flex",justifyContent:"flex-end",alignItems:"center",gap:"12px",flexShrink:0,background:"#fff"}}>
              {!taskForm.id && (
                <label style={{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"13px",color:"#374151",marginRight:"auto"}}>
                  <input type="checkbox" checked={createAnother} onChange={e => setCreateAnother(e.target.checked)}
                    style={{width:"15px",height:"15px",cursor:"pointer",accentColor:"#374151"}} />
                  Create Another
                </label>
              )}
              <button onClick={handleCancelTask}
                style={{padding:"7px 20px",background:"#e5e7eb",border:"none",borderRadius:"4px",cursor:"pointer",fontSize:"13px",fontWeight:500,color:"#374151"}}>
                Cancel
              </button>
              <button onClick={handleSaveTask}
                disabled={!taskForm.name || !taskForm.estimation || taskForm.isDeliverable === "none"}
                style={{padding:"7px 24px",background:(!taskForm.name||!taskForm.estimation||taskForm.isDeliverable==="none")?"#e5e7eb":"#374151",border:"none",borderRadius:"4px",cursor:(!taskForm.name||!taskForm.estimation||taskForm.isDeliverable==="none")?"not-allowed":"pointer",fontSize:"13px",fontWeight:500,color:(!taskForm.name||!taskForm.estimation||taskForm.isDeliverable==="none")?"#9ca3af":"#fff"}}>
                Save
              </button>
            </div>

          </div>
        </div>,
        document.body
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

      {/* ── View / Detail Task Overlay ── */}
      {isViewTaskOpen && viewingTask && createPortal(
        <div style={{position:"fixed",inset:0,zIndex:500,display:"flex",alignItems:"center",justifyContent:"center"}}>
          {/* Backdrop */}
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.45)"}} onClick={closeViewTask} />

          {/* Modal */}
          <div style={{position:"relative",background:"#fff",borderRadius:"8px",boxShadow:"0 25px 50px -12px rgba(0,0,0,.3)",display:"flex",flexDirection:"column",width:"820px",height:"85vh",overflow:"hidden"}}>

            {/* ── Header ── */}
            <div style={{padding:"12px 20px",borderBottom:"1px solid #e5e7eb",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
              <div style={{fontSize:"14px",color:"#6b7280"}}>
                Task No:&nbsp;
                <span style={{fontWeight:700,color:"#d97706",fontFamily:"monospace",letterSpacing:"0.02em"}}>
                  TSK-{viewingTask.id.slice(0,6).toUpperCase()}
                </span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                {/* Refresh */}
                <button title="Refresh" style={{background:"none",border:"none",cursor:"pointer",padding:"5px",borderRadius:"4px",color:"#9ca3af",display:"flex",alignItems:"center"}}
                  onClick={() => setViewingTask({...viewingTask})}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
                </button>
                {/* Watch */}
                <button title="Watch" style={{background:"none",border:"none",cursor:"pointer",padding:"5px",borderRadius:"4px",color:"#9ca3af",display:"flex",alignItems:"center"}}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M2 12s3.27-7 10-7 10 7 10 7-3.27 7-10 7S2 12 2 12z"/></svg>
                </button>
                {/* Archive */}
                <button style={{padding:"5px 14px",background:"none",border:"1px solid #d1d5db",borderRadius:"4px",cursor:"pointer",fontSize:"13px",color:"#6b7280",fontWeight:500}}>
                  Archive
                </button>
                {/* More */}
                <button title="More" style={{background:"none",border:"none",cursor:"pointer",padding:"5px",borderRadius:"4px",color:"#6b7280",display:"flex",alignItems:"center"}}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                </button>
                {/* Close */}
                <button onClick={closeViewTask} title="Close"
                  style={{background:"none",border:"none",cursor:"pointer",padding:"5px",borderRadius:"4px",color:"#6b7280",display:"flex",alignItems:"center",marginLeft:"4px"}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            {/* ── Body ── */}
            <div style={{display:"flex",flex:1,overflow:"hidden"}}>

              {/* LEFT PANEL */}
              <div style={{flex:1,overflowY:"auto",padding:"24px 28px",borderRight:"1px solid #e5e7eb",display:"flex",flexDirection:"column",gap:"0"}}>

                {/* Task Name */}
                <h2 style={{fontSize:"22px",fontWeight:600,color:"#111827",margin:"0 0 20px 0",lineHeight:1.3}}>
                  {viewingTask.name}
                </h2>

                {/* Description */}
                <div style={{marginBottom:"28px"}}>
                  <div style={{fontSize:"13px",color:"#6b7280",marginBottom:"6px"}}>Description</div>
                  <div style={{fontSize:"14px",color:viewingTask.description?"#374151":"#9ca3af",lineHeight:1.6}}>
                    {viewingTask.description || "None"}
                  </div>
                </div>

                {/* Sub Tasks */}
                <div style={{marginBottom:"28px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"12px"}}>
                    <span style={{fontSize:"14px",fontWeight:600,color:"#374151"}}>Sub Tasks</span>
                    <button onClick={addSubtaskFromView} title="Add Sub Task"
                      style={{width:"22px",height:"22px",background:"#f3f4f6",border:"1px solid #e5e7eb",borderRadius:"4px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#6b7280"}}>
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <div style={{borderBottom:"1px dashed #e5e7eb",marginBottom:"12px"}} />
                  {(viewingTask.subtasks ?? []).length === 0 ? (
                    <div style={{border:"1px solid #e5e7eb",borderRadius:"6px",padding:"28px 20px",textAlign:"center",background:"#f9fafb"}}>
                      <div style={{fontSize:"14px",fontWeight:600,color:"#6b7280",marginBottom:"6px"}}>No subtask found!</div>
                      <div style={{fontSize:"13px",color:"#9ca3af"}}>Sorry, no sub task has been created yet.</div>
                    </div>
                  ) : (
                    <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
                      {(viewingTask.subtasks ?? []).map(sub => (
                        <div key={sub.id}
                          style={{display:"flex",alignItems:"center",gap:"12px",padding:"10px 12px",borderRadius:"6px",border:"1px solid #f3f4f6",cursor:"pointer",background:"#fff",boxShadow:"0 1px 2px rgba(0,0,0,.04)"}}
                          onClick={() => openEditTask(sub)}>
                          <span style={{fontSize:"11px",color:"#9ca3af",fontFamily:"monospace",flexShrink:0}}>
                            {sub.id.slice(0,6).toUpperCase()}
                          </span>
                          <span style={{flex:1,fontSize:"13px",color:"#374151",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sub.name}</span>
                          <span style={{fontSize:"11px",padding:"2px 7px",borderRadius:"4px",flexShrink:0,fontWeight:600,
                            background:sub.priority==="High"?"#fef2f2":sub.priority==="Medium"?"#fefce8":"#f0fdf4",
                            color:sub.priority==="High"?"#dc2626":sub.priority==="Medium"?"#ca8a04":"#16a34a"}}>
                            {sub.priority==="none"?"—":sub.priority}
                          </span>
                          <span style={{fontSize:"11px",fontWeight:700,color:"#fff",padding:"2px 7px",borderRadius:"4px",background:"#6b7280",textTransform:"uppercase",flexShrink:0}}>
                            {sub.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Activity */}
                <div>
                  <div style={{fontSize:"14px",fontWeight:600,color:"#374151",marginBottom:"10px"}}>Activity</div>
                  <div style={{borderBottom:"1px dashed #e5e7eb",marginBottom:"14px"}} />
                  {/* Tab bar */}
                  <div style={{display:"flex",alignItems:"center",gap:"4px",marginBottom:"16px"}}>
                    <span style={{fontSize:"13px",color:"#6b7280",marginRight:"6px"}}>Show :</span>
                    {(["Comments","History","Work log"] as const).map(tab => (
                      <button key={tab} onClick={() => setActivityTab(tab)}
                        style={{padding:"4px 12px",borderRadius:"4px",border:"1px solid",cursor:"pointer",fontSize:"13px",fontWeight:500,
                          borderColor: activityTab===tab ? "#6b7280" : "#e5e7eb",
                          background: activityTab===tab ? "#6b7280" : "transparent",
                          color: activityTab===tab ? "#fff" : "#6b7280"}}>
                        {tab}
                      </button>
                    ))}
                  </div>
                  {/* Comment input row */}
                  <div style={{display:"flex",alignItems:"flex-start",gap:"12px"}}>
                    <div style={{width:"36px",height:"36px",borderRadius:"50%",background:"#374151",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"#fff",fontSize:"13px",fontWeight:700}}>TA</div>
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      style={{flex:1,border:"1px solid #e5e7eb",borderRadius:"6px",padding:"8px 12px",fontSize:"13px",outline:"none",color:"#374151",background:"#fff"}}
                    />
                  </div>
                  {activityTab === "Comments" && (
                    <div style={{marginTop:"16px",fontSize:"13px",color:"#9ca3af",fontStyle:"italic",textAlign:"center"}}>
                      No comments yet.
                    </div>
                  )}
                  {activityTab === "History" && (
                    <div style={{marginTop:"16px",fontSize:"13px",color:"#9ca3af",fontStyle:"italic",textAlign:"center"}}>
                      No history available.
                    </div>
                  )}
                  {activityTab === "Work log" && (
                    <div style={{marginTop:"16px",fontSize:"13px",color:"#9ca3af",fontStyle:"italic",textAlign:"center"}}>
                      No work log entries.
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT PANEL */}
              <div style={{width:"280px",flexShrink:0,overflowY:"auto",padding:"20px 24px",display:"flex",flexDirection:"column",gap:"0"}}>

                {(() => {
                  const field = (label: string, value: React.ReactNode) => (
                    <div style={{marginBottom:"20px"}}>
                      <div style={{fontSize:"12px",color:"#9ca3af",marginBottom:"5px"}}>{label}</div>
                      <div style={{fontSize:"14px",color:"#374151"}}>{value}</div>
                    </div>
                  );
                  const chip = (text: string, warm?: boolean) => (
                    <span style={{display:"inline-block",padding:"3px 10px",borderRadius:"4px",fontSize:"13px",fontWeight:500,
                      background: warm ? "#fef9c3" : "#f3f4f6",
                      color: warm ? "#92400e" : "#374151",
                      border: warm ? "1px solid #fde68a" : "1px solid #e5e7eb"}}>
                      {text}
                    </span>
                  );
                  const fmt = (v: string | null | undefined | Date) => {
                    if (!v) return "None";
                    if (typeof v === "string") return v === "none" ? "None" : v;
                    return String(v);
                  };
                  return (
                    <>
                      {field("Labels", fmt(viewingTask.labels))}
                      {field("Priority", fmt(viewingTask.priority))}
                      {field("Status", fmt(viewingTask.status))}
                      {field("Is Flagged", fmt(viewingTask.flagged))}
                      {field("Start Date", fmt(viewingTask.startDate as any))}
                      {field("Due Date", fmt(viewingTask.dueDate as any))}
                      {field("Reporter", chip(fmt(viewingTask.reporter), viewingTask.reporter !== "none"))}
                      {field("Assignee", chip(fmt(viewingTask.assignee)))}
                      {field("Is Deliverable", fmt(viewingTask.isDeliverable))}
                      {field("Estimation", viewingTask.estimation || "None")}
                      {field("Timezone", fmt(viewingTask.timezone))}
                      <div style={{borderTop:"1px solid #f3f4f6",paddingTop:"16px",marginTop:"4px"}}>
                        <div style={{fontSize:"12px",color:"#9ca3af",lineHeight:1.8}}>
                          <div>Created by : <span style={{color:"#6b7280"}}>—</span></div>
                          <div style={{color:"#d1d5db",fontSize:"11px",marginBottom:"6px"}}>—</div>
                          <div>Modified by : <span style={{color:"#6b7280"}}>—</span></div>
                          <div style={{color:"#d1d5db",fontSize:"11px"}}>—</div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
