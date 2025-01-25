import { relations } from "drizzle-orm";
import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "./_utils";
import { labelsTable } from "./labels.table";
import { projectMembersTable } from "./project-members.table";
import { tasksTable } from "./tasks.table";
import { usersTable } from "./users.table";

export const projectsTable = pgTable("projects", {
  id: id(),

  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),

  createdAt: createdAt(),
  updatedAt: updatedAt(),

  creatorId: uuid("creator_id").references(() => usersTable.id, {
    onDelete: "set null",
  }),
});

export const projectsRelations = relations(projectsTable, ({ one, many }) => ({
  creator: one(usersTable, {
    fields: [projectsTable.creatorId],
    references: [usersTable.id],
  }),

  labels: many(labelsTable),
  members: many(projectMembersTable),
  tasks: many(tasksTable),
}));
