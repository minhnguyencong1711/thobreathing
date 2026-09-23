import { IsArray, IsInt, IsNotEmpty, IsString, Max, MaxLength, Min, MinLength, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class CreateSurveyDto {
  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập họ tên hoặc biệt danh của bạn' })
  @MinLength(2, { message: 'Tên phải có ít nhất 2 ký tự' })
  @MaxLength(50, { message: 'Tên không quá 50 ký tự' })
  name: string;

  @IsInt()
  @Min(1900, { message: 'Năm sinh không hợp lệ (tối thiểu năm 1900)' })
  @Max(2026, { message: 'Năm sinh không hợp lệ' })
  birthYear: number;

  @IsArray()
  @ArrayMinSize(15, { message: 'Cần hoàn thành đủ 15 câu hỏi khảo sát' })
  @ArrayMaxSize(15, { message: 'Bài khảo sát gồm đúng 15 câu hỏi' })
  answers: number[];
}
