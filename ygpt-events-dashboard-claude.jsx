import { useState, useMemo } from "react";

const ROLES = ["Super Admin", "Regional Coordinator", "Events Team", "Leadership", "Finance & Accounts"];
const REGIONS = ["North", "South", "East", "West", "Central", "Northeast"];
const NOW = new Date("2026-03-15T12:00:00");
const daysDiff = (a, b) => Math.floor((new Date(b) - new Date(a)) / 86400000);
const dFromNow = (d) => daysDiff(d.split(" ")[0], NOW.toISOString().split("T")[0]);
const dUntil = (d) => daysDiff(NOW.toISOString().split("T")[0], d);
const ago = (d) => { const x = dFromNow(d); return x <= 0 ? "Today" : x === 1 ? "Yesterday" : x + "d ago"; };
const fmt = (n) => n != null ? "₹" + n.toLocaleString("en-IN") : "—";

const SC = {
  "Proposal Submitted": "#6366f1", "Under Review": "#eab308", "Changes Requested": "#f97316",
  "Approved by Events": "#22c55e", "Leadership Review": "#a855f7", "Leadership Approved": "#7c3aed",
  "Budget Review": "#0ea5e9", "Flagged by Finance": "#ef4444", "Funds Released": "#06b6d4",
  "Amendment Requested": "#f59e0b", "ECR Submitted": "#14b8a6", "ECR Corrections": "#f97316",
  "ECR Reviewed": "#059669", "Closed": "#6b7280", "Rejected": "#dc2626", "Resubmitted": "#818cf8",
};

const DSTAGES = ["Proposal Submitted", "Under Review", "Approved by Events", "Leadership Review", "Leadership Approved", "Budget Review", "Funds Released", "ECR Submitted", "ECR Reviewed", "Closed"];
const sidx = (s) => DSTAGES.indexOf(s);
const SLA = { "Under Review": 3, "Approved by Events": 1, "Leadership Review": 2, "Leadership Approved": 1, "Budget Review": 5, "Changes Requested": 3, "Flagged by Finance": 3, "ECR Submitted": 5, "ECR Reviewed": 5 };

const PHASES = [
  { name: "Proposal & Review", c: "#6366f1", bg: "#eef2ff", stages: ["Proposal Submitted", "Under Review", "Changes Requested"] },
  { name: "Approvals", c: "#8b5cf6", bg: "#f5f3ff", stages: ["Approved by Events", "Leadership Review", "Leadership Approved", "Budget Review", "Flagged by Finance", "Rejected"] },
  { name: "Execution", c: "#06b6d4", bg: "#ecfeff", stages: ["Funds Released", "Amendment Requested"] },
  { name: "Completion", c: "#059669", bg: "#ecfdf5", stages: ["ECR Submitted", "ECR Corrections", "ECR Reviewed", "Closed"] },
];

