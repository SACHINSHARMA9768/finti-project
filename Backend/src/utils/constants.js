const UserRoleEnum = {
  ADMIN: "admin",
  PROJECT_ADMIN: "project_admin",
  MEMBER: "memeber",
};
export { UserRoleEnum };
export const AvilableUserRole = Object.values(UserRoleEnum);

const TaskStatusEnum = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done",
};

export { TaskStatusEnum };
export const AvilableTaskStatus = Object.values(TaskStatusEnum);
