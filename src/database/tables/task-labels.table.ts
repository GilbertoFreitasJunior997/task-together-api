import { relations } from "drizzle-orm";
import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { labelsTable } from "./labels.table";
import { tasksTable } from "./tasks.table";

export const taskLabelsTable = pgTable(
  "task_labels",
  {
    taskId: uuid("task_id").references(() => tasksTable.id, {
      onDelete: "cascade",
    }),
    labelId: uuid("label_id").references(() => labelsTable.id, {
      onDelete: "cascade",
    }),
  },
  (t) => [primaryKey({ columns: [t.taskId, t.labelId] })],
);

export const taskLabelRelations = relations(taskLabelsTable, ({ one }) => ({
  task: one(tasksTable, {
    fields: [taskLabelsTable.taskId],
    references: [tasksTable.id],
  }),
  label: one(labelsTable, {
    fields: [taskLabelsTable.labelId],
    references: [labelsTable.id],
  }),
}));
