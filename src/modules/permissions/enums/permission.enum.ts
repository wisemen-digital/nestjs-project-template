export enum Permission {
  ADMIN = 'admin',
  READ_ONLY = 'read_only',

  FILE_READ = 'file.read',
  FILE_CREATE = 'file.create',
  FILE_UPDATE = 'file.update',
  FILE_DELETE = 'file.delete',

  PERMISSION_READ = 'permission.read',

  ROLE_READ = 'role.read',
  ROLE_CREATE = 'role.create',
  ROLE_UPDATE = 'role.update',
  ROLE_DELETE = 'role.delete',

  USER_READ = 'user.read',
  USER_CREATE = 'user.create',
  USER_UPDATE = 'user.update',
  USER_DELETE = 'user.delete',
}
