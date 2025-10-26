import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import type { Company } from "./Company.js";
import type { User } from "./User.js";

@Entity()
export class Invitation {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', unique: true })
    code!: string;

    @Column('varchar')
    email!: string;

    @Column({ type: 'varchar', nullable: true })
    name?: string;

    @Column({ type: 'varchar', nullable: true })
    position?: string;

    @Column({ type: 'varchar', nullable: true })
    department?: string;

    @Column({ type: 'boolean', default: false })
    isUsed!: boolean;

    @Column({ type: 'timestamp', nullable: true })
    usedAt?: Date;

    @Column({ type: 'timestamp', nullable: true })
    expiresAt?: Date;

    @Column({ type: 'boolean', default: true })
    isActive!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    // Relacionamento com empresa
    @ManyToOne('Company', 'invitations')
    @JoinColumn({ name: 'companyId' })
    company!: Company;

    @Column({ type: 'int' })
    companyId!: number;

    // Relacionamento com usuário que criou o convite (gestor)
    @ManyToOne('User')
    @JoinColumn({ name: 'createdById' })
    createdBy!: User;

    @Column({ type: 'int' })
    createdById!: number;

    // Relacionamento com usuário que usou o convite (funcionário)
    @ManyToOne('User', 'usedInvitations', { nullable: true })
    @JoinColumn({ name: 'usedById' })
    usedBy?: User;

    @Column({ type: 'int', nullable: true })
    usedById?: number;
}