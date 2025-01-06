import { IsNotEmpty } from "class-validator";

export class CreateBoardDto {
    @IsNotEmpty()   // 유효성 검사
    title: string;

    @IsNotEmpty()   // 유효성 검사
    description: string;
}
