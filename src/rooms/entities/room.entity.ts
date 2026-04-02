import { Group } from "src/groups/entities/group.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('rooms')
export class Room {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: "varchar" , unique : true})
    name: string;

    @Column({ type: "smallint" })
    seats: number

    @OneToMany(() => Group, (groups) => groups.room)
    groups: Group[]
}
