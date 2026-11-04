window.VISION = {
  today: [
    { t: "NPD Launch Readiness", go: "real-npd-readiness" },
    { t: "Item Setup Readiness", go: "real-item-setup-readiness" },
    { t: "Change Impact Workflow", go: "real-change-impact-workflow" },
    { t: "Cash application", go: "real-cash-application" },
    { t: "Blocked orders", go: "real-blocked-orders" },
    { t: "Online store integration", go: "real-online-store" },
    { t: "Pricing maintenance", go: "proto-pricing" },
    { t: "Retailer content", go: "proto-retailer" },
    { t: "PLM Workspace", go: "real-plm-workspace" },
    { t: "PLM-first item launch", go: "proto-plm-first" }
  ],
  lanes: [
    { k: "p1", h: "Phase 1" },
    { k: "p2", h: "Phase 2" },
    { k: "p3", h: "Phase 3", none: "Nothing built yet" },
    { k: "later", h: "Later" },
    { k: "out", h: "Beside the phases" }
  ],
  chips: [
    { t: "Blocked orders", lane: "p1", tag: "Phase 1", road: "Touchless O2C Exception Handling", go: "real-blocked-orders" },
    { t: "Pricing maintenance", lane: "p1", tag: "Phase 1", road: "Pricing Intelligence", go: "proto-pricing" },
    { t: "Item Setup Readiness", lane: "p2", tag: "Phase 2", road: "Item Master", go: "real-item-setup-readiness" },
    { t: "Cash application", lane: "p2", tag: "Phase 2", road: "Bank & Treasury Reconciliation", go: "real-cash-application" },
    { t: "PLM Workspace", lane: "p2", tag: "Phase 2", road: "Workflow", go: "real-plm-workspace" },
    { t: "PLM-first item launch", lane: "later", tag: "Later", road: "Item Creation Automation and Approval Flow", go: "proto-plm-first" },
    { t: "Online store integration", lane: "out", tag: "Your board date", go: "real-online-store" },
    { t: "NPD Launch Readiness", lane: "out", tag: "Added for you", go: "real-npd-readiness" },
    { t: "Change Impact Workflow", lane: "out", tag: "Added for you", go: "real-change-impact-workflow" },
    { t: "Retailer content", lane: "out", tag: "Added for you", go: "proto-retailer" }
  ]
};
