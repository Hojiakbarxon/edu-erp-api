import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Homework } from 'src/homework/entities/homework.entity'

@Entity('files_of_homework')
export class FileOfHomework {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'varchar' })
    title: string

    @Column({ type: 'varchar' })
    file: string

    @ManyToOne(() => Homework, (hw) => hw.files, { onDelete: 'CASCADE' })
    homework: Homework
}