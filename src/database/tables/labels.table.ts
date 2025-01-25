import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "./_utils";
import { projectsTable } from "./projects.table";
import { taskLabelsTable } from "./task-labels.table";

export const labelsTable = pgTable("labels", {
  id: id(),

  name: varchar("name", { length: 30 }).notNull(),
  color: varchar("color", { length: 7 }).notNull(),

  createdAt: createdAt(),
  updatedAt: updatedAt(),

  projectId: uuid("project_id")
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .notNull(),
});

export const labelsRelations = relations(labelsTable, ({ one, many }) => ({
  project: one(projectsTable, {
    fields: [labelsTable.projectId],
    references: [projectsTable.id],
  }),
  tasks: many(taskLabelsTable),
}));
