export enum Permission {
  ADMIN = 'admin',
  READ_ONLY = 'read_only',

  USER_READ = 'user.read',
  USER_CREATE = 'user.create',
  USER_UPDATE = 'user.update',
  USER_DELETE = 'user.delete',

  ROLE_READ = 'role.read',
  ROLE_CREATE = 'role.create',
  ROLE_UPDATE = 'role.update',
  ROLE_DELETE = 'role.delete'
}
