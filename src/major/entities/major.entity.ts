import { group } from "console";
import { MajorType } from "src/enums";
import { Group } from "src/groups/entities/group.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Major {
    @PrimaryGeneratedColumn('increment')
    id : number;

    @Column({type : "varchar", unique : true})
    name : string;

    @Column({type : "text"})
    description : string

    @Column({type : "varchar"})
    image : string

    @Column({type : "enum", enum : MajorType})
    type : MajorType

    @OneToMany(() => Group, (groups) => groups.major)
    groups : Group[]
}