import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import type { User } from "./User.js";
import type { Company } from "./Company.js";

@Entity()
export class UserMovementHistory {
    @PrimaryGeneratedColumn()
    id!: number;

    // Usuário que foi alterado
    @Column('int')
    userId!: number;

    @ManyToOne('User')
    @JoinColumn({ name: 'userId' })
    user?: User;

    // Campo que foi alterado
    @Column('varchar')
    fieldName!: string;

    // Valor antigo (JSON serializado)
    @Column({ type: 'text', nullable: true })
    oldValue?: string;

    // Valor novo (JSON serializado)
    @Column({ type: 'text', nullable: true })
    newValue?: string;

    // Diff legível para humanos
    @Column({ type: 'text', nullable: true })
    diff?: string;

    // Quem fez a alteração
    @Column('int')
    changedById!: number;

    @ManyToOne('User')
    @JoinColumn({ name: 'changedById' })
    changedBy?: User;

    // Justificativa opcional
    @Column({ type: 'text', nullable: true })
    justification?: string;

    // Informações de auditoria adicional
    @Column({ type: 'varchar', nullable: true })
    ipAddress?: string;

    @Column({ type: 'text', nullable: true })
    userAgent?: string;

    // Empresa (para isolamento de dados)
    @Column('int')
    companyId!: number;

    @ManyToOne('Company')
    @JoinColumn({ name: 'companyId' })
    company?: Company;

    @CreateDateColumn()
    createdAt!: Date;
}