const EVENTS = [
  {
    id: "EVT-001", name: "Youth Leadership Summit 2026", region: "North", coord: "Arjun Mehta",
    stage: "Leadership Review", budget: 245000, curBudget: 245000, actual: null,
    pDate: "2026-03-01", eDate: "2026-04-15", priority: "high",
    photos: [], invoices: [], costs: [], disb: [], amend: [], revisions: [],
    surplus: null, surplusStatus: null,
    comments: [
      { by: "Kavitha Rao", role: "Events", at: "2026-03-03 14:30", t: "Confirm venue capacity?" },
      { by: "Arjun Mehta", role: "Coordinator", at: "2026-03-04 09:15", t: "Pragati Maidan Hall B — 800 cap." },
      { by: "Kavitha Rao", role: "Events", at: "2026-03-04 10:00", t: "Perfect. Approving." },
    ],
    audit: [
      { a: "Proposal Submitted", by: "Arjun Mehta", r: "Coordinator", at: "2026-03-01 09:15", n: "Initial proposal", emails: [] },
      { a: "Changes Requested", by: "Kavitha Rao", r: "Events Team", at: "2026-03-03 14:22", n: "Need venue breakdown", emails: ["arjun@ygpt.in", "CC: bots@ygpt.in"] },
      { a: "Resubmitted", by: "Arjun Mehta", r: "Coordinator", at: "2026-03-05 11:00", n: "Added venue + ₹25K contingency", emails: ["events@ygpt.in"] },
      { a: "Approved by Events", by: "Kavitha Rao", r: "Events Team", at: "2026-03-06 16:40", n: "Approved → Leadership", emails: ["leadership@ygpt.in", "CC: bots@ygpt.in"] },
      { a: "Leadership Review", by: "System", r: "System", at: "2026-03-06 16:40", n: "Awaiting sign-off", emails: [] },
    ],
  },
  {
    id: "EVT-002", name: "Regional Coding Bootcamp", region: "South", coord: "Priya Sharma",
    stage: "Budget Review", budget: 89000, curBudget: 89000, actual: null,
    pDate: "2026-02-20", eDate: "2026-04-05", priority: "medium",
    photos: [], invoices: [], costs: [], disb: [], amend: [], revisions: [],
    surplus: null, surplusStatus: null, comments: [],
    audit: [
      { a: "Proposal Submitted", by: "Priya Sharma", r: "Coordinator", at: "2026-02-20 10:30", n: "", emails: [] },
      { a: "Approved by Events", by: "Kavitha Rao", r: "Events Team", at: "2026-02-22 09:15", n: "Well-structured", emails: ["leadership@ygpt.in"] },
      { a: "Leadership Approved", by: "Dr. Ramesh Gupta", r: "Leadership", at: "2026-02-24 11:30", n: "Align with calendar", emails: ["finance@ygpt.in", "accounts@ygpt.in"] },
      { a: "Budget Review", by: "System", r: "System", at: "2026-02-24 11:30", n: "", emails: [] },
    ],
  },
  {
    id: "EVT-003", name: "Clean India Drive III", region: "West", coord: "Rahul Desai",
    stage: "Funds Released", budget: 156000, curBudget: 156000, actual: null,
    pDate: "2026-02-10", eDate: "2026-03-20", priority: "medium",
    photos: [], invoices: [], costs: [],
    disb: [{ amt: 109200, pct: 70, type: "Advance", date: "2026-03-05", ref: "TXN-88402", by: "Neha Kapoor" }, { amt: 46800, pct: 30, type: "Post-ECR", date: null, pending: true }],
    amend: [], revisions: [], surplus: null, surplusStatus: null,
    comments: [{ by: "Neha Kapoor", role: "Finance", at: "2026-03-05 12:35", t: "70% advance released." }],
    audit: [
      { a: "Proposal Submitted", by: "Rahul Desai", r: "Coordinator", at: "2026-02-10 08:45", n: "", emails: [] },
      { a: "Approved by Events", by: "Sanjay Patil", r: "Events Team", at: "2026-02-12 15:00", n: "Approved", emails: ["leadership@ygpt.in"] },
      { a: "Leadership Approved", by: "Dr. Ramesh Gupta", r: "Leadership", at: "2026-02-14 10:00", n: "", emails: ["finance@ygpt.in", "accounts@ygpt.in"] },
      { a: "Funds Released", by: "Neha Kapoor", r: "Finance", at: "2026-03-05 12:30", n: "70% advance. TXN-88402", emails: ["rahul@ygpt.in"] },
    ],
  },
  {
    id: "EVT-004", name: "Mental Health Awareness Week", region: "East", coord: "Sneha Roy",
    stage: "Closed", budget: 72000, curBudget: 72000, actual: 68500,
    pDate: "2026-01-15", eDate: "2026-02-22", priority: "low",
    photos: [{ n: "Opening", e: "🎤" }, { n: "Panel", e: "🗣️" }, { n: "Workshop", e: "📝" }, { n: "Group Photo", e: "📸" }, { n: "Certificates", e: "🏅" }, { n: "Closing", e: "🎊" }],
    invoices: [
      { n: "Venue - Hotel Grand", amt: 25000, ref: "INV-4401", d: "2026-02-20", doc: true },
      { n: "Catering", amt: 18000, ref: "INV-4402", d: "2026-02-22", doc: true },
      { n: "Printing", amt: 8500, ref: "INV-4403", d: "2026-02-18", doc: true },
      { n: "Speaker Honorarium", amt: 12000, ref: "INV-4404", d: "2026-02-22", doc: true },
      { n: "Transport", amt: 5000, ref: "INV-4405", d: "2026-02-21", doc: true },
    ],
    costs: [{ c: "Venue", p: 28000, a: 25000 }, { c: "Catering", p: 20000, a: 18000 }, { c: "Materials", p: 8000, a: 8500 }, { c: "Speakers", p: 10000, a: 12000 }, { c: "Transport", p: 6000, a: 5000 }],
    disb: [{ amt: 50400, pct: 70, type: "Advance", date: "2026-01-25", ref: "TXN-87601", by: "Neha Kapoor" }, { amt: 18100, pct: 30, type: "Post-ECR", date: "2026-02-28", ref: "TXN-87901", by: "Neha Kapoor" }],
    amend: [], revisions: [],
    surplus: 3500, surplusStatus: "Returned",
    comments: [{ by: "Kavitha Rao", role: "Events", at: "2026-02-27 10:05", t: "Great docs." }, { by: "Neha Kapoor", role: "Finance", at: "2026-02-28 14:35", t: "Verified. ₹3,500 surplus returned. Closing." }],
    audit: [
      { a: "Proposal Submitted", by: "Sneha Roy", r: "Coordinator", at: "2026-01-15 09:00", n: "", emails: [] },
      { a: "Approved by Events", by: "Kavitha Rao", r: "Events Team", at: "2026-01-17 11:15", n: "Strong proposal", emails: ["leadership@ygpt.in"] },
      { a: "Leadership Approved", by: "Dr. Ramesh Gupta", r: "Leadership", at: "2026-01-18 14:00", n: "", emails: ["finance@ygpt.in", "accounts@ygpt.in"] },
      { a: "Funds Released", by: "Neha Kapoor", r: "Finance", at: "2026-01-25 09:30", n: "70% advance", emails: ["sneha@ygpt.in"] },
      { a: "ECR Submitted", by: "Sneha Roy", r: "Coordinator", at: "2026-02-25 16:00", n: "All docs attached", emails: ["events@ygpt.in"] },
      { a: "ECR Reviewed", by: "Kavitha Rao", r: "Events Team", at: "2026-02-27 10:00", n: "Complete", emails: ["finance@ygpt.in", "accounts@ygpt.in"] },
      { a: "Closed", by: "Neha Kapoor", r: "Finance", at: "2026-02-28 14:30", n: "₹3,500 surplus returned by coordinator", emails: ["sneha@ygpt.in", "events@ygpt.in"] },
    ],
  },
  {
    id: "EVT-005", name: "Entrepreneurship Workshop", region: "Central", coord: "Vikram Singh",
    stage: "ECR Submitted", budget: 120000, curBudget: 120000, actual: 115200,
    pDate: "2026-01-05", eDate: "2026-02-10", priority: "low",
    photos: [{ n: "Keynote", e: "🎓" }, { n: "Networking", e: "🤝" }, { n: "Pitch", e: "🏆" }],
    invoices: [
      { n: "Venue", amt: 35000, ref: "INV-5501", d: "2026-02-08", doc: true },
      { n: "Catering", amt: 22000, ref: "INV-5502", d: "2026-02-10", doc: true },
      { n: "Marketing", amt: 15200, ref: "INV-5503", d: "2026-02-05", doc: false },
      { n: "Speaker Travel", amt: 28000, ref: "INV-5504", d: "2026-02-10", doc: true },
      { n: "Misc", amt: 15000, ref: "INV-5505", d: "2026-02-10", doc: false },
    ],
    costs: [{ c: "Venue", p: 40000, a: 35000 }, { c: "Catering", p: 25000, a: 22000 }, { c: "Marketing", p: 15000, a: 15200 }, { c: "Speakers", p: 25000, a: 28000 }, { c: "Misc", p: 15000, a: 15000 }],
    disb: [{ amt: 84000, pct: 70, type: "Advance", date: "2026-01-15", ref: "TXN-86903", by: "Neha Kapoor" }, { amt: 36000, pct: 30, type: "Post-ECR", date: null, pending: true }],
    amend: [], revisions: [],
    surplus: 4800, surplusStatus: "Pending Return",
    comments: [],
    audit: [
      { a: "Proposal Submitted", by: "Vikram Singh", r: "Coordinator", at: "2026-01-05 10:00", n: "", emails: [] },
      { a: "Approved by Events", by: "Sanjay Patil", r: "Events Team", at: "2026-01-07 13:45", n: "", emails: ["leadership@ygpt.in"] },
      { a: "Leadership Approved", by: "Anita Deshmukh", r: "Leadership", at: "2026-01-08 16:20", n: "Capture outcomes", emails: ["finance@ygpt.in", "accounts@ygpt.in"] },
      { a: "Funds Released", by: "Neha Kapoor", r: "Finance", at: "2026-01-15 11:00", n: "70% advance", emails: ["vikram@ygpt.in"] },
      { a: "ECR Submitted", by: "Vikram Singh", r: "Coordinator", at: "2026-02-14 17:30", n: "Docs attached", emails: ["events@ygpt.in"] },
    ],
  },
  {
    id: "EVT-006", name: "Women in STEM Conference", region: "South", coord: "Ananya Iyer",
    stage: "Approved by Events", budget: 198000, curBudget: 198000, actual: null,
    pDate: "2026-03-05", eDate: "2026-04-20", priority: "high",
    photos: [], invoices: [], costs: [], disb: [], amend: [], revisions: [],
    surplus: null, surplusStatus: null,
    comments: [{ by: "Kavitha Rao", role: "Events", at: "2026-03-08 15:15", t: "Excellent lineup." }],
    audit: [
      { a: "Proposal Submitted", by: "Ananya Iyer", r: "Coordinator", at: "2026-03-05 08:30", n: "", emails: [] },
      { a: "Approved by Events", by: "Kavitha Rao", r: "Events Team", at: "2026-03-08 15:10", n: "Forwarding", emails: ["leadership@ygpt.in"] },
    ],
  },
  {
    id: "EVT-007", name: "Rural Digital Literacy Camp", region: "Northeast", coord: "Bhaskar Deka",
    stage: "Proposal Submitted", budget: 65000, curBudget: 65000, actual: null,
    pDate: "2026-03-12", eDate: "2026-05-01", priority: "medium",
    photos: [], invoices: [], costs: [], disb: [], amend: [], revisions: [],
    surplus: null, surplusStatus: null, comments: [],
    audit: [{ a: "Proposal Submitted", by: "Bhaskar Deka", r: "Coordinator", at: "2026-03-12 11:20", n: "200 rural youth, 5 villages", emails: ["events@ygpt.in"] }],
  },
  {
    id: "EVT-008", name: "Sports Day 2026", region: "North", coord: "Arjun Mehta",
    stage: "Funds Released", budget: 180000, curBudget: 195000, actual: null,
    pDate: "2026-02-01", eDate: "2026-03-22", priority: "high",
    photos: [], invoices: [], costs: [],
    disb: [{ amt: 126000, pct: 70, type: "Advance", date: "2026-02-10", ref: "TXN-88101", by: "Neha Kapoor" }, { amt: 54000, pct: 30, type: "Post-ECR", date: null, pending: true }],
    amend: [{ orig: 180000, revised: 195000, reason: "₹15K for medals — 200 extra registrations", reqBy: "Arjun Mehta", reqDate: "2026-03-01", appBy: "Dr. Ramesh Gupta", appDate: "2026-03-02", status: "Approved" }],
    revisions: [], surplus: null, surplusStatus: null,
    comments: [{ by: "Arjun Mehta", role: "Coordinator", at: "2026-03-01 10:00", t: "Need ₹15K for medals." }],
    audit: [
      { a: "Proposal Submitted", by: "Arjun Mehta", r: "Coordinator", at: "2026-02-01 09:00", n: "", emails: [] },
      { a: "Approved by Events", by: "Sanjay Patil", r: "Events Team", at: "2026-02-03 11:30", n: "", emails: ["leadership@ygpt.in"] },
      { a: "Leadership Approved", by: "Dr. Ramesh Gupta", r: "Leadership", at: "2026-02-04 09:00", n: "", emails: ["finance@ygpt.in", "accounts@ygpt.in"] },
      { a: "Funds Released", by: "Neha Kapoor", r: "Finance", at: "2026-02-10 14:15", n: "70% of ₹1.8L", emails: ["arjun@ygpt.in"] },
      { a: "Amendment Requested", by: "Arjun Mehta", r: "Coordinator", at: "2026-03-01 10:00", n: "₹15K for medals", emails: ["leadership@ygpt.in"] },
      { a: "Amendment Approved", by: "Dr. Ramesh Gupta", r: "Leadership", at: "2026-03-02 11:00", n: "Budget → ₹1.95L", emails: ["finance@ygpt.in", "arjun@ygpt.in"] },
    ],
  },
  {
    id: "EVT-009", name: "Art & Culture Festival", region: "West", coord: "Meera Joshi",
    stage: "Rejected", budget: 340000, curBudget: 340000, actual: null,
    pDate: "2026-02-28", eDate: "2026-04-10", priority: "low",
    photos: [], invoices: [], costs: [], disb: [], amend: [],
    revisions: [{ ver: 2, budget: 185000, date: "2026-03-10", changes: "Budget ₹3.4L → ₹1.85L. Cut 1 day, cheaper venue.", status: "Under Review", newDate: "2026-04-25" }],
    surplus: null, surplusStatus: null,
    comments: [{ by: "Dr. Ramesh Gupta", role: "Leadership", at: "2026-03-04 16:05", t: "Revise under ₹2L." }, { by: "Meera Joshi", role: "Coordinator", at: "2026-03-10 09:05", t: "Revised to ₹1.85L." }],
    audit: [
      { a: "Proposal Submitted", by: "Meera Joshi", r: "Coordinator", at: "2026-02-28 10:00", n: "", emails: [] },
      { a: "Approved by Events", by: "Kavitha Rao", r: "Events Team", at: "2026-03-02 12:00", n: "Good concept, high budget", emails: ["leadership@ygpt.in"] },
      { a: "Rejected", by: "Dr. Ramesh Gupta", r: "Leadership", at: "2026-03-04 16:00", n: "Exceeds allocation. Under ₹2L.", emails: ["meera@ygpt.in", "events@ygpt.in"] },
      { a: "Resubmitted", by: "Meera Joshi", r: "Coordinator", at: "2026-03-10 09:00", n: "v2: ₹1.85L", emails: ["events@ygpt.in"] },
    ],
  },
  {
    id: "EVT-010", name: "Career Guidance Seminar", region: "East", coord: "Sneha Roy",
    stage: "ECR Reviewed", budget: 45000, curBudget: 45000, actual: 47200,
    pDate: "2025-12-20", eDate: "2026-01-30", priority: "low",
    photos: [{ n: "Hall", e: "🏛️" }, { n: "Q&A", e: "❓" }, { n: "Students", e: "🎒" }],
    invoices: [
      { n: "Venue", amt: 20000, ref: "INV-3301", d: "2026-01-28", doc: true },
      { n: "Lunch", amt: 12200, ref: "INV-3302", d: "2026-01-30", doc: true },
      { n: "Printing", amt: 5000, ref: "INV-3303", d: "2026-01-25", doc: true },
      { n: "Speaker", amt: 10000, ref: "INV-3304", d: "2026-01-30", doc: false },
    ],
    costs: [{ c: "Venue", p: 15000, a: 20000 }, { c: "Catering", p: 12000, a: 12200 }, { c: "Materials", p: 8000, a: 5000 }, { c: "Speakers", p: 10000, a: 10000 }],
    disb: [{ amt: 31500, pct: 70, type: "Advance", date: "2025-12-30", ref: "TXN-86501", by: "Neha Kapoor" }, { amt: 13500, pct: 30, type: "Post-ECR", date: null, pending: true }],
    amend: [], revisions: [],
    surplus: null, surplusStatus: "Over Budget",
    comments: [{ by: "Kavitha Rao", role: "Events", at: "2026-02-04 10:05", t: "Over budget justified — venue change." }],
    audit: [
      { a: "Proposal Submitted", by: "Sneha Roy", r: "Coordinator", at: "2025-12-20 09:00", n: "", emails: [] },
      { a: "Approved by Events", by: "Kavitha Rao", r: "Events Team", at: "2025-12-22 11:00", n: "", emails: ["leadership@ygpt.in"] },
      { a: "Leadership Approved", by: "Anita Deshmukh", r: "Leadership", at: "2025-12-23 10:30", n: "", emails: ["finance@ygpt.in", "accounts@ygpt.in"] },
      { a: "Funds Released", by: "Neha Kapoor", r: "Finance", at: "2025-12-30 09:00", n: "70% advance", emails: ["sneha@ygpt.in"] },
      { a: "ECR Submitted", by: "Sneha Roy", r: "Coordinator", at: "2026-02-02 14:00", n: "Venue changed, +₹5K", emails: ["events@ygpt.in"] },
      { a: "ECR Reviewed", by: "Kavitha Rao", r: "Events Team", at: "2026-02-04 10:00", n: "Justified", emails: ["finance@ygpt.in", "accounts@ygpt.in"] },
    ],
  },
  {
    id: "EVT-011", name: "Hackathon Spring 2026", region: "South", coord: "Karthik Nair",
    stage: "Flagged by Finance", budget: 210000, curBudget: 210000, actual: null,
    pDate: "2026-02-15", eDate: "2026-03-25", priority: "high",
    photos: [], invoices: [], costs: [], disb: [], amend: [], revisions: [],
    surplus: null, surplusStatus: null,
    comments: [{ by: "Neha Kapoor", role: "Finance", at: "2026-02-20 15:50", t: "AV ₹45K too high. Get 2 quotes." }, { by: "Karthik Nair", role: "Coordinator", at: "2026-02-21 09:00", t: "Getting quotes." }],
    audit: [
      { a: "Proposal Submitted", by: "Karthik Nair", r: "Coordinator", at: "2026-02-15 10:00", n: "", emails: [] },
      { a: "Approved by Events", by: "Sanjay Patil", r: "Events Team", at: "2026-02-17 14:00", n: "", emails: ["leadership@ygpt.in"] },
      { a: "Leadership Approved", by: "Dr. Ramesh Gupta", r: "Leadership", at: "2026-02-18 11:00", n: "High visibility", emails: ["finance@ygpt.in", "accounts@ygpt.in"] },
      { a: "Flagged by Finance", by: "Neha Kapoor", r: "Finance", at: "2026-02-20 15:45", n: "AV ₹45K — get quotes", emails: ["karthik@ygpt.in", "events@ygpt.in"] },
    ],
  },
  {
    id: "EVT-012", name: "Teacher Training Program", region: "Central", coord: "Vikram Singh",
    stage: "Changes Requested", budget: 95000, curBudget: 95000, actual: null,
    pDate: "2026-03-10", eDate: "2026-04-28", priority: "medium",
    photos: [], invoices: [], costs: [], disb: [], amend: [], revisions: [],
    surplus: null, surplusStatus: null,
    comments: [{ by: "Kavitha Rao", role: "Events", at: "2026-03-12 16:05", t: "Add session plan, teacher count, assessment." }],
    audit: [
      { a: "Proposal Submitted", by: "Vikram Singh", r: "Coordinator", at: "2026-03-10 09:30", n: "", emails: [] },
      { a: "Changes Requested", by: "Kavitha Rao", r: "Events Team", at: "2026-03-12 16:00", n: "Need details", emails: ["vikram@ygpt.in"] },
    ],
  },
];

