import { Repository, DataSource } from "typeorm";
import { BoardStatus } from './board-status.enum';
import { Board } from "./board.entity";
import { Injectable } from "@nestjs/common";
import { CreateBoardDto } from "./dto/create-board.dto";
import { User } from "src/auth/user.entity";

@Injectable()
export class BoardRepository extends Repository<Board> {
    constructor(private dataSource: DataSource) {
        super(Board, dataSource.createEntityManager());
    }

    async createBoard(createBoardDto: CreateBoardDto, user: User) : Promise<Board> {
        const { title, description } = createBoardDto;

        const board = this.create({
            title,
            description,
            status: BoardStatus.PUBLIC,
            user
        });

        await this.save(board);  // Database 저장

        return board;
    }
}
