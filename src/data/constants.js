export const ROLES = ["Super Admin", "Regional Coordinator", "Events Team", "Leadership", "Finance & Accounts"];
export const REGIONS = ["North", "South", "East", "West", "Central", "Northeast"];
export const NOW = new Date("2026-03-15T12:00:00");

export const SC = {
  "Proposal Submitted": "#6366f1", "Under Review": "#eab308", "Changes Requested": "#f97316",
  "Approved by Events": "#22c55e", "Leadership Review": "#a855f7", "Leadership Approved": "#7c3aed",
  "Budget Review": "#0ea5e9", "Flagged by Finance": "#ef4444", "Funds Released": "#06b6d4",
  "Amendment Requested": "#f59e0b", "ECR Submitted": "#14b8a6", "ECR Corrections": "#f97316",
  "ECR Reviewed": "#059669", "Closed": "#6b7280", "Rejected": "#dc2626", "Resubmitted": "#818cf8",
};

export const DSTAGES = [
  "Proposal Submitted", "Under Review", "Approved by Events", "Leadership Review",
  "Leadership Approved", "Budget Review", "Funds Released", "ECR Submitted", "ECR Reviewed", "Closed",
];

export const SLA = {
  "Under Review": 3, "Approved by Events": 1, "Leadership Review": 2, "Leadership Approved": 1,
  "Budget Review": 5, "Changes Requested": 3, "Flagged by Finance": 3, "ECR Submitted": 5, "ECR Reviewed": 5,
};

export const PHASES = [
  { name: "Proposal & Review", c: "#6366f1", bg: "#eef2ff", stages: ["Proposal Submitted", "Under Review", "Changes Requested"] },
  { name: "Approvals", c: "#8b5cf6", bg: "#f5f3ff", stages: ["Approved by Events", "Leadership Review", "Leadership Approved", "Budget Review", "Flagged by Finance", "Rejected"] },
  { name: "Execution", c: "#06b6d4", bg: "#ecfeff", stages: ["Funds Released", "Amendment Requested"] },
  { name: "Completion", c: "#059669", bg: "#ecfdf5", stages: ["ECR Submitted", "ECR Corrections", "ECR Reviewed", "Closed"] },
];
