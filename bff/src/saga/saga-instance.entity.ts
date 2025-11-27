import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum SagaStatus {
  STARTED = 'STARTED',
  PAUSED_WITH_ERROR = 'PAUSED_WITH_ERROR',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  ROLLING_BACK = 'ROLLING_BACK',
  ROLLED_BACK = 'ROLLED_BACK',
}

@Entity()
export class SagaInstance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('jsonb')
  payload: any;

  @Column({
    type: 'enum',
    enum: SagaStatus,
    default: SagaStatus.STARTED,
  })
  status: SagaStatus;

  @Column('jsonb', { default: {} })
  stepStatus: Record<string, string>;

  @Column({ nullable: true })
  currentStep: string;

  @Column('text', { array: true, default: [] })
  errors: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
