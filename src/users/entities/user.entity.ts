import { group } from "console";
import { UserRoles } from "src/enums";
import { Group } from "src/groups/entities/group.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: "varchar" })
    full_name: string;

    @Column({ type: "varchar", nullable: true, unique : true})
    username: string

    @Column({ type: "varchar" })
    password: string

    @Column({ type: "varchar", unique : true})
    phone_number: string

    @Column({ type: "varchar", nullable: true })
    image: string

    @Column({ enum: UserRoles })
    role: UserRoles

    @Column({ type: "smallint" })
    age: number

    @Column({ type: "varchar", nullable: true, unique : true})
    email: string

    @ManyToMany(() => Group, (group) => group.users)
    groups : Group[]
}
