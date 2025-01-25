import { relations } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "./_utils";
import { notificationsTable } from "./notifications.table";
import { projectMembersTable } from "./project-members.table";
import { projectsTable } from "./projects.table";
import { taskAssigneesTable } from "./task-assignees.table";
import { taskAttachmentsTable } from "./task-attachments.table";
import { taskCommentsTable } from "./task-comments.table";
import { tasksTable } from "./tasks.table";
import { workspaceMembersTable } from "./workspace-members.table";
import { workspacesTable } from "./workspaces.table";

export const usersTable = pgTable("users", {
  id: id(),

  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  username: varchar("username", { length: 32 }).notNull(),
  avatarUrl: text("avatar_url"),

  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  notifications: many(notificationsTable),
  memberAtProjects: many(projectMembersTable),
  assignments: many(taskAssigneesTable),
  comments: many(taskCommentsTable),
  createdProjects: many(projectsTable),
  createdTasks: many(tasksTable),
  memberAtWorkspaces: many(workspaceMembersTable),
  createdWorkspaces: many(workspacesTable),
  uploadedAttachments: many(taskAttachmentsTable),
}));
