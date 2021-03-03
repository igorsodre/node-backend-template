import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column('int', { default: 0 })
    tokenVersion: number;

    getDisplayableValues = (): Partial<User> => {
        return {
            id: this.id,
            email: this.email,
            name: this.name,
        };
    };
}
