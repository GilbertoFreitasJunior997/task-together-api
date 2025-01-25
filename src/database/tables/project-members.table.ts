import { relations } from "drizzle-orm";
import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { userRoleEnum } from "./_enums";
import { projectsTable } from "./projects.table";
import { usersTable } from "./users.table";

export const projectMembersTable = pgTable(
  "project_members",
  {
    role: userRoleEnum("role").notNull(),

    memberId: uuid("member_id")
      .references(() => usersTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
    projectId: uuid("project_id")
      .references(() => projectsTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.memberId, t.projectId] })],
);

export const projectMembersRelations = relations(
  projectMembersTable,
  ({ one }) => ({
    member: one(usersTable, {
      fields: [projectMembersTable.memberId],
      references: [usersTable.id],
    }),
    project: one(projectsTable, {
      fields: [projectMembersTable.projectId],
      references: [projectsTable.id],
    }),
  }),
);
