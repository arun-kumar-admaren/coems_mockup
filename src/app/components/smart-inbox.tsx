import { useRef, useState } from "react";
import {
  Mail, X, Check, Plus,
  Users, MessageSquare, ChevronDown, ChevronRight, ChevronLeft,
  Search, Paperclip, CornerUpLeft, Flag,
  Archive, ExternalLink,
  Download, FileText,
  Tag, ChevronUp,
  Pencil, Send, Eye, Settings, ChevronsRight, Play, ArrowUp,
  FileSearch, Calculator, Ship, Sparkles, Trash2, AlertCircle, Maximize2,
} from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { DatePicker } from "./ui/date-picker";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { InquiryDetail } from "./inquiry-detail";
import { FixtureDetail } from "./fixture-detail";
import { VoyageEstimateDetail } from "./voyage-estimate-detail";
import { EmailAccountEntry } from "./settings-integrations";

const CURRENT_USER = "Tester Adminren";

function nameFor(email: string) {
  const local = email.split("@")[0] || email;
  return local
    .split(/[.\-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function rowKey(row: InboxRow) {
  return `${row.sender}__${row.subject}`;
}

interface ActivityEntry {
  type: "created" | "edited" | "queued" | "sent" | "seen";
  actor: string;
  time: string;
  detail?: string;
  showOpenMessage?: boolean;
}

interface ThreadMessage {
  id: string;
  avatar: string | null;
  avatarColor: string;
  sender: string;
  to: string[];
  cc: string[];
  sentDate: string;
  snippet: string;
  body: string;
  attachments: { name: string; size: string }[];
}

interface InboxRow {
  avatar: string | null;
  avatarColor: string;
  sender: string;
  replyPrefix: string;
  subject: string;
  snippet: string;
  body: string;
  to: string[];
  cc: string[];
  sentDate: string;
  attachments: { name: string; size: string }[];
  activity: ActivityEntry[];
  hasReply: boolean;
  hasAttachment: boolean;
  flagged?: boolean;
  isUnread?: boolean;
  tags: { label: string; style: "green" | "purple" | "blue-outline" }[];
  moreTags: number;
  inquiry: InquiryData | null;
  /** Earlier messages in this conversation, oldest first. The row's own sender/body/etc. above is always the latest message. */
  thread?: ThreadMessage[];
}

interface PortEntry {
  port: string;
  term: string;
  layCanFrom: string;
  layCanTo: string;
  unitNumber: string;
  totalVolume: string;
  totalWeight: string;
  freightTon: string;
  transitRequirements: string;
  remarks: string;
}

interface CommissionEntry {
  type: string;
  name: string;
  rate: string;
  applyTo: string[];
}

interface CargoIncomeEntry {
  accountHead: string;
  particulars: string;
  terms: string;
  rate: string;
  qty: string;
  amount: string;
}

interface InquiryData {
  cargoNumber: string;
  indicationType: string;
  cargoCategory: string;
  cargoSubcategory: string;
  cargoName: string;
  baseCurrency: string;
  conversionRateDate: string;
  relatedScope: string;
  account: string;
  broker: string;
  commissions: CommissionEntry[];
  portsOfLoading: PortEntry[];
  portsOfDischarge: PortEntry[];
  cargoIncomeExpense: CargoIncomeEntry[];
  freightCalcType: string;
  freightCurrency: string;
  freightRate: string;
  fixedByOffices: string[];
  personInCharge: string[];
  legalEntity: string;
}

const EMPTY_PORT_ENTRY: PortEntry = {
  port: "", term: "", layCanFrom: "", layCanTo: "", unitNumber: "", totalVolume: "",
  totalWeight: "", freightTon: "", transitRequirements: "", remarks: "",
};

const EMPTY_INQUIRY_DATA: InquiryData = {
  cargoNumber: "",
  indicationType: "", cargoCategory: "", cargoSubcategory: "", cargoName: "",
  baseCurrency: "Thai Baht", conversionRateDate: "",
  relatedScope: "", account: "", broker: "",
  commissions: [],
  portsOfLoading: [{ ...EMPTY_PORT_ENTRY }],
  portsOfDischarge: [{ ...EMPTY_PORT_ENTRY }],
  cargoIncomeExpense: [],
  freightCalcType: "Lumpsum", freightCurrency: "Thai Baht", freightRate: "",
  fixedByOffices: [], personInCharge: [], legalEntity: "",
};

interface FixtureCargoDimension {
  cargoName: string;
  stowage: string;
  stackable: boolean;
  length: string;
  breadth: string;
  height: string;
  volume: string;
  weight: string;
  units: string;
}

interface FixtureCommissionEntry {
  type: string;
  name: string;
  rate: string;
  applyTo: string[];
}

interface FixturePortEntry {
  port: string;
  unitNumber: string;
  totalVolume: string;
  totalWeight: string;
  freightTon: string;
  layCan: string;
  transitRequirements: string;
}

interface FixtureInvoiceEntry {
  type: string;
  raisedBy: string;
  invoiceNo: string;
  dueDate: string;
  status: string;
}

interface FixtureData {
  fixtureNumber: string;

  // Cargo
  fixtureType: string;
  cargoName: string;
  cargoDescription: string;
  cargoCategory: string;
  cargoSubcategory: string;
  unitNumber: string;
  totalVolume: string;
  totalWeight: string;
  freightTon: string;
  cargoRelet: string;
  freightCalcType: string;
  freightCurrency: string;
  freightRate: string;
  comments: string;
  paymentTerms: string;
  cargoDimensions: FixtureCargoDimension[];

  // Chartering
  projectName: string;
  relatedScope: string;
  fixedByOffices: string[];
  personsInCharge: string[];
  legalEntity: string;
  bookingDate: string;
  timezone: string;
  fixtureStatus: string;
  intendedVesselType: string;
  intendedVessel: string;
  finalPerformer: string;
  demurragePdpr: string;
  demurrageUnit: string;
  demurrageDuration: string;
  bunkerAdjustmentFactor: boolean;
  bafComments: string;

  // Client
  headAccount: string;
  account: string;
  shipper: string;
  broker: string;
  contactEmails: string[];
  commissions: FixtureCommissionEntry[];
  charterPartySigned: boolean;
  charterPartyPdf: boolean;
  charterPartyHardCopy: boolean;

  // Voyage
  voyageNumber: string;
  portsOfLoading: FixturePortEntry[];
  portsOfDischarge: FixturePortEntry[];
  agreementType: string;

  // Accounting
  baseCurrency: string;
  conversionRate: string;
  invoices: FixtureInvoiceEntry[];
}

const EMPTY_FIXTURE_PORT: FixturePortEntry = {
  port: "", unitNumber: "", totalVolume: "", totalWeight: "", freightTon: "", layCan: "", transitRequirements: "",
};

const EMPTY_FIXTURE_DATA: FixtureData = {
  fixtureNumber: "",
  fixtureType: "Chartered Fixture",
  cargoName: "", cargoDescription: "", cargoCategory: "", cargoSubcategory: "",
  unitNumber: "", totalVolume: "", totalWeight: "", freightTon: "", cargoRelet: "Not Checked",
  freightCalcType: "Lumpsum", freightCurrency: "US Dollar", freightRate: "",
  comments: "", paymentTerms: "",
  cargoDimensions: [],
  projectName: "", relatedScope: "",
  fixedByOffices: [], personsInCharge: [], legalEntity: "",
  bookingDate: "", timezone: "(UTC-5:00) America/Toronto", fixtureStatus: "Not Loaded",
  intendedVesselType: "", intendedVessel: "", finalPerformer: "",
  demurragePdpr: "", demurrageUnit: "day", demurrageDuration: "",
  bunkerAdjustmentFactor: false, bafComments: "",
  headAccount: "", account: "", shipper: "", broker: "", contactEmails: [],
  commissions: [], charterPartySigned: false, charterPartyPdf: false, charterPartyHardCopy: false,
  voyageNumber: "", portsOfLoading: [{ ...EMPTY_FIXTURE_PORT }], portsOfDischarge: [{ ...EMPTY_FIXTURE_PORT }], agreementType: "None",
  baseCurrency: "US Dollar", conversionRate: "", invoices: [],
};

const FIXTURE_STEPS = ["Cargo", "Chartering", "Client", "Voyage", "Accounting"] as const;
type FixtureStep = (typeof FIXTURE_STEPS)[number];

function fixtureRequiredFields(data: FixtureData) {
  return [
    !!data.cargoName,
    !!data.cargoCategory,
    num(data.totalVolume) > 0,
    num(data.totalWeight) > 0,
    num(data.freightRate) > 0,
    !!data.account,
    !!data.portsOfLoading[0]?.port,
    !!data.portsOfDischarge[0]?.port,
  ];
}

function fixtureStepHasErrors(step: FixtureStep, data: FixtureData): boolean {
  if (step === "Cargo") return !data.cargoName || !data.cargoCategory || num(data.totalVolume) <= 0 || num(data.totalWeight) <= 0 || num(data.freightRate) <= 0;
  if (step === "Client") return !data.account;
  if (step === "Voyage") return !data.portsOfLoading[0]?.port || !data.portsOfDischarge[0]?.port;
  return false;
}

const INBOX_ROWS: InboxRow[] = [
  {
    avatar: "RR", avatarColor: "bg-teal-600", sender: "Rahul R - Chartering (UHL)",
    replyPrefix: "RE: ", subject: "MV FAITH – Steel Coils Fixture Recap",
    snippet: "Please find attached the finalized recap for MV FAITH covering Durban/Rotterdam, laycan 20–25 Sep, freight USD 45.50/MT FIOST...",
    body: "Hi Team,\n\nPlease find attached the finalized recap for MV FAITH covering the Durban/Rotterdam steel coils fixture. Laycan 20–25 Sep, freight USD 45.50/MT FIOST.\n\nKindly review and confirm so we can proceed with the Charter Party.\n\nRegards,\nRahul",
    to: ["Neethu V Mohan - Chartering (UHL)"], cc: ["Sajith Salim - Chartering (UHL)"], sentDate: "Sep 12 2026 15:10",
    attachments: [{ name: "MV_FAITH_Recap.pdf", size: "212KB" }],
    thread: [
      {
        id: "faith-1", avatar: "NM", avatarColor: "bg-emerald-500", sender: "Neethu V Mohan - Chartering (UHL)",
        to: ["Rahul R - Chartering (UHL)"], cc: ["Sajith Salim - Chartering (UHL)"], sentDate: "Sep 12 2026 14:50",
        snippet: "Hi Rahul, can you send over the finalized recap for MV FAITH once ready? Owners are chasing for the Charter Party...",
        body: "Hi Rahul,\n\nCan you send over the finalized recap for MV FAITH covering the Durban/Rotterdam steel coils fixture once it's ready? Owners are chasing us for the Charter Party.\n\nThanks,\nNeethu",
        attachments: [],
      },
    ],
    activity: [
      { type: "created", actor: "Rahul R", time: "15:05", detail: "reply to message 892104223", showOpenMessage: true },
      { type: "edited", actor: "Rahul R", time: "15:08" },
      { type: "queued", actor: "Rahul R", time: "15:09" },
      { type: "sent", actor: "Rahul R", time: "15:10" },
      { type: "seen", actor: "Neethu V Mohan", time: "15:14" },
      { type: "seen", actor: "Sajith Salim", time: "15:20" },
    ],
    hasReply: true, hasAttachment: true, isUnread: true,
    tags: [{ label: "FAITH-2609", style: "green" }], moreTags: 2,
    inquiry: {
      cargoNumber: "CR-2026-216",
      indicationType: "GENCON fios", cargoCategory: "Breakbulk / Generals", cargoSubcategory: "Steel Products",
      cargoName: "Steel Coils", baseCurrency: "US Dollar", conversionRateDate: "2026-09-12",
      relatedScope: "Chartering (UHL)", account: "Rahul R - Chartering (UHL)", broker: "Rahul R - Chartering (UHL)",
      commissions: [{ type: "HQ", name: "Management Fee", rate: "5", applyTo: ["Freight"] }],
      portsOfLoading: [{
        port: "Durban, South Africa", term: "FIOST", layCanFrom: "2026-09-20", layCanTo: "2026-09-25",
        unitNumber: "", totalVolume: "", totalWeight: "", freightTon: "", transitRequirements: "", remarks: "",
      }],
      portsOfDischarge: [{
        port: "Rotterdam, Netherlands", term: "FIOST", layCanFrom: "", layCanTo: "",
        unitNumber: "", totalVolume: "", totalWeight: "", freightTon: "", transitRequirements: "None", remarks: "",
      }],
      cargoIncomeExpense: [{ accountHead: "Freight Income", particulars: "Steel Coils Freight", terms: "Lumpsum", rate: "45.50", qty: "1", amount: "" }],
      freightCalcType: "Weight", freightCurrency: "US Dollar", freightRate: "45.50",
      fixedByOffices: ["UHL HQ Chartering"], personInCharge: ["Rahul R"], legalEntity: "ADMAREN TECH",
    },
  },
  {
    avatar: "NM", avatarColor: "bg-emerald-500", sender: "Neethu V Mohan - Chartering (UHL)",
    replyPrefix: "AW: AW: AW: ", subject: "Charter Party Draft – Clause Review",
    snippet: "Moin Team, following up on the outstanding clause comments for the MV FAITH charter party draft, please revert...",
    body: "Moin Team,\n\nFollowing up on the outstanding clause comments for the MV FAITH charter party draft. Please revert with your final position on Clause 9 (demurrage) and Clause 14 (bunkers) by EOD.\n\nThanks,\nNeethu",
    to: ["Rahul R - Chartering (UHL)", "Sajith Salim - Chartering (UHL)"], cc: [], sentDate: "Sep 12 2026 14:33",
    attachments: [],
    thread: [
      {
        id: "cp-1", avatar: "RR", avatarColor: "bg-teal-600", sender: "Rahul R - Chartering (UHL)",
        to: ["Neethu V Mohan - Chartering (UHL)", "Sajith Salim - Chartering (UHL)"], cc: [], sentDate: "Sep 10 2026 09:15",
        snippet: "Team, please find attached the draft Charter Party for MV FAITH. Kindly review Clause 9 (demurrage) and Clause 14 (bunkers)...",
        body: "Team,\n\nPlease find attached the draft Charter Party for MV FAITH. Kindly review Clause 9 (demurrage) and Clause 14 (bunkers) and revert with your comments at the earliest.\n\nRegards,\nRahul",
        attachments: [{ name: "MV_FAITH_CP_Draft_v1.pdf", size: "184KB" }],
      },
      {
        id: "cp-2", avatar: "SS", avatarColor: "bg-gray-400", sender: "Sajith Salim - Chartering (UHL)",
        to: ["Rahul R - Chartering (UHL)", "Neethu V Mohan - Chartering (UHL)"], cc: [], sentDate: "Sep 11 2026 11:02",
        snippet: "Clause 9 demurrage rate looks fine but Clause 14 needs to reference IFO380 pricing at Rotterdam, not Singapore...",
        body: "Rahul,\n\nClause 9 (demurrage rate) looks fine as drafted. However, Clause 14 needs to reference IFO380 pricing at Rotterdam, not Singapore, given the discharge port. Please amend and recirculate.\n\nSajith",
        attachments: [],
      },
      {
        id: "cp-3", avatar: "RR", avatarColor: "bg-teal-600", sender: "Rahul R - Chartering (UHL)",
        to: ["Sajith Salim - Chartering (UHL)", "Neethu V Mohan - Chartering (UHL)"], cc: [], sentDate: "Sep 12 2026 10:20",
        snippet: "Updated Clause 14 to reference Rotterdam IFO380 as suggested. Clause 9 remains unchanged. Revised draft attached...",
        body: "Sajith,\n\nUpdated Clause 14 to reference Rotterdam IFO380 as suggested. Clause 9 remains unchanged since owners already agreed to the demurrage rate. Revised draft attached for final sign-off.\n\nRahul",
        attachments: [{ name: "MV_FAITH_CP_Draft_v2.pdf", size: "186KB" }],
      },
    ],
    activity: [
      { type: "created", actor: "Neethu V Mohan", time: "14:30", detail: "reply to message 892104187", showOpenMessage: true },
      { type: "sent", actor: "Neethu V Mohan", time: "14:33" },
      { type: "seen", actor: "Sajith Salim", time: "14:40" },
      { type: "seen", actor: "Rahul R", time: "14:45" },
    ],
    hasReply: true, hasAttachment: false, isUnread: true,
    tags: [{ label: "CP-DRAFT", style: "green" }], moreTags: 0,
    inquiry: null,
  },
  {
    avatar: null, avatarColor: "", sender: "master@mv-helge.ham-ships.com",
    replyPrefix: "RE: ", subject: "MV HELGE - Notice of Readiness Houston",
    snippet: "Captain John Reyes, NOR tendered 0600 LT today, all fast and in free pratique. Awaiting berth instructions from the terminal...",
    body: "Dear Operators,\n\nCaptain John Reyes. NOR tendered 0600 LT today, all fast and in free pratique. Awaiting berth instructions from the terminal.\n\nRegards,\nMaster, MV HELGE",
    to: ["Chartering Team"], cc: ["Port Agent - Houston"], sentDate: "Sep 9 2026 06:15",
    attachments: [],
    thread: [
      {
        id: "helge-1", avatar: "PA", avatarColor: "bg-rose-500", sender: "Port Agent - Houston",
        to: ["Chartering Team", "master@mv-helge.ham-ships.com"], cc: [], sentDate: "Sep 9 2026 05:40",
        snippet: "Please advise ETA and confirm NOR tendering time for MV HELGE at Houston. Berth prospects currently tight...",
        body: "Dear Master / Operators,\n\nPlease advise ETA and confirm NOR tendering time for MV HELGE at Houston. Berth prospects are currently tight and the terminal is requesting an update.\n\nRegards,\nPort Agent - Houston",
        attachments: [],
      },
    ],
    activity: [{ type: "sent", actor: "Master, MV HELGE", time: "06:15" }],
    hasReply: true, hasAttachment: false, isUnread: true,
    tags: [{ label: "HEL 4102", style: "green" }], moreTags: 2,
    inquiry: null,
  },
  {
    avatar: "SS", avatarColor: "bg-gray-400", sender: "Sajith Salim - Chartering (UHL)",
    replyPrefix: "", subject: "Laycan Confirmation Required – MV OCEAN PEARL",
    snippet: "Owners are pressing for confirmation as the vessel completes prior discharge on the 18th and needs routing instructions...",
    body: "Hi,\n\nOwners are pressing for confirmation of laycan 20–25 Sep for MV OCEAN PEARL, as the vessel completes her prior discharge on the 18th and needs routing instructions.\n\nPlease revert urgently.\n\nThanks,\nSajith",
    to: ["Chartering Team"], cc: [], sentDate: "Sep 12 2026 14:11",
    attachments: [],
    activity: [
      { type: "sent", actor: "Sajith Salim", time: "14:11" },
      { type: "seen", actor: "Rahul R", time: "14:20" },
    ],
    hasReply: false, hasAttachment: false, flagged: true,
    tags: [{ label: "PEARL-0918", style: "green" }], moreTags: 0,
    inquiry: {
      cargoNumber: "CR-2026-217",
      indicationType: "", cargoCategory: "", cargoSubcategory: "", cargoName: "",
      baseCurrency: "US Dollar", conversionRateDate: "2026-09-12",
      relatedScope: "Chartering (UHL)", account: "", broker: "Sajith Salim - Chartering (UHL)",
      commissions: [],
      portsOfLoading: [{ ...EMPTY_PORT_ENTRY, layCanFrom: "2026-09-20", layCanTo: "2026-09-25" }],
      portsOfDischarge: [{ ...EMPTY_PORT_ENTRY }],
      cargoIncomeExpense: [],
      freightCalcType: "Lumpsum", freightCurrency: "US Dollar", freightRate: "",
      fixedByOffices: [], personInCharge: ["Sajith Salim"], legalEntity: "",
    },
  },
  {
    avatar: null, avatarColor: "", sender: "MASTER (MV BOREALIS)",
    replyPrefix: "RE: ", subject: "MV BOREALIS // Bunker Stem Confirmation Singapore",
    snippet: "Good morning, confirming receipt of 450 MT VLSFO and 50 MT MGO at the agreed anchorage slot...",
    body: "Good morning,\n\nConfirming receipt of 450 MT VLSFO and 50 MT MGO at the agreed anchorage slot. Bunker survey completed without discrepancy.\n\nRegards,\nMaster, MV BOREALIS",
    to: ["Chartering Team"], cc: ["Deepak Anthraper - Chartering (UHL)"], sentDate: "Sep 11 2026 09:40",
    attachments: [{ name: "Bunker_Survey_Report.pdf", size: "1.2MB" }],
    thread: [
      {
        id: "borealis-1", avatar: "NB", avatarColor: "bg-cyan-600", sender: "Owners - Nordic Bulk",
        to: ["MASTER (MV BOREALIS)"], cc: ["Chartering Team"], sentDate: "Sep 8 2026 22:10",
        snippet: "Please confirm receipt of bunker stem 450 MT VLSFO / 50 MT MGO at the agreed anchorage slot in Singapore...",
        body: "Master,\n\nPlease confirm receipt of the bunker stem - 450 MT VLSFO and 50 MT MGO - at the agreed anchorage slot in Singapore, and revert with sounding figures once complete.\n\nRegards,\nOwners, Nordic Bulk",
        attachments: [],
      },
    ],
    activity: [{ type: "sent", actor: "Master, MV BOREALIS", time: "09:40" }],
    hasReply: true, hasAttachment: false,
    tags: [{ label: "P-2026-041 - SINGAPORE BUNKERS", style: "green" }], moreTags: 1,
    inquiry: null,
  },
  {
    avatar: "CP", avatarColor: "bg-indigo-500", sender: "Clarksons Platou (Broker)",
    replyPrefix: "", subject: "Weekly Fixture List – Broker Circular",
    snippet: "Please find attached this week's fixture list covering recent Panamax and Supramax business across the Atlantic and Pacific basins...",
    body: "Dear Charterers,\n\nPlease find attached this week's fixture list covering recent Panamax and Supramax business across the Atlantic and Pacific basins.\n\nHappy to discuss any of the below or explore fresh tonnage for upcoming stems.\n\nBest regards,\nClarksons Platou",
    to: ["Chartering Team"], cc: [], sentDate: "Sep 10 2026 08:00",
    attachments: [{ name: "Weekly_Fixture_List.pdf", size: "340KB" }],
    activity: [{ type: "sent", actor: "Clarksons Platou", time: "08:00" }],
    hasReply: false, hasAttachment: true,
    tags: [], moreTags: 0,
    inquiry: null,
  },
  {
    avatar: "GS", avatarColor: "bg-sky-500", sender: "Global Shipping Co (Charterer)",
    replyPrefix: "", subject: "Freight Invoice – Voyage 2026-041",
    snippet: "Please find attached the freight invoice amounting to USD 682,500 as per the Charter Party terms...",
    body: "Dear Owners,\n\nPlease find attached the freight invoice for Voyage 2026-041, amounting to USD 682,500 as per the Charter Party terms. Kindly arrange payment within 5 banking days of B/L date.\n\nRegards,\nGlobal Shipping Co",
    to: ["Chartering Team"], cc: ["Femina Joseph - Chartering (UHL)"], sentDate: "Sep 9 2026 11:20",
    attachments: [{ name: "Invoice_2026-041.pdf", size: "98KB" }],
    activity: [{ type: "sent", actor: "Global Shipping Co", time: "11:20" }],
    hasReply: false, hasAttachment: true,
    tags: [{ label: "INV-2026-041", style: "green" }], moreTags: 0,
    inquiry: null,
  },
  {
    avatar: "NB", avatarColor: "bg-cyan-600", sender: "Owners - Nordic Bulk",
    replyPrefix: "", subject: "Demurrage Claim – MV STELLER",
    snippet: "We hereby submit our demurrage claim amounting to USD 38,400 based on 2 days 4 hours of delay beyond the allowed laytime...",
    body: "Dear Charterers,\n\nWe hereby submit our demurrage claim for MV STELLER amounting to USD 38,400, based on 2 days 4 hours of delay beyond the allowed laytime. Supporting SOF and laytime calculation attached.\n\nRegards,\nOwners, Nordic Bulk",
    to: ["Chartering Team"], cc: [], sentDate: "Sep 8 2026 16:45",
    attachments: [{ name: "Laytime_Calculation.xlsx", size: "54KB" }, { name: "SOF_MV_STELLER.pdf", size: "210KB" }],
    activity: [{ type: "sent", actor: "Owners, Nordic Bulk", time: "16:45" }],
    hasReply: false, hasAttachment: true, flagged: true,
    tags: [{ label: "STELLER-CLAIM", style: "purple" }], moreTags: 0,
    inquiry: null,
  },
  {
    avatar: "FJ", avatarColor: "bg-purple-500", sender: "Femina Joseph - Chartering (UHL)",
    replyPrefix: "", subject: "SOF Signed – Awaiting Approval",
    snippet: "The Statement of Facts for Voyage 2026-041 has been signed by all parties and is attached for your records...",
    body: "Hi Team,\n\nThe Statement of Facts for Voyage 2026-041 has been signed by all parties and is attached. Laytime used: 1 day 6 hours against 2 days allowed — no demurrage anticipated.\n\nRegards,\nFemina",
    to: ["Chartering Team"], cc: [], sentDate: "Sep 8 2026 10:05",
    attachments: [{ name: "SOF_Signed.pdf", size: "180KB" }],
    activity: [{ type: "sent", actor: "Femina Joseph", time: "10:05" }],
    hasReply: false, hasAttachment: true,
    tags: [{ label: "SOF-2026-041", style: "green" }], moreTags: 0,
    inquiry: null,
  },
  {
    avatar: "PR", avatarColor: "bg-rose-500", sender: "Port Agent - Rotterdam",
    replyPrefix: "", subject: "Port Agent Nomination – MV AQUAGEMINI",
    snippet: "Please confirm agent nomination and share berth prospects for the upcoming discharge call...",
    body: "Please confirm agent nomination and share berth prospects for the upcoming discharge call of MV AQUAGEMINI. ETA currently estimated 14 Sep 2026.\n\nRegards,\nPort Agent, Rotterdam",
    to: ["Chartering Team"], cc: [], sentDate: "Sep 7 2026 13:30",
    attachments: [],
    activity: [{ type: "sent", actor: "Port Agent, Rotterdam", time: "13:30" }],
    hasReply: false, hasAttachment: false,
    tags: [{ label: "AQUAGEMINI", style: "blue-outline" }], moreTags: 0,
    inquiry: null,
  },
  {
    avatar: "MK", avatarColor: "bg-amber-600", sender: "Mahmoud Khalil - Nile Project Logistics (Broker)",
    replyPrefix: "", subject: "Shipment Options – Port Sudan to Jeddah (Tree Frame & Crates)",
    snippet: "Thank you for reaching out. Please find the details below: Load Port Sudan, Discharge Jeddah, Tree Frame and Crates cargo, LTHH, laycan 2023–2024...",
    body: "Good morning,\n\nThank you for reaching out. We appreciate the opportunity to propose options for your shipment.\n\nPlease find the details below:\n\nLoad: Port Sudan\nDischarge: Jeddah\n\nCargo:\n1 x Tree Frame: Dimensions 5.63m x 5.69m x 4.5m, Weight 61 MT\n1 x Crate: Dimensions 9.5m x 8.2m x 2.2m, Weight 14 MT\n1 x Crate: Dimensions 2.9m x 3.5m x 1.8m, Weight 18 MT\n\nTerms: Liner terms hook/hook (LTHH)\nLaycan: 2023-2024\n\nAdditional Requirements:\nStowage: Can be both Under the deck and On the deck\nThis is a fragile cargo.\nPlease provide options for both standard part charter and last in first out.",
    to: ["Chartering Team"], cc: [], sentDate: "Sep 13 2026 09:20",
    attachments: [{ name: "Packing_List_PortSudan.pdf", size: "145KB" }],
    activity: [{ type: "sent", actor: "Mahmoud Khalil", time: "09:20" }],
    hasReply: false, hasAttachment: true, isUnread: true,
    tags: [], moreTags: 0,
    inquiry: {
      cargoNumber: "CR-2026-301",
      indicationType: "Part Charter", cargoCategory: "Breakbulk / Generals", cargoSubcategory: "Project Cargo",
      cargoName: "Tree Frame & Crates (3 pcs)", baseCurrency: "US Dollar", conversionRateDate: "2026-09-13",
      relatedScope: "Chartering (UHL)", account: "Mahmoud Khalil - Nile Project Logistics (Broker)",
      broker: "Mahmoud Khalil - Nile Project Logistics (Broker)",
      commissions: [],
      portsOfLoading: [{
        ...EMPTY_PORT_ENTRY, port: "Port Sudan, Sudan", term: "Liner Terms", unitNumber: "3", totalWeight: "93",
        remarks: "1x Tree Frame 5.63x5.69x4.5m / 61 MT; 1x Crate 9.5x8.2x2.2m / 14 MT; 1x Crate 2.9x3.5x1.8m / 18 MT. Fragile cargo. Stowage under or on deck. Laycan 2023–2024 (as advised).",
      }],
      portsOfDischarge: [{
        ...EMPTY_PORT_ENTRY, port: "Jeddah, Saudi Arabia", term: "Liner Terms",
        remarks: "Please provide options for both standard part charter and LIFO (last in first out).",
      }],
      cargoIncomeExpense: [],
      freightCalcType: "Lumpsum", freightCurrency: "US Dollar", freightRate: "",
      fixedByOffices: [], personInCharge: [], legalEntity: "",
    },
  },
  {
    avatar: "CM", avatarColor: "bg-sky-600", sender: "Carla Mendes - Pacific Heavylift Charterers",
    replyPrefix: "", subject: "Quote Request – San Francisco to Lagos (Oil Rig & Wind Equipment)",
    snippet: "We are in need of your assistance for an upcoming shipment. Port of Loading San Francisco, Port of Discharge Lagos. Dismantled oil rig, wind power equipment, monopiles...",
    body: "I hope this email finds you well. We are in need of your assistance for an upcoming shipment with the following details:\n\nPort of Loading: San Francisco (12/02/2023 - 20/12/2023)\nPort of Discharge: Lagos\n\nCargo Details:\n1 x DISMANTLED OIL RIG: Dimensions 5.2 x 6.5 x 7.2 meters, Weight 49 metric tons\n1 x Wind Power Equipment: Dimensions 2.5 x 2.3 x 4.8 meters, Weight 30 metric tons\n1 x Monopiles: Dimensions 7.2 x 6.5 x 1.4 meters, Weight 22 metric tons\n2 x TEU SOC (Shipper's Owned Container)\n\nTerms: LTHH (Liner Terms, Hook/Hook)\nLaycan: 2023-2024\n\nAdditional Specifications:\nLoading: Under deck\nLifting: Single hook lift only\nPart Charter Options: Last in first out.\nStackability: Non-stackable\n\nWe kindly request your support in providing us with suitable options for this shipment. We appreciate your prompt response and look forward to discussing the details further.\n\nThank you for your attention to this matter.\n\nBest regards,\nCarla",
    to: ["Chartering Team"], cc: [], sentDate: "Sep 13 2026 11:05",
    attachments: [],
    activity: [{ type: "sent", actor: "Carla Mendes", time: "11:05" }],
    hasReply: false, hasAttachment: false, isUnread: true,
    tags: [], moreTags: 0,
    inquiry: {
      cargoNumber: "CR-2026-302",
      indicationType: "Part Charter", cargoCategory: "Breakbulk / Generals", cargoSubcategory: "Project Cargo",
      cargoName: "Dismantled Oil Rig, Wind Equipment & Monopiles (5 pcs)", baseCurrency: "US Dollar", conversionRateDate: "2026-09-13",
      relatedScope: "Chartering (UHL)", account: "Carla Mendes - Pacific Heavylift Charterers",
      broker: "Carla Mendes - Pacific Heavylift Charterers",
      commissions: [],
      portsOfLoading: [{
        ...EMPTY_PORT_ENTRY, port: "San Francisco, USA", term: "Liner Terms", unitNumber: "5", totalWeight: "101",
        remarks: "1x Dismantled Oil Rig 5.2x6.5x7.2m / 49 MT; 1x Wind Power Equipment 2.5x2.3x4.8m / 30 MT; 1x Monopiles 7.2x6.5x1.4m / 22 MT; 2x TEU SOC. Loading window stated: 12/02/2023 – 20/12/2023. Under deck, single hook lift only, non-stackable.",
      }],
      portsOfDischarge: [{
        ...EMPTY_PORT_ENTRY, port: "Lagos, Nigeria", term: "Liner Terms",
        remarks: "Part charter - last in first out.",
      }],
      cargoIncomeExpense: [],
      freightCalcType: "Lumpsum", freightCurrency: "US Dollar", freightRate: "",
      fixedByOffices: [], personInCharge: [], legalEntity: "",
    },
  },
  {
    avatar: "JP", avatarColor: "bg-lime-600", sender: "Jonas Peeters - Antwerp Project Cargo BV (Broker)",
    replyPrefix: "", subject: "Firm Part Cargo – Antwerp to Singapore (Test Separators)",
    snippet: "Firm/our hands - part cargo, need self-sustained vessel, standard transit. 2x Test Separator 10.97 x 4.5 x 5.5m. POL Antwerp, POD Singapore...",
    body: "Hi\n\nFirm/our hands\n-partcargo\n-need selfsustained vessel\n-standard transit (plse adv expected TT)\n-2 x Test Separator LWH 10.97 x 4.5 x 5.5m / 91.000 kgs plus one small package,\n+/- 5 pct leverage in merchants option – see PL and drawings attached)\n-under deck and non-stack / non-overstowable\n-POL: Antwerp (BE), carriers berth out of Katoennatie or Zuidnatie\n-POD: Singapore, carriers berth, discharging to barge with\n\nPlease propose",
    to: ["Chartering Team"], cc: [], sentDate: "Sep 13 2026 13:47",
    attachments: [{ name: "PL_and_Drawings.pdf", size: "1.8MB" }],
    activity: [{ type: "sent", actor: "Jonas Peeters", time: "13:47" }],
    hasReply: false, hasAttachment: true, isUnread: true,
    tags: [], moreTags: 0,
    inquiry: {
      cargoNumber: "CR-2026-303",
      indicationType: "Part Charter", cargoCategory: "Breakbulk / Generals", cargoSubcategory: "Project Cargo",
      cargoName: "Test Separators (2 units) + small package", baseCurrency: "US Dollar", conversionRateDate: "2026-09-13",
      relatedScope: "Chartering (UHL)", account: "Jonas Peeters - Antwerp Project Cargo BV (Broker)",
      broker: "Jonas Peeters - Antwerp Project Cargo BV (Broker)",
      commissions: [],
      portsOfLoading: [{
        ...EMPTY_PORT_ENTRY, port: "Antwerp, Belgium (Katoennatie / Zuidnatie berth)", term: "Liner Terms", unitNumber: "3",
        remarks: "2x Test Separator 10.97 x 4.5 x 5.5m, approx. 91 MT each (+/-5% merchant's option), plus 1 small package. Under deck, non-stack / non-overstowable. Self-sustained vessel required. Firm, our hands - part cargo.",
      }],
      portsOfDischarge: [{
        ...EMPTY_PORT_ENTRY, port: "Singapore (carrier's berth, discharge to barge)", term: "Liner Terms",
        remarks: "Standard transit - please advise expected transit time.",
      }],
      cargoIncomeExpense: [],
      freightCalcType: "Lumpsum", freightCurrency: "US Dollar", freightRate: "",
      fixedByOffices: [], personInCharge: [], legalEntity: "",
    },
  },
  {
    avatar: "LA", avatarColor: "bg-violet-600", sender: "Lars Andersen - Nordic Wind Logistics (Charterer)",
    replyPrefix: "", subject: "RFQ – Wind Power Equipment, China to Denmark",
    snippet: "Please let us have your quote for the following: 1x Wind Power Equipment, POL Anshan or Shanghai, POD Copenhagen or Hadsund, appr. 10.25 x 8 x 2m, LSW appr. 150 T...",
    body: "Good day,\n\nPlease let us have your quote for the following:\n\n1x Wind Power Equipments, type Breakbulk / Generals\n\nPOL: Anshan or Shanghai\nPOD: Copenhagen or Hadsund\nDimensions: Appr. 10.25 x 8 x 2 m\nWeight: LSW appr. 150 T\nTOS: WK17 2026\n\nRemarks:\n- installed with lifting eyes\n- flat bottom so only dunnage needed to be stowed on deck.\n  see drawings and pics attached/below illustrating the same\n\nLooking forward to hearing from you.",
    to: ["Chartering Team"], cc: [], sentDate: "Sep 13 2026 16:12",
    attachments: [{ name: "Drawings_WindEquipment.pdf", size: "2.1MB" }],
    activity: [{ type: "sent", actor: "Lars Andersen", time: "16:12" }],
    hasReply: false, hasAttachment: true, isUnread: true,
    tags: [], moreTags: 0,
    inquiry: {
      cargoNumber: "CR-2026-304",
      indicationType: "GENCON fios", cargoCategory: "Breakbulk / Generals", cargoSubcategory: "Project Cargo",
      cargoName: "Wind Power Equipment (1 pc)", baseCurrency: "US Dollar", conversionRateDate: "2026-09-13",
      relatedScope: "Chartering (UHL)", account: "Lars Andersen - Nordic Wind Logistics (Charterer)",
      broker: "Lars Andersen - Nordic Wind Logistics (Charterer)",
      commissions: [],
      portsOfLoading: [{
        ...EMPTY_PORT_ENTRY, port: "Anshan or Shanghai, China", term: "Liner Terms", unitNumber: "1", totalVolume: "164", totalWeight: "150",
        remarks: "Dimensions approx. 10.25 x 8 x 2m, LSW approx. 150 T. TOS WK17 2026. Installed with lifting eyes, flat bottom - dunnage only needed on deck. Drawings/pics attached.",
      }],
      portsOfDischarge: [{
        ...EMPTY_PORT_ENTRY, port: "Copenhagen or Hadsund, Denmark", term: "Liner Terms",
      }],
      cargoIncomeExpense: [],
      freightCalcType: "Weight", freightCurrency: "US Dollar", freightRate: "",
      fixedByOffices: [], personInCharge: [], legalEntity: "",
    },
  },
  {
    avatar: "HL", avatarColor: "bg-slate-500", sender: "Heavy Lift Weekly (Broker Circular)",
    replyPrefix: "", subject: "Weekly Open Tonnage – Heavy Lift & Project Vessels",
    snippet: "Please find this week's open tonnage list for heavy lift and project vessels across Europe, West Africa, and the Far East...",
    body: "Dear Charterers,\n\nPlease find this week's open tonnage list for heavy lift and project vessels across Europe, West Africa, and the Far East.\n\nHappy to discuss positions or explore upcoming project stems.\n\nBest regards,\nHeavy Lift Weekly",
    to: ["Chartering Team"], cc: [], sentDate: "Sep 12 2026 08:15",
    attachments: [{ name: "Open_Tonnage_List.pdf", size: "410KB" }],
    activity: [{ type: "sent", actor: "Heavy Lift Weekly", time: "08:15" }],
    hasReply: false, hasAttachment: true,
    tags: [], moreTags: 0,
    inquiry: null,
  },
  {
    avatar: "PN", avatarColor: "bg-fuchsia-500", sender: "Priya Nair - Chartering (UHL)",
    replyPrefix: "", subject: "Missing B/L Copy – Urgent",
    snippet: "We're missing the signed B/L copy for the Antwerp shipment cleared last week. Customs in Singapore are holding up release pending this document...",
    body: "Hi Team,\n\nWe're missing the signed B/L copy for the Antwerp shipment cleared last week. Customs in Singapore are holding up release pending this document.\n\nCan someone resend at the earliest?\n\nThanks,\nPriya",
    to: ["Chartering Team"], cc: [], sentDate: "Sep 12 2026 10:40",
    attachments: [],
    activity: [{ type: "sent", actor: "Priya Nair", time: "10:40" }],
    hasReply: false, hasAttachment: false, flagged: true,
    tags: [], moreTags: 0,
    inquiry: null,
  },
  {
    avatar: null, avatarColor: "", sender: "Master (MV CONDOR)",
    replyPrefix: "", subject: "MV CONDOR - ETA Update Antwerp",
    snippet: "Revised ETA Antwerp now 06:00 LT tomorrow due to weather delay in the Channel. Will update further once pilot boarding is confirmed...",
    body: "Dear Operators,\n\nRevised ETA Antwerp now 06:00 LT tomorrow due to weather delay in the Channel. Will update further once pilot boarding is confirmed.\n\nRegards,\nMaster, MV CONDOR",
    to: ["Chartering Team"], cc: [], sentDate: "Sep 12 2026 18:30",
    attachments: [],
    activity: [{ type: "sent", actor: "Master, MV CONDOR", time: "18:30" }],
    hasReply: false, hasAttachment: false,
    tags: [], moreTags: 0,
    inquiry: null,
  },
  {
    avatar: "FN", avatarColor: "bg-orange-500", sender: "Finance - Nile Project Logistics",
    replyPrefix: "", subject: "Payment Reminder – Invoice PC-2026-014",
    snippet: "This is a gentle reminder that Invoice PC-2026-014 for USD 12,400 remains outstanding. Kindly arrange payment at your earliest convenience...",
    body: "Dear Sir/Madam,\n\nThis is a gentle reminder that Invoice PC-2026-014 for USD 12,400 remains outstanding. Kindly arrange payment at your earliest convenience.\n\nRegards,\nFinance Team",
    to: ["Chartering Team"], cc: [], sentDate: "Sep 11 2026 15:00",
    attachments: [{ name: "Invoice_PC-2026-014.pdf", size: "76KB" }],
    activity: [{ type: "sent", actor: "Finance Team", time: "15:00" }],
    hasReply: false, hasAttachment: true,
    tags: [], moreTags: 0,
    inquiry: null,
  },
];

const TAG_PILL_STYLES: Record<string, string> = {
  green: "bg-emerald-600 text-white",
  purple: "bg-purple-600 text-white",
  "blue-outline": "bg-white text-blue-600 border border-blue-400",
};

function SidebarSection({
  title,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-2">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600"
      >
        {expanded ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
        {title}
      </button>
      {expanded && <div>{children}</div>}
    </div>
  );
}

function useResizablePane(initialWidth: number, min: number, max: number) {
  const [width, setWidth] = useState(initialWidth);
  const ref = useRef<HTMLDivElement>(null);
  const resizing = useRef(false);

  const onMouseMove = (e: MouseEvent) => {
    if (!resizing.current || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setWidth(Math.min(max, Math.max(min, e.clientX - rect.left)));
  };

  const onMouseUp = () => {
    resizing.current = false;
    document.body.style.cursor = "";
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    resizing.current = true;
    document.body.style.cursor = "col-resize";
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return { width, ref, onMouseDown };
}

function useResizablePaneFromRight(initialWidth: number, min: number, max: number) {
  const [width, setWidth] = useState(initialWidth);
  const ref = useRef<HTMLDivElement>(null);
  const resizing = useRef(false);

  const onMouseMove = (e: MouseEvent) => {
    if (!resizing.current || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setWidth(Math.min(max, Math.max(min, rect.right - e.clientX)));
  };

  const onMouseUp = () => {
    resizing.current = false;
    document.body.style.cursor = "";
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    resizing.current = true;
    document.body.style.cursor = "col-resize";
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return { width, ref, onMouseDown };
}

function ResizeHandle({ onMouseDown }: { onMouseDown: (e: React.MouseEvent) => void }) {
  return (
    <div onMouseDown={onMouseDown} className="relative w-2.5 flex-shrink-0 cursor-col-resize group z-10">
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gray-200 group-hover:bg-blue-400 group-active:bg-blue-500 transition-colors" />
    </div>
  );
}

function InboxRowItem({ row, isSelected, onClick, compact }: { row: InboxRow; isSelected: boolean; onClick: () => void; compact: boolean }) {
  const senderBlock = (
    <div className={compact ? "" : "w-52 flex-shrink-0"}>
      <div className="flex items-center gap-2">
        <div className="size-6 flex-shrink-0 flex items-center justify-center relative">
          {row.avatar && (
            <div className={`size-6 rounded ${row.avatarColor} flex items-center justify-center`}>
              <span className="text-[9px] font-semibold text-white">{row.avatar}</span>
            </div>
          )}
          {row.isUnread && <span className="absolute -left-2 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-blue-600" />}
        </div>
        <span className="text-[13px] font-semibold text-gray-900 truncate">{row.sender}</span>
      </div>
      {(row.hasReply || row.hasAttachment) && (
        <div className="flex items-center gap-1.5 mt-1 pl-8 text-gray-400">
          {row.hasReply && <CornerUpLeft className="size-3" />}
          {row.hasAttachment && <Paperclip className="size-3" />}
        </div>
      )}
    </div>
  );

  const contentBlock = (
    <div className="min-w-0 flex-1">
      <p className="text-[13px] text-gray-900 flex items-center gap-1.5">
        <span className="truncate">
          <span className="text-gray-500">{row.replyPrefix}</span>
          {row.subject}
        </span>
        {(row.thread?.length ?? 0) > 0 && (
          <span className="text-[10px] font-medium text-gray-500 bg-gray-100 rounded-full px-1.5 py-0.5 flex-shrink-0">
            {row.thread!.length + 1}
          </span>
        )}
      </p>
      <p className="text-[12px] text-gray-500 truncate mt-0.5">{row.snippet}</p>
      {(row.tags.length > 0 || row.moreTags > 0) && (
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          {row.tags.map((tag) => (
            <span key={tag.label} className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold ${TAG_PILL_STYLES[tag.style]}`}>
              {tag.label}
            </span>
          ))}
          {row.moreTags > 0 && <span className="text-[11px] text-gray-400">+{row.moreTags}</span>}
          {row.flagged && <Flag className="size-3 text-rose-500 ml-0.5" />}
        </div>
      )}
    </div>
  );

  return (
    <div
      onClick={onClick}
      className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
        compact ? "flex flex-col gap-1" : "flex items-start gap-3"
      } ${isSelected ? "bg-blue-50" : row.isUnread ? "bg-blue-50/40" : ""}`}
    >
      {senderBlock}
      {contentBlock}
    </div>
  );
}

function ChipField({ label, values }: { label: string; values: string[] }) {
  if (values.length === 0) return null;
  return (
    <div className="flex items-start gap-3 mb-2">
      <span className="text-[13px] text-gray-500 w-8 flex-shrink-0 mt-1.5">{label}</span>
      <div className="flex items-center gap-1.5 flex-wrap">
        {values.map((v) => (
          <span key={v} className="text-[13px] text-gray-800 border border-gray-200 rounded px-2 py-1">
            {v}
          </span>
        ))}
      </div>
    </div>
  );
}

function ReadingPaneToolbar({
  isFollowing,
  onToggleFollow,
}: {
  isFollowing: boolean;
  onToggleFollow: () => void;
}) {
  return (
    <div className="flex items-center gap-1 px-4 flex-1 min-w-0">
      <button
        onClick={onToggleFollow}
        className={`flex items-center gap-1.5 text-[13px] font-medium rounded px-2 py-1.5 flex-shrink-0 transition-colors ${
          isFollowing ? "text-white bg-blue-600 hover:bg-blue-700" : "text-blue-600 hover:bg-blue-50"
        }`}
      >
        <Flag className="size-3.5" />
        {isFollowing ? "Following" : "Follow"}
      </button>
      <div className="w-px h-5 bg-gray-200 mx-1 flex-shrink-0" />
      <button title="Archive" className="p-1.5 rounded hover:bg-gray-100 text-gray-500 flex-shrink-0"><Archive className="size-4" /></button>
    </div>
  );
}

function MessageAvatar({ avatar, avatarColor }: { avatar: string | null; avatarColor: string }) {
  if (!avatar) {
    return (
      <div className="size-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
        <Mail className="size-3.5 text-gray-400" />
      </div>
    );
  }
  return (
    <div className={`size-7 rounded-full ${avatarColor} flex items-center justify-center flex-shrink-0`}>
      <span className="text-[10px] font-semibold text-white">{avatar}</span>
    </div>
  );
}

function AttachmentList({ attachments }: { attachments: { name: string; size: string }[] }) {
  if (attachments.length === 0) return null;
  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[13px] font-medium text-gray-700">
          {attachments.length} attachment{attachments.length > 1 ? "s" : ""}
        </p>
        <button className="flex items-center gap-1 text-[12px] text-blue-600 hover:underline">
          <Download className="size-3.5" />
          Download all
        </button>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        {attachments.map((a) => (
          <div key={a.name} className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2 w-64">
            <FileText className="size-6 text-rose-500 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-medium text-gray-900 truncate">{a.name}</p>
              <p className="text-[11px] text-gray-400">{a.size}</p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0 text-gray-400">
              <button title="Download"><Download className="size-3.5 hover:text-gray-600" /></button>
              <button title="Open"><ExternalLink className="size-3.5 hover:text-gray-600" /></button>
              <button title="Attach"><Paperclip className="size-3.5 hover:text-gray-600" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface MessageLike {
  avatar: string | null;
  avatarColor: string;
  sender: string;
  to: string[];
  cc: string[];
  sentDate: string;
  snippet: string;
  body: string;
  attachments: { name: string; size: string }[];
}

function MessageCard({
  message,
  defaultExpanded = false,
  emphasized = false,
}: {
  message: MessageLike;
  defaultExpanded?: boolean;
  emphasized?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <div className={emphasized ? "" : "border border-gray-200 rounded-md overflow-hidden bg-white"}>
      <button
        onClick={() => setExpanded((e) => !e)}
        className={`w-full flex items-center gap-3 text-left ${
          emphasized ? "py-3 -mx-2 px-2 rounded-md hover:bg-gray-50" : "px-3 py-2.5 hover:bg-gray-50"
        }`}
      >
        <MessageAvatar avatar={message.avatar} avatarColor={message.avatarColor} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className={`font-medium text-gray-800 truncate ${emphasized ? "text-[14px]" : "text-[13px]"}`}>{message.sender}</span>
            <span className="text-[11px] text-gray-400 flex-shrink-0 ml-2">{message.sentDate}</span>
          </div>
          {!expanded && <p className="text-[12px] text-gray-500 truncate mt-0.5">{message.snippet}</p>}
        </div>
        {expanded ? (
          <ChevronUp className="size-4 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="size-4 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {expanded && (
        <div className={emphasized ? "pt-2" : "px-3 pb-4 pt-1 border-t border-gray-100"}>
          <ChipField label="To" values={message.to} />
          <ChipField label="Cc" values={message.cc} />
          <p className="text-[13px] text-gray-800 leading-relaxed whitespace-pre-line mt-3">{message.body}</p>
          <AttachmentList attachments={message.attachments} />
        </div>
      )}
    </div>
  );
}

function ReadingPaneBody({ row }: { row: InboxRow }) {
  const priorMessages = row.thread ?? [];
  const currentMessage: MessageLike = {
    avatar: row.avatar, avatarColor: row.avatarColor, sender: row.sender,
    to: row.to, cc: row.cc, sentDate: row.sentDate, snippet: row.snippet,
    body: row.body, attachments: row.attachments,
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white min-w-0 px-6 py-5">
      <div className="flex items-center gap-2 mb-3">
        <h1 className="text-lg font-semibold text-gray-900">
          {row.replyPrefix}
          {row.subject}
        </h1>
        {priorMessages.length > 0 && (
          <span className="text-[11px] font-medium text-gray-500 bg-gray-100 rounded-full px-2 py-0.5 flex-shrink-0">
            {priorMessages.length + 1} messages
          </span>
        )}
      </div>

      <MessageCard key={rowKey(row)} message={currentMessage} defaultExpanded emphasized />

      {priorMessages.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-[12px] font-medium text-gray-500 mb-2">
            {priorMessages.length} earlier message{priorMessages.length > 1 ? "s" : ""} in this conversation
          </p>
          <div className="flex flex-col gap-2">
            {[...priorMessages].reverse().map((msg) => (
              <MessageCard key={msg.id} message={msg} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type SidePanelKey = "activity" | "tags" | "inquiry" | "voyage-estimate" | "fixture" | "voyage";

function ReadingPaneSideRail({
  activePanel,
  onSelectPanel,
  collapsed,
  onToggleCollapsed,
}: {
  activePanel: SidePanelKey | null;
  onSelectPanel: (panel: SidePanelKey) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  const items: { key: SidePanelKey; icon: typeof MessageSquare; title: string }[] = [
    { key: "inquiry", icon: FileSearch, title: "Inquiry" },
    { key: "voyage-estimate", icon: Calculator, title: "Voyage Estimate" },
    { key: "fixture", icon: FileText, title: "Fixture" },
    { key: "voyage", icon: Ship, title: "Voyage" },
    { key: "activity", icon: MessageSquare, title: "Activity" },
    { key: "tags", icon: Tag, title: "Tags" },
  ];

  return (
    <div className="w-10 flex-shrink-0 border-l border-r border-gray-200 bg-white flex flex-col items-center pt-2">
      <div className="flex flex-col gap-0">
        {items.map((item) => {
          const Icon = item.icon;
          const active = activePanel === item.key;
          return (
            <button
              key={item.key}
              title={item.title}
              onClick={() => onSelectPanel(item.key)}
              className={`size-7 rounded flex items-center justify-center transition-colors ${
                active ? "bg-gray-900 text-white" : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              <Icon className="size-4" />
            </button>
          );
        })}
      </div>

      <div className="flex-1" />

      <button
        title={collapsed ? "Show panel" : "Hide panel"}
        onClick={onToggleCollapsed}
        className="size-7 mb-1 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700"
      >
        {collapsed ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
      </button>
    </div>
  );
}

const ACTIVITY_ICONS: Record<ActivityEntry["type"], typeof Pencil> = {
  created: Pencil,
  edited: Pencil,
  queued: ChevronsRight,
  sent: Play,
  seen: Eye,
};

function activityText(entry: ActivityEntry) {
  switch (entry.type) {
    case "created":
      return { actor: entry.actor, rest: ` created this ${entry.detail}` };
    case "edited":
      return { actor: "", rest: `Edited by ${entry.actor}` };
    case "queued":
      return { actor: entry.actor, rest: " set message to send" };
    case "sent":
      return { actor: entry.actor, rest: " sent this" };
    case "seen":
      return { actor: "", rest: `Seen by ${entry.actor}` };
  }
}

function ActivityPanel({ row }: { row: InboxRow }) {
  const [comment, setComment] = useState("");

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-[13px] font-semibold text-gray-900">Activity</h2>
        <div className="flex items-center gap-1">
          <button className="p-1 rounded hover:bg-gray-100 text-gray-400"><Settings className="size-3.5" /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        <p className="text-[12px] text-gray-500 text-center mb-3">Today</p>
        <div className="space-y-2.5">
          {row.activity.map((entry, i) => {
            const Icon = ACTIVITY_ICONS[entry.type];
            const { actor, rest } = activityText(entry);
            return (
              <div key={i}>
                <div className="flex items-start gap-2">
                  <Icon className="size-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[12px] text-gray-600 leading-snug flex-1">
                    {actor && <span className="font-semibold text-gray-900">{actor}</span>}
                    <span>{rest}</span>
                  </p>
                  <span className="text-[11px] text-gray-400 flex-shrink-0">{entry.time}</span>
                </div>
                {entry.showOpenMessage && (
                  <button className="text-[12px] text-blue-600 hover:underline ml-5 mt-0.5">Open message</button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 py-2.5 border-t border-gray-200 flex-shrink-0">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Type a comment"
          className="flex-1 text-[13px] outline-none placeholder:text-gray-400"
        />
        <button
          onClick={() => setComment("")}
          className="size-7 flex-shrink-0 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50"
        >
          <ArrowUp className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

interface EmailTagState {
  job: string[];
  category: string[];
  follower: string[];
  private: string[];
}

const EMPTY_EMAIL_TAGS: EmailTagState = { job: [], category: [], follower: [], private: [] };

const JOB_TAG_POOL = Array.from(new Set(INBOX_ROWS.flatMap((r) => r.tags.map((t) => t.label)))).sort();

const CATEGORY_TAG_STARTERS = ["Urgent", "Follow-up Required", "Awaiting Client Response", "Internal Review"];
const PRIVATE_TAG_STARTERS = ["Review Later", "Needs My Approval"];
const FOLLOWER_ROSTER = [
  "Rahul R - Chartering (UHL)",
  "Neethu V Mohan - Chartering (UHL)",
  "Sajith Salim - Chartering (UHL)",
  "Femina Joseph - Chartering (UHL)",
  "Priya Nair - Chartering (UHL)",
  "Deepak Anthraper - Chartering (UHL)",
];

function autoJobTags(row: InboxRow, fixtures: FixtureTabState[]): string[] {
  const tags: string[] = [];
  if (row.inquiry) tags.push(row.inquiry.cargoNumber);
  fixtures.forEach((f) => {
    if (f.data.fixtureNumber) tags.push(f.data.fixtureNumber);
  });
  return tags;
}

function allTagLabelsForRow(row: InboxRow, fixtures: FixtureTabState[], emailTags: EmailTagState | undefined): string[] {
  const et = emailTags ?? EMPTY_EMAIL_TAGS;
  return Array.from(new Set([
    ...row.tags.map((t) => t.label),
    ...autoJobTags(row, fixtures),
    ...et.job, ...et.category, ...et.follower, ...et.private,
  ]));
}

function TagFacetSection({
  label,
  colorClass,
  autoTags,
  appliedTags,
  suggestionPool,
  allowFreeText,
  expanded,
  onToggleExpanded,
  onAdd,
  onRemove,
}: {
  label: string;
  colorClass: string;
  autoTags?: string[];
  appliedTags: string[];
  suggestionPool: string[];
  allowFreeText: boolean;
  expanded: boolean;
  onToggleExpanded: () => void;
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const remaining = suggestionPool.filter((t) => !appliedTags.includes(t) && !(autoTags ?? []).includes(t));

  const submitDraft = () => {
    const value = draft.trim();
    if (value && !appliedTags.includes(value)) onAdd(value);
    setDraft("");
  };

  return (
    <div>
      <p className="text-[13px] font-semibold text-gray-800 mb-2">{label}</p>

      {!!autoTags?.length && (
        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
          {autoTags.map((t) => (
            <span
              key={t}
              title="Auto-linked from this email's Inquiry/Fixture"
              className={`inline-flex items-center rounded px-2.5 py-1 text-[12px] font-medium ${colorClass}`}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {appliedTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
          {appliedTags.map((t) => (
            <span key={t} className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-[12px] font-medium ${colorClass}`}>
              {t}
              <button onClick={() => onRemove(t)} className="hover:text-red-600"><X className="size-3" /></button>
            </span>
          ))}
        </div>
      )}

      {suggestionPool.length > 0 && (
        <>
          <button onClick={onToggleExpanded} className="flex items-center gap-1 text-[12px] text-gray-400 hover:text-gray-600 mb-1.5">
            {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
            Suggestions
          </button>
          {expanded && (
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              {remaining.length > 0 ? (
                remaining.map((t) => (
                  <button
                    key={t}
                    onClick={() => onAdd(t)}
                    className="inline-flex items-center gap-1 rounded border border-dashed border-gray-300 px-2.5 py-1 text-[12px] text-gray-500 hover:border-gray-400 hover:text-gray-700"
                  >
                    <Plus className="size-3" />
                    {t}
                  </button>
                ))
              ) : (
                <span className="text-[11px] text-gray-400">No more suggestions</span>
              )}
            </div>
          )}
        </>
      )}

      {allowFreeText && (
        <div className="flex items-center gap-1.5 mt-1">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submitDraft();
              }
            }}
            placeholder={`Add ${label.toLowerCase()} tag`}
            className="h-8 text-[12px] flex-1"
          />
          <button onClick={submitDraft} className="flex items-center gap-1 text-[13px] text-blue-600 hover:underline flex-shrink-0">
            <Plus className="size-3.5" /> Add
          </button>
        </div>
      )}
    </div>
  );
}

function TagsPanel({
  row,
  fixtures,
  emailTags,
  categoryPool,
  privatePool,
  onAddTag,
  onRemoveTag,
}: {
  row: InboxRow;
  fixtures: FixtureTabState[];
  emailTags: EmailTagState;
  categoryPool: string[];
  privatePool: string[];
  onAddTag: (facet: keyof EmailTagState, value: string) => void;
  onRemoveTag: (facet: keyof EmailTagState, value: string) => void;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const toggleExpanded = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-[13px] font-semibold text-gray-900">Tags</h2>
        <div className="flex items-center gap-1">
          <button className="p-1 rounded hover:bg-gray-100 text-gray-400"><Settings className="size-3.5" /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5">
        <TagFacetSection
          label="Job"
          colorClass="bg-emerald-100 text-emerald-800"
          autoTags={autoJobTags(row, fixtures)}
          appliedTags={emailTags.job}
          suggestionPool={JOB_TAG_POOL}
          allowFreeText={false}
          expanded={expanded.has("job")}
          onToggleExpanded={() => toggleExpanded("job")}
          onAdd={(v) => onAddTag("job", v)}
          onRemove={(v) => onRemoveTag("job", v)}
        />
        <TagFacetSection
          label="Category"
          colorClass="bg-blue-100 text-blue-800"
          appliedTags={emailTags.category}
          suggestionPool={categoryPool}
          allowFreeText
          expanded={expanded.has("category")}
          onToggleExpanded={() => toggleExpanded("category")}
          onAdd={(v) => onAddTag("category", v)}
          onRemove={(v) => onRemoveTag("category", v)}
        />
        <TagFacetSection
          label="Follower"
          colorClass="bg-purple-100 text-purple-800"
          appliedTags={emailTags.follower}
          suggestionPool={FOLLOWER_ROSTER}
          allowFreeText={false}
          expanded={expanded.has("follower")}
          onToggleExpanded={() => toggleExpanded("follower")}
          onAdd={(v) => onAddTag("follower", v)}
          onRemove={(v) => onRemoveTag("follower", v)}
        />
        <TagFacetSection
          label="Private"
          colorClass="bg-amber-100 text-amber-800"
          appliedTags={emailTags.private}
          suggestionPool={privatePool}
          allowFreeText
          expanded={expanded.has("private")}
          onToggleExpanded={() => toggleExpanded("private")}
          onAdd={(v) => onAddTag("private", v)}
          onRemove={(v) => onRemoveTag("private", v)}
        />
      </div>
    </div>
  );
}

const LOADING_TERM_OPTIONS = ["FIOST", "FIOS", "FIO", "Liner Terms", "Gross Terms"];
const TRANSIT_OPTIONS = ["None", "Transshipment Allowed", "Direct Only"];

function PortSection({
  title,
  entry,
  onChange,
  showLaycan,
  showTransit,
}: {
  title: string;
  entry: PortEntry;
  onChange: (next: PortEntry) => void;
  showLaycan?: boolean;
  showTransit?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const set = (k: keyof PortEntry, v: string) => onChange({ ...entry, [k]: v });

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
        <button className="text-gray-500 hover:text-gray-900"><Plus className="size-4" /></button>
      </div>
      <div className="border border-gray-200 rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
          <button onClick={() => setCollapsed((c) => !c)} className="text-gray-400 hover:text-gray-600">
            <ChevronUp className={`size-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
          <button className="text-gray-400 hover:text-red-600"><Trash2 className="size-4" /></button>
        </div>
        {!collapsed && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[12px] text-red-500 mb-1 block">Search Ports</Label>
                <Input value={entry.port} onChange={(e) => set("port", e.target.value)} placeholder="Search Ports" />
              </div>
              <div>
                <Label className="text-[12px] text-gray-500 mb-1 block">{showTransit ? "Discharge Term" : "Loading Terms"}</Label>
                <Select value={entry.term} onValueChange={(v) => set("term", v)}>
                  <SelectTrigger><SelectValue placeholder="Select term" /></SelectTrigger>
                  <SelectContent>
                    {LOADING_TERM_OPTIONS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {showLaycan && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[12px] text-gray-500 mb-1 block">Laycan From</Label>
                  <DatePicker value={entry.layCanFrom} onChange={(v) => set("layCanFrom", v)} />
                </div>
                <div>
                  <Label className="text-[12px] text-gray-500 mb-1 block">Laycan To</Label>
                  <DatePicker value={entry.layCanTo} onChange={(v) => set("layCanTo", v)} />
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 gap-3">
              <div>
                <Label className="text-[12px] text-gray-500 mb-1 block">Unit/Number <span className="text-gray-400 font-normal">nos</span></Label>
                <Input value={entry.unitNumber} onChange={(e) => set("unitNumber", e.target.value)} />
              </div>
              <div>
                <Label className="text-[12px] text-red-500 mb-1 block">Total Volume <span className="text-gray-400 font-normal">cbm</span></Label>
                <Input value={entry.totalVolume} onChange={(e) => set("totalVolume", e.target.value)} />
              </div>
              <div>
                <Label className="text-[12px] text-red-500 mb-1 block">Total Weight <span className="text-gray-400 font-normal">mts</span></Label>
                <Input value={entry.totalWeight} onChange={(e) => set("totalWeight", e.target.value)} />
              </div>
              <div>
                <Label className="text-[12px] text-gray-500 mb-1 block">Freight Ton <span className="text-gray-400 font-normal">frts</span></Label>
                <Input value={entry.freightTon} onChange={(e) => set("freightTon", e.target.value)} />
              </div>
            </div>

            {showTransit && (
              <div>
                <Label className="text-[12px] text-gray-500 mb-1 block">Transit Requirements</Label>
                <Select value={entry.transitRequirements} onValueChange={(v) => set("transitRequirements", v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {TRANSIT_OPTIONS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label className="text-[12px] text-gray-500 mb-1 block">{showTransit ? "Discharge Term Remarks" : "Loading Term Remarks"}</Label>
              <Textarea value={entry.remarks} onChange={(e) => set("remarks", e.target.value)} rows={2} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CargoIncomeRow({
  entry,
  onChange,
  onDelete,
}: {
  entry: CargoIncomeEntry;
  onChange: (next: CargoIncomeEntry) => void;
  onDelete: () => void;
}) {
  const set = (k: keyof CargoIncomeEntry, v: string) => onChange({ ...entry, [k]: v });
  return (
    <tr className="border-t border-gray-100">
      <td className="py-2 pr-3"><Input value={entry.accountHead} onChange={(e) => set("accountHead", e.target.value)} placeholder="Account Head" className="h-8 text-[12px]" /></td>
      <td className="py-2 pr-3"><Input value={entry.particulars} onChange={(e) => set("particulars", e.target.value)} placeholder="Particulars" className="h-8 text-[12px]" /></td>
      <td className="py-2 pr-3">
        <Select value={entry.terms} onValueChange={(v) => set("terms", v)}>
          <SelectTrigger className="h-8 text-[12px]"><SelectValue /></SelectTrigger>
          <SelectContent>{["Lumpsum", "Per Unit", "Per MT"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
        </Select>
      </td>
      <td className="py-2 pr-3 w-20"><Input value={entry.rate} onChange={(e) => set("rate", e.target.value)} placeholder="rate" className="h-8 text-[12px]" /></td>
      <td className="py-2 pr-3 w-16"><Input value={entry.qty} onChange={(e) => set("qty", e.target.value)} className="h-8 text-[12px]" /></td>
      <td className="py-2 pr-3 w-28">
        <div className="flex items-center gap-1">
          <span className="text-gray-400">฿</span>
          <Input value={entry.amount} onChange={(e) => set("amount", e.target.value)} className="h-8 text-[12px]" />
        </div>
      </td>
      <td className="py-2 w-8">
        <button onClick={onDelete} className="text-gray-400 hover:text-red-600"><X className="size-4" /></button>
      </td>
    </tr>
  );
}

function TagPillField({
  values,
  options,
  colorClass,
  placeholder,
  onAdd,
  onRemove,
}: {
  values: string[];
  options: string[];
  colorClass: string;
  placeholder: string;
  onAdd: (v: string) => void;
  onRemove: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {values.map((v) => (
        <span key={v} className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[12px] ${colorClass}`}>
          {v}
          <button onClick={() => onRemove(v)} className="hover:text-red-600"><X className="size-3" /></button>
        </span>
      ))}
      <Select onValueChange={(v) => { if (!values.includes(v)) onAdd(v); }}>
        <SelectTrigger className="h-7 w-40 text-[11px]"><SelectValue placeholder={placeholder} /></SelectTrigger>
        <SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}

function num(v: string) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  "US Dollar": "$", "Thai Baht": "฿", Euro: "€", "Singapore Dollar": "S$",
};

function generateCargoNumber(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return `CR-2026-${100 + (hash % 900)}`;
}

function generateFixtureNumber(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return `FX-2026-${100 + (hash % 900)}`;
}

interface VoyageEstimateRow {
  estimateNumber: string;
  estimateName: string;
  vesselName: string;
  createdOn: string;
  createdBy: string;
}

interface VoyageEstimateGroup {
  groupId: string;
  groupType: "inquiry" | "fixture";
  groupLabel: string;
  groupSubLabel: string;
  estimates: VoyageEstimateRow[];
}

const VOYAGE_ESTIMATE_VESSELS = ["UHL FREEDOM", "MV FAITH", "MV OCEAN PEARL", "MV HELGE", "MV BOREALIS", "MV STELLAR HORIZON"];
const VOYAGE_ESTIMATE_ROUTES = ["Rauma - Dung Quat", "Durban - Rotterdam", "Houston - Singapore", "Antwerp - Lagos", "Shanghai - Copenhagen", "Port Sudan - Jebel Ali"];
const VOYAGE_ESTIMATE_PEOPLE = ["Leif Müller", "Jesper Larsen", "Sajith Salim", "Neethu V Mohan", "Rahul Ramesh"];
const VOYAGE_ESTIMATE_DATES = ["25/03/2024", "02/06/2024", "14/11/2024", "09/01/2025", "22/04/2025", "17/09/2026"];

function hashSeed(text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  return hash;
}

function generateVoyageEstimatesForSeed(seedText: string, count: number, baseRoute: string | null): VoyageEstimateRow[] {
  const seed = hashSeed(seedText);
  return Array.from({ length: count }, (_, i) => {
    const n = seed + i * 97;
    return {
      estimateNumber: `EST-2026-${100 + (n % 900)}-${i + 1}`,
      estimateName: i === 0 && baseRoute ? baseRoute : VOYAGE_ESTIMATE_ROUTES[(n >>> 2) % VOYAGE_ESTIMATE_ROUTES.length],
      vesselName: VOYAGE_ESTIMATE_VESSELS[(n >>> 4) % VOYAGE_ESTIMATE_VESSELS.length],
      createdOn: VOYAGE_ESTIMATE_DATES[(n >>> 5) % VOYAGE_ESTIMATE_DATES.length],
      createdBy: VOYAGE_ESTIMATE_PEOPLE[(n >>> 1) % VOYAGE_ESTIMATE_PEOPLE.length],
    };
  });
}

function generateVoyageEstimateGroups(row: InboxRow, fixtures: FixtureTabState[]): VoyageEstimateGroup[] {
  const groups: VoyageEstimateGroup[] = [];

  if (row.inquiry) {
    const loadPort = row.inquiry.portsOfLoading[0]?.port;
    const dischargePort = row.inquiry.portsOfDischarge[0]?.port;
    const baseRoute = loadPort && dischargePort ? `${loadPort} - ${dischargePort}` : null;
    const seedText = `${rowKey(row)}__inquiry`;
    const count = 2 + (hashSeed(seedText) % 2);
    groups.push({
      groupId: `inquiry-${row.inquiry.cargoNumber}`,
      groupType: "inquiry",
      groupLabel: row.inquiry.cargoNumber,
      groupSubLabel: row.inquiry.cargoName,
      estimates: generateVoyageEstimatesForSeed(seedText, count, baseRoute),
    });
  }

  fixtures.forEach((fixture) => {
    const loadPort = fixture.data.portsOfLoading[0]?.port;
    const dischargePort = fixture.data.portsOfDischarge[0]?.port;
    const baseRoute = loadPort && dischargePort ? `${loadPort} - ${dischargePort}` : null;
    const seedText = `${rowKey(row)}__fixture__${fixture.id}`;
    const count = 1 + (hashSeed(seedText) % 2);
    groups.push({
      groupId: `fixture-${fixture.id}`,
      groupType: "fixture",
      groupLabel: fixture.data.fixtureNumber,
      groupSubLabel: fixture.data.cargoName,
      estimates: generateVoyageEstimatesForSeed(seedText, count, baseRoute),
    });
  });

  return groups;
}

function InquiryFieldsEditor<T extends InquiryData>({
  row,
  data,
  onChange,
}: {
  row: InboxRow;
  data: T;
  onChange: (updater: (prev: T) => T) => void;
}) {
  const set = <K extends keyof InquiryData>(k: K, v: InquiryData[K]) => onChange((prev) => ({ ...prev, [k]: v }));

  const updatePort = (list: "portsOfLoading" | "portsOfDischarge", index: number, next: PortEntry) => {
    onChange((prev) => {
      const arr = [...prev[list]];
      arr[index] = next;
      return { ...prev, [list]: arr };
    });
  };

  const updateCommission = (i: number, next: CommissionEntry) => {
    onChange((prev) => { const arr = [...prev.commissions]; arr[i] = next; return { ...prev, commissions: arr }; });
  };
  const addCommission = () => {
    onChange((prev) => ({ ...prev, commissions: [...prev.commissions, { type: "HQ", name: "", rate: "", applyTo: [] }] }));
  };
  const removeCommission = (i: number) => {
    onChange((prev) => ({ ...prev, commissions: prev.commissions.filter((_, idx) => idx !== i) }));
  };

  const updateCargoIncomeRow = (i: number, next: CargoIncomeEntry) => {
    onChange((prev) => { const arr = [...prev.cargoIncomeExpense]; arr[i] = next; return { ...prev, cargoIncomeExpense: arr }; });
  };
  const addCargoIncomeRow = () => {
    onChange((prev) => ({ ...prev, cargoIncomeExpense: [...prev.cargoIncomeExpense, { accountHead: "", particulars: "", terms: "Lumpsum", rate: "", qty: "1", amount: "" }] }));
  };
  const deleteCargoIncomeRow = (i: number) => {
    onChange((prev) => ({ ...prev, cargoIncomeExpense: prev.cargoIncomeExpense.filter((_, idx) => idx !== i) }));
  };

  const ports = [...data.portsOfLoading, ...data.portsOfDischarge];
  const summary = {
    unitNumber: ports.reduce((s, p) => s + num(p.unitNumber), 0),
    totalVolume: ports.reduce((s, p) => s + num(p.totalVolume), 0),
    totalWeight: ports.reduce((s, p) => s + num(p.totalWeight), 0),
    freightTon: ports.reduce((s, p) => s + num(p.freightTon), 0),
  };
  const grossAmount = num(data.freightRate) * (num(data.portsOfLoading[0]?.totalWeight) || 1);
  const currencySymbol = CURRENCY_SYMBOLS[data.freightCurrency] ?? "$";

  return (
        <div className="flex-1 overflow-y-auto p-6 space-y-8 text-[13px]">
          {/* Cargo Details */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-sm">Cargo Details</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-[12px] text-red-500 mb-1 block">Indication Type</Label>
                <Select value={data.indicationType} onValueChange={(v) => set("indicationType", v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{["GENCON fios", "NYPE", "Voyage Charter", "Time Charter", "Part Charter"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[12px] text-red-500 mb-1 block">Cargo Category</Label>
                <Select value={data.cargoCategory} onValueChange={(v) => set("cargoCategory", v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{["Breakbulk / Generals", "Bulk", "Container", "Liquid Bulk"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-[12px] text-gray-500 mb-1 block">Cargo Subcategory</Label>
                <Select value={data.cargoSubcategory} onValueChange={(v) => set("cargoSubcategory", v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{["Steel Products", "Machinery", "Project Cargo", "Minerals"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[12px] text-red-500 mb-1 block">Cargo Name</Label>
                <Input value={data.cargoName} onChange={(e) => set("cargoName", e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[12px] text-gray-500 mb-1 block">Base Currency</Label>
                <Select value={data.baseCurrency} onValueChange={(v) => set("baseCurrency", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["US Dollar", "Thai Baht", "Euro", "Singapore Dollar"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[12px] text-gray-500 mb-1 block">Conversion Rate As On</Label>
                <DatePicker value={data.conversionRateDate} onChange={(v) => set("conversionRateDate", v)} />
              </div>
            </div>
          </div>

          {/* Client */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-sm">Client</h3>
              <button className="flex items-center gap-1 text-[12px] bg-gray-800 text-white px-2.5 py-1.5 rounded hover:bg-gray-700">
                <Plus className="size-3.5" /> Add New Client
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-[12px] text-gray-500 mb-1 block">Related Scope</Label>
                <Select value={data.relatedScope} onValueChange={(v) => set("relatedScope", v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{["Chartering (UHL)", "Chartering (Admaren)"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[12px] text-gray-500 mb-1 block">Account</Label>
                <Select value={data.account} onValueChange={(v) => set("account", v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{Array.from(new Set([row.sender, "Rahul R - Chartering (UHL)", "Sajith Salim - Chartering (UHL)"])).map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[12px] text-gray-500 mb-1 block">Broker</Label>
                <Select value={data.broker} onValueChange={(v) => set("broker", v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{Array.from(new Set([row.sender, "Clarksons Platou (Broker)"])).map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Commissions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-sm">Commissions</h3>
              <button onClick={addCommission} className="flex items-center gap-1 text-[12px] bg-gray-800 text-white px-2.5 py-1.5 rounded hover:bg-gray-700">
                <Plus className="size-3.5" /> Add New Commission
              </button>
            </div>
            <div className="space-y-3">
              {data.commissions.map((c, i) => (
                <div key={i} className="border border-gray-200 rounded-md p-4">
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <Label className="text-[11px] text-gray-500 mb-1 block">Choose Type</Label>
                      <Select value={c.type} onValueChange={(v) => updateCommission(i, { ...c, type: v })}>
                        <SelectTrigger className="h-8 text-[12px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{["HQ", "Branch"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-[11px] text-gray-500 mb-1 block">Choose Name</Label>
                      <Select value={c.name} onValueChange={(v) => updateCommission(i, { ...c, name: v })}>
                        <SelectTrigger className="h-8 text-[12px]"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>{["Management Fee", "Address Commission", "Broker Commission"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label className="text-[11px] text-gray-500 mb-1 block">Add Rate</Label>
                        <div className="flex items-center gap-1">
                          <Input value={c.rate} onChange={(e) => updateCommission(i, { ...c, rate: e.target.value })} className="h-8 text-[12px]" />
                          <span className="text-gray-500 text-[12px]">%</span>
                        </div>
                      </div>
                      <button onClick={() => removeCommission(i)} className="text-gray-400 hover:text-red-600 mb-1.5"><Trash2 className="size-4" /></button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-[11px] text-gray-500 mb-1.5 block">Apply To</Label>
                    <TagPillField
                      values={c.applyTo}
                      options={["Additional Freight", "Detention / Demurrage / Despatch", "Freight"]}
                      colorClass="bg-gray-700 text-white"
                      placeholder="+ Add"
                      onAdd={(v) => updateCommission(i, { ...c, applyTo: [...c.applyTo, v] })}
                      onRemove={(v) => updateCommission(i, { ...c, applyTo: c.applyTo.filter((x) => x !== v) })}
                    />
                  </div>
                </div>
              ))}
              {data.commissions.length === 0 && <p className="text-[12px] text-gray-400">No commissions added.</p>}
            </div>
          </div>

          <PortSection
            title="Port of Loading"
            entry={data.portsOfLoading[0]}
            onChange={(next) => updatePort("portsOfLoading", 0, next)}
            showLaycan
          />

          <PortSection
            title="Port of Discharge"
            entry={data.portsOfDischarge[0]}
            onChange={(next) => updatePort("portsOfDischarge", 0, next)}
            showTransit
          />

          {/* Cargo Measurement Summary */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Cargo Measurement Summary</h3>
            <div className="grid grid-cols-4 gap-4 bg-gray-50 rounded-md p-4 border border-gray-100">
              <div>
                <div className="text-gray-400 text-[11px] mb-1">Unit/Number</div>
                <div className="text-gray-900 font-medium">{summary.unitNumber} nos.</div>
              </div>
              <div>
                <div className="text-gray-400 text-[11px] mb-1">Total Volume</div>
                <div className="text-gray-900 font-medium">{summary.totalVolume} cbm</div>
              </div>
              <div>
                <div className="text-gray-400 text-[11px] mb-1">Total Weight</div>
                <div className="text-gray-900 font-medium">{summary.totalWeight} mts</div>
              </div>
              <div>
                <div className="text-gray-400 text-[11px] mb-1">Freight Ton</div>
                <div className="text-gray-900 font-medium">{summary.freightTon} frts</div>
              </div>
            </div>
          </div>

          {/* Cargo Income/Expense */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900 text-sm">Cargo Income/Expense</h3>
              <button onClick={addCargoIncomeRow} className="flex items-center gap-1 text-[12px] text-blue-600 hover:underline">
                <Plus className="size-3.5" /> Add Row
              </button>
            </div>
            {data.cargoIncomeExpense.length > 0 ? (
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="pb-2 font-medium">Account Head</th>
                    <th className="pb-2 font-medium">Particulars</th>
                    <th className="pb-2 font-medium">Terms</th>
                    <th className="pb-2 font-medium">Rate</th>
                    <th className="pb-2 font-medium">Qty</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {data.cargoIncomeExpense.map((entry, i) => (
                    <CargoIncomeRow
                      key={i}
                      entry={entry}
                      onChange={(next) => updateCargoIncomeRow(i, next)}
                      onDelete={() => deleteCargoIncomeRow(i)}
                    />
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-[12px] text-gray-400">No entries yet.</p>
            )}
          </div>

          {/* Freight Details */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-sm">Freight Details</h3>
            <div className="mb-4">
              <Label className="text-[12px] text-gray-500 mb-2 block">Freight Calc Type</Label>
              <RadioGroup value={data.freightCalcType} onValueChange={(v) => set("freightCalcType", v)} className="flex items-center gap-6">
                {["Lumpsum", "Units", "Volume", "Weight", "Freight Ton"].map((t) => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value={t} />
                    <span className="text-gray-700">{t}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-[12px] text-gray-500 mb-1 block">Freight Currency</Label>
                <Select value={data.freightCurrency} onValueChange={(v) => set("freightCurrency", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["US Dollar", "Thai Baht", "Euro"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[12px] text-gray-500 mb-1 block">Freight Rate</Label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">{currencySymbol}</span>
                  <Input value={data.freightRate} onChange={(e) => set("freightRate", e.target.value)} />
                </div>
              </div>
            </div>
            <div className="text-gray-700">
              Gross Amount: <span className="font-medium text-gray-900">{currencySymbol} {grossAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Chartering */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-sm">Chartering</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-[12px] text-gray-500 mb-1.5 block">Fixed By (Offices)</Label>
                <TagPillField
                  values={data.fixedByOffices}
                  options={["UHL HQ Chartering", "Admaren HQ Chartering"]}
                  colorClass="bg-gray-100 text-gray-700"
                  placeholder="+ Add office"
                  onAdd={(v) => set("fixedByOffices", [...data.fixedByOffices, v])}
                  onRemove={(v) => set("fixedByOffices", data.fixedByOffices.filter((x) => x !== v))}
                />
              </div>
              <div>
                <Label className="text-[12px] text-gray-500 mb-1.5 block">Person in charge</Label>
                <TagPillField
                  values={data.personInCharge}
                  options={["Rahul R", "Sajith Salim", "Neethu V Mohan", "Deepak Anthraper"]}
                  colorClass="bg-emerald-100 text-emerald-800"
                  placeholder="+ Add person"
                  onAdd={(v) => set("personInCharge", [...data.personInCharge, v])}
                  onRemove={(v) => set("personInCharge", data.personInCharge.filter((x) => x !== v))}
                />
              </div>
              <div>
                <Label className="text-[12px] text-gray-500 mb-1 block">Legal Entity</Label>
                <Select value={data.legalEntity} onValueChange={(v) => set("legalEntity", v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{["ADMAREN TECH", "UHL Singapore Pte Ltd"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
  );
}

interface InquiryTabState {
  id: string;
  isAiCreated: boolean;
  created: boolean;
  convertedToFixture: boolean;
  data: InquiryData;
}

function InquiryTabsPanel({
  row,
  onClose,
  onConvertToFixture,
}: {
  row: InboxRow;
  onClose: () => void;
  onConvertToFixture: (data: InquiryData) => void;
}) {
  const [tabs, setTabs] = useState<InquiryTabState[]>(() =>
    row.inquiry
      ? [{ id: "ai", isAiCreated: true, created: true, convertedToFixture: false, data: row.inquiry }]
      : [{ id: "manual-1", isAiCreated: false, created: false, convertedToFixture: false, data: { ...EMPTY_INQUIRY_DATA } }]
  );
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const [showInquiryDetail, setShowInquiryDetail] = useState(false);
  const nextIdRef = useRef(1);

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  const updateActiveTabData = (updater: (prev: InquiryData) => InquiryData) => {
    setTabs((prev) => prev.map((t) => (t.id === activeTabId ? { ...t, data: updater(t.data) } : t)));
  };

  const addTab = () => {
    nextIdRef.current += 1;
    const id = `manual-${nextIdRef.current}`;
    const newTab: InquiryTabState = {
      id,
      isAiCreated: false,
      created: false,
      convertedToFixture: false,
      data: row.inquiry
        ? {
            ...row.inquiry,
            cargoNumber: "",
            commissions: row.inquiry.commissions.map((c) => ({ ...c, applyTo: [...c.applyTo] })),
            portsOfLoading: row.inquiry.portsOfLoading.map((p) => ({ ...p })),
            portsOfDischarge: row.inquiry.portsOfDischarge.map((p) => ({ ...p })),
            cargoIncomeExpense: row.inquiry.cargoIncomeExpense.map((c) => ({ ...c })),
            fixedByOffices: [...row.inquiry.fixedByOffices],
            personInCharge: [...row.inquiry.personInCharge],
          }
        : { ...EMPTY_INQUIRY_DATA },
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(id);
  };

  const removeTab = (id: string) => {
    setTabs((prev) => {
      const next = prev.filter((t) => t.id !== id);
      if (next.length === 0) {
        onClose();
        return prev;
      }
      if (id === activeTabId) setActiveTabId(next[0].id);
      return next;
    });
  };

  const markCreated = () => {
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? { ...t, created: true, data: { ...t.data, cargoNumber: t.data.cargoNumber || generateCargoNumber(`${row.subject}#${t.id}`) } }
          : t
      )
    );
  };

  const handleConvertToFixture = () => {
    onConvertToFixture(activeTab.data);
    setTabs((prev) => prev.map((t) => (t.id === activeTabId ? { ...t, convertedToFixture: true } : t)));
  };

  const summary = (() => {
    const ports = [...activeTab.data.portsOfLoading, ...activeTab.data.portsOfDischarge];
    return {
      unitNumber: ports.reduce((s, p) => s + num(p.unitNumber), 0),
      totalVolume: ports.reduce((s, p) => s + num(p.totalVolume), 0),
      totalWeight: ports.reduce((s, p) => s + num(p.totalWeight), 0),
    };
  })();

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex items-center gap-1 px-2 pt-2 border-b border-gray-200 flex-shrink-0 overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`group flex items-center gap-1 pl-3 pr-1.5 py-1.5 text-[12px] font-medium rounded-t-md border-b-2 flex-shrink-0 cursor-pointer transition-colors ${
              tab.id === activeTabId ? "border-gray-900 text-gray-900 bg-gray-50" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.isAiCreated ? (
              <Sparkles className="size-3 text-emerald-600 flex-shrink-0" />
            ) : tab.created ? (
              <Check className="size-3 text-emerald-600 flex-shrink-0" />
            ) : null}
            <span className="whitespace-nowrap">{tab.created ? tab.data.cargoNumber : "New Inquiry"}</span>
            {!tab.isAiCreated && (
              <button
                onClick={(e) => { e.stopPropagation(); removeTab(tab.id); }}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        ))}
        <button onClick={addTab} title="Add manual inquiry" className="p-1.5 mb-1 rounded hover:bg-gray-100 text-gray-500 flex-shrink-0">
          <Plus className="size-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 flex-shrink-0 min-h-[2.25rem]">
        {activeTab.isAiCreated && (
          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-2 py-0.5 flex-shrink-0">
            <Sparkles className="size-3" /> AI-created
          </span>
        )}
        {!row.inquiry && !activeTab.created && (
          <span className="flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5 flex-shrink-0">
            <AlertCircle className="size-3" /> Not Enough data to Create Inquiry, Create Manually
          </span>
        )}
        {activeTab.created ? (
          <button
            onClick={() => setShowInquiryDetail(true)}
            className="text-[13px] font-semibold text-blue-600 hover:underline truncate"
          >
            {activeTab.data.cargoNumber}
          </button>
        ) : (
          !activeTab.isAiCreated && row.inquiry && (
            <span className="text-[13px] font-medium text-gray-400 truncate">New Inquiry</span>
          )
        )}
        <div className="flex-1" />
        {activeTab.created && (
          <button
            onClick={handleConvertToFixture}
            disabled={activeTab.convertedToFixture}
            className={`flex items-center gap-1 text-[12px] font-medium rounded px-2.5 py-1 flex-shrink-0 transition-colors ${
              activeTab.convertedToFixture
                ? "text-emerald-700 bg-emerald-50 border border-emerald-200 cursor-default"
                : "text-white bg-gray-900 hover:bg-gray-800"
            }`}
          >
            {activeTab.convertedToFixture ? (
              <>
                <Check className="size-3.5" /> Converted to Fixture
              </>
            ) : (
              <>
                <FileText className="size-3.5" /> Convert to Fixture
              </>
            )}
          </button>
        )}
      </div>

      <InquiryFieldsEditor row={row} data={activeTab.data} onChange={updateActiveTabData} />

      {!activeTab.created && (
        <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-gray-200 flex-shrink-0">
          <button onClick={() => removeTab(activeTab.id)} className="px-4 py-2 rounded text-[13px] font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
          <button onClick={markCreated} className="px-4 py-2 rounded bg-gray-900 text-white text-[13px] font-medium hover:bg-gray-800">
            Create Inquiry
          </button>
        </div>
      )}

      {showInquiryDetail && (
        <InquiryDetail
          inquiry={{
            cargoNumber: activeTab.data.cargoNumber,
            name: activeTab.data.cargoName,
            description: activeTab.data.portsOfLoading[0]?.remarks || activeTab.data.portsOfDischarge[0]?.remarks || "",
            unitNumber: summary.unitNumber || activeTab.data.portsOfLoading[0]?.unitNumber,
            totalVolume: summary.totalVolume || activeTab.data.portsOfLoading[0]?.totalVolume,
            totalWeight: summary.totalWeight || activeTab.data.portsOfLoading[0]?.totalWeight,
          }}
          onClose={() => setShowInquiryDetail(false)}
        />
      )}
    </div>
  );
}

interface FixtureTabState {
  id: string;
  isConverted: boolean;
  created: boolean;
  data: FixtureData;
}

function FixturePortCard({
  title,
  entry,
  onChange,
  showLayCan,
  showTransit,
}: {
  title: string;
  entry: FixturePortEntry;
  onChange: (next: FixturePortEntry) => void;
  showLayCan?: boolean;
  showTransit?: boolean;
}) {
  const set = (k: keyof FixturePortEntry, v: string) => onChange({ ...entry, [k]: v });
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-900 text-[13px]">{title}</h4>
        <Plus className="size-4 text-gray-400" />
      </div>
      <div className="border border-gray-200 rounded-md p-4">
        <div className="flex justify-end gap-3 mb-3 text-gray-400">
          <Check className="size-4" />
          <Trash2 className="size-4" />
        </div>
        <div className="mb-3">
          <Label className="text-[12px] text-red-500 mb-1 block">Search Ports</Label>
          <Input value={entry.port} onChange={(e) => set("port", e.target.value)} placeholder="Search Ports" />
        </div>
        <div className="grid grid-cols-4 gap-3 mb-3">
          <div>
            <Label className="text-[11px] text-gray-500 mb-1 block">Unit/Number <span className="text-gray-400 font-normal">nos</span></Label>
            <Input className="h-8 text-[12px]" value={entry.unitNumber} onChange={(e) => set("unitNumber", e.target.value)} />
          </div>
          <div>
            <Label className="text-[11px] text-gray-500 mb-1 block">Total Volume <span className="text-gray-400 font-normal">cbm</span></Label>
            <Input className="h-8 text-[12px]" value={entry.totalVolume} onChange={(e) => set("totalVolume", e.target.value)} />
          </div>
          <div>
            <Label className="text-[11px] text-gray-500 mb-1 block">Total Weight <span className="text-gray-400 font-normal">mts</span></Label>
            <Input className="h-8 text-[12px]" value={entry.totalWeight} onChange={(e) => set("totalWeight", e.target.value)} />
          </div>
          <div>
            <Label className="text-[11px] text-gray-500 mb-1 block">Freight Ton <span className="text-gray-400 font-normal">frts</span></Label>
            <Input className="h-8 text-[12px]" value={entry.freightTon} onChange={(e) => set("freightTon", e.target.value)} />
          </div>
        </div>
        {showLayCan && (
          <div>
            <Label className="text-[12px] text-gray-500 mb-1 block">LAY/CAN</Label>
            <Input value={entry.layCan} onChange={(e) => set("layCan", e.target.value)} />
          </div>
        )}
        {showTransit && (
          <div>
            <Label className="text-[12px] text-gray-500 mb-1 block">Transit Requirements</Label>
            <Select value={entry.transitRequirements} onValueChange={(v) => set("transitRequirements", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{TRANSIT_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}

function FixtureCargoDimensionCard({
  entry,
  onChange,
  onDelete,
}: {
  entry: FixtureCargoDimension;
  onChange: (next: FixtureCargoDimension) => void;
  onDelete: () => void;
}) {
  const set = (k: keyof FixtureCargoDimension, v: string | boolean) => onChange({ ...entry, [k]: v } as FixtureCargoDimension);
  return (
    <div className="border border-gray-200 rounded-md p-4">
      <div className="grid grid-cols-3 gap-4 mb-3 items-end">
        <div>
          <Label className="text-[11px] text-red-500 mb-1 block">Cargo Name</Label>
          <Input className="h-8 text-[12px]" value={entry.cargoName} onChange={(e) => set("cargoName", e.target.value)} />
        </div>
        <div>
          <Label className="text-[11px] text-gray-500 mb-1 block">Stowage</Label>
          <Select value={entry.stowage} onValueChange={(v) => set("stowage", v)}>
            <SelectTrigger className="h-8 text-[12px]"><SelectValue /></SelectTrigger>
            <SelectContent>{["Both", "Under Deck", "On Deck"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-[12px] text-gray-600 flex-shrink-0">
            <Checkbox checked={entry.stackable} onCheckedChange={(v) => set("stackable", !!v)} /> Stackable
          </label>
          <div className="flex-1" />
          <Check className="size-4 text-gray-400 flex-shrink-0" />
          <button onClick={onDelete} className="flex-shrink-0"><Trash2 className="size-4 text-gray-400 hover:text-red-600" /></button>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-3">
        <div>
          <Label className="text-[11px] text-gray-500 mb-1 block">Length <span className="text-gray-400 font-normal">m</span></Label>
          <Input className="h-8 text-[12px]" value={entry.length} onChange={(e) => set("length", e.target.value)} />
        </div>
        <div>
          <Label className="text-[11px] text-gray-500 mb-1 block">Breadth <span className="text-gray-400 font-normal">m</span></Label>
          <Input className="h-8 text-[12px]" value={entry.breadth} onChange={(e) => set("breadth", e.target.value)} />
        </div>
        <div>
          <Label className="text-[11px] text-gray-500 mb-1 block">Height <span className="text-gray-400 font-normal">m</span></Label>
          <Input className="h-8 text-[12px]" value={entry.height} onChange={(e) => set("height", e.target.value)} />
        </div>
        <div>
          <Label className="text-[11px] text-gray-500 mb-1 block">Volume <span className="text-gray-400 font-normal">cbm</span></Label>
          <Input className="h-8 text-[12px]" value={entry.volume} onChange={(e) => set("volume", e.target.value)} />
        </div>
        <div>
          <Label className="text-[11px] text-gray-500 mb-1 block">Weight <span className="text-gray-400 font-normal">mts</span></Label>
          <Input className="h-8 text-[12px]" value={entry.weight} onChange={(e) => set("weight", e.target.value)} />
        </div>
        <div>
          <Label className="text-[11px] text-gray-500 mb-1 block">No of Units <span className="text-gray-400 font-normal">nos</span></Label>
          <Input className="h-8 text-[12px]" value={entry.units} onChange={(e) => set("units", e.target.value)} />
        </div>
      </div>
    </div>
  );
}

function EmailTagField({ values, onAdd, onRemove }: { values: string[]; onAdd: (v: string) => void; onRemove: (v: string) => void }) {
  const [draft, setDraft] = useState("");
  return (
    <div className="border-b border-gray-200 pb-1.5">
      <div className="flex flex-wrap items-center gap-1.5">
        {values.map((v) => (
          <span key={v} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 rounded px-2 py-1 text-[12px]">
            {v}
            <button onClick={() => onRemove(v)} className="hover:text-red-600"><X className="size-3" /></button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && draft.trim()) {
              e.preventDefault();
              onAdd(draft.trim());
              setDraft("");
            }
          }}
          placeholder={values.length === 0 ? "Type an email and press Enter" : ""}
          className="flex-1 min-w-[120px] text-[13px] outline-none placeholder:text-gray-400 py-1"
        />
      </div>
    </div>
  );
}

function FixtureAccordionSection({
  title,
  index,
  expanded,
  onToggle,
  hasErrors,
  children,
}: {
  title: string;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  hasErrors: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-2 px-5 py-3.5 text-left hover:bg-gray-50"
      >
        <span className="flex items-center gap-2 text-[13.5px] font-semibold text-gray-900">
          {hasErrors ? (
            <AlertCircle className="size-4 text-red-500 flex-shrink-0" />
          ) : (
            <span className="size-5 rounded-full bg-gray-100 text-gray-600 text-[11px] font-medium flex items-center justify-center flex-shrink-0">
              {index}
            </span>
          )}
          {title}
        </span>
        {expanded ? (
          <ChevronUp className="size-4 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="size-4 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {expanded && <div className="px-5 pb-6 space-y-6 text-[13px]">{children}</div>}
    </div>
  );
}

function FixtureTabsPanel({
  row,
  fixtures,
  onAddFixture,
  onUpdateFixture,
  onClose,
}: {
  row: InboxRow;
  fixtures: FixtureTabState[];
  onAddFixture: (data: FixtureData) => void;
  onUpdateFixture: (id: string, updater: (prev: FixtureData) => FixtureData) => void;
  onClose: () => void;
}) {
  const [draftTabs, setDraftTabs] = useState<FixtureTabState[]>(() =>
    fixtures.length === 0 ? [{ id: "fx-draft-1", isConverted: false, created: false, data: { ...EMPTY_FIXTURE_DATA } }] : []
  );
  const nextDraftId = useRef(1);

  const allTabs = [...fixtures, ...draftTabs];
  const [activeTabId, setActiveTabId] = useState(allTabs[allTabs.length - 1]?.id ?? "");
  const [showFixtureDetail, setShowFixtureDetail] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<FixtureStep>>(new Set(["Cargo"]));

  const activeTab = allTabs.find((t) => t.id === activeTabId) ?? allTabs[allTabs.length - 1];
  const isDraft = draftTabs.some((t) => t.id === activeTab?.id);

  const toggleSection = (step: FixtureStep) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(step)) next.delete(step);
      else next.add(step);
      return next;
    });
  };

  const updateActiveTabData = (updater: (prev: FixtureData) => FixtureData) => {
    if (isDraft) {
      setDraftTabs((prev) => prev.map((t) => (t.id === activeTabId ? { ...t, data: updater(t.data) } : t)));
    } else {
      onUpdateFixture(activeTabId, updater);
    }
  };

  const setActiveField = <K extends keyof FixtureData>(k: K, v: FixtureData[K]) => {
    updateActiveTabData((prev) => ({ ...prev, [k]: v }));
  };

  const addTab = () => {
    nextDraftId.current += 1;
    const id = `fx-draft-${nextDraftId.current}`;
    setDraftTabs((prev) => [...prev, { id, isConverted: false, created: false, data: { ...EMPTY_FIXTURE_DATA } }]);
    setActiveTabId(id);
    setExpandedSections(new Set(["Cargo"]));
  };

  const removeTab = (id: string) => {
    setDraftTabs((prev) => {
      const next = prev.filter((t) => t.id !== id);
      const remaining = [...fixtures, ...next];
      if (remaining.length === 0) {
        onClose();
        return prev;
      }
      if (id === activeTabId) setActiveTabId(remaining[remaining.length - 1].id);
      return next;
    });
  };

  const markCreated = () => {
    const tab = draftTabs.find((t) => t.id === activeTabId);
    if (!tab) return;
    const finalData: FixtureData = {
      ...tab.data,
      fixtureNumber: tab.data.fixtureNumber || generateFixtureNumber(`${row.subject}#${tab.id}`),
    };
    onAddFixture(finalData);
    setDraftTabs((prev) => prev.filter((t) => t.id !== activeTabId));
  };

  if (!activeTab) return null;

  const data = activeTab.data;
  const requiredFlags = fixtureRequiredFields(data);
  const progressPct = Math.round((requiredFlags.filter(Boolean).length / requiredFlags.length) * 100);

  // Port helpers
  const updatePort = (list: "portsOfLoading" | "portsOfDischarge", next: FixturePortEntry) => {
    updateActiveTabData((prev) => ({ ...prev, [list]: [next] }));
  };

  // Commission helpers
  const addCommission = () => updateActiveTabData((prev) => ({ ...prev, commissions: [...prev.commissions, { type: "HQ", name: "", rate: "", applyTo: [] }] }));
  const updateCommission = (i: number, next: FixtureCommissionEntry) => updateActiveTabData((prev) => { const arr = [...prev.commissions]; arr[i] = next; return { ...prev, commissions: arr }; });
  const removeCommission = (i: number) => updateActiveTabData((prev) => ({ ...prev, commissions: prev.commissions.filter((_, idx) => idx !== i) }));
  const grossCommission = data.commissions.reduce((s, c) => s + num(c.rate), 0);

  // Cargo dimension helpers
  const addCargoDimension = () =>
    updateActiveTabData((prev) => ({
      ...prev,
      cargoDimensions: [...prev.cargoDimensions, { cargoName: "", stowage: "Both", stackable: false, length: "", breadth: "", height: "", volume: "", weight: "", units: "" }],
    }));
  const updateCargoDimension = (i: number, next: FixtureCargoDimension) =>
    updateActiveTabData((prev) => { const arr = [...prev.cargoDimensions]; arr[i] = next; return { ...prev, cargoDimensions: arr }; });
  const removeCargoDimension = (i: number) => updateActiveTabData((prev) => ({ ...prev, cargoDimensions: prev.cargoDimensions.filter((_, idx) => idx !== i) }));

  // Invoice helpers
  const addInvoice = () => updateActiveTabData((prev) => ({ ...prev, invoices: [...prev.invoices, { type: "Management", raisedBy: "HQ", invoiceNo: "", dueDate: "", status: "To Be Issued" }] }));
  const updateInvoice = (i: number, next: FixtureInvoiceEntry) => updateActiveTabData((prev) => { const arr = [...prev.invoices]; arr[i] = next; return { ...prev, invoices: arr }; });
  const removeInvoice = (i: number) => updateActiveTabData((prev) => ({ ...prev, invoices: prev.invoices.filter((_, idx) => idx !== i) }));

  const grossAmount = num(data.freightRate) * (num(data.totalWeight) || 1);
  const currencySymbol = CURRENCY_SYMBOLS[data.freightCurrency] ?? "$";
  const balanceAmount = data.commissions.reduce((s, c) => s + num(c.rate), 0);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex items-center gap-1 px-2 pt-2 border-b border-gray-200 flex-shrink-0 overflow-x-auto">
        {allTabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`group flex items-center gap-1 pl-3 pr-1.5 py-1.5 text-[12px] font-medium rounded-t-md border-b-2 flex-shrink-0 cursor-pointer transition-colors ${
              tab.id === activeTabId ? "border-gray-900 text-gray-900 bg-gray-50" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.isConverted ? (
              <Sparkles className="size-3 text-emerald-600 flex-shrink-0" />
            ) : tab.created ? (
              <Check className="size-3 text-emerald-600 flex-shrink-0" />
            ) : null}
            <span className="whitespace-nowrap">{tab.created ? tab.data.fixtureNumber : "New Fixture"}</span>
            {!tab.isConverted && (
              <button
                onClick={(e) => { e.stopPropagation(); removeTab(tab.id); }}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        ))}
        <button onClick={addTab} title="Add manual fixture" className="p-1.5 mb-1 rounded hover:bg-gray-100 text-gray-500 flex-shrink-0">
          <Plus className="size-4" />
        </button>
      </div>

      {/* Title / progress row */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {activeTab.isConverted && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-2 py-0.5 flex-shrink-0">
              <Sparkles className="size-3" /> Converted from Inquiry
            </span>
          )}
          {activeTab.created ? (
            <button onClick={() => setShowFixtureDetail(true)} className="text-[13px] font-semibold text-blue-600 hover:underline truncate">
              {data.fixtureNumber}
            </button>
          ) : (
            <h2 className="text-[13px] font-semibold text-gray-900 truncate">Add New Fixture</h2>
          )}
        </div>
        {isDraft && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[12px] font-semibold text-amber-600">{progressPct}% Completed</span>
            <div className="w-20 h-1.5 rounded-full bg-gray-200 overflow-hidden">
              <div className="h-full bg-amber-400" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Collapsible sections */}
      <div className="flex-1 overflow-y-auto">
        <FixtureAccordionSection
          title="Cargo"
          index={1}
          expanded={expandedSections.has("Cargo")}
          onToggle={() => toggleSection("Cargo")}
          hasErrors={isDraft && fixtureStepHasErrors("Cargo", data)}
        >
              <div>
                <Label className="text-[12px] text-gray-500 mb-1 block">Fixture Type</Label>
                <Select value={data.fixtureType} onValueChange={(v) => setActiveField("fixtureType", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["Chartered Fixture", "COA Fixture", "Relet Fixture"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Cargo Details</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-[12px] text-red-500 mb-1 block">Cargo Name</Label>
                    <Input value={data.cargoName} onChange={(e) => setActiveField("cargoName", e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-[12px] text-gray-500 mb-1 block">Cargo Description</Label>
                    <Textarea value={data.cargoDescription} onChange={(e) => setActiveField("cargoDescription", e.target.value)} rows={2} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[12px] text-red-500 mb-1 block">Cargo Category</Label>
                      <Select value={data.cargoCategory} onValueChange={(v) => setActiveField("cargoCategory", v)}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>{["Breakbulk / Generals", "Bulk", "Container", "Liquid Bulk"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-[12px] text-gray-500 mb-1 block">Cargo Subcategory</Label>
                      <Select value={data.cargoSubcategory} onValueChange={(v) => setActiveField("cargoSubcategory", v)}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>{["Steel Products", "Machinery", "Project Cargo", "Minerals"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <Label className="text-[11px] text-gray-500 mb-1 block">Unit/Number <span className="text-gray-400 font-normal">nos.</span></Label>
                      <Input className="h-8 text-[12px]" value={data.unitNumber} onChange={(e) => setActiveField("unitNumber", e.target.value)} />
                    </div>
                    <div>
                      <Label className="text-[11px] text-red-500 mb-1 block">Total Volume <span className="text-gray-400 font-normal">cbm</span></Label>
                      <Input className="h-8 text-[12px]" value={data.totalVolume} onChange={(e) => setActiveField("totalVolume", e.target.value)} />
                      {num(data.totalVolume) <= 0 && <p className="text-[10px] text-red-500 mt-0.5">Value should be greater than zero</p>}
                    </div>
                    <div>
                      <Label className="text-[11px] text-red-500 mb-1 block">Total Weight <span className="text-gray-400 font-normal">mts</span></Label>
                      <Input className="h-8 text-[12px]" value={data.totalWeight} onChange={(e) => setActiveField("totalWeight", e.target.value)} />
                      {num(data.totalWeight) <= 0 && <p className="text-[10px] text-red-500 mt-0.5">Value should be greater than zero</p>}
                    </div>
                    <div>
                      <Label className="text-[11px] text-gray-500 mb-1 block">Freight Ton <span className="text-gray-400 font-normal">frts</span></Label>
                      <Input className="h-8 text-[12px]" value={data.freightTon} onChange={(e) => setActiveField("freightTon", e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-[12px] text-gray-500 mb-1 block">Cargo Relet</Label>
                    <Select value={data.cargoRelet} onValueChange={(v) => setActiveField("cargoRelet", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{["Not Checked", "Checked", "Relet"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Freight Details</h3>
                <div className="mb-4">
                  <Label className="text-[12px] text-gray-500 mb-2 block">Freight Calc Type</Label>
                  <RadioGroup value={data.freightCalcType} onValueChange={(v) => setActiveField("freightCalcType", v)} className="flex items-center gap-5 flex-wrap">
                    {["Lumpsum", "Units", "Volume", "Weight", "Freight Ton"].map((t) => (
                      <label key={t} className="flex items-center gap-1.5 cursor-pointer">
                        <RadioGroupItem value={t} />
                        <span className="text-gray-700">{t}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-[12px] text-gray-500 mb-1 block">Freight Currency</Label>
                    <Select value={data.freightCurrency} onValueChange={(v) => setActiveField("freightCurrency", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{["US Dollar", "Thai Baht", "Euro"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[12px] text-red-500 mb-1 block">Freight Rate</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">{currencySymbol}</span>
                      <Input value={data.freightRate} onChange={(e) => setActiveField("freightRate", e.target.value)} />
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">Gross Amount: <span className="font-medium text-gray-900">{currencySymbol} {grossAmount.toLocaleString()}</span></p>
                <div className="space-y-3">
                  <div>
                    <Label className="text-[12px] text-gray-500 mb-1 block">Comments</Label>
                    <Textarea value={data.comments} onChange={(e) => setActiveField("comments", e.target.value)} rows={2} />
                  </div>
                  <div>
                    <Label className="text-[12px] text-gray-500 mb-1 block">Payment Terms</Label>
                    <Textarea value={data.paymentTerms} onChange={(e) => setActiveField("paymentTerms", e.target.value)} rows={2} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Cargo Dimensions</h3>
                <button onClick={addCargoDimension} className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[12px] font-medium rounded mb-3">
                  Add Cargo Dimensions
                </button>
                <div className="space-y-3">
                  {data.cargoDimensions.map((dim, i) => (
                    <FixtureCargoDimensionCard key={i} entry={dim} onChange={(next) => updateCargoDimension(i, next)} onDelete={() => removeCargoDimension(i)} />
                  ))}
                </div>
              </div>
        </FixtureAccordionSection>

        <FixtureAccordionSection
          title="Chartering"
          index={2}
          expanded={expandedSections.has("Chartering")}
          onToggle={() => toggleSection("Chartering")}
          hasErrors={isDraft && fixtureStepHasErrors("Chartering", data)}
        >
              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Scope Details</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-[12px] text-gray-500 mb-1 block">Project Name</Label>
                    <Select value={data.projectName} onValueChange={(v) => setActiveField("projectName", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{["General", "Heavy Lift", "Project Cargo"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[12px] text-gray-500 mb-1 block">Related Scope</Label>
                    <Select value={data.relatedScope} onValueChange={(v) => setActiveField("relatedScope", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{["Chartering (UHL)", "Chartering (Admaren)"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[12px] text-gray-500 mb-1.5 block">Fixed By (Offices)</Label>
                    <TagPillField
                      values={data.fixedByOffices}
                      options={["UNITED HEAVY TRANSPORT GmbH – Headquarters", "UHL HQ Chartering", "Admaren HQ Chartering"]}
                      colorClass="bg-gray-100 text-gray-700"
                      placeholder="+ Add office"
                      onAdd={(v) => setActiveField("fixedByOffices", [...data.fixedByOffices, v])}
                      onRemove={(v) => setActiveField("fixedByOffices", data.fixedByOffices.filter((x) => x !== v))}
                    />
                  </div>
                  <div>
                    <Label className="text-[12px] text-gray-500 mb-1.5 block">Persons in charge</Label>
                    <TagPillField
                      values={data.personsInCharge}
                      options={["Rahul R", "Sajith Salim", "Neethu V Mohan", "Deepak Anthraper", "Tester Admaren"]}
                      colorClass="bg-emerald-100 text-emerald-800"
                      placeholder="+ Add person"
                      onAdd={(v) => setActiveField("personsInCharge", [...data.personsInCharge, v])}
                      onRemove={(v) => setActiveField("personsInCharge", data.personsInCharge.filter((x) => x !== v))}
                    />
                  </div>
                  <div>
                    <Label className="text-[12px] text-gray-500 mb-1 block">Legal Entity</Label>
                    <Select value={data.legalEntity} onValueChange={(v) => setActiveField("legalEntity", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{["UHL HQ Chartering", "ADMAREN TECH", "UHL Singapore Pte Ltd"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[12px] text-gray-500 mb-1 block">Booking Date</Label>
                      <Input value={data.bookingDate} onChange={(e) => setActiveField("bookingDate", e.target.value)} placeholder="DD/MM/YYYY, HH:MM:SS" />
                    </div>
                    <div>
                      <Label className="text-[12px] text-gray-500 mb-1 block">Timezone</Label>
                      <Select value={data.timezone} onValueChange={(v) => setActiveField("timezone", v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{["(UTC-5:00) America/Toronto", "(UTC+0:00) London", "(UTC+4:00) Dubai", "(UTC+8:00) Singapore"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-[12px] text-gray-500 mb-1 block">Fixture Status</Label>
                    <Select value={data.fixtureStatus} onValueChange={(v) => setActiveField("fixtureStatus", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{["Not Loaded", "Loaded", "Fixed", "Completed", "Cancelled"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Vessel Details</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[12px] text-gray-500 mb-1 block">Intended Vessel Type</Label>
                      <Select value={data.intendedVesselType} onValueChange={(v) => setActiveField("intendedVesselType", v)}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>{["Bulk Carrier", "Heavy Lift", "General Cargo", "Container"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-[12px] text-gray-500 mb-1 block">Intended Vessel</Label>
                      <Select value={data.intendedVessel} onValueChange={(v) => setActiveField("intendedVessel", v)}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>{["MV FAITH", "MV OCEAN PEARL", "MV HELGE", "MV BOREALIS"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-[12px] text-gray-500 mb-1 block">Final Performer</Label>
                    <Select value={data.finalPerformer} onValueChange={(v) => setActiveField("finalPerformer", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{["MV FAITH", "MV OCEAN PEARL", "MV HELGE", "MV BOREALIS"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Demurrage</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[12px] text-gray-500 mb-1 block">Demurrage PDPR</Label>
                      <Input className="h-8 text-[12px]" value={data.demurragePdpr} onChange={(e) => setActiveField("demurragePdpr", e.target.value)} />
                    </div>
                    <div>
                      <Label className="text-[12px] text-gray-500 mb-1 block">Unit</Label>
                      <Select value={data.demurrageUnit} onValueChange={(v) => setActiveField("demurrageUnit", v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{["day", "hour"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-[12px] text-gray-500 mb-1 block">Demurrage Duration</Label>
                    <Input className="h-8 text-[12px]" value={data.demurrageDuration} onChange={(e) => setActiveField("demurrageDuration", e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-[12px] text-gray-500 mb-1 block">Demurrage Gross Amount</Label>
                    <p className="text-gray-900 font-medium">$ {(num(data.demurragePdpr) * num(data.demurrageDuration)).toLocaleString()}</p>
                  </div>
                  <label className="flex items-center gap-1.5 text-[12px] text-gray-600">
                    <Checkbox checked={data.bunkerAdjustmentFactor} onCheckedChange={(v) => setActiveField("bunkerAdjustmentFactor", !!v)} /> Bunker Adjustment Factor
                  </label>
                  <div>
                    <Label className="text-[12px] text-gray-500 mb-1 block">BAF Comments</Label>
                    <Textarea value={data.bafComments} onChange={(e) => setActiveField("bafComments", e.target.value)} rows={2} />
                  </div>
                </div>
              </div>
        </FixtureAccordionSection>

        <FixtureAccordionSection
          title="Client"
          index={3}
          expanded={expandedSections.has("Client")}
          onToggle={() => toggleSection("Client")}
          hasErrors={isDraft && fixtureStepHasErrors("Client", data)}
        >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-sm">Client Details</h3>
                  <button className="text-gray-500 hover:text-gray-900"><Plus className="size-4" /></button>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <Label className="text-[12px] text-gray-500 mb-1 block">Head Account</Label>
                    <Select value={data.headAccount} onValueChange={(v) => setActiveField("headAccount", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{Array.from(new Set([row.sender, "Rahul R - Chartering (UHL)"])).map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[12px] text-red-500 mb-1 block">Account</Label>
                    <Select value={data.account} onValueChange={(v) => setActiveField("account", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{Array.from(new Set([row.sender, "Rahul R - Chartering (UHL)", "Sajith Salim - Chartering (UHL)"])).map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <Label className="text-[12px] text-gray-500 mb-1 block">Shipper</Label>
                    <Select value={data.shipper} onValueChange={(v) => setActiveField("shipper", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{Array.from(new Set([row.sender])).map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[12px] text-gray-500 mb-1 block">Broker</Label>
                    <Select value={data.broker} onValueChange={(v) => setActiveField("broker", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{Array.from(new Set([row.sender, "Clarksons Platou (Broker)"])).map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-[12px] text-gray-500 mb-1 block">Client/Charterer Contact E-mail(s)</Label>
                  <EmailTagField
                    values={data.contactEmails}
                    onAdd={(v) => setActiveField("contactEmails", [...data.contactEmails, v])}
                    onRemove={(v) => setActiveField("contactEmails", data.contactEmails.filter((x) => x !== v))}
                  />
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Commission Structure</h3>
                <button onClick={addCommission} className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[12px] font-medium rounded mb-3">
                  Add Commission
                </button>
                <div className="space-y-3">
                  {data.commissions.map((c, i) => (
                    <div key={i} className="border border-gray-200 rounded-md p-4">
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <Label className="text-[11px] text-gray-500 mb-1 block">Choose Type</Label>
                          <Select value={c.type} onValueChange={(v) => updateCommission(i, { ...c, type: v })}>
                            <SelectTrigger className="h-8 text-[12px]"><SelectValue /></SelectTrigger>
                            <SelectContent>{["HQ", "Branch"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-[11px] text-gray-500 mb-1 block">Choose Name</Label>
                          <Select value={c.name} onValueChange={(v) => updateCommission(i, { ...c, name: v })}>
                            <SelectTrigger className="h-8 text-[12px]"><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>{["Management Fee", "Address Commission", "Broker Commission"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <Label className="text-[11px] text-gray-500 mb-1 block">Add Rate</Label>
                            <div className="flex items-center gap-1">
                              <Input value={c.rate} onChange={(e) => updateCommission(i, { ...c, rate: e.target.value })} className="h-8 text-[12px]" />
                              <span className="text-gray-500 text-[12px]">%</span>
                            </div>
                          </div>
                          <button onClick={() => removeCommission(i)} className="text-gray-400 hover:text-red-600 mb-1.5"><Trash2 className="size-4" /></button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-[11px] text-gray-500 mb-1.5 block">Apply To</Label>
                        <TagPillField
                          values={c.applyTo}
                          options={["Additional Freight", "Detention / Demurrage", "Freight"]}
                          colorClass="bg-gray-700 text-white"
                          placeholder="+ Add"
                          onAdd={(v) => updateCommission(i, { ...c, applyTo: [...c.applyTo, v] })}
                          onRemove={(v) => updateCommission(i, { ...c, applyTo: c.applyTo.filter((x) => x !== v) })}
                        />
                      </div>
                    </div>
                  ))}
                  {data.commissions.length === 0 && <p className="text-[12px] text-gray-400">No commissions added.</p>}
                </div>
                <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded mt-3 text-[12px] font-medium text-gray-700">
                  <span>Gross Commission</span>
                  <span>$ {grossCommission.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Charter Party Status</h3>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-1.5 text-[12px] text-gray-600">
                    <Checkbox checked={data.charterPartySigned} onCheckedChange={(v) => setActiveField("charterPartySigned", !!v)} /> Charter Party Signed
                  </label>
                  <label className="flex items-center gap-1.5 text-[12px] text-gray-600">
                    <Checkbox checked={data.charterPartyPdf} onCheckedChange={(v) => setActiveField("charterPartyPdf", !!v)} /> PDF
                  </label>
                  <label className="flex items-center gap-1.5 text-[12px] text-gray-600">
                    <Checkbox checked={data.charterPartyHardCopy} onCheckedChange={(v) => setActiveField("charterPartyHardCopy", !!v)} /> Hard Copy
                  </label>
                </div>
              </div>
        </FixtureAccordionSection>

        <FixtureAccordionSection
          title="Voyage"
          index={4}
          expanded={expandedSections.has("Voyage")}
          onToggle={() => toggleSection("Voyage")}
          hasErrors={isDraft && fixtureStepHasErrors("Voyage", data)}
        >
              <div>
                <Label className="text-[12px] text-gray-500 mb-1 block">Voyage Number</Label>
                <Select value={data.voyageNumber} onValueChange={(v) => setActiveField("voyageNumber", v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{["2026-041", "2026-042", "2026-043"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <FixturePortCard title="Port of Loading" entry={data.portsOfLoading[0]} onChange={(next) => updatePort("portsOfLoading", next)} showLayCan />
              <FixturePortCard title="Port of Discharge" entry={data.portsOfDischarge[0]} onChange={(next) => updatePort("portsOfDischarge", next)} showTransit />

              <div>
                <Label className="text-[12px] text-gray-500 mb-1 block">Agreement Type</Label>
                <Select value={data.agreementType} onValueChange={(v) => setActiveField("agreementType", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["None", "GENCON", "NYPE", "Booking Note"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              </div>
        </FixtureAccordionSection>

        <FixtureAccordionSection
          title="Accounting"
          index={5}
          expanded={expandedSections.has("Accounting")}
          onToggle={() => toggleSection("Accounting")}
          hasErrors={isDraft && fixtureStepHasErrors("Accounting", data)}
        >
              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Currency Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[12px] text-gray-500 mb-1 block">Base Currency</Label>
                    <Select value={data.baseCurrency} onValueChange={(v) => setActiveField("baseCurrency", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{["US Dollar", "Thai Baht", "Euro", "Singapore Dollar"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[12px] text-gray-500 mb-1 block">Conversion Rate</Label>
                    <Input value={data.conversionRate} onChange={(e) => setActiveField("conversionRate", e.target.value)} placeholder="DD/MM/YYYY, HH:MM:SS" />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-sm">Invoice Details</h3>
                  <button onClick={addInvoice} className="text-gray-500 hover:text-gray-900"><Plus className="size-4" /></button>
                </div>
                {data.invoices.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-[12px]">
                      <thead>
                        <tr className="text-left text-gray-500 border-b border-gray-200">
                          <th className="pb-2 pr-3 font-medium">Type</th>
                          <th className="pb-2 pr-3 font-medium">Raised By</th>
                          <th className="pb-2 pr-3 font-medium">Invoice No</th>
                          <th className="pb-2 pr-3 font-medium">Due Date</th>
                          <th className="pb-2 pr-3 font-medium">Status</th>
                          <th className="pb-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.invoices.map((inv, i) => (
                          <tr key={i} className="border-t border-gray-100">
                            <td className="py-2 pr-3 text-blue-600 font-medium whitespace-nowrap">{inv.type}</td>
                            <td className="py-2 pr-3 whitespace-nowrap">{inv.raisedBy}</td>
                            <td className="py-2 pr-3"><Input value={inv.invoiceNo} onChange={(e) => updateInvoice(i, { ...inv, invoiceNo: e.target.value })} className="h-8 text-[12px]" /></td>
                            <td className="py-2 pr-3">
                              <button onClick={() => updateInvoice(i, { ...inv, dueDate: inv.dueDate || new Date().toLocaleDateString() })} className="text-blue-600 hover:underline whitespace-nowrap">
                                {inv.dueDate || "Add Date"}
                              </button>
                            </td>
                            <td className="py-2 pr-3">
                              <Select value={inv.status} onValueChange={(v) => updateInvoice(i, { ...inv, status: v })}>
                                <SelectTrigger className="h-8 text-[12px] w-32"><SelectValue /></SelectTrigger>
                                <SelectContent>{["To Be Issued", "Issued", "Paid"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                              </Select>
                            </td>
                            <td className="py-2">
                              <button onClick={() => removeInvoice(i)} className="text-gray-400 hover:text-red-600"><X className="size-4" /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-[12px] text-gray-400">No invoices yet.</p>
                )}
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Accounting Details</h3>
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-200">
                      <th className="pb-2 pr-3 font-medium">Particular</th>
                      <th className="pb-2 pr-3 font-medium">Type</th>
                      <th className="pb-2 pr-3 font-medium">Freight Rate</th>
                      <th className="pb-2 pr-3 font-medium">Rate</th>
                      <th className="pb-2 pr-3 font-medium">Unit</th>
                      <th className="pb-2 font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-100">
                      <td className="py-2 pr-3">Freight</td>
                      <td className="py-2 pr-3">—</td>
                      <td className="py-2 pr-3">—</td>
                      <td className="py-2 pr-3">{currencySymbol}{num(data.freightRate).toLocaleString()}</td>
                      <td className="py-2 pr-3">1</td>
                      <td className="py-2">{currencySymbol}{grossAmount.toLocaleString()}</td>
                    </tr>
                    {data.commissions.map((c, i) => (
                      <tr key={i} className="border-t border-gray-100">
                        <td className="py-2 pr-3">{c.name || "—"}</td>
                        <td className="py-2 pr-3">{c.type}</td>
                        <td className="py-2 pr-3">{c.applyTo.join(", ") || "—"}</td>
                        <td className="py-2 pr-3">{c.rate}%</td>
                        <td className="py-2 pr-3">—</td>
                        <td className="py-2">$ 0</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-gray-200">
                      <td colSpan={5} className="py-2 pr-3 text-right font-medium text-gray-700">Balance Amount</td>
                      <td className="py-2 font-medium text-gray-900">$ {balanceAmount.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
        </FixtureAccordionSection>
      </div>

      {isDraft && (
        <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-gray-200 flex-shrink-0">
          <button onClick={() => removeTab(activeTab.id)} className="px-4 py-2 rounded text-[13px] font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
          <button onClick={markCreated} className="px-4 py-2 rounded bg-gray-900 text-white text-[13px] font-medium hover:bg-gray-800">
            Create Fixture
          </button>
        </div>
      )}

      {showFixtureDetail && (
        <FixtureDetail
          fixture={{
            number: data.fixtureNumber,
            cargoName: data.cargoName,
            cargoDescription: data.cargoDescription,
            account: data.account,
            vessel: data.intendedVessel,
            fixtureStatus: data.fixtureStatus,
            charterPartySigned: data.charterPartySigned,
          }}
          onClose={() => setShowFixtureDetail(false)}
        />
      )}
    </div>
  );
}

function VoyageEstimateTable({ estimates }: { estimates: VoyageEstimateRow[] }) {
  const [selected, setSelected] = useState<VoyageEstimateRow | null>(null);

  return (
    <>
      <div className="overflow-x-auto border border-gray-200 rounded-md">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="text-left text-gray-500 bg-gray-50 border-b border-gray-200">
              <th className="py-2 pl-3 pr-3 font-medium whitespace-nowrap">Estimate Number</th>
              <th className="py-2 pr-3 font-medium whitespace-nowrap">Estimate Name</th>
              <th className="py-2 pr-3 font-medium whitespace-nowrap">Vessel Name</th>
              <th className="py-2 pr-3 font-medium whitespace-nowrap">Created On</th>
              <th className="py-2 pr-3 font-medium whitespace-nowrap">Created By</th>
            </tr>
          </thead>
          <tbody>
            {estimates.map((est) => (
              <tr key={est.estimateNumber} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="py-2 pl-3 pr-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setSelected(est)} className="text-blue-600 font-medium hover:underline">
                      {est.estimateNumber}
                    </button>
                    <button onClick={() => setSelected(est)} title="Expand" className="text-gray-300 hover:text-gray-600">
                      <Maximize2 className="size-3" />
                    </button>
                  </div>
                </td>
                <td className="py-2 pr-3 whitespace-nowrap">{est.estimateName}</td>
                <td className="py-2 pr-3 whitespace-nowrap">{est.vesselName}</td>
                <td className="py-2 pr-3 whitespace-nowrap text-gray-500">{est.createdOn}</td>
                <td className="py-2 pr-3 whitespace-nowrap text-gray-500">{est.createdBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <VoyageEstimateDetail
          estimate={{ number: selected.estimateNumber, name: selected.estimateName, vessel: selected.vesselName }}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

function VoyageEstimatePanel({
  row,
  fixtures,
}: {
  row: InboxRow;
  fixtures: FixtureTabState[];
}) {
  const groups = generateVoyageEstimateGroups(row, fixtures);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-[13px] font-semibold text-gray-900">Voyage Estimate</h2>
        <div className="flex items-center gap-1">
          <button className="p-1 rounded hover:bg-gray-100 text-gray-400"><Settings className="size-3.5" /></button>
        </div>
      </div>
      <div className="flex-1 overflow-auto px-4 py-3">
        <p className="text-[11px] text-gray-500 mb-3">Voyage estimates created from the Inquiries / Fixtures on this email.</p>
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <Calculator className="size-6 text-gray-300 mb-2" />
            <p className="text-[12px] text-gray-500">No voyage estimates yet.</p>
            <p className="text-[11px] text-gray-400 mt-1">Create an Inquiry or Fixture from this email first.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {groups.map((g) => (
              <div key={g.groupId}>
                <div className="flex items-center gap-1.5 mb-2">
                  {g.groupType === "inquiry" ? (
                    <FileSearch className="size-3.5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <FileText className="size-3.5 text-gray-400 flex-shrink-0" />
                  )}
                  <span className="text-[12px] font-semibold text-gray-800">{g.groupLabel}</span>
                  {g.groupSubLabel && <span className="text-[12px] text-gray-400">· {g.groupSubLabel}</span>}
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide ml-1">
                    {g.groupType === "inquiry" ? "Inquiry" : "Fixture"}
                  </span>
                  <span className="text-[11px] text-gray-400 ml-auto flex-shrink-0">
                    {g.estimates.length} estimate{g.estimates.length > 1 ? "s" : ""}
                  </span>
                </div>
                <VoyageEstimateTable estimates={g.estimates} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ComingSoonPanel({ title, icon: Icon }: { title: string; icon: typeof MessageSquare }) {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-[13px] font-semibold text-gray-900">{title}</h2>
        <div className="flex items-center gap-1">
          <button className="p-1 rounded hover:bg-gray-100 text-gray-400"><Settings className="size-3.5" /></button>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <Icon className="size-7 text-gray-300 mb-3" />
        <p className="text-[13px] text-gray-500">{title} isn't part of this MVP yet.</p>
      </div>
    </div>
  );
}

type InboxTab = "inbox" | "archive" | "sent" | "all" | "following";

export function SmartInbox({ emailAccounts }: { emailAccounts: EmailAccountEntry[] }) {
  const myMailboxes = emailAccounts.filter((a) => a.userIds.includes(CURRENT_USER)).map((a) => a.email);
  const [activeAccountOverride, setActiveAccountOverride] = useState<string | null>(null);
  const activeAccount = activeAccountOverride && myMailboxes.includes(activeAccountOverride) ? activeAccountOverride : myMailboxes[0] ?? null;
  const [activeTab, setActiveTab] = useState<InboxTab>("inbox");
  const [sidebarSections, setSidebarSections] = useState({
    mailboxes: true,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [quickFilters, setQuickFilters] = useState({ unread: false, flagged: false, hasAttachment: false });
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);
  const [activeSidePanel, setActiveSidePanel] = useState<SidePanelKey | null>("inquiry");
  const [sidePanelCollapsed, setSidePanelCollapsed] = useState(false);
  const [followedKeys, setFollowedKeys] = useState<Set<string>>(new Set());
  const [fixturesByRow, setFixturesByRow] = useState<Record<string, FixtureTabState[]>>({});
  const [emailTagsByRow, setEmailTagsByRow] = useState<Record<string, EmailTagState>>({});
  const [categoryTagPool, setCategoryTagPool] = useState<string[]>(CATEGORY_TAG_STARTERS);
  const [privateTagPool, setPrivateTagPool] = useState<string[]>(PRIVATE_TAG_STARTERS);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const listPane = useResizablePane(380, 280, 640);
  const sidePanelPane = useResizablePaneFromRight(480, 480, 800);

  const hasAccount = myMailboxes.length > 0;

  const toggleQuickFilter = (key: keyof typeof quickFilters) => {
    setQuickFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectRow = (row: InboxRow) => {
    setSelectedRowKey(rowKey(row));
    setActiveSidePanel("inquiry");
    setSidePanelCollapsed(false);
  };

  const toggleFollow = (row: InboxRow) => {
    setFollowedKeys((prev) => {
      const next = new Set(prev);
      const key = rowKey(row);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const addFixture = (row: InboxRow, data: FixtureData, isConverted: boolean) => {
    const key = rowKey(row);
    const tab: FixtureTabState = {
      id: `fixture-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      isConverted,
      created: true,
      data,
    };
    setFixturesByRow((prev) => ({ ...prev, [key]: [...(prev[key] ?? []), tab] }));
  };

  const updateFixtureData = (row: InboxRow, id: string, updater: (prev: FixtureData) => FixtureData) => {
    const key = rowKey(row);
    setFixturesByRow((prev) => ({
      ...prev,
      [key]: (prev[key] ?? []).map((t) => (t.id === id ? { ...t, data: updater(t.data) } : t)),
    }));
  };

  const addEmailTag = (row: InboxRow, facet: keyof EmailTagState, value: string) => {
    const key = rowKey(row);
    setEmailTagsByRow((prev) => {
      const current = prev[key] ?? EMPTY_EMAIL_TAGS;
      if (current[facet].includes(value)) return prev;
      return { ...prev, [key]: { ...current, [facet]: [...current[facet], value] } };
    });
    if (facet === "category") setCategoryTagPool((prev) => (prev.includes(value) ? prev : [...prev, value]));
    if (facet === "private") setPrivateTagPool((prev) => (prev.includes(value) ? prev : [...prev, value]));
  };

  const removeEmailTag = (row: InboxRow, facet: keyof EmailTagState, value: string) => {
    const key = rowKey(row);
    setEmailTagsByRow((prev) => {
      const current = prev[key] ?? EMPTY_EMAIL_TAGS;
      return { ...prev, [key]: { ...current, [facet]: current[facet].filter((v) => v !== value) } };
    });
  };

  const convertInquiryToFixture = (row: InboxRow, inquiryData: InquiryData) => {
    const key = rowKey(row);
    const nowStr = new Date().toLocaleString("en-GB", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
    });
    const loading = inquiryData.portsOfLoading[0];
    const discharge = inquiryData.portsOfDischarge[0];
    const fixtureData: FixtureData = {
      ...EMPTY_FIXTURE_DATA,
      fixtureNumber: generateFixtureNumber(`${key}#${Date.now()}`),
      cargoName: inquiryData.cargoName,
      cargoCategory: inquiryData.cargoCategory,
      cargoSubcategory: inquiryData.cargoSubcategory,
      unitNumber: loading?.unitNumber || "",
      totalVolume: loading?.totalVolume || "",
      totalWeight: loading?.totalWeight || "",
      freightTon: loading?.freightTon || "",
      freightCalcType: inquiryData.freightCalcType,
      freightCurrency: inquiryData.freightCurrency,
      freightRate: inquiryData.freightRate,
      relatedScope: inquiryData.relatedScope,
      fixedByOffices: [...inquiryData.fixedByOffices],
      personsInCharge: [...inquiryData.personInCharge],
      legalEntity: inquiryData.legalEntity,
      bookingDate: nowStr,
      account: inquiryData.account,
      broker: inquiryData.broker,
      commissions: inquiryData.commissions.map((c) => ({ ...c, applyTo: [...c.applyTo] })),
      portsOfLoading: [{
        port: loading?.port || "", unitNumber: loading?.unitNumber || "", totalVolume: loading?.totalVolume || "",
        totalWeight: loading?.totalWeight || "", freightTon: loading?.freightTon || "",
        layCan: loading?.layCanFrom ? `${loading.layCanFrom} - ${loading.layCanTo}` : "", transitRequirements: "",
      }],
      portsOfDischarge: [{
        port: discharge?.port || "", unitNumber: discharge?.unitNumber || "", totalVolume: discharge?.totalVolume || "",
        totalWeight: discharge?.totalWeight || "", freightTon: discharge?.freightTon || "",
        layCan: "", transitRequirements: discharge?.transitRequirements || "",
      }],
      baseCurrency: inquiryData.baseCurrency,
      conversionRate: nowStr,
    };
    addFixture(row, fixtureData, true);
    setActiveSidePanel("fixture");
  };

  const handleTabChange = (tab: InboxTab) => {
    setActiveTab(tab);
    if (tab !== "inbox" && tab !== "following") setSelectedRowKey(null);
  };

  const visibleRows = INBOX_ROWS.filter((row) => {
    if (activeTab === "following" && !followedKeys.has(rowKey(row))) return false;
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      const haystack = [row.sender, row.subject, row.snippet, ...row.tags.map((t) => t.label)].join(" ").toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (quickFilters.unread && !row.isUnread) return false;
    if (quickFilters.flagged && !row.flagged) return false;
    if (quickFilters.hasAttachment && !row.hasAttachment) return false;
    if (tagFilter && !allTagLabelsForRow(row, fixturesByRow[rowKey(row)] ?? [], emailTagsByRow[rowKey(row)]).includes(tagFilter)) return false;
    return true;
  });
  const activeQuickFilterCount = Object.values(quickFilters).filter(Boolean).length + (tagFilter ? 1 : 0);
  const tagFilterOptions = Array.from(
    new Set(INBOX_ROWS.flatMap((r) => allTagLabelsForRow(r, fixturesByRow[rowKey(r)] ?? [], emailTagsByRow[rowKey(r)])))
  ).sort();
  const selectedRow = selectedRowKey ? INBOX_ROWS.find((r) => rowKey(r) === selectedRowKey) ?? null : null;

  const toggleSection = (key: keyof typeof sidebarSections) => {
    setSidebarSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSwitchAccount = (email: string) => {
    setActiveAccountOverride(email);
  };

  const tabLabel = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);

  return (
    <div className="flex flex-col h-full w-full relative">
      {hasAccount ? (
        <div className="flex h-full w-full overflow-hidden">
          <div className="w-56 flex-shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col overflow-hidden">
            <div className="px-3 py-3">
              <h1 className="text-[14px] font-semibold text-gray-900">Smart Inbox</h1>
            </div>

            <div className="flex-1 overflow-y-auto px-2 pb-2">
              <SidebarSection title={`Mailboxes (${myMailboxes.length})`} expanded={sidebarSections.mailboxes} onToggle={() => toggleSection("mailboxes")}>
                {myMailboxes.map((email) => (
                  <div key={email}>
                    <button
                      onClick={() => handleSwitchAccount(email)}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded text-[13px] transition-colors ${
                        email === activeAccount ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-200/60"
                      }`}
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <Users className="size-3.5 flex-shrink-0" />
                        <span className="truncate">{nameFor(email)}</span>
                      </span>
                      {email === activeAccount && <Check className="size-3.5 flex-shrink-0" />}
                    </button>

                    {email === activeAccount && (
                      <div className="ml-6 mt-0.5 mb-1 space-y-0.5 border-l border-gray-200 pl-2">
                        {(
                          [
                            { key: "inbox", label: `Inbox (${INBOX_ROWS.length})` },
                            { key: "archive", label: "Archive" },
                            { key: "following", label: `Following (${followedKeys.size})` },
                          ] as { key: InboxTab; label: string }[]
                        ).map((tab) => (
                          <button
                            key={tab.key}
                            onClick={() => handleTabChange(tab.key)}
                            className={`w-full text-left px-2.5 py-1 rounded text-[12.5px] transition-colors ${
                              activeTab === tab.key ? "bg-gray-200/70 text-gray-900 font-medium" : "text-gray-500 hover:bg-gray-200/50"
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </SidebarSection>
            </div>

          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Row 1: search bar (list column width) + blank spacer over reading pane column */}
            <div className="flex items-stretch border-b border-gray-200 flex-shrink-0">
              <div
                style={selectedRow ? { width: listPane.width } : undefined}
                className={`flex items-center gap-2 px-4 py-2.5 ${selectedRow ? "flex-shrink-0" : "flex-1"}`}
              >
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-2.5 top-2 size-4 text-gray-400" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a term, tag, Team, or user"
                    className="w-full pl-8 pr-3 py-1.5 text-[13px] border border-gray-200 rounded-md outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={() => setFilterPanelOpen((o) => !o)}
                  className={`flex-shrink-0 flex items-center gap-1 rounded-md border text-[13px] font-medium px-3 py-1.5 transition-colors ${
                    filterPanelOpen || activeQuickFilterCount > 0
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-blue-300 text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  Show Filter{activeQuickFilterCount > 0 ? ` (${activeQuickFilterCount})` : ""}
                </button>
              </div>
              {selectedRow && <div className="flex-1" />}
            </div>

            {/* Optional quick-filters row, list column only */}
            {filterPanelOpen && (
              <div className="flex items-stretch border-b border-gray-200 flex-shrink-0 bg-gray-50">
                <div
                  style={selectedRow ? { width: listPane.width } : undefined}
                  className={`flex items-center gap-2 px-4 py-2 ${selectedRow ? "flex-shrink-0" : "flex-1"}`}
                >
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mr-1">Quick filters</span>
                  {(
                    [
                      { key: "unread", label: "Unread" },
                      { key: "flagged", label: "Flagged" },
                      { key: "hasAttachment", label: "Has attachment" },
                    ] as const
                  ).map((f) => (
                    <button
                      key={f.key}
                      onClick={() => toggleQuickFilter(f.key)}
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors ${
                        quickFilters[f.key] ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                  {tagFilterOptions.length > 0 && (
                    <div className="flex items-center gap-1 ml-1">
                      <Select value={tagFilter ?? "__all__"} onValueChange={(v) => setTagFilter(v === "__all__" ? null : v)}>
                        <SelectTrigger className="h-7 text-[12px] w-40"><SelectValue placeholder="Tag" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__all__">All tags</SelectItem>
                          {tagFilterOptions.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {tagFilter && (
                        <button onClick={() => setTagFilter(null)} className="text-gray-400 hover:text-gray-600">
                          <X className="size-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                {selectedRow && <div className="flex-1" />}
              </div>
            )}

            {/* Body row: three independently-scrolling columns */}
            <div className="flex-1 flex overflow-hidden">
              <div
                ref={listPane.ref}
                style={selectedRow ? { width: listPane.width } : undefined}
                className={`overflow-y-auto bg-white ${selectedRow ? "flex-shrink-0" : "flex-1"}`}
              >
                {activeTab === "inbox" || activeTab === "following" ? (
                  visibleRows.length > 0 ? (
                    visibleRows.map((row) => (
                      <InboxRowItem
                        key={rowKey(row)}
                        row={row}
                        isSelected={selectedRowKey === rowKey(row)}
                        onClick={() => handleSelectRow(row)}
                        compact={!!selectedRow}
                      />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center px-6">
                      {activeTab === "following" ? (
                        <>
                          <Flag className="size-8 text-gray-300 mb-2" />
                          <p className="text-sm text-gray-500">You're not following any emails yet</p>
                        </>
                      ) : (
                        <>
                          <Search className="size-8 text-gray-300 mb-2" />
                          <p className="text-sm text-gray-500">No messages match your search or filters</p>
                        </>
                      )}
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center px-6">
                    <Mail className="size-8 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">No messages in {tabLabel}</p>
                  </div>
                )}
              </div>

              {selectedRow && <ResizeHandle onMouseDown={listPane.onMouseDown} />}

              {selectedRow && (
                <div ref={sidePanelPane.ref} className="flex-1 flex overflow-hidden bg-white min-w-0">
                  <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                    <div className="flex items-center px-2 py-1.5 flex-shrink-0 overflow-hidden">
                      <ReadingPaneToolbar
                        isFollowing={followedKeys.has(rowKey(selectedRow))}
                        onToggleFollow={() => toggleFollow(selectedRow)}
                      />
                    </div>
                    <ReadingPaneBody row={selectedRow} />
                  </div>
                  <ReadingPaneSideRail
                    activePanel={activeSidePanel}
                    onSelectPanel={(p) => {
                      if (activeSidePanel === p && !sidePanelCollapsed) {
                        setSidePanelCollapsed(true);
                      } else {
                        setActiveSidePanel(p);
                        setSidePanelCollapsed(false);
                      }
                    }}
                    collapsed={sidePanelCollapsed}
                    onToggleCollapsed={() => setSidePanelCollapsed((c) => !c)}
                  />
                  {activeSidePanel && !sidePanelCollapsed && (
                    <>
                      <ResizeHandle onMouseDown={sidePanelPane.onMouseDown} />
                      <div style={{ width: sidePanelPane.width }} className="flex-shrink-0 flex overflow-hidden">
                        {activeSidePanel === "activity" && (
                          <ActivityPanel row={selectedRow} />
                        )}
                        {activeSidePanel === "tags" && (
                          <TagsPanel
                            key={rowKey(selectedRow)}
                            row={selectedRow}
                            fixtures={fixturesByRow[rowKey(selectedRow)] ?? []}
                            emailTags={emailTagsByRow[rowKey(selectedRow)] ?? EMPTY_EMAIL_TAGS}
                            categoryPool={categoryTagPool}
                            privatePool={privateTagPool}
                            onAddTag={(facet, value) => addEmailTag(selectedRow, facet, value)}
                            onRemoveTag={(facet, value) => removeEmailTag(selectedRow, facet, value)}
                          />
                        )}
                        {activeSidePanel === "inquiry" && (
                          <InquiryTabsPanel
                            key={rowKey(selectedRow)}
                            row={selectedRow}
                            onClose={() => setActiveSidePanel(null)}
                            onConvertToFixture={(data) => convertInquiryToFixture(selectedRow, data)}
                          />
                        )}
                        {activeSidePanel === "voyage-estimate" && (
                          <VoyageEstimatePanel
                            row={selectedRow}
                            fixtures={fixturesByRow[rowKey(selectedRow)] ?? []}
                          />
                        )}
                        {activeSidePanel === "fixture" && (
                          <FixtureTabsPanel
                            key={rowKey(selectedRow)}
                            row={selectedRow}
                            fixtures={fixturesByRow[rowKey(selectedRow)] ?? []}
                            onAddFixture={(data) => addFixture(selectedRow, data, false)}
                            onUpdateFixture={(id, updater) => updateFixtureData(selectedRow, id, updater)}
                            onClose={() => setActiveSidePanel(null)}
                          />
                        )}
                        {activeSidePanel === "voyage" && (
                          <ComingSoonPanel title="Voyage" icon={Ship} />
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-sm">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-blue-50">
              <Mail className="size-6 text-blue-600" />
            </div>
            <h2 className="text-base font-medium text-gray-900">No mailbox access yet</h2>
          </div>
        </div>
      )}
    </div>
  );
}