/* ═══ Helpers ═══ */
const tis = (e) => { const l = e.audit[e.audit.length - 1]; return l ? dFromNow(l.at) : 0; };
const slaLeft = (e) => { const s = SLA[e.stage]; return s != null ? s - tis(e) : null; };
const evtCD = (e) => { const d = dUntil(e.eDate); return d > 7 ? null : d > 0 ? { t: "Event in " + d + "d", c: d <= 3 ? "#dc2626" : "#f59e0b" } : d === 0 ? { t: "Event today!", c: "#dc2626" } : { t: "Event was " + Math.abs(d) + "d ago", c: "#6b7280" }; };
const pendingFor = (role, adm) => {
  if (adm) return EVENTS.filter(e => ["Proposal Submitted", "Under Review", "Approved by Events", "Leadership Review", "Budget Review", "ECR Submitted", "ECR Reviewed"].includes(e.stage));
  if (role === "Events Team") return EVENTS.filter(e => ["Proposal Submitted", "Under Review", "ECR Submitted"].includes(e.stage));
  if (role === "Leadership") return EVENTS.filter(e => ["Approved by Events", "Leadership Review"].includes(e.stage));
  if (role === "Finance & Accounts") return EVENTS.filter(e => ["Budget Review", "ECR Reviewed"].includes(e.stage));
  if (role === "Regional Coordinator") return EVENTS.filter(e => e.coord === "Arjun Mehta" && ["Changes Requested", "Flagged by Finance"].includes(e.stage));
  return [];
};

