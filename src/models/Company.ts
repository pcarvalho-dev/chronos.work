import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import type { User } from "./User.js";
import type { Invitation } from "./Invitation.js";

@Entity()
export class Company {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('varchar')
    name!: string;

    @Column({ type: 'varchar', unique: true })
    cnpj!: string;

    @Column({ type: 'varchar', nullable: true })
    corporateName?: string;

    @Column({ type: 'varchar', nullable: true })
    email?: string;

    @Column({ type: 'varchar', nullable: true })
    phone?: string;

    @Column({ type: 'varchar', nullable: true })
    website?: string;

    // Endereço da empresa
    @Column({ type: 'varchar', nullable: true })
    address?: string;

    @Column({ type: 'varchar', nullable: true })
    addressNumber?: string;

    @Column({ type: 'varchar', nullable: true })
    addressComplement?: string;

    @Column({ type: 'varchar', nullable: true })
    neighborhood?: string;

    @Column({ type: 'varchar', nullable: true })
    city?: string;

    @Column({ type: 'varchar', nullable: true })
    state?: string;

    @Column({ type: 'varchar', nullable: true })
    zipCode?: string;

    @Column({ type: 'varchar', nullable: true })
    country?: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'varchar', nullable: true })
    logo?: string;

    @Column({ type: 'boolean', default: true })
    isActive!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    // Relacionamento com usuários
    @OneToMany('User', 'company')
    users!: User[];

    // Relacionamento com convites
    @OneToMany('Invitation', 'company')
    invitations!: Invitation[];
}