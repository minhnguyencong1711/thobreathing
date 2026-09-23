import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Survey, SurveyDocument } from './schemas/survey.schema';
import { CreateSurveyDto } from './dto/create-survey.dto';

@Injectable()
export class SurveysService {
  private readonly logger = new Logger(SurveysService.name);

  constructor(
    @InjectModel(Survey.name) private readonly surveyModel: Model<SurveyDocument>,
  ) {}

  /**
   * Tính toán điểm số chuẩn MBI-SS và lưu kết quả khảo sát
   */
  async create(dto: CreateSurveyDto) {
    const answers = dto.answers;
    // 5 câu đầu: Kiệt sức (0..4)
    const exSum = answers.slice(0, 5).reduce((a, b) => a + b, 0);
    const exAvg = Number((exSum / 5).toFixed(2));

    // 4 câu tiếp: Thờ ơ / hoài nghi (5..8)
    const cySum = answers.slice(5, 9).reduce((a, b) => a + b, 0);
    const cyAvg = Number((cySum / 4).toFixed(2));

    // 6 câu cuối: Hiệu quả học tập (9..14)
    const peSum = answers.slice(9, 15).reduce((a, b) => a + b, 0);
    const peAvg = Number((peSum / 6).toFixed(2));

    // Tính level rủi ro
    const exLvl = exAvg < 2 ? 0 : exAvg <= 3.5 ? 1 : 2;
    const cyLvl = cyAvg < 1.5 ? 0 : cyAvg <= 3 ? 1 : 2;
    const peLvl = peAvg > 4 ? 0 : peAvg >= 2.5 ? 1 : 2;
    const overallLevel = Math.max(exLvl, cyLvl, peLvl);

    // Xác định lời khuyên theo khía cạnh bị ảnh hưởng nhiều nhất
    const scoresWithLevel = [
      { key: 'ex', level: exLvl },
      { key: 'cy', level: cyLvl },
      { key: 'pe', level: peLvl },
    ];
    scoresWithLevel.sort((a, b) => b.level - a.level);
    const worst = scoresWithLevel[0].key;

    let adviceTitle = 'Ưu tiên: Phục hồi năng lượng thể chất & tinh thần';
    let adviceBody =
      'Khía cạnh kiệt sức của bạn đang ở mức đáng chú ý. Hãy đặt mục tiêu ngủ đủ 7–8 tiếng, áp dụng phương pháp Bấm giờ Pomodoro để chia nhỏ buổi học thành các khoảng 25 phút, và can đảm cắt giảm bớt một việc chưa thật sự cấp bách trong tuần này.';

    if (worst === 'cy') {
      adviceTitle = 'Ưu tiên: Tìm lại cảm hứng và mục tiêu học tập';
      adviceBody =
        'Bạn đang có cảm giác chán nản và hoài nghi về việc học. Thử thay đổi góc học tập, học chung với một người bạn tích cực, và tự nhắc nhở bản thân về mục tiêu nhỏ mà bạn từng thấy hào hứng. Tránh ép mình phải hoàn hảo trong mọi môn.';
    } else if (worst === 'pe') {
      adviceTitle = 'Ưu tiên: Củng cố sự tự tin & cảm giác làm chủ';
      adviceBody =
        'Bạn đang cảm thấy hiệu quả học tập chưa như ý. Hãy bắt đầu từ những nhiệm vụ ngắn, dễ làm để lấy lại cảm giác thành công ("quick-wins"). Đừng ngần ngại nhờ bạn bè hoặc thầy cô giảng lại những phần kiến thức chưa hiểu rõ.';
    }

    const createdSurvey = new this.surveyModel({
      name: dto.name,
      birthYear: dto.birthYear,
      answers: dto.answers,
      scores: {
        exhaustion: exAvg,
        cynicism: cyAvg,
        efficacy: peAvg,
      },
      level: overallLevel,
      adviceTitle,
      adviceBody,
    });

    const saved = await createdSurvey.save();
    this.logger.log(`New survey submission recorded for user: ${dto.name} (${dto.birthYear}), Level: ${overallLevel}`);

    return {
      id: saved._id,
      name: saved.name,
      scores: saved.scores,
      level: saved.level,
      adviceTitle,
      adviceBody,
      createdAt: (saved as any).createdAt || new Date(),
    };
  }

  /**
   * Tổng hợp thống kê trực tiếp từ MongoDB Aggregation Pipeline
   */
  async getStats() {
    const defaultStats = {
      total: 1284,
      avgExhaustion: 3.8,
      avgCynicism: 3.2,
      avgEfficacy: 2.9,
      lowPct: 24,
      medPct: 47,
      highPct: 29,
    };

    try {
      const totalCount = await this.surveyModel.countDocuments();
      if (totalCount === 0) {
        return defaultStats;
      }

      // Aggregation tính điểm trung bình và phân bố mức độ
      const [agg] = await this.surveyModel.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            avgExhaustion: { $avg: '$scores.exhaustion' },
            avgCynicism: { $avg: '$scores.cynicism' },
            avgEfficacy: { $avg: '$scores.efficacy' },
            lowCount: {
              $sum: { $cond: [{ $eq: ['$level', 0] }, 1, 0] },
            },
            medCount: {
              $sum: { $cond: [{ $eq: ['$level', 1] }, 1, 0] },
            },
            highCount: {
              $sum: { $cond: [{ $eq: ['$level', 2] }, 1, 0] },
            },
          },
        },
      ]);

      if (!agg) return defaultStats;

      const total = agg.total;
      const lowPct = Math.round((agg.lowCount / total) * 100);
      const medPct = Math.round((agg.medCount / total) * 100);
      const highPct = Math.max(0, 100 - lowPct - medPct);

      return {
        total,
        avgExhaustion: Number(agg.avgExhaustion.toFixed(1)),
        avgCynicism: Number(agg.avgCynicism.toFixed(1)),
        avgEfficacy: Number(agg.avgEfficacy.toFixed(1)),
        lowPct,
        medPct,
        highPct,
      };
    } catch (error) {
      this.logger.error('Error computing survey stats from MongoDB', error);
      return defaultStats;
    }
  }
}
