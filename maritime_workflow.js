"use strict";
const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3" x 7.5"

// ─── Palette ────────────────────────────────────────────────────────────────
const C = {
  navy:      "003366",
  blue:      "0066CC",
  lblue:     "4DA6FF",
  orange:    "FF6600",
  orangeDk:  "CC4400",
  green:     "00AA44",
  white:     "FFFFFF",
  bg:        "F4F7FA",
  dark:      "2D3748",
  gray:      "718096",
  trkAbg:    "D6E8FF",
  trkBbg:    "CCE5FF",
  trkCbg:    "CCE8F5",
  trkBhdr:   "003D99",
  trkChdr:   "1C7293",
  legalBg:   "FFE8D0",
  resBg:     "D4EDDA",
  amberBg:   "FFF3CD",
  legalHdr:  "CC4400",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function addStep(slide, x, y, w, h, text, bgColor, borderColor, fontSize) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: bgColor },
    line: { color: borderColor, width: 0.75 },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 0.06, h,
    fill: { color: borderColor },
    line: { color: borderColor },
  });
  slide.addText(text, {
    x: x + 0.12, y, w: w - 0.2, h,
    fontSize: fontSize || 8.5,
    fontFace: "Calibri",
    color: C.dark,
    align: "left",
    valign: "middle",
    margin: 0,
  });
}

function vline(slide, x, y1, y2, color, width) {
  slide.addShape(pres.shapes.LINE, {
    x, y: y1, w: 0, h: y2 - y1,
    line: { color, width: width || 1.5 },
  });
}

function hline(slide, x1, x2, y, color, width) {
  slide.addShape(pres.shapes.LINE, {
    x: x1, y, w: x2 - x1, h: 0,
    line: { color, width: width || 1.5 },
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 1 — TITLE
// ═══════════════════════════════════════════════════════════════════════════════
const s1 = pres.addSlide();
s1.background = { color: C.navy };

// Top accent
s1.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 13.3, h: 0.07,
  fill: { color: C.lblue }, line: { color: C.lblue },
});

s1.addText("Maritime HSEQ", {
  x: 0.5, y: 1.1, w: 12.3, h: 1.05,
  fontSize: 58, fontFace: "Calibri", bold: true,
  color: C.white, align: "center", valign: "middle",
});
s1.addText("Legal  ·  Claims  ·  Incidents  ·  Insurance", {
  x: 0.5, y: 2.3, w: 12.3, h: 0.65,
  fontSize: 28, fontFace: "Calibri",
  color: C.lblue, align: "center",
});
s1.addText("End-to-End Workflow Overview", {
  x: 0.5, y: 3.1, w: 12.3, h: 0.42,
  fontSize: 16, fontFace: "Calibri", italic: true,
  color: "7799BB", align: "center",
});

// Colour legend
const legend = [
  { label: "Incident Trigger",     color: C.orange  },
  { label: "HSEQ / Safety",        color: C.blue    },
  { label: "Insurance Activation", color: C.trkBhdr },
  { label: "Claims Management",    color: C.trkChdr },
  { label: "Legal Escalation",     color: C.legalHdr },
  { label: "Resolution / Closed",  color: C.green   },
];
const lgW = 1.82, lgH = 0.44, lgGap = 0.17;
const lgTotal = legend.length * lgW + (legend.length - 1) * lgGap;
const lgX0 = (13.3 - lgTotal) / 2;
const lgY  = 4.55;

legend.forEach((item, i) => {
  const x = lgX0 + i * (lgW + lgGap);
  s1.addShape(pres.shapes.RECTANGLE, {
    x, y: lgY, w: lgW, h: lgH,
    fill: { color: item.color }, line: { color: item.color },
  });
  s1.addText(item.label, {
    x, y: lgY, w: lgW, h: lgH,
    fontSize: 9.5, fontFace: "Calibri", bold: true,
    color: C.white, align: "center", valign: "middle", margin: 0,
  });
});

s1.addText("COEMS  ·  Admaren", {
  x: 0.5, y: 7.1, w: 12.3, h: 0.3,
  fontSize: 11, fontFace: "Calibri",
  color: "4D6680", align: "center",
});

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 2 — 3-TRACK PARALLEL FLOW
// ═══════════════════════════════════════════════════════════════════════════════
const s2 = pres.addSlide();
s2.background = { color: C.bg };

// Title bar
s2.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 13.3, h: 0.58,
  fill: { color: C.navy }, line: { color: C.navy },
});
s2.addText("Maritime Incident — Parallel Response Tracks", {
  x: 0, y: 0, w: 13.3, h: 0.58,
  fontSize: 18, fontFace: "Calibri", bold: true,
  color: C.white, align: "center", valign: "middle", margin: 0,
});

