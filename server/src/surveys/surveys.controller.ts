import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { SurveysService } from './surveys.service';
import { CreateSurveyDto } from './dto/create-survey.dto';

@Controller('surveys')
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) {}

  /**
   * Endpoint nộp bài kiểm tra burnout (Giới hạn tối đa 5 lượt nộp / 1 phút mỗi IP để chống spam)
   */
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async submitSurvey(@Body() dto: CreateSurveyDto) {
    return this.surveysService.create(dto);
  }

  /**
   * Endpoint lấy số liệu thống kê cộng đồng thời gian thực
   */
  @Get('stats')
  async getStats() {
    return this.surveysService.getStats();
  }
}
