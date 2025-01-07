import { User } from "src/auth/user.entity";
import { BoardStatus } from "./board-status.enum";
import { 
    Entity,
    BaseEntity,
    PrimaryGeneratedColumn,
    Column, 
    ManyToOne
} from "typeorm";

@Entity()
export class Board extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: BoardStatus;

    // 유저와 게시물의 관계 형성
    @ManyToOne(type => User, user => user.boards, { eager: false })
    user: User;
}
