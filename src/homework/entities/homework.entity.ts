import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Lesson } from 'src/lessons/entities/lesson.entity'
import { FileOfHomework } from 'src/files-of-homework/entities/files-of-homework.entity'

@Entity('homework')
export class Homework {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'text' })
    description: string

    @ManyToOne(() => Lesson, (lesson) => lesson.homeworks, { onDelete: 'CASCADE' })
    lesson: Lesson

    @OneToMany(() => FileOfHomework, (files) => files.homework)
    files : FileOfHomework[]
}