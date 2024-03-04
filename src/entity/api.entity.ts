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
    @Column({name: 'res_type'})
    resType: string;
    @Column()
    response: string;
    @Column()
    enabled: boolean;
    @CreateDateColumn({
        name: 'created_time',
        type: 'datetime',
    })
    createdTime: Date;
    @UpdateDateColumn({
        name: 'updated_time',
        type: 'datetime',
    })
    updatedTime: Date;
}