// Incident trigger
const IT = { x: 4.65, y: 0.72, w: 4.0, h: 0.65 };
s2.addShape(pres.shapes.RECTANGLE, {
  x: IT.x, y: IT.y, w: IT.w, h: IT.h,
  fill: { color: C.orange }, line: { color: C.orangeDk, width: 2 },
  shadow: { type: "outer", color: "000000", blur: 5, offset: 2, angle: 135, opacity: 0.2 },
});
s2.addText("MARITIME INCIDENT", {
  x: IT.x, y: IT.y, w: IT.w, h: IT.h * 0.52,
  fontSize: 11.5, fontFace: "Calibri", bold: true,
  color: C.white, align: "center", valign: "middle", margin: 0,
});
s2.addText("Casualty  ·  Cargo Damage  ·  Crew Injury  ·  Environmental  ·  Security", {
  x: IT.x, y: IT.y + IT.h * 0.5, w: IT.w, h: IT.h * 0.5,
  fontSize: 7, fontFace: "Calibri",
  color: "FFE0C0", align: "center", valign: "middle", margin: 0,
});

// Track definitions
const TRK_HDR_Y    = 1.55;
const TRK_HDR_H    = 0.38;
const STEP_START_Y = 2.02;
const STEP_H       = 0.42;
const STEP_GAP     = 0.05;

const tracks = [
  {
    label:     "TRACK A — HSEQ / Safety Management",
    x: 0.25, w: 3.88,
    hdrColor:  C.blue,
    bgColor:   C.trkAbg,
    steps: [
      "Master Reports to DPA (24-72 hrs)",
      "DPA / Ship Manager Notified",
      "SMS Activated",
      "Flag / Port State Notified",
      "Investigation (Internal + External)",
      "Root Cause Analysis (RCA)",
      "Corrective Action Plan (CAP)",
      "HSEQ Records & Lessons Learned",
    ],
  },
  {
    label:    "TRACK B — Insurance Activation",
    x: 4.71, w: 3.88,
    hdrColor: C.trkBhdr,
    bgColor:  C.trkBbg,
    steps: [
      "P&I Club / H&M Insurer Notified",
      "Broker Engaged",
      "Club Correspondent Appointed",
      "Surveyor Dispatched to Vessel",
      "Survey Report Prepared",
      "Claim File Opened",
      "Claim Assessment by Adjuster",
      "Settlement Negotiation Initiated",
    ],
  },
  {
    label:    "TRACK C — Claims Management",
    x: 9.17, w: 3.88,
    hdrColor: C.trkChdr,
    bgColor:  C.trkCbg,
    steps: [
      "Own Damage (H&M) / 3rd Party (P&I)",
      "Survey  /  Demand Received",
      "Repair Estimate  /  Liability Assessed",
      "Average Adjuster  /  W-P Negotiation",
      "Settlement Reached  OR  Dispute?",
    ],
  },
];

// T-junction connectors: incident -> track headers
const incCX  = IT.x + IT.w / 2; // 6.65
const incBY  = IT.y + IT.h;      // 1.37
const midY   = incBY + (TRK_HDR_Y - incBY) / 2; // ~1.46

const leftCX  = tracks[0].x + tracks[0].w / 2;
const rightCX = tracks[2].x + tracks[2].w / 2;

vline(s2, incCX,   incBY, midY, C.orange, 2);
hline(s2, leftCX, rightCX, midY, C.orange, 2);
tracks.forEach(t => vline(s2, t.x + t.w / 2, midY, TRK_HDR_Y, C.orange, 2));

