// ETA Notice (Version 2.0) — mock data, shared state and pure helpers.
// Used by the Arrival and Departure Report, the ETA notice dialog, the Voyage page,
// the Position List and Settings → ETA Notice Template.
import { useSyncExternalStore } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

/** Handover tab → Frequency (fixed list in COEMS). Only "Daily" drives the notice-due marker. */
export type Frequency = "Daily" | "Standard" | "None";

export interface EtaFixture {
  id: string;
  account: string; // customer name
  cargo: string;
  frequency: Frequency;
  /** Handover tab → "ETA's to be given": the e-mail addresses that receive this fixture's ETA notices (can be several). */
  etaEmails: string[];
}

export interface PortCallFixture {
  fixtureId: string;
  operation: "Loading" | "Discharging";
}

/** All dates are "YYYY-MM-DDTHH:mm" in the port's local time. */
export interface PortCall {
  id: string;
  voyage: string;
  vessel: string;
  port: string;
  locode: string;
  kind: "port" | "canal";
  timeZone: string;
  /** First call of the voyage: departure only, there is no arrival to notify. */
  startOnly?: boolean;
  budgeted: { arrival?: string; departure?: string };
  /** System-computed expected dates (shown grey, as a placeholder, in the report). */
  computed: { arrival?: string; departure?: string };
  /** Operator-entered expected dates (shown as normal text). */
  entered: { arrival?: string; departure?: string };
  actual: { arrival?: string; berth?: string; departure?: string };
  /** Latest arrival requirement, "YYYY-MM-DD". */
  latestArrival?: string;
  fixtures: PortCallFixture[];
  remarks?: string;
  pic?: string;
}

export interface EtaVoyage {
  number: string;
  vessel: string;
  id: number;
  status: string;
  operationInCharge: string;
  startDate: string;
  fixtures: EtaFixture[];
  portCalls: PortCall[];
}

export interface Contact {
  name: string;
  email: string;
}

export interface Customer {
  name: string;
  contacts: Contact[];
}

export interface SentNotice {
  id: string;
  portCallId: string;
  voyage: string;
  vessel: string;
  port: string;
  sentAt: string; // ISO with seconds
  sentBy: string;
  customer: string;
  fixtureIds: string[];
  to: string[];
  etaTold: string; // "YYYY-MM-DDTHH:mm"
  /** System Expected ETA at the moment of sending, to detect "ETA changed since the last notice". */
  systemEta?: string;
  includeTime: boolean;
  timeZone: string;
  remark: string;
  subject: string;
  body: string;
  status: "Sent" | "Failed";
  failReason?: string;
}

