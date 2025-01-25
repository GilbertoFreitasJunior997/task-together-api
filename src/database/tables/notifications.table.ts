import { relations } from "drizzle-orm";
import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { notificationTypeEnum } from "./_enums";
import { createdAt, id, updatedAt } from "./_utils";
import { usersTable } from "./users.table";

export const notificationsTable = pgTable("notifications", {
  id: id(),

  type: notificationTypeEnum("type").notNull(),
  message: text(),
  isRead: boolean("is_read").default(false).notNull(),

  createdAt: createdAt(),
  updatedAt: updatedAt(),

  userId: uuid("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
});

export const notificationsRelations = relations(
  notificationsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [notificationsTable.userId],
      references: [usersTable.id],
    }),
  }),
);