// Draw tracks
tracks.forEach(t => {
  // Header
  s2.addShape(pres.shapes.RECTANGLE, {
    x: t.x, y: TRK_HDR_Y, w: t.w, h: TRK_HDR_H,
    fill: { color: t.hdrColor }, line: { color: t.hdrColor },
  });
  s2.addText(t.label, {
    x: t.x, y: TRK_HDR_Y, w: t.w, h: TRK_HDR_H,
    fontSize: 8.5, fontFace: "Calibri", bold: true,
    color: C.white, align: "center", valign: "middle", margin: 0,
  });

  // Steps
  t.steps.forEach((step, i) => {
    const y = STEP_START_Y + i * (STEP_H + STEP_GAP);
    const isDecision = i === t.steps.length - 1 && t.label.includes("Claims");
    addStep(s2, t.x, y, t.w, STEP_H, step,
            isDecision ? C.amberBg : t.bgColor, t.hdrColor, 8.5);
    if (i < t.steps.length - 1) {
      vline(s2, t.x + t.w / 2, y + STEP_H, y + STEP_H + STEP_GAP, t.hdrColor, 1);
    }
  });

  // Tail arrow after last step
  const lastBottom = STEP_START_Y + t.steps.length * (STEP_H + STEP_GAP) - STEP_GAP;
  vline(s2, t.x + t.w / 2, lastBottom, lastBottom + 0.22, t.hdrColor, 1.5);
});

s2.addText("Continued on next slide — Resolution & Legal Escalation Paths  →", {
  x: 0.25, y: 7.15, w: 12.8, h: 0.28,
  fontSize: 8.5, fontFace: "Calibri", italic: true,
  color: C.gray, align: "center",
});

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 3 — RESOLUTION PATHS
// ═══════════════════════════════════════════════════════════════════════════════
const s3 = pres.addSlide();
s3.background = { color: C.bg };

// Title bar
s3.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 13.3, h: 0.58,
  fill: { color: C.navy }, line: { color: C.navy },
});
s3.addText("Resolution Paths — Settlement & Legal Escalation", {
  x: 0, y: 0, w: 13.3, h: 0.58,
  fontSize: 18, fontFace: "Calibri", bold: true,
  color: C.white, align: "center", valign: "middle", margin: 0,
});

// Decision box (centred)
const DEC = { x: 4.65, y: 0.76, w: 4.0, h: 0.62 };
const decCY = DEC.y + DEC.h / 2;
s3.addShape(pres.shapes.RECTANGLE, {
  x: DEC.x, y: DEC.y, w: DEC.w, h: DEC.h,
  fill: { color: "FF8C00" }, line: { color: C.orange, width: 2 },
  shadow: { type: "outer", color: "000000", blur: 5, offset: 2, angle: 135, opacity: 0.2 },
});
s3.addText("SETTLEMENT  OR  LEGAL DISPUTE?", {
  x: DEC.x, y: DEC.y, w: DEC.w, h: DEC.h,
  fontSize: 11, fontFace: "Calibri", bold: true,
  color: C.white, align: "center", valign: "middle", margin: 0,
});

// ── PATH 1: SETTLEMENT (left) ─────────────────────────────────────────────────
const P1 = { x: 0.25, w: 4.15, stepH: 0.46, stepGap: 0.06, stepStartY: 1.6 };

s3.addShape(pres.shapes.RECTANGLE, {
  x: P1.x, y: DEC.y, w: P1.w, h: DEC.h,
  fill: { color: C.green }, line: { color: C.green },
});
s3.addText("PATH 1 — SETTLEMENT", {
  x: P1.x, y: DEC.y, w: P1.w, h: DEC.h,
  fontSize: 11, fontFace: "Calibri", bold: true,
  color: C.white, align: "center", valign: "middle", margin: 0,
});

// Connector: P1 right -> DEC left
hline(s3, P1.x + P1.w, DEC.x, decCY, C.green, 1.5);
// Label "YES / AGREED"
s3.addText("YES / AGREED", {
  x: P1.x + P1.w + 0.03, y: decCY - 0.18, w: DEC.x - P1.x - P1.w - 0.06, h: 0.18,
  fontSize: 7, fontFace: "Calibri", italic: true, bold: true,
  color: C.green, align: "center",
});

const settleSteps = [
  "Settlement Terms Agreed",
  "Final Accounts Prepared",
  "P&I Club / H&M Insurer Issues Payment",
  "Release & Discharge Signed",
  "Claim File Closed",
];
settleSteps.forEach((step, i) => {
  const y = P1.stepStartY + i * (P1.stepH + P1.stepGap);
  addStep(s3, P1.x, y, P1.w, P1.stepH, step, C.resBg, C.green, 9);
  if (i < settleSteps.length - 1) {
    vline(s3, P1.x + P1.w / 2, y + P1.stepH, y + P1.stepH + P1.stepGap, C.green, 1);
  }
});

