import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ schema: 'admin', name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'boolean', nullable: false })
  active: boolean;

  @BeforeInsert()
  setActive() {
    this.active = true;
  }

  @BeforeInsert()
  @BeforeUpdate()
  nameToLowerCase() {
    this.name = this.name.toLowerCase().trim();
  }
}