/* ═══ Micro Components ═══ */
const Badge = ({ stage, sm }) => <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: sm ? "2px 8px" : "3px 10px", borderRadius: 14, fontSize: sm ? 10 : 11, fontWeight: 600, whiteSpace: "nowrap", background: (SC[stage] || "#6b7280") + "12", color: SC[stage] || "#6b7280", border: "1px solid " + (SC[stage] || "#6b7280") + "25" }}><span style={{ width: sm ? 4 : 5, height: sm ? 4 : 5, borderRadius: "50%", background: SC[stage] || "#6b7280" }} />{stage}</span>;
const Dot = ({ p }) => <span style={{ width: 7, height: 7, borderRadius: "50%", background: p === "high" ? "#ef4444" : p === "medium" ? "#eab308" : "#94a3b8", display: "inline-block" }} />;
const SlaChip = ({ e }) => { const l = slaLeft(e); if (l === null) return null; const c = l < 0 ? "#dc2626" : l <= 1 ? "#b45309" : "#059669"; return <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: l < 0 ? "#fef2f2" : l <= 1 ? "#fffbeb" : "#ecfdf5", color: c }}>{l < 0 ? Math.abs(l) + "d overdue" : l === 0 ? "Due today" : l + "d left"}</span>; };
const CDChip = ({ e }) => { const cd = evtCD(e); return cd ? <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: cd.c === "#dc2626" ? "#fef2f2" : cd.c === "#f59e0b" ? "#fffbeb" : "#f1f5f9", color: cd.c }}>{cd.t}</span> : null; };
const Nt = ({ n }) => n > 0 ? <span style={{ minWidth: 16, height: 16, borderRadius: 8, background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 4px", marginLeft: 4 }}>{n}</span> : null;
const Btn = ({ children, v = "sec", onClick }) => {
  const base = { padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", border: "none", fontFamily: "inherit" };
  const vs = { pri: { ...base, background: "#22c55e", color: "#fff" }, dan: { ...base, border: "1px solid #fecaca", background: "#fff", color: "#ef4444" }, sec: { ...base, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b" }, pur: { ...base, background: "#7c3aed", color: "#fff" }, blu: { ...base, background: "#0ea5e9", color: "#fff" }, tea: { ...base, background: "#14b8a6", color: "#fff" }, drk: { ...base, background: "#1e293b", color: "#fff" }, amb: { ...base, background: "#f59e0b", color: "#fff" } };
  return <button onClick={onClick} style={vs[v] || vs.sec}>{children}</button>;
};

const SurplusBadge = ({ e }) => {
  if (e.actual == null || !["ECR Submitted", "ECR Reviewed", "Closed"].includes(e.stage)) return null;
  const released = e.disb.filter(d => !d.pending).reduce((s, d) => s + d.amt, 0);
  const diff = released - e.actual;
  if (diff <= 0 && e.actual <= e.curBudget) return null;
  if (e.actual > e.curBudget) return <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: "#fef2f2", color: "#dc2626" }}>↑ {fmt(e.actual - e.curBudget)} over budget</span>;
  return <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: diff > 0 ? "#ecfdf5" : "#f1f5f9", color: diff > 0 ? "#059669" : "#64748b" }}>↓ {fmt(e.curBudget - e.actual)} under budget{e.surplusStatus ? " · " + e.surplusStatus : ""}</span>;
};

/* ═══ Card ═══ */
const EvtCard = ({ e, onClick }) => (
  <div onClick={onClick} style={{ background: (slaLeft(e) !== null && slaLeft(e) < 0) ? "#fef2f2" : "#fff", borderRadius: 8, border: "1px solid #e2e8f0", padding: "12px 16px", cursor: "pointer", borderLeft: "3px solid " + (SC[e.stage] || "#6b7280"), marginBottom: 6, transition: "box-shadow 0.1s" }} onMouseEnter={ev => { ev.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"; }} onMouseLeave={ev => { ev.currentTarget.style.boxShadow = "none"; }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4, flexWrap: "wrap" }}>
          <Dot p={e.priority} /><span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", fontFamily: "var(--m)" }}>{e.id}</span>
          <SlaChip e={e} /><CDChip e={e} /><SurplusBadge e={e} />
          {e.comments.length > 0 && <span style={{ fontSize: 10, color: "#94a3b8" }}>💬{e.comments.length}</span>}
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{e.name}</div>
        <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{e.coord} · {e.region} · {e.eDate}</div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 10 }}>
        <Badge stage={e.stage} sm />
        <div style={{ fontSize: 14, fontWeight: 800, fontFamily: "var(--m)", marginTop: 4 }}>{fmt(e.budget)}</div>
      </div>
    </div>
  </div>
);

/* ═══ MAIN ═══ */
function YGPTDashboard() {
  const [role, setRole] = useState("Super Admin");
  const [sel, setSel] = useState(null);
  const [nav, setNav] = useState("pending");
  const [rgn, setRgn] = useState("All");
  const [tab, setTab] = useState("overview");
  const [q, setQ] = useState("");
  const [nc, setNc] = useState("");
  const [ecrStep, setEcrStep] = useState(0);

  const adm = role === "Super Admin";
  const evts = useMemo(() => {
    let x = EVENTS;
    if (rgn !== "All") x = x.filter(e => e.region === rgn);
    if (q.trim()) { const s = q.toLowerCase(); x = x.filter(e => e.name.toLowerCase().includes(s) || e.id.toLowerCase().includes(s) || e.coord.toLowerCase().includes(s)); }
    return x;
  }, [rgn, q]);

  const pend = pendingFor(role, adm);
  const nt = useMemo(() => ({ pend: pend.length, ecr: EVENTS.filter(e => e.stage === "ECR Submitted").length, ecrF: EVENTS.filter(e => e.stage === "ECR Reviewed").length, overdue: EVENTS.filter(e => { const l = slaLeft(e); return l !== null && l < 0; }).length, surplusPend: EVENTS.filter(e => e.surplusStatus === "Pending Return").length }), [pend]);
  const stats = useMemo(() => ({ total: EVENTS.length, budgetTotal: EVENTS.reduce((s, x) => s + x.curBudget, 0), spent: EVENTS.filter(x => x.actual).reduce((s, x) => s + x.actual, 0) }), []);
  const cycleTime = useMemo(() => { const done = EVENTS.filter(e => e.audit.find(a => a.a === "Funds Released")); const times = done.map(e => { const f = e.audit[0].at; const fu = e.audit.find(a => a.a === "Funds Released"); return fu ? daysDiff(f.split(" ")[0], fu.at.split(" ")[0]) : null; }).filter(Boolean); return times.length ? Math.round(times.reduce((a, b) => a + b) / times.length) : null; }, []);
  const budgetAcc = useMemo(() => { const d = EVENTS.filter(e => e.actual != null); if (!d.length) return null; return (100 - d.map(e => Math.abs(e.actual - e.curBudget) / e.curBudget * 100).reduce((a, b) => a + b) / d.length).toFixed(1); }, []);

  const chRole = (r) => { setRole(r); setSel(null); setTab("overview"); setQ(""); setNav(r === "Regional Coordinator" ? "myevents" : "pending"); };
  const open = (e) => { setSel(e); setTab("overview"); setEcrStep(0); };

  const getNav = () => {
    if (role === "Regional Coordinator") return [{ k: "myevents", l: "My Events", n: pend.length }, { k: "overview", l: "Overview" }, { k: "pipeline", l: "Pipeline" }];
    const items = [{ k: "pending", l: "Pending on Me", n: nt.pend }];
    if (role === "Events Team" || adm) items.push({ k: "ecr", l: "ECR Review", n: nt.ecr });
    if (role === "Finance & Accounts" || adm) items.push({ k: "close", l: "Verify & Close", n: nt.ecrF });
    if ((role === "Finance & Accounts" || adm) && nt.surplusPend > 0) items.push({ k: "surplus", l: "Surplus Pending", n: nt.surplusPend });
    items.push({ k: "pipeline", l: "Pipeline" }, { k: "overview", l: "Overview" }, { k: "analytics", l: "Analytics" });
    return items;
  };

  /* ── Detail ── */
  const Detail = ({ e }) => {
    const idx = sidx(e.stage); const rej = e.stage === "Rejected";
    const chg = e.stage === "Changes Requested"; const flg = e.stage === "Flagged by Finance";
    const hasECR = ["ECR Submitted", "ECR Reviewed", "Closed"].includes(e.stage);
    const canER = (adm || role === "Events Team") && ["Proposal Submitted", "Under Review"].includes(e.stage);
    const canLA = (adm || role === "Leadership") && ["Approved by Events", "Leadership Review"].includes(e.stage);
    const canFA = (adm || role === "Finance & Accounts") && e.stage === "Budget Review";
    const canECR = (adm || role === "Events Team") && e.stage === "ECR Submitted";
    const canVC = (adm || role === "Finance & Accounts") && e.stage === "ECR Reviewed";
    const canRS = (adm || role === "Regional Coordinator") && ["Changes Requested", "Flagged by Finance"].includes(e.stage);
    const canRev = (adm || role === "Regional Coordinator") && e.stage === "Rejected";
    const canAmend = (adm || role === "Regional Coordinator") && e.stage === "Funds Released";
    const canECRSubmit = (adm || role === "Regional Coordinator") && e.stage === "Funds Released";
    const invA = e.invoices.filter(x => x.doc).length;
    const released = e.disb.filter(d => !d.pending).reduce((s, d) => s + d.amt, 0);
    const hasSurplus = e.actual != null && e.actual < released;
    const surplusAmt = hasSurplus ? released - e.actual : 0;

    const tabs = [{ k: "overview", l: "Overview" }, { k: "comments", l: "Comments (" + e.comments.length + ")" }, { k: "audit", l: "Audit (" + e.audit.length + ")" }];
    if (hasECR || canECRSubmit) tabs.push({ k: "ecr", l: hasECR ? "ECR" + (e.invoices.length ? " · " + invA + "/" + e.invoices.length : "") : "Submit ECR" });
    if (e.disb.length) tabs.push({ k: "funds", l: "Funds" });
    if (e.amend.length) tabs.push({ k: "amend", l: "Amendments" });
    if (e.revisions.length) tabs.push({ k: "revisions", l: "Revisions" });

    return (
      <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", fontFamily: "var(--m)" }}>{e.id}</span><Dot p={e.priority} /><SlaChip e={e} /><CDChip e={e} /><SurplusBadge e={e} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 }}>{e.name}</h3>
              <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 12, color: "#64748b" }}>
                <span>👤 {e.coord}</span><span>📍 {e.region}</span><span>📅 {e.eDate}</span>
              </div>
            </div>
            <Badge stage={e.stage} />
          </div>
          {(chg || flg || rej) && <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, fontSize: 12, display: "flex", alignItems: "flex-start", gap: 8, lineHeight: 1.5, background: rej || flg ? "#fef2f2" : "#fff7ed", border: "1px solid " + (rej || flg ? "#fecaca" : "#fed7aa"), color: rej || flg ? "#dc2626" : "#c2410c" }}>⚠ <div><b>{rej ? "Rejected" : flg ? "Flagged by Finance" : "Changes Requested"}:</b> {e.audit.filter(a => a.a === (rej ? "Rejected" : flg ? "Flagged by Finance" : "Changes Requested")).pop()?.n}</div></div>}
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid #f1f5f9", padding: "0 24px", overflowX: "auto" }}>
          {tabs.map(t => <button key={t.k} onClick={() => { setTab(t.k); if (t.k === "ecr") setEcrStep(0); }} style={{ padding: "10px 16px", fontSize: 12, fontWeight: 600, border: "none", background: "none", cursor: "pointer", fontFamily: "inherit", color: tab === t.k ? "#4f46e5" : "#94a3b8", borderBottom: tab === t.k ? "2px solid #4f46e5" : "2px solid transparent", whiteSpace: "nowrap" }}>{t.l}</button>)}
        </div>

        {tab === "overview" && <div>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Lifecycle</div>
            <div style={{ display: "flex", alignItems: "center", overflowX: "auto", paddingBottom: 4 }}>
              {DSTAGES.map((s, i) => { const done = !rej && idx >= i; const cur = e.stage === s; return <div key={s} style={{ display: "flex", alignItems: "center", flex: i < DSTAGES.length - 1 ? 1 : "none" }}><div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 22 }}><div style={{ width: cur ? 22 : 14, height: cur ? 22 : 14, borderRadius: "50%", background: done ? SC[s] : "#e2e8f0", border: cur ? "2px solid " + SC[s] + "30" : "none", display: "flex", alignItems: "center", justifyContent: "center" }}>{done && !cur && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>}</div><span style={{ fontSize: 8, color: done ? "#334155" : "#cbd5e1", marginTop: 4, textAlign: "center", maxWidth: 52, lineHeight: 1.1, fontWeight: cur ? 700 : 500 }}>{s}</span></div>{i < DSTAGES.length - 1 && <div style={{ flex: 1, height: 2, background: done && idx > i ? SC[s] : "#e2e8f0", margin: "0 2px", marginBottom: 16, minWidth: 6 }} />}</div>; })}
            </div>
          </div>
          <div style={{ padding: "16px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Budget</div>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                <div><div style={{ fontSize: 11, color: "#94a3b8" }}>Proposed</div><div style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--m)" }}>{fmt(e.budget)}</div></div>
                {e.curBudget !== e.budget && <div><div style={{ fontSize: 11, color: "#94a3b8" }}>Current</div><div style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--m)", color: "#0ea5e9" }}>{fmt(e.curBudget)}</div></div>}
                {e.actual != null && <div><div style={{ fontSize: 11, color: "#94a3b8" }}>Actual</div><div style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--m)", color: e.actual > e.curBudget ? "#ef4444" : "#10b981" }}>{fmt(e.actual)}</div></div>}
              </div>
              {e.actual != null && <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600, color: e.actual <= e.curBudget ? "#10b981" : "#ef4444" }}>{e.actual <= e.curBudget ? "↓ " + fmt(e.curBudget - e.actual) + " under budget" : "↑ " + fmt(e.actual - e.curBudget) + " over budget"}</div>}
              {hasSurplus && <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 6, background: "#ecfdf5", border: "1px solid #bbf7d0", fontSize: 12 }}>
                <div style={{ fontWeight: 700, color: "#059669", marginBottom: 2 }}>Fund Reconciliation</div>
                <div style={{ color: "#334155" }}>Released: {fmt(released)} · Spent: {fmt(e.actual)} · <b style={{ color: "#059669" }}>Surplus: {fmt(surplusAmt)}</b></div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Status: <b style={{ color: e.surplusStatus === "Returned" ? "#059669" : e.surplusStatus === "Pending Return" ? "#f59e0b" : "#dc2626" }}>{e.surplusStatus || "Pending"}</b></div>
              </div>}
              {e.actual != null && e.actual > e.curBudget && <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 6, background: "#fef2f2", border: "1px solid #fecaca", fontSize: 12 }}>
                <div style={{ fontWeight: 700, color: "#dc2626", marginBottom: 2 }}>Over Budget</div>
                <div style={{ color: "#334155" }}>Budget: {fmt(e.curBudget)} · Actual: {fmt(e.actual)} · <b style={{ color: "#dc2626" }}>Excess: {fmt(e.actual - e.curBudget)}</b></div>
              </div>}
            </div>
            <div><div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Notes</div><p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, margin: 0 }}>{e.name} — {e.region} Region</p></div>
          </div>
          {(canER || canLA || canFA || canECR || canVC || canRS || canRev || canAmend || canECRSubmit) && <div style={{ padding: "12px 24px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            {canER && <><Btn v="pri">Approve → Leadership</Btn><Btn v="sec">Request Changes</Btn><Btn v="dan">Reject</Btn></>}
            {canLA && <><Btn v="pur">Approve → Finance</Btn><Btn v="sec">Request Changes</Btn><Btn v="dan">Reject</Btn></>}
            {canFA && <><Btn v="blu">Release Funds</Btn><Btn v="dan">Flag</Btn></>}
            {canECR && <><Btn v="tea">Approve ECR</Btn><Btn v="dan">Request Corrections</Btn></>}
            {canVC && <><Btn v="drk">Verify & Close</Btn><Btn v="dan">Corrections</Btn></>}
            {canRS && <Btn v="pri">Resubmit</Btn>}
            {canRev && <Btn v="amb">Revise & Resubmit</Btn>}
            {canAmend && <Btn v="amb">Budget Amendment</Btn>}
            {canECRSubmit && <Btn v="tea" onClick={() => setTab("ecr")}>Submit ECR</Btn>}
            {adm && <span style={{ fontSize: 10, color: "#94a3b8" }}>⚡ Admin</span>}
          </div>}
        </div>}

        {tab === "comments" && <div style={{ padding: "18px 24px" }}>
          {e.comments.length === 0 && <div style={{ textAlign: "center", padding: 24, color: "#94a3b8", fontSize: 13 }}>No comments yet.</div>}
          {e.comments.map((c, i) => <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#6366f1", flexShrink: 0 }}>{c.by.split(" ").map(w => w[0]).join("")}</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 12 }}><b style={{ color: "#0f172a" }}>{c.by}</b> <span style={{ color: "#94a3b8", fontSize: 11 }}>{c.role} · {c.at}</span></div><p style={{ fontSize: 13, color: "#334155", margin: "4px 0 0", background: "#f8fafc", padding: "8px 12px", borderRadius: "0 8px 8px 8px", border: "1px solid #f1f5f9", lineHeight: 1.5 }}>{c.t}</p></div>
          </div>)}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}><textarea value={nc} onChange={x => setNc(x.target.value)} placeholder="Add comment..." rows={2} style={{ flex: 1, padding: "8px 12px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 13, fontFamily: "inherit", resize: "vertical", outline: "none" }} /><Btn v="pri" onClick={() => setNc("")}>Send</Btn></div>
        </div>}

        {tab === "audit" && <div style={{ padding: "18px 24px" }}>
          <div style={{ position: "relative", paddingLeft: 24 }}>
            <div style={{ position: "absolute", left: 8, top: 4, bottom: 4, width: 2, background: "#e2e8f0" }} />
            {e.audit.map((a, i) => <div key={i} style={{ position: "relative", marginBottom: 18 }}>
              <div style={{ position: "absolute", left: -19, top: 2, width: 14, height: 14, borderRadius: "50%", background: a.r === "System" ? "#e2e8f0" : (SC[a.a] || "#6366f1"), border: "2px solid #fff" }} />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}><span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{a.a}</span><Badge stage={a.a} sm /></div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}><b>{a.by}</b> · {a.r} · <span style={{ fontFamily: "var(--m)", fontSize: 10 }}>{a.at}</span></div>
                {a.n && <div style={{ marginTop: 4, padding: "6px 10px", background: "#f8fafc", borderRadius: 6, border: "1px solid #f1f5f9", fontSize: 12, color: "#475569", lineHeight: 1.4 }}>{a.n}</div>}
                {a.emails && a.emails.length > 0 && <div style={{ marginTop: 4, fontSize: 11, color: "#0ea5e9", display: "flex", alignItems: "center", gap: 4 }}>📧 Notified: {a.emails.join(", ")}</div>}
              </div>
            </div>)}
          </div>
        </div>}

        {tab === "ecr" && <div style={{ padding: "18px 24px" }}>
          {canECRSubmit && !hasECR ? (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 14 }}>Submit Event Completion Report</div>
              <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
                {["Upload Photos", "Attach Invoices", "Cost Breakdown", "Review & Submit"].map((s, i) => <div key={i} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", margin: "0 auto 6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, background: ecrStep >= i ? "#4f46e5" : "#e2e8f0", color: ecrStep >= i ? "#fff" : "#94a3b8" }}>{i + 1}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: ecrStep === i ? "#4f46e5" : "#94a3b8" }}>{s}</div>
                </div>)}
              </div>
              {ecrStep === 0 && <div style={{ padding: 24, border: "2px dashed #e2e8f0", borderRadius: 10, textAlign: "center" }}><div style={{ fontSize: 32, marginBottom: 8 }}>📸</div><div style={{ fontSize: 14, fontWeight: 600, color: "#334155", marginBottom: 4 }}>Upload Event Photos</div><div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>Drop photos here or click to browse. JPG, PNG accepted.</div><Btn v="pri">Choose Files</Btn></div>}
              {ecrStep === 1 && <div style={{ padding: 24, border: "2px dashed #e2e8f0", borderRadius: 10, textAlign: "center" }}><div style={{ fontSize: 32, marginBottom: 8 }}>🧾</div><div style={{ fontSize: 14, fontWeight: 600, color: "#334155", marginBottom: 4 }}>Attach Invoices & Receipts</div><div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>Upload scanned invoices for each expense. PDF or image.</div><Btn v="pri">Upload</Btn></div>}
              {ecrStep === 2 && <div><div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Fill Cost Breakdown</div><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}><thead><tr style={{ borderBottom: "2px solid #e2e8f0" }}>{["Category", "Proposed (₹)", "Actual (₹)"].map(h => <th key={h} style={{ textAlign: "left", padding: "8px", fontSize: 10, fontWeight: 700, color: "#94a3b8" }}>{h}</th>)}</tr></thead><tbody>{["Venue", "Catering", "Materials", "Speakers", "Transport", "Misc"].map(c => <tr key={c} style={{ borderBottom: "1px solid #f1f5f9" }}><td style={{ padding: "8px", fontSize: 12 }}>{c}</td><td style={{ padding: "8px" }}><input style={{ width: 80, padding: "4px 8px", border: "1px solid #e2e8f0", borderRadius: 4, fontSize: 12, fontFamily: "var(--m)" }} placeholder="0" /></td><td style={{ padding: "8px" }}><input style={{ width: 80, padding: "4px 8px", border: "1px solid #e2e8f0", borderRadius: 4, fontSize: 12, fontFamily: "var(--m)" }} placeholder="0" /></td></tr>)}</tbody></table></div>}
              {ecrStep === 3 && <div style={{ textAlign: "center", padding: 20 }}><div style={{ fontSize: 36, marginBottom: 8 }}>✅</div><div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Ready to Submit</div><div style={{ fontSize: 13, color: "#64748b", marginBottom: 14 }}>Review uploads and cost data, then submit.</div><Btn v="pri">Submit ECR</Btn></div>}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}><Btn v="sec" onClick={() => setEcrStep(Math.max(0, ecrStep - 1))}>← Back</Btn>{ecrStep < 3 && <Btn v="pri" onClick={() => setEcrStep(ecrStep + 1)}>Next →</Btn>}</div>
            </div>
          ) : (
            <div>
              {e.photos.length > 0 && <div style={{ marginBottom: 18 }}><div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 10 }}>Photos ({e.photos.length})</div><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(90px,1fr))", gap: 8 }}>{e.photos.map((p, i) => <div key={i} style={{ background: "#f1f5f9", borderRadius: 8, padding: 12, textAlign: "center", border: "1px solid #e2e8f0" }}><div style={{ fontSize: 24, marginBottom: 4 }}>{p.e}</div><div style={{ fontSize: 10, fontWeight: 600, color: "#475569" }}>{p.n}</div></div>)}</div></div>}
              {e.costs.length > 0 && <div style={{ marginBottom: 18 }}><div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 10 }}>Cost Breakdown</div><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}><thead><tr style={{ borderBottom: "2px solid #e2e8f0" }}>{["Category", "Proposed", "Actual", "Variance"].map(h => <th key={h} style={{ textAlign: "left", padding: "8px", fontSize: 10, fontWeight: 700, color: "#94a3b8" }}>{h}</th>)}</tr></thead><tbody>{e.costs.map((c, i) => { const v = c.p - c.a; return <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}><td style={{ padding: "8px", fontWeight: 600 }}>{c.c}</td><td style={{ padding: "8px", fontFamily: "var(--m)" }}>{fmt(c.p)}</td><td style={{ padding: "8px", fontFamily: "var(--m)" }}>{fmt(c.a)}</td><td style={{ padding: "8px", fontFamily: "var(--m)", fontWeight: 700, color: v >= 0 ? "#10b981" : "#ef4444" }}>{v >= 0 ? "↓" : "↑"} {fmt(Math.abs(v))}</td></tr>; })}</tbody></table></div>}
              {e.invoices.length > 0 && <div><div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 10 }}>Invoices — <span style={{ color: invA === e.invoices.length ? "#059669" : "#f59e0b" }}>{invA}/{e.invoices.length} docs attached</span></div>{e.invoices.map((inv, i) => <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 8, border: "1px solid #e2e8f0", marginBottom: 5, background: inv.doc ? "#fff" : "#fffbeb" }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 26, height: 26, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, background: inv.doc ? "#ecfdf5" : "#fef3c7", color: inv.doc ? "#059669" : "#b45309" }}>{inv.doc ? "✓" : "!"}</span><div><div style={{ fontSize: 12, fontWeight: 600 }}>{inv.n}</div><div style={{ fontSize: 10, color: "#94a3b8" }}>{inv.ref} · {inv.d} · {inv.doc ? <span style={{ color: "#059669" }}>Attached</span> : <span style={{ color: "#b45309", fontWeight: 700 }}>Pending upload</span>}</div></div></div><span style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--m)" }}>{fmt(inv.amt)}</span></div>)}</div>}
              {(canECR || canVC) && <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #f1f5f9", display: "flex", gap: 6, alignItems: "center" }}>
                {canECR && <><Btn v="tea">Approve ECR</Btn><Btn v="dan">Corrections</Btn></>}
                {canVC && <><Btn v="drk">Verify & Close</Btn><Btn v="dan">Corrections</Btn></>}
                {invA < e.invoices.length && <span style={{ fontSize: 11, color: "#b45309" }}>⚠ {e.invoices.length - invA} invoice docs pending</span>}
              </div>}
            </div>
          )}
        </div>}

        {tab === "funds" && <div style={{ padding: "18px 24px" }}>
          <div style={{ display: "flex", gap: 20, marginBottom: 16 }}>
            <div><div style={{ fontSize: 11, color: "#94a3b8" }}>Approved</div><div style={{ fontSize: 18, fontWeight: 800, fontFamily: "var(--m)" }}>{fmt(e.curBudget)}</div></div>
            <div><div style={{ fontSize: 11, color: "#94a3b8" }}>Released</div><div style={{ fontSize: 18, fontWeight: 800, fontFamily: "var(--m)", color: "#22c55e" }}>{fmt(released)}</div></div>
            <div><div style={{ fontSize: 11, color: "#94a3b8" }}>Pending</div><div style={{ fontSize: 18, fontWeight: 800, fontFamily: "var(--m)", color: "#f59e0b" }}>{fmt(e.disb.filter(d => d.pending).reduce((s, d) => s + d.amt, 0))}</div></div>
            {hasSurplus && <div><div style={{ fontSize: 11, color: "#94a3b8" }}>Surplus</div><div style={{ fontSize: 18, fontWeight: 800, fontFamily: "var(--m)", color: "#059669" }}>{fmt(surplusAmt)}</div></div>}
          </div>
          <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3, marginBottom: 16 }}><div style={{ height: "100%", background: "linear-gradient(90deg,#22c55e,#06b6d4)", borderRadius: 3, width: (released / e.curBudget * 100) + "%" }} /></div>
          {hasSurplus && <div style={{ padding: "10px 14px", borderRadius: 8, background: "#ecfdf5", border: "1px solid #bbf7d0", marginBottom: 14, fontSize: 12, color: "#059669", fontWeight: 600 }}>💰 Surplus of {fmt(surplusAmt)} — Status: <b>{e.surplusStatus || "Pending"}</b></div>}
          {e.disb.map((d, i) => <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0", marginBottom: 6, background: d.pending ? "#fffbeb" : "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: d.pending ? "#fef3c7" : "#ecfdf5", color: d.pending ? "#b45309" : "#059669" }}>{d.pct}%</span><div><div style={{ fontSize: 12, fontWeight: 600 }}>{d.type}</div><div style={{ fontSize: 10, color: "#94a3b8" }}>{d.pending ? "Pending release" : d.ref + " · " + d.date + " · " + d.by}</div></div></div>
            <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--m)", color: d.pending ? "#b45309" : "#0f172a" }}>{fmt(d.amt)}</span>
          </div>)}
        </div>}

        {tab === "amend" && <div style={{ padding: "18px 24px" }}>
          {e.amend.map((a, i) => <div key={i} style={{ padding: 14, borderRadius: 8, border: "1px solid #e2e8f0", background: "#fafbfc" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ fontSize: 13, fontWeight: 700 }}>Amendment #{i + 1}</span><span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: "#ecfdf5", color: "#059669" }}>{a.status}</span></div>
            <div style={{ display: "flex", gap: 16, marginBottom: 8 }}><div><div style={{ fontSize: 11, color: "#94a3b8" }}>Original</div><div style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--m)", textDecoration: "line-through", color: "#94a3b8" }}>{fmt(a.orig)}</div></div><span style={{ color: "#94a3b8", alignSelf: "center", fontSize: 14 }}>→</span><div><div style={{ fontSize: 11, color: "#94a3b8" }}>Revised</div><div style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--m)" }}>{fmt(a.revised)}</div></div></div>
            <div style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>{a.reason}</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>By {a.reqBy} · Approved by {a.appBy} on {a.appDate}</div>
          </div>)}
        </div>}

        {tab === "revisions" && <div style={{ padding: "18px 24px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 12 }}>Revision History</div>
          <div style={{ padding: 14, borderRadius: 8, border: "1px solid #fecaca", background: "#fef2f2", marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 13, fontWeight: 700 }}>v1 — Original</span><span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: "#fef2f2", color: "#dc2626" }}>Rejected</span></div>
            <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--m)", marginBottom: 2 }}>{fmt(e.budget)}</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>Event date: {e.eDate}</div>
          </div>
          {e.revisions.map((rv, i) => <div key={i} style={{ padding: 14, borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 13, fontWeight: 700 }}>v{rv.ver} — Revised</span><Badge stage={rv.status} sm /></div>
            <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--m)", marginBottom: 4 }}>{fmt(rv.budget)}</div>
            <div style={{ fontSize: 12, color: "#475569", marginBottom: 4 }}>{rv.changes}</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>New date: {rv.newDate} · Submitted {rv.date}</div>
          </div>)}
        </div>}
      </div>
    );
  };

  /* ── Views ── */
  const QueueView = ({ items, title, sub }) => (
    <div>
      <div style={{ marginBottom: 14 }}><h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 }}>{title}</h3><p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 0" }}>{sub}</p></div>
      {nt.overdue > 0 && title.includes("Pending") && <div style={{ padding: "10px 14px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", marginBottom: 12, fontSize: 12, color: "#dc2626", fontWeight: 600 }}>⚠ {nt.overdue} event{nt.overdue > 1 ? "s" : ""} overdue on SLA</div>}
      {items.length === 0 ? <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 13, background: "#fff", borderRadius: 8, border: "1px solid #e2e8f0" }}>All caught up ✓</div>
        : items.sort((a, b) => (slaLeft(a) || 99) - (slaLeft(b) || 99)).map(e => <EvtCard key={e.id} e={e} onClick={() => open(e)} />)}
    </div>
  );

  const PipelineView = () => (
    <div>
      <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 14px" }}>Pipeline</h3>
      {PHASES.map(ph => { const items = evts.filter(e => ph.stages.includes(e.stage)); return <div key={ph.name} style={{ background: "#fff", borderRadius: 8, border: "1px solid #e2e8f0", overflow: "hidden", marginBottom: 10 }}>
        <div style={{ padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: items.length ? "1px solid #f1f5f9" : "none", background: ph.bg }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 10, height: 10, borderRadius: 3, background: ph.c }} /><span style={{ fontSize: 14, fontWeight: 700 }}>{ph.name}</span></div><span style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--m)", color: ph.c, background: "#fff", padding: "2px 8px", borderRadius: 4 }}>{items.length}</span></div>
        {items.length > 0 && <div style={{ padding: 10, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 8 }}>{items.map(e => <EvtCard key={e.id} e={e} onClick={() => open(e)} />)}</div>}
      </div>; })}
    </div>
  );

  const OverviewView = () => {
    const byRgn = REGIONS.map(r => ({ l: r.slice(0, 3), v: EVENTS.filter(e => e.region === r).length }));
    return <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginBottom: 18 }}>
        {[{ l: "Total", v: stats.total, c: "#6366f1" }, { l: "Pending", v: EVENTS.filter(x => ["Proposal Submitted", "Under Review", "Changes Requested"].includes(x.stage)).length, c: "#eab308" }, { l: "Approval", v: EVENTS.filter(x => ["Approved by Events", "Leadership Review", "Leadership Approved", "Budget Review", "Flagged by Finance"].includes(x.stage)).length, c: "#8b5cf6" }, { l: "Active", v: EVENTS.filter(x => x.stage === "Funds Released").length, c: "#06b6d4" }, { l: "Done", v: EVENTS.filter(x => ["ECR Submitted", "ECR Reviewed", "Closed"].includes(x.stage)).length, c: "#059669" }].map((s, i) => <div key={i} style={{ background: "#fff", borderRadius: 8, padding: "16px 18px", border: "1px solid #e2e8f0" }}><div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 4 }}>{s.l}</div><div style={{ fontSize: 28, fontWeight: 800, color: s.c, fontFamily: "var(--m)", lineHeight: 1 }}>{s.v}</div></div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
        <div style={{ background: "#fff", borderRadius: 8, padding: 18, border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12 }}>Budget</div>
          <div style={{ display: "flex", gap: 20 }}><div><div style={{ fontSize: 11, color: "#94a3b8" }}>Total</div><div style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--m)" }}>{fmt(stats.budgetTotal)}</div></div><div><div style={{ fontSize: 11, color: "#94a3b8" }}>Spent</div><div style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--m)", color: "#10b981" }}>{fmt(stats.spent)}</div></div></div>
          <div style={{ marginTop: 12, height: 6, background: "#f1f5f9", borderRadius: 3 }}><div style={{ height: "100%", width: (stats.spent / stats.budgetTotal * 100) + "%", background: "linear-gradient(90deg,#10b981,#06b6d4)", borderRadius: 3 }} /></div>
        </div>
        <div style={{ background: "#fff", borderRadius: 8, padding: 18, border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12 }}>By Region</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>{byRgn.map((d, i) => { const mx = Math.max(...byRgn.map(x => x.v), 1); return <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}><span style={{ fontSize: 10, fontWeight: 700, color: "#64748b" }}>{d.v}</span><div style={{ width: "100%", maxWidth: 24, borderRadius: 3, background: "#6366f1" + (i % 2 === 0 ? "bb" : "77"), height: Math.max(d.v / mx * 48, d.v > 0 ? 3 : 0) + "px" }} /><span style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600 }}>{d.l}</span></div>; })}</div>
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 8, padding: 18, border: "1px solid #e2e8f0" }}>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12 }}>All Events</div>
        {evts.map(e => <EvtCard key={e.id} e={e} onClick={() => open(e)} />)}
      </div>
    </div>;
  };

  const AnalyticsView = () => {
    const brg = REGIONS.map(r => ({ l: r.slice(0, 4), v: Math.round(EVENTS.filter(e => e.region === r).reduce((s, e) => s + e.curBudget, 0) / 1000) }));
    const monthly = [{ m: "Jan", v: EVENTS.filter(e => e.pDate.startsWith("2026-01")).length }, { m: "Feb", v: EVENTS.filter(e => e.pDate.startsWith("2026-02")).length }, { m: "Mar", v: EVENTS.filter(e => e.pDate.startsWith("2026-03")).length }];
    return <div>
      <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 16px" }}>Analytics</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 18 }}>
        <div style={{ background: "#fff", borderRadius: 8, padding: 18, border: "1px solid #e2e8f0", textAlign: "center" }}><div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 6 }}>Avg Cycle Time</div><div style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--m)", color: "#6366f1" }}>{cycleTime || "—"}</div><div style={{ fontSize: 11, color: "#94a3b8" }}>days (proposal → funds)</div></div>
        <div style={{ background: "#fff", borderRadius: 8, padding: 18, border: "1px solid #e2e8f0", textAlign: "center" }}><div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 6 }}>Budget Accuracy</div><div style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--m)", color: "#22c55e" }}>{budgetAcc || "—"}%</div><div style={{ fontSize: 11, color: "#94a3b8" }}>avg (completed events)</div></div>
        <div style={{ background: "#fff", borderRadius: 8, padding: 18, border: "1px solid #e2e8f0", textAlign: "center" }}><div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 6 }}>SLA Overdue</div><div style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--m)", color: nt.overdue > 0 ? "#dc2626" : "#22c55e" }}>{nt.overdue}</div><div style={{ fontSize: 11, color: "#94a3b8" }}>events past deadline</div></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
        <div style={{ background: "#fff", borderRadius: 8, padding: 18, border: "1px solid #e2e8f0" }}><div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12 }}>Budget by Region (₹K)</div><div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 90 }}>{brg.map((d, i) => { const mx = Math.max(...brg.map(x => x.v), 1); return <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}><span style={{ fontSize: 10, fontWeight: 700, fontFamily: "var(--m)", color: "#64748b" }}>{d.v}</span><div style={{ width: "100%", maxWidth: 24, borderRadius: 3, background: "#8b5cf6" + (i % 2 === 0 ? "bb" : "77"), height: Math.max(d.v / mx * 56, d.v > 0 ? 3 : 0) + "px" }} /><span style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600 }}>{d.l}</span></div>; })}</div></div>
        <div style={{ background: "#fff", borderRadius: 8, padding: 18, border: "1px solid #e2e8f0" }}><div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12 }}>Monthly Proposals</div><div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 90 }}>{monthly.map((d, i) => <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}><span style={{ fontSize: 10, fontWeight: 700, color: "#64748b" }}>{d.v}</span><div style={{ width: "100%", maxWidth: 32, borderRadius: 3, background: "#06b6d4" + (i % 2 === 0 ? "bb" : "77"), height: Math.max(d.v / 8 * 56, d.v > 0 ? 3 : 0) + "px" }} /><span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>{d.m}</span></div>)}</div></div>
      </div>
      <div style={{ background: "#fff", borderRadius: 8, padding: 18, border: "1px solid #e2e8f0" }}><div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12 }}>Budget Variance — Completed</div><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}><thead><tr style={{ borderBottom: "2px solid #e2e8f0" }}>{["Event", "Region", "Budget", "Actual", "Variance", "Status"].map(h => <th key={h} style={{ textAlign: "left", padding: "8px", fontSize: 10, fontWeight: 700, color: "#94a3b8" }}>{h}</th>)}</tr></thead><tbody>{EVENTS.filter(e => e.actual != null).map(e => { const v = e.curBudget - e.actual; return <tr key={e.id} style={{ borderBottom: "1px solid #f1f5f9", cursor: "pointer" }} onClick={() => { open(e); setTab("ecr"); }}><td style={{ padding: "8px", fontWeight: 600 }}>{e.name}</td><td style={{ padding: "8px", color: "#64748b" }}>{e.region}</td><td style={{ padding: "8px", fontFamily: "var(--m)" }}>{fmt(e.curBudget)}</td><td style={{ padding: "8px", fontFamily: "var(--m)" }}>{fmt(e.actual)}</td><td style={{ padding: "8px", fontFamily: "var(--m)", fontWeight: 700, color: v >= 0 ? "#10b981" : "#ef4444" }}>{v >= 0 ? "↓ " : "↑ "}{fmt(Math.abs(v))}</td><td style={{ padding: "8px" }}>{e.surplusStatus ? <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: e.surplusStatus === "Returned" ? "#ecfdf5" : e.surplusStatus === "Pending Return" ? "#fffbeb" : "#fef2f2", color: e.surplusStatus === "Returned" ? "#059669" : e.surplusStatus === "Pending Return" ? "#b45309" : "#dc2626" }}>{e.surplusStatus}</span> : "—"}</td></tr>; })}</tbody></table></div>
    </div>;
  };

  const MyEventsView = () => {
    const my = EVENTS.filter(e => e.coord === "Arjun Mehta");
    const regionEvts = EVENTS.filter(e => e.region === "North");
    const nudges = [];
    my.forEach(e => { const du = dUntil(e.eDate); if (e.stage === "Changes Requested") nudges.push({ e, c: "#f97316", t: e.name + ": Changes requested — respond soon" }); if (e.stage === "Flagged by Finance") nudges.push({ e, c: "#ef4444", t: e.name + ": Flagged by Finance" }); if (e.stage === "Funds Released" && du <= 7 && du > 0) nudges.push({ e, c: "#06b6d4", t: e.name + ": Event in " + du + "d — prepare" }); if (e.stage === "Funds Released" && du <= 0) nudges.push({ e, c: "#f59e0b", t: e.name + ": Event passed — submit ECR" }); if (e.stage === "Rejected") nudges.push({ e, c: "#dc2626", t: e.name + ": Rejected — revise & resubmit" }); });
    return <div>
      <div style={{ marginBottom: 14 }}><h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>My Events</h3><p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 0" }}>Arjun Mehta · North Region</p></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 16, padding: "14px 16px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
        <div><div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>North Events</div><div style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--m)", color: "#6366f1" }}>{regionEvts.length}</div></div>
        <div><div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>Total Budget</div><div style={{ fontSize: 14, fontWeight: 800, fontFamily: "var(--m)" }}>{fmt(regionEvts.reduce((s, x) => s + x.curBudget, 0))}</div></div>
        <div><div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>Completed</div><div style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--m)", color: "#22c55e" }}>{regionEvts.filter(x => ["ECR Submitted", "ECR Reviewed", "Closed"].includes(x.stage)).length}</div></div>
        <div><div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>Active</div><div style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--m)", color: "#06b6d4" }}>{regionEvts.filter(x => x.stage === "Funds Released").length}</div></div>
      </div>
      {nudges.length > 0 && <div style={{ marginBottom: 14 }}>{nudges.map((nd, i) => <div key={i} onClick={() => open(nd.e)} style={{ padding: "8px 12px", borderRadius: 6, background: nd.c + "08", border: "1px solid " + nd.c + "22", fontSize: 12, color: nd.c, fontWeight: 600, cursor: "pointer", marginBottom: 4 }}>⚡ {nd.t}</div>)}</div>}
      {my.map(e => <div key={e.id} onClick={() => open(e)} style={{ background: "#fff", borderRadius: 8, padding: 14, border: "1px solid #e2e8f0", cursor: "pointer", marginBottom: 6 }} onMouseEnter={ev => { ev.currentTarget.style.borderColor = "#6366f1"; }} onMouseLeave={ev => { ev.currentTarget.style.borderColor = "#e2e8f0"; }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><div style={{ fontSize: 14, fontWeight: 700 }}>{e.name}</div><div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{e.eDate} · {ago(e.pDate)}</div></div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><SlaChip e={e} /><CDChip e={e} /><Badge stage={e.stage} sm /></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 10 }}>{DSTAGES.slice(0, 7).map((s, i) => { const x = sidx(e.stage); const done = x >= i; return <div key={s} style={{ display: "flex", alignItems: "center", flex: i < 6 ? 1 : "none" }}><div style={{ width: 10, height: 10, borderRadius: "50%", background: done ? SC[s] : "#e2e8f0", flexShrink: 0 }} />{i < 6 && <div style={{ flex: 1, height: 2, background: done && x > i ? SC[s] : "#e2e8f0", minWidth: 4 }} />}</div>; })}</div>
      </div>)}
    </div>;
  };

  const render = () => {
    if (sel) return <Detail e={sel} />;
    switch (nav) {
      case "pending": return <QueueView items={pend} title="Pending on Me" sub={pend.length + " items need your action"} />;
      case "ecr": return <QueueView items={EVENTS.filter(e => e.stage === "ECR Submitted")} title="ECR Review" sub="Completion reports awaiting review" />;
      case "close": return <QueueView items={EVENTS.filter(e => e.stage === "ECR Reviewed")} title="Verify & Close" sub="Awaiting invoice verification" />;
      case "surplus": return <QueueView items={EVENTS.filter(e => e.surplusStatus === "Pending Return")} title="Surplus Pending Return" sub="Events with unaccounted surplus funds" />;
      case "pipeline": return <PipelineView />;
      case "overview": return <OverviewView />;
      case "analytics": return <AnalyticsView />;
      case "myevents": return <MyEventsView />;
      default: return <OverviewView />;
    }
  };

  return (
    <div style={{ "--m": "'JetBrains Mono',monospace", minHeight: "100vh", background: "#f7f8fa", fontFamily: "'Outfit',system-ui,sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ background: "#0f172a", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 48, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 5, background: "linear-gradient(135deg,#6366f1,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#fff", fontSize: 11, fontWeight: 800, fontFamily: "var(--m)" }}>Y</span></div>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>YGPT Events</span>
          {adm && <span style={{ fontSize: 9, fontWeight: 700, color: "#fbbf24", background: "#fbbf2418", padding: "2px 6px", borderRadius: 3, textTransform: "uppercase", letterSpacing: 0.4 }}>Admin</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          {ROLES.map(r => <button key={r} onClick={() => chRole(r)} style={{ padding: "4px 10px", borderRadius: 4, border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", background: role === r ? (r === "Super Admin" ? "#fbbf24" : "#4f46e5") : "transparent", color: role === r ? (r === "Super Admin" ? "#0f172a" : "#fff") : "#64748b" }}>{r === "Super Admin" ? "⚡ Admin" : r}</button>)}
        </div>
      </div>
      <div style={{ display: "flex", minHeight: "calc(100vh - 48px)" }}>
        <div style={{ width: 200, background: "#fff", borderRight: "1px solid #e2e8f0", padding: "14px 8px", flexShrink: 0 }}>
          <div style={{ position: "relative", marginBottom: 10, padding: "0 4px" }}>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search events..." style={{ width: "100%", padding: "7px 8px 7px 28px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 12, fontFamily: "inherit", outline: "none", background: "#f8fafc", boxSizing: "border-box" }} />
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "#94a3b8" }}>🔍</span>
          </div>
          {getNav().map(x => <button key={x.k} onClick={() => { setNav(x.k); setSel(null); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", borderRadius: 6, marginBottom: 2, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", textAlign: "left", width: "100%", fontFamily: "inherit", background: nav === x.k ? "#eef2ff" : "transparent", color: nav === x.k ? "#4f46e5" : "#64748b" }}><span style={{ flex: 1 }}>{x.l}</span>{x.n > 0 && <Nt n={x.n} />}</button>)}
          {role !== "Regional Coordinator" && <div style={{ marginTop: 16, padding: "0 10px" }}><div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Region</div>{["All", ...REGIONS].map(r => <button key={r} onClick={() => { setRgn(r); setSel(null); }} style={{ display: "block", width: "100%", padding: "4px 6px", borderRadius: 4, border: "none", fontSize: 11, fontWeight: 500, cursor: "pointer", textAlign: "left", background: rgn === r ? "#f1f5f9" : "transparent", color: rgn === r ? "#334155" : "#94a3b8", fontFamily: "inherit" }}>{r}</button>)}</div>}
          {sel && <button onClick={() => setSel(null)} style={{ marginTop: 14, padding: "6px 10px", borderRadius: 5, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", width: "calc(100% - 16px)", marginLeft: 8 }}>← Back to list</button>}
        </div>
        <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>{render()}</div>
      </div>
    </div>
  );
}

export default YGPTDashboard;
