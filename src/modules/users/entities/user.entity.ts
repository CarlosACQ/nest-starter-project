import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  BeforeInsert,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { UserStatus } from '../enums';
import { Role } from 'src/modules/roles/entities/role.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { capitalizeFirstLetter, capitalizeFirstLetterAllWords } from '../../../common/utils';

@Entity({ schema: 'auth', name: 'users' })
export class User extends BaseEntity {
  @ApiProperty({
    example: '123',
    description: 'User ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'carlos@gmail.com',
    description: 'email',
    uniqueItems: true,
  })
  @Index()
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  public email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({
    name: 'first_lastname',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  firstLastname: string;

  @Column({
    name: 'second_lastname',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  secondLastname: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  phone: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  birthdate: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: UserStatus,
    nullable: false,
  })
  status: UserStatus;

  @ManyToMany(() => Role, (role) => role.id, {
    // lazy: true,
    cascade: true,
  })
  @JoinTable({
    schema: 'auth',
    name: 'users_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  @BeforeInsert()
  nametoCamelCase() {
    this.name = capitalizeFirstLetterAllWords(this.name);
  }

  @BeforeInsert()
  firstLastnametoCamelCase() {
    this.firstLastname = capitalizeFirstLetter(this.firstLastname);
  }

  @BeforeInsert()
  secondLastnametoCamelCase() {
    if (this.secondLastname)
      this.secondLastname = capitalizeFirstLetter(this.secondLastname);
  }

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @BeforeInsert()
  setStatus() {
    this.status = UserStatus.Active;
  }

  @Expose()
  get fullname(): string {
    const fullname = `${this.name} ${this.firstLastname} ${this.secondLastname}`;
    return fullname.trim();
  }
}
