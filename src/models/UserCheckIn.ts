import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User.js";

@Entity()
export class UserCheckIn {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user!: User;

    @Column('timestamp')
    checkIn!: Date;

    @Column({ type: 'timestamp', nullable: true })
    checkOut?: Date;

    @Column({ type: 'varchar', nullable: true })
    checkInPhoto?: string;

    @Column({ type: 'varchar', nullable: true })
    checkOutPhoto?: string;

    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
    latitude?: number;

    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
    longitude?: number;

    @Column({ type: 'text', nullable: true })
    checkInLocation?: string;

    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
    outLatitude?: number;

    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
    outLongitude?: number;

    @Column({ type: 'text', nullable: true })
    checkOutLocation?: string;

    // Campos para lançamento manual
    @Column({ type: 'boolean', default: false })
    isManual!: boolean;

    @Column({ type: 'text', nullable: true })
    reason?: string;

    @Column({ type: 'varchar', default: 'approved' })
    status!: 'pending_approval' | 'approved' | 'rejected';

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'approvedBy' })
    approver?: User;

    @Column({ type: 'timestamp', nullable: true })
    approvalDate?: Date;

    @Column({ type: 'text', nullable: true })
    rejectionReason?: string;
}
