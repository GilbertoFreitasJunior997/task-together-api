import { relations } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "./_utils";
import { tasksTable } from "./tasks.table";
import { usersTable } from "./users.table";

export const taskCommentsTable = pgTable("task_comments", {
  id: id(),

  content: text("content").notNull(),

  createdAt: createdAt(),
  updatedAt: updatedAt(),

  userId: uuid("user_id").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  taskId: uuid("task_id")
    .references(() => tasksTable.id, { onDelete: "cascade" })
    .notNull(),
});

export const taskCommentsRelations = relations(
  taskCommentsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [taskCommentsTable.userId],
      references: [usersTable.id],
    }),
    task: one(tasksTable, {
      fields: [taskCommentsTable.taskId],
      references: [tasksTable.id],
    }),
  }),
);
