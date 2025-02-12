export const PERMISSIONS = {
  ADMIN: "admin",
};

export const USER_STATUSES = Object.freeze({
  ACTIVE: "active",
  SUSPENDED: "suspended",
  DELETED: "deleted",
});

type UsersStatusKeys = keyof typeof USER_STATUSES;
export type USER_STATUSES = (typeof USER_STATUSES)[UsersStatusKeys];

export const USERS_STATUSES_COLOR_MAPPING = Object.freeze({
  [USER_STATUSES.ACTIVE]: "green",
  [USER_STATUSES.SUSPENDED]: "yellow",
  [USER_STATUSES.DELETED]: "red",
});
