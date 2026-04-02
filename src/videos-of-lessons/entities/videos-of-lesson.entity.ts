import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Lesson } from 'src/lessons/entities/lesson.entity'

@Entity('videos_of_lessons')
export class VideoOfLesson {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'varchar' })
    title: string

    @Column({ type: 'varchar' })
    video: string

    @ManyToOne(() => Lesson, (lesson) => lesson.videos, { onDelete: 'CASCADE' })
    lesson: Lesson
}