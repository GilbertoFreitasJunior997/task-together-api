import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "./_utils";
import { projectsTable } from "./projects.table";
import { taskStatusTable } from "./task-status.table";

export const statusTable = pgTable("status", {
  id: id(),

  name: varchar("name", { length: 30 }).notNull(),
  color: varchar("color", { length: 7 }).notNull(),

  createdAt: createdAt(),
  updatedAt: updatedAt(),

  projectId: uuid("project_id")
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .notNull(),
});

export const statusRelations = relations(statusTable, ({ one, many }) => ({
  project: one(projectsTable, {
    fields: [statusTable.projectId],
    references: [projectsTable.id],
  }),
  tasks: many(taskStatusTable),
}));