export interface NoticeTemplate {
  subject: string;
  body: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

export const FREQUENCY_OPTIONS: Frequency[] = ["Daily", "None", "Standard"];

export const CUSTOMERS: Customer[] = [
  {
    name: "Nordex",
    contacts: [
      { name: "A. Eckert", email: "a.eckert@nordex.example" },
      { name: "Nordex Logistics Desk", email: "logistics@nordex.example" },
    ],
  },
  {
    name: "Baltic Turbine Logistics GmbH",
    contacts: [
      { name: "M. Petersen", email: "m.petersen@balticturbine.example" },
      { name: "Chartering", email: "chartering@balticturbine.example" },
    ],
  },
  {
    name: "AAK Germany GmbH",
    contacts: [
      { name: "J. Weber", email: "j.weber@aak-germany.example" },
      { name: "Shipping Desk", email: "shipping@aak-germany.example" },
    ],
  },
  {
    name: "Hanseatic Project Cargo",
    contacts: [{ name: "L. Brandt", email: "l.brandt@hanseatic-pc.example" }],
  },
];

export const OPERATIONS_MAILBOX = "operations@uhl-operations.example";

/** The signed-in user of the mockup (sidebar); "My voyages" compares this with PIC Operations. */
export const CURRENT_USER = "Tester Adminren";

const FRS_FIXTURES: EtaFixture[] = [
  { id: "UHL-F-2026-1356", account: "Nordex", cargo: "57 Blades, 18 Nacelles, 19 Drive Trains, 10 Hubs", frequency: "Daily", etaEmails: ["a.eckert@nordex.example", "logistics@nordex.example"] },
  { id: "UHL-F-2026-1362", account: "Baltic Turbine Logistics GmbH", cargo: "Tower sections, 12 pcs", frequency: "Daily", etaEmails: ["m.petersen@balticturbine.example"] },
  // empty on purpose: shows the "no e-mail in ETA's to be given" hint
  { id: "UHL-F-2026-1368", account: "AAK Germany GmbH", cargo: "Processing equipment, 6 pcs", frequency: "Standard", etaEmails: [] },
];

export const ETA_VOYAGES: EtaVoyage[] = [
  {
    number: "FRS 2604",
    vessel: "UHL FRESH",
    id: 2715,
    status: "Active",
    operationInCharge: CURRENT_USER,
    startDate: "22/10/2026",
    fixtures: FRS_FIXTURES,
    portCalls: [
      {
        id: "FRS 2604:durban", voyage: "FRS 2604", vessel: "UHL FRESH", port: "Durban", locode: "ZADUR", kind: "port",
        timeZone: "(UTC+2:00) Africa/Johannesburg", startOnly: true,
        budgeted: { departure: "2026-10-22T15:00" }, computed: {}, entered: {},
        actual: { departure: "2026-10-22T15:00" }, fixtures: [], pic: "RH",
      },
      {
        id: "FRS 2604:tuticorin", voyage: "FRS 2604", vessel: "UHL FRESH", port: "Tuticorin", locode: "INTUT", kind: "port",
        timeZone: "(UTC+05:30) Sri Jayawardenepura",
        budgeted: { arrival: "2026-10-31T18:30", departure: "2026-11-02T06:30" },
        computed: { arrival: "2026-11-01T17:00", departure: "2026-11-04T23:30" },
        entered: { arrival: "2026-11-01T17:00" },
        actual: { arrival: "2026-11-01T17:30", berth: "2026-11-01T20:30", departure: "2026-11-04T23:30" },
        fixtures: [{ fixtureId: "UHL-F-2026-1356", operation: "Loading" }], pic: "RH",
        remarks: "Loading completed, vessel sailed on time",
      },
      {
        id: "FRS 2604:cuxhaven", voyage: "FRS 2604", vessel: "UHL FRESH", port: "Cuxhaven", locode: "DECUX", kind: "port",
        timeZone: "(UTC+1:00) Europe/Berlin", latestArrival: "2026-11-20",
        budgeted: { arrival: "2026-11-19T04:45", departure: "2026-11-23T16:45" },
        computed: { arrival: "2026-11-24T21:45", departure: "2026-11-28T09:45" }, entered: {}, actual: {},
        fixtures: [
          { fixtureId: "UHL-F-2026-1356", operation: "Discharging" },
          { fixtureId: "UHL-F-2026-1362", operation: "Discharging" },
          { fixtureId: "UHL-F-2026-1368", operation: "Loading" },
        ],
        pic: "RH",
      },
      {
        id: "FRS 2604:emden", voyage: "FRS 2604", vessel: "UHL FRESH", port: "Emden", locode: "DEEME", kind: "port",
        timeZone: "(UTC+1:00) Europe/Berlin", latestArrival: "2026-11-30",
        budgeted: { arrival: "2026-11-24T19:02", departure: "2026-11-26T07:02" },
        computed: { arrival: "2026-11-29T02:00", departure: "2026-12-01T07:02" },
        entered: { arrival: "2026-11-29T04:00" }, actual: {},
        fixtures: [{ fixtureId: "UHL-F-2026-1356", operation: "Discharging" }], pic: "RH",
      },
    ],
  },
  {
    number: "FOR 2603",
    vessel: "UHL FORTUNE",
    id: 2714,
    status: "Active",
    operationInCharge: "Merle Hollstein",
    startDate: "14/11/2026",
    fixtures: [
      { id: "UHL-F-2026-1401", account: "Hanseatic Project Cargo", cargo: "Heavy-lift modules, 4 pcs", frequency: "Daily", etaEmails: ["l.brandt@hanseatic-pc.example", "ops@hanseatic-pc.example"] },
    ],
    portCalls: [
      {
        id: "FOR 2603:cherbourg", voyage: "FOR 2603", vessel: "UHL FORTUNE", port: "Cherbourg", locode: "FRCER", kind: "port",
        timeZone: "(UTC+1:00) Europe/Paris",
        budgeted: { arrival: "2026-11-13T08:00", departure: "2026-11-16T06:00" },
        computed: { arrival: "2026-11-14T08:00", departure: "2026-11-16T06:00" }, entered: {},
        actual: { arrival: "2026-11-14T08:00", berth: "2026-11-14T10:30", departure: "2026-11-16T06:00" },
        fixtures: [{ fixtureId: "UHL-F-2026-1401", operation: "Loading" }], pic: "MH",
      },
      {
        id: "FOR 2603:kiel-canal", voyage: "FOR 2603", vessel: "UHL FORTUNE", port: "Kiel Canal", locode: "DEKEL", kind: "canal",
        timeZone: "(UTC+1:00) Europe/Berlin",
        budgeted: { arrival: "2026-11-19T10:00", departure: "2026-11-19T22:00" },
        computed: { arrival: "2026-11-19T14:34", departure: "2026-11-20T02:34" }, entered: {}, actual: {},
        fixtures: [], pic: "MH", remarks: "Canal transit, pilot ordered",
      },
      {
        id: "FOR 2603:gdynia", voyage: "FOR 2603", vessel: "UHL FORTUNE", port: "Gdynia", locode: "PLGDY", kind: "port",
        timeZone: "(UTC+1:00) Europe/Warsaw", latestArrival: "2026-11-22",
        budgeted: { arrival: "2026-11-21T05:00", departure: "2026-11-23T18:00" },
        computed: { arrival: "2026-11-21T09:30", departure: "2026-11-23T18:00" }, entered: {}, actual: {},
        fixtures: [{ fixtureId: "UHL-F-2026-1401", operation: "Discharging" }], pic: "MH",
      },
    ],
  },
  {
    number: "FAL 2603",
    vessel: "UHL FALCON",
    id: 2713,
    status: "Active",
    operationInCharge: CURRENT_USER,
    startDate: "03/11/2026",
    fixtures: [
      { id: "UHL-F-2026-1450", account: "AAK Germany GmbH", cargo: "Edible oil tanks, 3 pcs", frequency: "Standard", etaEmails: ["j.weber@aak-germany.example"] },
    ],
    portCalls: [
      {
        id: "FAL 2603:osaka", voyage: "FAL 2603", vessel: "UHL FALCON", port: "Osaka", locode: "JPOSA", kind: "port",
        timeZone: "(UTC+9:00) Asia/Tokyo",
        budgeted: { arrival: "2026-11-03T09:00", departure: "2026-11-09T12:00" },
        computed: { arrival: "2026-11-03T09:00", departure: "2026-11-09T12:00" }, entered: {},
        actual: { arrival: "2026-11-03T10:15", berth: "2026-11-03T13:00", departure: "2026-11-09T12:00" },
        fixtures: [{ fixtureId: "UHL-F-2026-1450", operation: "Loading" }], pic: "MH",
      },
      {
        id: "FAL 2603:singapore", voyage: "FAL 2603", vessel: "UHL FALCON", port: "Singapore", locode: "SGSIN", kind: "port",
        timeZone: "(UTC+8:00) Asia/Singapore",
        budgeted: { arrival: "2026-11-17T08:00", departure: "2026-11-19T20:00" },
        computed: { arrival: "2026-11-18T09:30", departure: "2026-11-20T20:00" }, entered: {}, actual: {},
        fixtures: [{ fixtureId: "UHL-F-2026-1450", operation: "Discharging" }], pic: "MH",
      },
      {
        id: "FAL 2603:jakarta", voyage: "FAL 2603", vessel: "UHL FALCON", port: "Jakarta", locode: "IDJKT", kind: "port",
        timeZone: "(UTC+7:00) Asia/Jakarta",
        budgeted: { arrival: "2026-11-22T06:00", departure: "2026-11-24T14:00" },
        computed: { arrival: "2026-11-22T06:00", departure: "2026-11-24T14:00" }, entered: {}, actual: {},
        fixtures: [], pic: "MH",
      },
    ],
  },
];

export const DEFAULT_TEMPLATE: NoticeTemplate = {
  subject: "MV {vessel} – Voyage {voyage} – {fixture} – {loadPort} / {dischargePort} – {client}",
  body: [
    "Dear all,",
    "",
    "from today's perspective the MV {vessel} is expected to arrive in {port} on/about {eta} wp agw wog fme uce",
    "",
    "**Remark: {remark}**",
    "",
    "Please consider this message as notice in accordance with the governing cargo contract and let us know if any additional information is needed",
    "",
    "Thank you for your attention.",
    "",
    "Best regards,",
    "",
    "{signatory}",
    "",
    "UNITED HEAVY LIFT",
    "Am Kaiserkai 69, 20457 Hamburg, Germany",
    "operations@uhl-operations.example",
  ].join("\n"),
};

export const TEMPLATE_TOKENS: { token: string; desc: string }[] = [
  { token: "{vessel}", desc: "Vessel name" },
  { token: "{voyage}", desc: "Voyage number" },
  { token: "{port}", desc: "Port or canal of the notice" },
  { token: "{eta}", desc: "ETA date, with time and port time when 'Include time' is on" },
  { token: "{fixture}", desc: "Chosen fixture number(s); dropped when none is chosen" },
  { token: "{loadPort}", desc: "Loading port(s) of the chosen fixture(s)" },
  { token: "{dischargePort}", desc: "Discharge port(s) of the chosen fixture(s)" },
  { token: "{client}", desc: "Client (customer) of the row" },
  { token: "{remark}", desc: "Remark typed by the operator; the line is dropped when empty" },
  { token: "{signatory}", desc: "Signatory: the signed-in user" },
];

// ─── Date helpers (ISO "YYYY-MM-DDTHH:mm", port-local) ────────────────────────

const pad = (n: number) => String(n).padStart(2, "0");

/** dd/MM/yyyy HH:mm */
export const fmtDT = (iso?: string) =>
  iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)} ${iso.slice(11, 16)}` : "";

/** dd.MM.yyyy — the date format of the notice e-mail */
export const fmtMailDate = (iso: string) => `${iso.slice(8, 10)}.${iso.slice(5, 7)}.${iso.slice(0, 4)}`;

/** dd/MM/yyyy */
export const fmtDate = (isoDate?: string) =>
  isoDate ? `${isoDate.slice(8, 10)}/${isoDate.slice(5, 7)}/${isoDate.slice(0, 4)}` : "";

/** "TUE 24-11-2026 21:45" as on the Voyage page / Position List */
export const fmtCard = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(`${iso}:00`);
  const wd = d.toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase();
  return `${wd} ${iso.slice(8, 10)}-${iso.slice(5, 7)}-${iso.slice(0, 4)} ${iso.slice(11, 16)}`;
};

/** Parse "dd/MM/yyyy HH:mm" or "dd/MM/yy HH:mm" → ISO, or null when invalid. */
export const parseDT = (s: string): string | null => {
  const m = s.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})\s+(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const [, dd, mm, yy, hh, mi] = m;
  const yyyy = yy.length === 2 ? `20${yy}` : yy;
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(hh), Number(mi));
  if (d.getMonth() !== Number(mm) - 1 || d.getDate() !== Number(dd) || Number(hh) > 23 || Number(mi) > 59) return null;
  return `${yyyy}-${pad(Number(mm))}-${pad(Number(dd))}T${pad(Number(hh))}:${mi}`;
};

export const portDays = (arrival?: string, departure?: string) => {
  if (!arrival || !departure) return null;
  const diff = (new Date(`${departure}:00`).getTime() - new Date(`${arrival}:00`).getTime()) / 86400000;
  return diff > 0 ? diff.toFixed(2) : null;
};

export const nowIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const isSameDay = (a: string, b: string) => a.slice(0, 10) === b.slice(0, 10);

// ─── Store ────────────────────────────────────────────────────────────────────

interface EtaState {
  sent: SentNotice[];
  /** Saved (Confirm & Update) expected dates per port call. */
  saved: Record<string, { arrival?: string; departure?: string }>;
  template: NoticeTemplate;
}

const seedSaved = () => {
  const out: EtaState["saved"] = {};
  ETA_VOYAGES.forEach((v) => v.portCalls.forEach((pc) => { out[pc.id] = { ...pc.entered }; }));
  return out;
};

const yesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T09:12:00`;
};

