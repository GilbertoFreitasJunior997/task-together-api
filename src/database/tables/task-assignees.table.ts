import { relations } from "drizzle-orm";
import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { tasksTable } from "./tasks.table";
import { usersTable } from "./users.table";

export const taskAssigneesTable = pgTable(
  "task_assignees",
  {
    taskId: uuid("task_id").references(() => tasksTable.id, {
      onDelete: "cascade",
    }),
    assigneeId: uuid("assignee_id").references(() => usersTable.id, {
      onDelete: "cascade",
    }),
  },
  (t) => [primaryKey({ columns: [t.taskId, t.assigneeId] })],
);

export const taskAssigneesRelations = relations(
  taskAssigneesTable,
  ({ one }) => ({
    task: one(tasksTable, {
      fields: [taskAssigneesTable.taskId],
      references: [tasksTable.id],
    }),
    assignee: one(usersTable, {
      fields: [taskAssigneesTable.assigneeId],
      references: [usersTable.id],
    }),
  }),
);
