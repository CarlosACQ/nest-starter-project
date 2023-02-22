import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
@Entity({ schema: 'auth', name: 'permissions' })
export class PermissionEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
  public slug: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  public resource: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  public action: string;

  @Column({
    name: 'description',
    type: 'varchar',
    nullable: false,
    length: 160,
  })
  description: string;

  @Column({
    name: 'active',
    type: 'boolean',
    nullable: false,
    default: true,
  })
  active: boolean;
}