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
}
