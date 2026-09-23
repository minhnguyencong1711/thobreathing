import React from 'react';
import { MapPin, HeartHandshake, Coffee, Trees, PhoneCall, Smile, BookOpen } from 'lucide-react';

const SPOTS = [
  {
    icon: HeartHandshake,
    tag: 'Tư vấn học đường',
    title: 'Phòng Tham vấn Tâm lý',
    desc: 'Gặp chuyên viên tâm lý của trường để được lắng nghe và tháo gỡ áp lực học tập hoàn toàn bảo mật.',
    color: '#E63375',
    bg: 'rgba(230, 51, 117, 0.1)',
  },
  {
    icon: Coffee,
    tag: 'Không gian yên tĩnh',
    title: 'Quán cà phê sách gần trường',
    desc: 'Không gian yên ắng để đọc sách, viết nhật ký hoặc chỉ đơn giản là ngồi thưởng thức một ly trà ấm.',
    color: '#2172D7',
    bg: 'rgba(33, 114, 215, 0.1)',
  },
  {
    icon: Trees,
    tag: 'Ngoài trời',
    title: 'Công viên cây xanh khu vực',
    desc: 'Đi bộ 15 phút giữa hàng cây xanh giúp hạ mức cortisol và làm dịu hệ thần kinh đang căng thẳng.',
    color: '#2ECC71',
    bg: 'rgba(46, 204, 113, 0.12)',
  },
  {
    icon: PhoneCall,
    tag: 'Đường dây nóng 24/7',
    title: 'Tổng đài Quốc gia 111 / 1800 1567',
    desc: 'Đường dây hỗ trợ tâm lý miễn phí dành cho trẻ em và học sinh khi bạn cần người lắng nghe khẩn cấp.',
    color: '#E63375',
    bg: 'rgba(232, 159, 178, 0.25)',
  },
  {
    icon: Smile,
    tag: 'Vận động nhẹ',
    title: 'Lớp yoga & thiền cộng đồng',
    desc: 'Các buổi tập thở và yoga nhẹ nhàng vào cuối tuần giúp giải tỏa các cơ bắp bị co cứng vì ngồi học lâu.',
    color: '#E67E22',
    bg: 'rgba(244, 185, 66, 0.18)',
  },
  {
    icon: BookOpen,
    tag: 'Góc tự học ấm áp',
    title: 'Thư viện cộng đồng',
    desc: 'Không gian học tập yên tĩnh, thoáng mát và ít áp lực phán xét hơn phòng học chính khóa.',
    color: '#2172D7',
    bg: 'rgba(33, 114, 215, 0.1)',
  },
];

export const RelaxSpots: React.FC = () => {
  return (
    <section id="spots" className="py-20 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 mb-3">
            <MapPin className="w-3.5 h-3.5" /> Trạm sạc tâm lý
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-body-text tracking-tight">
            Những nơi để bạn chậm lại một nhịp
          </h2>
          <p className="mt-3 text-base text-[#5A6A7D] leading-relaxed">
            Gợi ý các địa điểm hỗ trợ tinh thần và không gian thư giãn yên tĩnh quanh khu vực trường học.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SPOTS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-7 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-soft-lg transition-all duration-300"
              >
                <div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: s.bg, color: s.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-secondary bg-secondary/10 mb-3">
                    {s.tag}
                  </span>

                  <h3 className="text-lg font-bold text-body-text mb-2">{s.title}</h3>
                  <p className="text-sm text-[#5A6A7D] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
