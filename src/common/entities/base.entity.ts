import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class BaseEntity {
  @Exclude()
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    update: false,
    nullable: false,
  })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({
    name: 'updated_at',
    nullable: false,
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'now()',
  })
  updatedAt: Date;

  @Exclude()
  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @Exclude()
  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string;

  @BeforeInsert()
  setCreatedAndUpdatedBy() {
    this.createdBy = 'admin'; // Aquí puedes setear el usuario actualmente autenticado
    this.updatedBy = 'admin'; // Aquí puedes setear el usuario actualmente autenticado
  }

  @BeforeUpdate()
  setUpdatedBy() {
    this.updatedBy = 'admin'; // Aquí puedes setear el usuario actualmente autenticado
  }
}