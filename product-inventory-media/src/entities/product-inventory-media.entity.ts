import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('product_inventory_media')
export class ProductInventoryMediaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  inventoryId: string;

  @Column()
  bucket: string;

  @Column()
  key: string;

  @Column('text')
  url: string;

  @Column({ nullable: true })
  type: string;

  @Column({ default: 'ACTIVE' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
