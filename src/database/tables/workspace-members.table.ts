import { relations } from "drizzle-orm";
import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { userRoleEnum } from "./_enums";
import { usersTable } from "./users.table";
import { workspacesTable } from "./workspaces.table";

export const workspaceMembersTable = pgTable(
  "workspace_members",
  {
    role: userRoleEnum("role").notNull(),

    workspaceId: uuid("workspace_id").references(() => workspacesTable.id, {
      onDelete: "cascade",
    }),
    mermberId: uuid("member_id").references(() => usersTable.id, {
      onDelete: "cascade",
    }),
  },
  (t) => [primaryKey({ columns: [t.workspaceId, t.mermberId] })],
);

export const workspaceMembersRelations = relations(
  workspaceMembersTable,
  ({ one }) => ({
    workspace: one(workspacesTable, {
      fields: [workspaceMembersTable.workspaceId],
      references: [workspacesTable.id],
    }),
    member: one(usersTable, {
      fields: [workspaceMembersTable.mermberId],
      references: [usersTable.id],
    }),
  }),
);
