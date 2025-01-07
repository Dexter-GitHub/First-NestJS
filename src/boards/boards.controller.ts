import { BoardsService } from './boards.service';
import { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { Board } from './board.entity';
import { 
    Controller,
    Get,
    Post, 
    Body,
    Param,
    Delete,
    Patch,
    UsePipes,
    ValidationPipe,
    ParseIntPipe,
    UseGuards,    
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('boards')
@UseGuards(AuthGuard()) /* 인증 사용자만 접근하도록 함 */
export class BoardsController {
    constructor(private boardsService: BoardsService) {}

    @Get()
    getAllBoard(): Promise<Board[]> {
        return this.boardsService.getAllBoards();
    }

    @Post()
    @UsePipes(ValidationPipe)
    createBoard(@Body() CreateBoardDto: CreateBoardDto,    
                @GetUser() user:User): Promise<Board> {
        return this.boardsService.createBoard(CreateBoardDto, user);
    }

    @Get('/:id')
    getBoardById(@Param('id') id: number) : Promise<Board> {
        return this.boardsService.getBoardById(id);
    }

    @Delete('/:id')
    deleteBoard(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.boardsService.deleteBoard(id);
    }

    @Patch('/:id/status')
    updateBoardStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', BoardStatusValidationPipe) status: BoardStatus
    ): Promise<Board> {
        return this.boardsService.updateBoardStatus(id, status);
    }
/*
    @Get('/')
    getAllBoards(): Board[] {
        return this.boardsService.getAllBoards();
    }

    @Post()
    @UsePipes(ValidationPipe)   // 유효성 검사
    createBoard(
        @Body() createBoardDto: CreateBoardDto
    ): Board {        
        return this.boardsService.createBoard(createBoardDto);
    }
*/
/*     
    createBoard(
        @Body('title') title: string, 
        @Body('description') description: string
    ): Board {  
        return this.boardsService.createBoard(title, description);
    } 
*/
/*
    @Get('/:id')
    getBoardById(@Param('id') id: string): Board {
        return this.boardsService.getBoardById(id);
    }

    @Delete('/:id')
    deleteBoard(@Param('id') id: string): void {
        this.boardsService.deleteBoard(id);
    }

    @Patch('/:id/status')
    updateBoardStatus(
        @Param('id') id: string,
        @Body('status', BoardStatusValidationPipe) status: BoardStatus
    ): Board {
        return this.boardsService.updateBoardStatus(id, status);
    }
*/
}
