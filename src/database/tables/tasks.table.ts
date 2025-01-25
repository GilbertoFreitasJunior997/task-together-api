import { relations } from "drizzle-orm";
import {
  date,
  integer,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { taskPriorityEnum } from "./_enums";
import { createdAt, id, updatedAt } from "./_utils";
import { labelsTable } from "./labels.table";
import { projectsTable } from "./projects.table";
import { taskAssigneesTable } from "./task-assignees.table";
import { taskAttachmentsTable } from "./task-attachments.table";
import { taskCommentsTable } from "./task-comments.table";
import { usersTable } from "./users.table";

export const tasksTable = pgTable("tasks", {
  id: id(),

  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  priority: taskPriorityEnum("priority").notNull(),
  dueDate: date("due_date"),
  position: integer("position").notNull(),

  createdAt: createdAt(),
  updatedAt: updatedAt(),

  status: varchar("status").notNull(), // CREATE TABLE
  creatorId: uuid("created_by_id").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  projectId: uuid("project_id")
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .notNull(),
});

export const tasksRelations = relations(tasksTable, ({ one, many }) => ({
  creator: one(usersTable, {
    fields: [tasksTable.creatorId],
    references: [usersTable.id],
  }),
  project: one(projectsTable, {
    fields: [tasksTable.projectId],
    references: [projectsTable.id],
  }),

  assignees: many(taskAssigneesTable),
  comments: many(taskCommentsTable),
  labels: many(labelsTable),
  attachments: many(taskAttachmentsTable),
}));
