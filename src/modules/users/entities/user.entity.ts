import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

import { UserStatus } from '../enums';
import { Role } from 'src/modules/roles/entities/role.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { capitalizeFirstLetter, capitalizeFirstLetterAllWords } from '../../../common/utils';
import { IUser } from '../interfaces';
import { RefreshToken } from 'src/modules/auth/entities/refresh-token.entity';

@Entity({ schema: 'auth', name: 'users' })
@Index('email_unique_index', ['email'], { unique: true })
export class User extends BaseEntity implements IUser {
  @ApiProperty({
    example: 'carlos@gmail.com',
    description: 'email',
    uniqueItems: true,
  })
  @Index()
  @Column({ type: 'varchar', length: 100, nullable: false })
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

  @Column({ nullable: true })
  @Exclude()
  refresh_token?: string;

  @ManyToMany(() => Role, (role) => role.users, {
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

  @OneToMany(() => RefreshToken, refreshToken => refreshToken.user, { cascade: true })
  refreshTokens: RefreshToken[];

  @BeforeInsert()
  formatUserFields() {
    this.name = capitalizeFirstLetterAllWords(this.name);
    this.firstLastname = capitalizeFirstLetter(this.firstLastname);
    this.secondLastname = this.secondLastname ? capitalizeFirstLetter(this.secondLastname) : undefined;
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
