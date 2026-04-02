import { Major } from 'src/major/entities/major.entity'
import { Room } from 'src/rooms/entities/room.entity'
import { Days } from 'src/enums'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm'
import { User } from 'src/users/entities/user.entity'
import { Lesson } from 'src/lessons/entities/lesson.entity'

@Entity('groups')
export class    Group {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'varchar' })
    name: string

    @Column({ type: 'date' })
    start_date: Date

    @Column({ type: 'date' })
    end_date: Date

    @Column({ type: 'time' })
    duration: string

    @Column({ type: 'enum', enum: Days, array: true })
    days: Days[]

    @ManyToOne(() => Major, (major) => major.groups, { onDelete: 'CASCADE' })
    major: Major

    @ManyToOne(() => Room, (room) => room.groups, { onDelete: 'CASCADE' })
    room: Room

    @ManyToMany(() => User, (user) => user.groups)
    @JoinTable({name : "user_groups"})
    users : User[]

    @OneToMany(() => Lesson, (lesson) => lesson.group)
    lessons : Lesson[]
}