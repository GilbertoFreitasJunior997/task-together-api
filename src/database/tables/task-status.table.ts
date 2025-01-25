import { relations } from "drizzle-orm";
import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { statusTable } from "./status.table";
import { tasksTable } from "./tasks.table";

export const taskStatusTable = pgTable(
  "task_status",
  {
    taskId: uuid("task_id").references(() => tasksTable.id, {
      onDelete: "cascade",
    }),
    statusId: uuid("status_id").references(() => statusTable.id, {
      onDelete: "cascade",
    }),
  },
  (t) => [primaryKey({ columns: [t.taskId, t.statusId] })],
);

export const taskStatusRelations = relations(taskStatusTable, ({ one }) => ({
  task: one(tasksTable, {
    fields: [taskStatusTable.taskId],
    references: [tasksTable.id],
  }),
  status: one(statusTable, {
    fields: [taskStatusTable.statusId],
    references: [statusTable.id],
  }),
}));
