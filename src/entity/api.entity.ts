import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('api')
export class Api {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    remark: string;
    @Column()
    path: string;
    @Column()
    method: string;
    @Column()
    response: string;
    @Column()
    enabled: boolean;
    @CreateDateColumn({
        type: 'datetime',
    })
    createdTime: Date;
    @UpdateDateColumn({
        type: 'datetime',
    })
    updatedTime: Date;
}
