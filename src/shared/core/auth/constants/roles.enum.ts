// Roles de Authorization (JWT) - Globales
export enum AuthorizationRole {
  ADMIN = 1,
  USER = 2,
  SUPERVISOR = 3,
  ADMIN_AUTHORIZED_ORIGIN = 4,
  SUPER_ADMIN = 5,
  ASSISTANT = 6,
}

// Roles Locales del Sistema
export enum LocalRole {
  OWNER = 1,
  REGIONAL_MANAGER = 2,
  MANAGER = 3,
  COLLABORATOR = 4,
  AIA = 5,
}

// Backward compatibility
export enum Role {
  ADMIN = 1,
  USER = 2,
  SUPERVISOR = 3,
  ADMIN_AUTHORIZED_ORIGIN = 4,
  SUPER_ADMIN = 5,
  ASSISTANT = 6,
}
