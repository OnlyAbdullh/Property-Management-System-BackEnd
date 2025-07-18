import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RolePermission } from "./role-permissions.entity";
import { UserPermission } from "./user-permission.entity";

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => RolePermission, rp => rp.permission)
  rolePermissions: RolePermission[];

  @OneToMany(() => UserPermission, up => up.permission)
  userPermissions: UserPermission[];
}
