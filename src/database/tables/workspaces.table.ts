import { relations } from "drizzle-orm";
import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "./_utils";
import { projectsTable } from "./projects.table";
import { usersTable } from "./users.table";
import { workspaceMembersTable } from "./workspace-members.table";

export const workspacesTable = pgTable("workspaces", {
  id: id(),

  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),

  createdAt: createdAt(),
  updatedAt: updatedAt(),

  creatorId: uuid("creator_id").references(() => usersTable.id, {
    onDelete: "set null",
  }),
});

export const workspacesRelations = relations(
  workspacesTable,
  ({ one, many }) => ({
    creator: one(usersTable, {
      fields: [workspacesTable.creatorId],
      references: [usersTable.id],
    }),

    projects: many(projectsTable),
    members: many(workspaceMembersTable),
  }),
);