// Case Closed – settlement
const cc1Y = P1.stepStartY + settleSteps.length * (P1.stepH + P1.stepGap) - P1.stepGap + 0.12;
vline(s3, P1.x + P1.w / 2, P1.stepStartY + settleSteps.length * (P1.stepH + P1.stepGap) - P1.stepGap, cc1Y, C.green, 1.5);
s3.addShape(pres.shapes.RECTANGLE, {
  x: P1.x, y: cc1Y, w: P1.w, h: 0.52,
  fill: { color: C.green }, line: { color: C.green },
  shadow: { type: "outer", color: "000000", blur: 4, offset: 2, angle: 135, opacity: 0.15 },
});
s3.addText("CASE CLOSED", {
  x: P1.x, y: cc1Y, w: P1.w, h: 0.52,
  fontSize: 14, fontFace: "Calibri", bold: true,
  color: C.white, align: "center", valign: "middle", margin: 0,
});

// ── PATH 2: LEGAL ESCALATION (right) ─────────────────────────────────────────
const P2 = { x: 9.05, w: 4.0, stepH: 0.46, stepGap: 0.06, stepStartY: 1.6 };

s3.addShape(pres.shapes.RECTANGLE, {
  x: P2.x, y: DEC.y, w: P2.w, h: DEC.h,
  fill: { color: C.legalHdr }, line: { color: C.legalHdr },
});
s3.addText("PATH 2 — LEGAL ESCALATION", {
  x: P2.x, y: DEC.y, w: P2.w, h: DEC.h,
  fontSize: 11, fontFace: "Calibri", bold: true,
  color: C.white, align: "center", valign: "middle", margin: 0,
});

// Connector: DEC right -> P2 left
hline(s3, DEC.x + DEC.w, P2.x, decCY, C.legalHdr, 1.5);
s3.addText("DISPUTE", {
  x: DEC.x + DEC.w + 0.03, y: decCY - 0.18, w: P2.x - DEC.x - DEC.w - 0.06, h: 0.18,
  fontSize: 7, fontFace: "Calibri", italic: true, bold: true,
  color: C.legalHdr, align: "center",
});

const legalSteps = [
  "Letter of Undertaking (LOU) Posted",
  "Without-Prejudice Negotiations",
  "Arbitration (London / Singapore / NY)  OR  Litigation",
  "Hearing / Trial Proceedings",
  "Award / Judgment",
  "Enforcement of Award",
];
legalSteps.forEach((step, i) => {
  const y = P2.stepStartY + i * (P2.stepH + P2.stepGap);
  addStep(s3, P2.x, y, P2.w, P2.stepH, step, C.legalBg, C.legalHdr, 9);
  if (i < legalSteps.length - 1) {
    vline(s3, P2.x + P2.w / 2, y + P2.stepH, y + P2.stepH + P2.stepGap, C.legalHdr, 1);
  }
});

// Case Closed – legal
const cc2Y = P2.stepStartY + legalSteps.length * (P2.stepH + P2.stepGap) - P2.stepGap + 0.12;
vline(s3, P2.x + P2.w / 2, P2.stepStartY + legalSteps.length * (P2.stepH + P2.stepGap) - P2.stepGap, cc2Y, C.legalHdr, 1.5);
s3.addShape(pres.shapes.RECTANGLE, {
  x: P2.x, y: cc2Y, w: P2.w, h: 0.52,
  fill: { color: C.legalHdr }, line: { color: C.legalHdr },
  shadow: { type: "outer", color: "000000", blur: 4, offset: 2, angle: 135, opacity: 0.15 },
});
s3.addText("CASE CLOSED", {
  x: P2.x, y: cc2Y, w: P2.w, h: 0.52,
  fontSize: 14, fontFace: "Calibri", bold: true,
  color: C.white, align: "center", valign: "middle", margin: 0,
});

// ── Write file ────────────────────────────────────────────────────────────────
pres.writeFile({ fileName: "Maritime_HSEQ_Workflow.pptx" }).then(() => {
  console.log("Done: Maritime_HSEQ_Workflow.pptx");
});
