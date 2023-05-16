import { v4 as uuidv4 } from 'uuid';
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

export interface IBaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

@Entity()
export abstract class BaseEntity implements IBaseEntity {
  @Exclude()
  @PrimaryColumn({ type: 'uuid' })
  id: string;

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
    this.id = uuidv4(); // asigna un nuevo uuid al insertar una entidad
    this.createdBy = 'admin'; // Aquí puedes setear el usuario actualmente autenticado
    this.updatedBy = 'admin'; // Aquí puedes setear el usuario actualmente autenticado
  }

  @BeforeUpdate()
  setUpdatedBy() {
    this.updatedBy = 'admin'; // Aquí puedes setear el usuario actualmente autenticado
  }
}
