import { BaseEntity } from 'src/common/entities/base.entity';
import { Permission } from 'src/modules/permissions/entities/permission.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IRole } from '../interfaces';

@Entity({ schema: 'auth', name: 'roles' })
export class Role extends BaseEntity implements IRole {
  @Index()
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    name: 'active',
    type: 'boolean',
    nullable: false,
    default: true,
  })
  isActive: boolean;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @ManyToMany(() => Permission, { nullable: true, cascade: true })
  @JoinTable({
    schema: 'auth',
    name: 'roles_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[];

  @BeforeInsert()
  setActive() {
    this.isActive = true;
  }

  @BeforeInsert()
  @BeforeUpdate()
  nameToLowerCase() {
    this.name = this.name.toLowerCase().trim();
  }
}
