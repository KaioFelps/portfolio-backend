import { UserRole } from '@/domain/users/entities/user';
import { $Enums } from '@prisma/client';

export class PrismaRoleMapper {
  static prismaToDomain(role: $Enums.UserRole) {
    switch (role) {
      case 'ADMIN':
        return UserRole.admin;
      case 'EDITOR':
        return UserRole.editor;
    }
  }

  static userRoleToPrisma(role: UserRole) {
    switch (role) {
      case UserRole.admin:
        return $Enums.UserRole.ADMIN;
      case UserRole.editor:
        return $Enums.UserRole.EDITOR;
    }
  }

  static toPrisma(role: string) {
    switch (role.toUpperCase()) {
      case 'ADMIN':
        return $Enums.UserRole.ADMIN;
      case 'EDITOR':
        return $Enums.UserRole.EDITOR;
      default:
        return null;
    }
  }
}
