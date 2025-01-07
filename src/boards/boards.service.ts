import { Injectable, NotFoundException } from '@nestjs/common';
import { v1 as uuid } from 'uuid';
import { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardRepository } from './board.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class BoardsService {
    /* 강의 코드 TypeORM v0.3 이후에 변경됨 */
    // constructor(
    //     @InjectRepository(BoardRepository)
    //     private boardRepository: BoardRepository,
    // ) {}
    /* 커스텀 Repository를 사용하지 않고 Board 사용 */
    // constructor(
    //     @InjectRepository(Board)
    //     private boardRepository: Repository<Board>,
    // ) {}
    /* 커스텀 Repository 사용 */
    private boardRepository: BoardRepository;

    constructor(private dataSource: DataSource) {
        this.boardRepository = new BoardRepository(this.dataSource);    // 수동 초기화화
    }

    async getAllBoards(): Promise<Board[]> {
        return this.boardRepository.find();
    }

    createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {        
        return this.boardRepository.createBoard(createBoardDto, user);
    }

    async getBoardById(id: number): Promise<Board> {
        const found = await this.boardRepository.findOne({
            where: { id: id },
        });

        if (!found) {
            throw new NotFoundException(`Can't find Board with id ${id}`);
        }

        return found;
    }

    async deleteBoard(id: number): Promise<void> {
        const result = await this.boardRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Cnt't find Board with id ${id}`);
        }
    }

    async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
        const board = await this.getBoardById(id);

        board.status = status;
        await this.boardRepository.save(board);

        return board;
    }
/*
    getAllBoards(): Board[] {   // return Board[] 타입 정의
        return this.boards;
    }

    createBoard(createBoardDto: CreateBoardDto) {
        const { title, description } = createBoardDto;

        const board: Board = {
            id: uuid(),
            title,
            description,
            status: BoardStatus.PUBLIC
        }
        
        this.boards.push(board);

        return board;
    }

    getBoardById(id: string): Board {
        const found = this.boards.find((board) => board.id === id);

        if (!found) {
            // 찾는 ID가 없을시 예외 처리(에러 문구 포함)
            throw new NotFoundException(`Can't find Board with id ${id}`);  
        }

        return found;
    }

    deleteBoard(id: string): void {
        const found = this.getBoardById(id)
        this.boards = this.boards.filter((board) => board.id !== found.id);
    }

    updateBoardStatus(id: string, status: BoardStatus): Board {
        const board = this.getBoardById(id);
        board.status = status;
        return board;
    }
*/
}
