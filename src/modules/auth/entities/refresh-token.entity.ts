import { User } from 'src/modules/users/entities/user.entity';
import { Entity, Column, BaseEntity, ManyToOne } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class RefreshToken extends BaseEntity {
  @Column('uuid', { primary: true, default: uuidv4 })
  id: string;

  @Column()
  token: string;

  @Column()
  expiresIn: Date;

  @ManyToOne(() => User, user => user.refreshTokens, { nullable: false })
  user: User;
}