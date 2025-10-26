import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    // Informações básicas
    @Column('varchar')
    name!: string;

    @Column({ type: 'varchar', unique: true })
    email!: string;

    @Column('varchar')
    password!: string;

    @Column({ type: 'varchar', nullable: true })
    profilePhoto?: string;

    @Column({ type: 'varchar', nullable: true })
    resetPasswordToken?: string;

    @Column({ type: 'timestamp', nullable: true })
    resetPasswordExpires?: Date;

    @Column({ type: 'text', nullable: true })
    refreshToken?: string;

    // Informações pessoais
    @Column({ type: 'varchar', nullable: true })
    cpf?: string;

    @Column({ type: 'varchar', nullable: true })
    rg?: string;

    @Column({ type: 'date', nullable: true })
    birthDate?: Date;

    @Column({ type: 'varchar', nullable: true })
    gender?: string;

    @Column({ type: 'varchar', nullable: true })
    maritalStatus?: string;

    @Column({ type: 'varchar', nullable: true })
    phone?: string;

    @Column({ type: 'varchar', nullable: true })
    mobilePhone?: string;

    // Endereço
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

    // Informações profissionais
    @Column({ type: 'varchar', nullable: true })
    employeeId?: string;

    @Column({ type: 'varchar', nullable: true })
    department?: string;

    @Column({ type: 'varchar', nullable: true })
    position?: string;

    @Column({ type: 'date', nullable: true })
    hireDate?: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    salary?: number;

    @Column({ type: 'varchar', nullable: true })
    workSchedule?: string;

    @Column({ type: 'varchar', nullable: true })
    employmentType?: string; // CLT, PJ, Estagiário, etc.

    @Column({ type: 'varchar', nullable: true })
    directSupervisor?: string;

    // Informações bancárias
    @Column({ type: 'varchar', nullable: true })
    bankName?: string;

    @Column({ type: 'varchar', nullable: true })
    bankAccount?: string;

    @Column({ type: 'varchar', nullable: true })
    bankAgency?: string;

    @Column({ type: 'varchar', nullable: true })
    bankAccountType?: string;

    @Column({ type: 'varchar', nullable: true })
    pix?: string;

    // Informações de emergência
    @Column({ type: 'varchar', nullable: true })
    emergencyContactName?: string;

    @Column({ type: 'varchar', nullable: true })
    emergencyContactPhone?: string;

    @Column({ type: 'varchar', nullable: true })
    emergencyContactRelationship?: string;

    // Informações adicionais
    @Column({ type: 'varchar', nullable: true })
    education?: string;

    @Column({ type: 'text', nullable: true })
    notes?: string;

    @Column({ type: 'boolean', default: true })
    isActive!: boolean;

    @Column({ type: 'varchar', default: 'employee' })
    role!: 'manager' | 'employee';

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
