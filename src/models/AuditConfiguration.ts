import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import type { Company } from "./Company.js";

@Entity()
export class AuditConfiguration {
    @PrimaryGeneratedColumn()
    id!: number;

    // Empresa
    @Column({ type: 'int', unique: true })
    companyId!: number;

    @ManyToOne('Company')
    @JoinColumn({ name: 'companyId' })
    company?: Company;

    // Campos que devem ser rastreados (array de nomes de campos)
    // Exemplo: ['salary', 'position', 'department', 'isActive']
    @Column('simple-array')
    trackedFields!: string[];

    // Se justificativa é obrigatória para alterações
    @Column({ type: 'boolean', default: false })
    requireJustification!: boolean;

    // Se o sistema de auditoria está ativo para esta empresa
    @Column({ type: 'boolean', default: true })
    isEnabled!: boolean;

    @UpdateDateColumn()
    updatedAt!: Date;
}