let state: EtaState = {
  sent: [
    {
      id: "seed-1",
      portCallId: "FRS 2604:cuxhaven",
      voyage: "FRS 2604",
      vessel: "UHL FRESH",
      port: "Cuxhaven",
      sentAt: yesterday(),
      sentBy: "Rabea Hammann",
      customer: "Nordex",
      fixtureIds: ["UHL-F-2026-1356"],
      to: ["a.eckert@nordex.example", "logistics@nordex.example"],
      etaTold: "2026-11-24T21:45",
      systemEta: "2026-11-24T21:45",
      includeTime: false,
      timeZone: "(UTC+1:00) Europe/Berlin",
      remark: "Vessel on schedule, slight head wind expected in the North Sea",
      subject: "MV UHL FRESH – Voyage FRS 2604 – UHL-F-2026-1356 – Tuticorin / Cuxhaven, Emden – Nordex",
      body: "Dear all,\n\nfrom today's perspective the MV UHL FRESH is expected to arrive in Cuxhaven on/about 24.11.2026 wp agw wog fme uce\n\n**Remark: Vessel on schedule, slight head wind expected in the North Sea**\n\nPlease consider this message as notice in accordance with the governing cargo contract and let us know if any additional information is needed\n\nThank you for your attention.\n\nBest regards,\n\nRabea Hammann\n\nUNITED HEAVY LIFT\nAm Kaiserkai 69, 20457 Hamburg, Germany\noperations@uhl-operations.example",
      status: "Sent",
    },
  ],
  saved: seedSaved(),
  template: DEFAULT_TEMPLATE,
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useEtaState = (): EtaState => useSyncExternalStore(subscribe, () => state);

export const etaActions = {
  addNotice(n: SentNotice) {
    state = { ...state, sent: [n, ...state.sent] };
    emit();
  },
  saveExpected(portCallId: string, v: { arrival?: string; departure?: string }) {
    state = { ...state, saved: { ...state.saved, [portCallId]: v } };
    emit();
  },
  setTemplate(t: NoticeTemplate) {
    state = { ...state, template: t };
    emit();
  },
};

// ─── Lookups and rules ────────────────────────────────────────────────────────

export const findVoyage = (number: string) => ETA_VOYAGES.find((v) => v.number === number);

export const findPortCall = (id: string) => {
  for (const v of ETA_VOYAGES) {
    const pc = v.portCalls.find((p) => p.id === id);
    if (pc) return { voyage: v, portCall: pc };
  }
  return null;
};

export const fixtureOf = (voyage: EtaVoyage, id: string) => voyage.fixtures.find((f) => f.id === id);

/** Expected arrival that a notice would carry: saved override, else the computed ETA. */
export const effectiveEta = (pc: PortCall, st: EtaState) => st.saved[pc.id]?.arrival ?? pc.computed.arrival;
export const effectiveEts = (pc: PortCall, st: EtaState) => st.saved[pc.id]?.departure ?? pc.computed.departure;

/**
 * ETA notices go only to the ports of loading and discharge of a fixture, never to canals or other calls.
 * A call qualifies when a fixture with a Frequency other than None loads or discharges there, and the vessel has
 * not arrived yet (the first call of a voyage has no arrival).
 */
export const canNotify = (v: EtaVoyage, pc: PortCall) =>
  !pc.startOnly &&
  !pc.actual.arrival &&
  pc.fixtures.some((f) => {
    const fx = fixtureOf(v, f.fixtureId);
    return !!fx && fx.frequency !== "None";
  });

/** The vessel's next port call = first call without an actual arrival (used for the Position List highlight). */
export const nextPortCall = (voyage: EtaVoyage) => voyage.portCalls.find((p) => !p.startOnly && !p.actual.arrival);

/** The fixtures that get an ETA notice at this call, one e-mail each: those loading or discharging there whose Frequency is not None. */
export const noticeFixtures = (v: EtaVoyage, pc: PortCall): EtaFixture[] =>
  pc.fixtures
    .map((f) => fixtureOf(v, f.fixtureId))
    .filter((f): f is EtaFixture => !!f && f.frequency !== "None");

export const coveredToday = (st: EtaState, portCallId: string, fixtureId: string) => {
  const today = nowIso();
  return st.sent.some(
    (n) => n.portCallId === portCallId && n.status === "Sent" && n.fixtureIds.includes(fixtureId) && isSameDay(n.sentAt, today)
  );
};

// ─── Frequency rules, agreed with the client on 2026-11-17 (read from the fixture's Handover tab) ───
// Daily = every day. Standard = Monday, Wednesday and Friday. None = no notice.
// The series starts 2 weeks before the voyage starts (loading port) or 2 weeks before the ETA (discharge port).
// Sending is always manual: the schedule only decides what is "due" / "Ready to Send".

export const SERIES_WINDOW_DAYS = 14;

/** "dd/mm/yyyy" → "YYYY-MM-DD" */
const dmyToIso = (d: string) => `${d.slice(6, 10)}-${d.slice(3, 5)}-${d.slice(0, 2)}`;

const addDays = (isoDate: string, days: number) => {
  const d = new Date(`${isoDate}T00:00:00`);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const isScheduleDay = (f: Frequency, isoDate: string) => {
  if (f === "Daily") return true;
  if (f === "Standard") return [1, 3, 5].includes(new Date(`${isoDate}T00:00:00`).getDay());
  return false;
};

/** First day of the series for this fixture at this call ("" when it cannot be worked out). */
export const seriesStart = (v: EtaVoyage, pc: PortCall, operation: "Loading" | "Discharging", st: EtaState) => {
  const base = operation === "Loading" ? dmyToIso(v.startDate) : (effectiveEta(pc, st) ?? "").slice(0, 10);
  return base ? addDays(base, -SERIES_WINDOW_DAYS) : "";
};

/** Fixtures at this call whose notice is due today: inside the series window, on a scheduled day, and not sent yet today. */
export const dueFixtures = (v: EtaVoyage, pc: PortCall, st: EtaState): EtaFixture[] => {
  if (!canNotify(v, pc)) return [];
  const today = nowIso().slice(0, 10);
  return pc.fixtures.flatMap((pf) => {
    const fx = fixtureOf(v, pf.fixtureId);
    if (!fx || fx.frequency === "None") return [];
    const start = seriesStart(v, pc, pf.operation, st);
    const due = !!start && today >= start && isScheduleDay(fx.frequency, today) && !coveredToday(st, pc.id, fx.id);
    return due ? [fx] : [];
  });
};

/** "Ready to Send" notices of a voyage = the notices that are due today (they come back on the next scheduled day). */
export const readyNotices = (v: EtaVoyage, st: EtaState) =>
  v.portCalls.flatMap((pc) => dueFixtures(v, pc, st).map((fixture) => ({ portCall: pc, fixture })));

/** Last notice sent to this customer (and fixtures, when given) — used to pre-fill To. */
export const lastNoticeFor = (st: EtaState, voyageNumber: string, customer: string, fixtureIds: string[] = []) => {
  const mine = st.sent.filter((n) => n.status === "Sent" && n.customer === customer);
  const byFixture = fixtureIds.length ? mine.filter((n) => n.fixtureIds.some((f) => fixtureIds.includes(f))) : [];
  const sameVoyage = mine.filter((n) => n.voyage === voyageNumber);
  return byFixture[0] ?? sameVoyage[0] ?? mine[0];
};

// ─── Notice text ──────────────────────────────────────────────────────────────

export interface NoticeValues {
  vessel: string;
  voyage: string;
  port: string;
  eta: string;
  fixture: string;
  loadPort: string;
  dischargePort: string;
  client: string;
  remark: string;
  signatory: string;
}

const TOKEN_RE = /\{(\w+)\}/g;

const resolve = (line: string, values: Record<string, string>) => {
  const tokens = [...line.matchAll(TOKEN_RE)].map((m) => m[1]);
  const out = line.replace(TOKEN_RE, (_, k) => values[k] ?? "");
  return { tokens, out, allEmpty: tokens.length > 0 && tokens.every((k) => !(values[k] ?? "").trim()) };
};

/** Subject: segments separated by " – "; a segment whose placeholders are all empty is dropped. */
export const renderSubject = (template: string, values: NoticeValues) => {
  const v = values as unknown as Record<string, string>;
  return template
    .split(" – ")
    .map((seg) => resolve(seg, v))
    .filter((r) => !r.allEmpty)
    .map((r) => r.out.replace(/^\s*\/\s*|\s*\/\s*$/g, "").trim())
    .filter(Boolean)
    .join(" – ");
};

/** Body: a line whose placeholders are all empty (e.g. the remark line) is dropped. */
export const renderBody = (template: string, values: NoticeValues) => {
  const v = values as unknown as Record<string, string>;
  const lines = template.split("\n").map((l) => resolve(l, v));
  const out: string[] = [];
  lines.forEach((r, i) => {
    if (r.allEmpty) {
      // also drop one blank line that followed the removed line, to avoid a double gap
      if (lines[i + 1] && lines[i + 1].out.trim() === "" && !lines[i + 1].tokens.length) lines[i + 1] = { ...lines[i + 1], out: "\u0000" };
      return;
    }
    if (r.out === "\u0000") return;
    out.push(r.out);
  });
  return out.join("\n");
};

/** ETA text of the e-mail: "24.11.2026" or "24.11.2026 21:45 LT (UTC+1:00) Europe/Berlin". */
export const etaText = (etaIso: string, includeTime: boolean, timeZone: string) =>
  includeTime ? `${fmtMailDate(etaIso)} ${etaIso.slice(11, 16)} LT ${timeZone}` : fmtMailDate(etaIso);

export const portsFor = (voyage: EtaVoyage, fixtureIds: string[], operation: "Loading" | "Discharging") => {
  const names: string[] = [];
  voyage.portCalls.forEach((pc) =>
    pc.fixtures.forEach((f) => {
      if (fixtureIds.includes(f.fixtureId) && f.operation === operation && !names.includes(pc.port)) names.push(pc.port);
    })
  );
  return names.join(", ");
};

// ─── Voyage page / Position List helpers ──────────────────────────────────────

/** "ATA - TUE …/ATS - …" for visited calls, otherwise "ETA - …/ETS - …" (per field), as on the Position List. */
export const cardDates = (pc: PortCall, st: EtaState) => {
  const eta = effectiveEta(pc, st);
  const ets = effectiveEts(pc, st);
  return {
    arrival: pc.actual.arrival ? { label: "ATA", value: pc.actual.arrival } : eta ? { label: "ETA", value: eta } : null,
    departure: pc.actual.departure ? { label: "ATS", value: pc.actual.departure } : ets ? { label: "ETS", value: ets } : null,
  };
};
