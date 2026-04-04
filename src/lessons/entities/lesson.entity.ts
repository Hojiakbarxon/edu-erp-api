import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Group } from 'src/groups/entities/group.entity'
import { Homework } from 'src/homework/entities/homework.entity'
import { VideoOfLesson } from 'src/videos-of-lessons/entities/videos-of-lesson.entity'


@Entity('lessons')
export class Lesson {
    @PrimaryGeneratedColumn('increment')
    id: number 

    @Column({ type: 'varchar' })
    title: string 

    @Column({ type: 'time' })
    start_time: string
     
    @Column({ type: 'time' })
    end_time: string 

    @ManyToOne(() => Group, (group) => group.lessons, { onDelete: 'CASCADE' })
    group: Group 

    @OneToMany(() => Homework, (hw) => hw.lesson)
    homeworks: Homework[]
     
    @OneToMany(() => VideoOfLesson, (vd) => vd.lesson)
    videos: VideoOfLesson[] 
}