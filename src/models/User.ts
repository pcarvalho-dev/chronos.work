import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('varchar')
    name!: string;

    @Column({ type: 'varchar', unique: true })
    email!: string;

    @Column('varchar')
    password!: string;
}
