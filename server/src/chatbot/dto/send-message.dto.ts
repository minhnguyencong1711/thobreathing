import {
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  IsOptional,
  ValidateNested,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CHATBOT_MAX_INPUT_LENGTH } from '../constants';

export class UserContextDto {
  @IsString() @MaxLength(100)
  name: string;

  @IsInt() @Min(10) @Max(30)
  age: number;

  @IsInt() @Min(0) @Max(2)
  burnoutLevel: number;

  @IsInt() @Min(0) @Max(30)
  exhaustionScore: number;

  @IsInt() @Min(0) @Max(24)
  cynicismScore: number;

  @IsInt() @Min(0) @Max(36)
  efficacyScore: number;
}

export class SendMessageDto {
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  sessionId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(CHATBOT_MAX_INPUT_LENGTH)
  message: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserContextDto)
  userContext?: UserContextDto;
}
