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
    checkInLatitude?: number;

    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
    checkInLongitude?: number;

    @Column({ type: 'text', nullable: true })
    checkInLocation?: string;

    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
    checkOutLatitude?: number;

    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
    checkOutLongitude?: number;

    @Column({ type: 'text', nullable: true })
    checkOutLocation?: string;
}
