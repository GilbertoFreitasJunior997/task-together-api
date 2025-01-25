import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["owner", "admin", "member"]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "info",
  "warning",
  "error",
]);

export const taskPriorityEnum = pgEnum("task_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);
