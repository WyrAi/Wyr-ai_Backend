import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  SelectAccess: {
    purchaseOrder: [
      {
        type: String,
        enum: [
          "Request For Change",
          "View",
          "Accept",
          "Generate",
          "Edit",
          "Approve",
          "Send To Factory",
          "Delete",
        ],
      },
    ],

    packingList: [
      {
        type: String,
        enum: [
          "Create/Edit User",
          "Approve",
          "Delete",
          "Share with OC",
          "View",
        ],
      },
    ],

    sheduleInspection: [
      {
        type: String,
        enum: [
          "View Inspections",
          "Schedule",
          "Reschedule",
          "Approve Reschedule",
          "Approve schedule",
        ],
      },
    ],

    liveInspection: [
      {
        type: String,
        enum: ["View Live"],
      },
    ],

    inspectionWallet: [
      {
        type: String,
        enum: ["Transfer Credits", "View Credits", "Add Credits"],
      },
    ],

    userManagement: [
      {
        type: String,
        enum: [
          "Create/Edit User",
          "View User",
          "Delete User",
          "Add/Edit Branch",
          "View Branch",
        ],
      },
    ],

    relationshipManagement: [
      {
        type: String,
        enum: ["Add/Edit Company", "View Company", "Delete"],
      },
    ],

    reports: [
      {
        type: String,
        enum: ["View Reports"],
      },
    ],

    qaAssignment: [
      {
        type: String,
        enum: ["Assign/Unassign QC"],
      },
    ],
  },
});

const Role = mongoose.model("Role", RoleSchema);

export default Role;
