import { relations } from "drizzle-orm";
import { integer, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "./_utils";
import { tasksTable } from "./tasks.table";
import { usersTable } from "./users.table";

export const taskAttachmentsTable = pgTable("task_attachments", {
  id: id(),

  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: varchar("file_type", { length: 50 }).notNull(),
  fileSize: integer("file_size").notNull(),

  createdAt: createdAt(),
  updatedAt: updatedAt(),

  taskId: uuid("task_id")
    .references(() => tasksTable.id, { onDelete: "cascade" })
    .notNull(),
  uploaderId: uuid("uploader_id").references(() => usersTable.id, {
    onDelete: "set null",
  }),
});

export const taskAttachmentsRelations = relations(
  taskAttachmentsTable,
  ({ one }) => ({
    task: one(tasksTable, {
      fields: [taskAttachmentsTable.taskId],
      references: [tasksTable.id],
    }),
    uploader: one(usersTable, {
      fields: [taskAttachmentsTable.uploaderId],
      references: [usersTable.id],
    }),
  }),
);
