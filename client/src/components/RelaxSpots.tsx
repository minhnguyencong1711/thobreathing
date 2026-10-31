import React, { useState } from 'react';
import {
  MapPin,
  HeartHandshake,
  Coffee,
  Trees,
  PhoneCall,
  Smile,
  BookOpen,
  Navigation,
  ExternalLink,
  Sparkles,
  Stethoscope,
  ShieldCheck,
  Clock,
  Heart,
  Phone,
  Compass
} from 'lucide-react';

interface SpotItem {
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  tagBg: string;
  tagColor: string;
  title: string;
  desc: string;
  color: string;
  bg: string;
  address?: string;
  mapUrl?: string;
  phones?: { label: string; number: string; highlight?: boolean }[];
}

const SPOTS: SpotItem[] = [
  {
    icon: HeartHandshake,
    tag: 'Tư vấn học đường',
    tagBg: 'rgba(230, 51, 117, 0.1)',
    tagColor: '#E63375',
    title: 'Phòng Tham vấn Tâm lý học đường',
    desc: 'Gặp chuyên viên tâm lý của trường để được lắng nghe, tháo gỡ áp lực học tập và các mối quan hệ bạn bè trong không gian hoàn toàn bảo mật.',
    address: 'Tại phòng y tế / phòng tham vấn trường THPT bạn đang học',
    color: '#E63375',
    bg: 'rgba(230, 51, 117, 0.1)',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=ph%C3%B2ng+tham+v%E1%BA%A5n+t%C3%A2m+l%C3%BD+h%E1%BB%8Dc+%C4%91%C6%B0%E1%BB%9Dng',
  },
  {
    icon: Coffee,
    tag: 'Không gian yên tĩnh',
    tagBg: 'rgba(33, 114, 215, 0.1)',
    tagColor: '#2172D7',
    title: 'Quán cà phê sách gần trường',
    desc: 'Không gian yên ắng với âm nhạc êm dịu, phù hợp để đọc sách, viết nhật ký cảm xúc hoặc chỉ đơn giản là ngồi thưởng thức một ly trà ấm.',
    address: 'Các quán cà phê yên tĩnh quanh khu vực trường học',
    color: '#2172D7',
    bg: 'rgba(33, 114, 215, 0.1)',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=qu%C3%A1n+c%C3%A0+ph%C3%AA+s%C3%A1ch+y%C3%AAn+t%C4%A9nh+g%E1%BA%A7n+%C4%91%C3%A2y',
  },
  {
    icon: Trees,
    tag: 'Ngoài trời & Thiên nhiên',
    tagBg: 'rgba(46, 204, 113, 0.12)',
    tagColor: '#2ECC71',
    title: 'Công viên cây xanh khu vực',
    desc: 'Đi dạo nhẹ nhàng 15 phút giữa tán cây xanh giúp hạ nhanh mức hormone căng thẳng cortisol và kích hoạt lại sự tập trung của não bộ.',
    address: 'Công viên cây xanh, vườn hoa gần khu vực sinh sống',
    color: '#2ECC71',
    bg: 'rgba(46, 204, 113, 0.12)',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=c%C3%B4ng+vi%C3%AAn+c%C3%A2y+xanh+g%E1%BA%A7n+%C4%91%C3%A2y',
  },
  {
    icon: PhoneCall,
    tag: 'Đường dây nóng 24/7',
    tagBg: 'rgba(230, 51, 117, 0.12)',
    tagColor: '#E63375',
    title: 'Tổng đài Quốc gia 111 & 1800 1567',
    desc: 'Đường dây nóng hỗ trợ bảo vệ trẻ em và tư vấn tâm lý miễn phí 24/7. Luôn có chuyên viên trực tổng đài lắng nghe bạn mọi lúc khó khăn.',
    address: 'Toàn quốc — Miễn cước cuộc gọi 24/7',
    color: '#E63375',
    bg: 'rgba(232, 159, 178, 0.25)',
    phones: [
      { label: 'Gọi 111 (Quốc gia)', number: '111', highlight: true },
      { label: 'Gọi 1800 1567', number: '18001567' },
    ],
  },
  {
    icon: Smile,
    tag: 'Vận động & Cân bằng',
    tagBg: 'rgba(244, 185, 66, 0.2)',
    tagColor: '#D97706',
    title: 'Lớp yoga & thiền cộng đồng',
    desc: 'Các buổi tập hít thở và yoga nhẹ nhàng cuối tuần giúp giải phóng các bó cơ bị co cứng vì ngồi học lâu, tái tạo nguồn năng lượng tích cực.',
    address: 'Các câu lạc bộ thiền, yoga quanh khu vực bạn ở',
    color: '#E67E22',
    bg: 'rgba(244, 185, 66, 0.18)',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=l%E1%BB%9Bp+yoga+thi%E1%BB%81n+c%E1%BB%99ng+%C4%91%E1%BB%93ng+g%E1%BA%A7n+%C4%91%C3%A2y',
  },
  {
    icon: BookOpen,
    tag: 'Góc tự học ấm áp',
    tagBg: 'rgba(33, 114, 215, 0.1)',
    tagColor: '#2172D7',
    title: 'Thư viện cộng đồng & Tự học',
    desc: 'Không gian học tập yên tĩnh, thoáng mát với điều hòa và ánh sáng chuẩn. Nơi bạn có thể tự do học theo nhịp độ của riêng mình.',
    address: 'Thư viện KHTH TP.HCM (69 Lý Tự Trọng) & thư viện quận huyện',
    color: '#2172D7',
    bg: 'rgba(33, 114, 215, 0.1)',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Th%C6%B0+vi%E1%BB%87n+Khoa+h%E1%BB%8Dc+T%E1%BB%95ng+h%E1%BB%A3p+TP.HCM+69+L%C3%BD+T%E1%BB%B1+Tr%E1%BB%8Dng',
  },
];

export const RelaxSpots: React.FC = () => {
  const [showEmbeddedMap, setShowEmbeddedMap] = useState(true);

  const psychiatricHospitalMapUrl =
    'https://maps.google.com/?q=B%E1%BB%87nh+vi%E1%BB%87n+T%C3%A2m+th%E1%BA%A7n+TP.HCM,+766+%C4%90.+V%C3%B5+V%C4%83n+Ki%E1%BB%87t,+Ph%C6%B0%E1%BB%9Dng+1,+Qu%E1%BA%ADn+5,+H%E1%BB%93+Ch%C3%AD+Minh';

  const embedMapSrc =
    'https://maps.google.com/maps?q=B%E1%BB%87nh+vi%E1%BB%87n+T%C3%A2m+th%E1%BA%A7n+TP.HCM,+766+V%C3%B5+V%C4%83n+Ki%E1%BB%87t,+Ph%C6%B0%E1%BB%9Dng+1,+Qu%E1%BA%ADn+5,+Th%C3%A0nh+ph%E1%BB%91+H%E1%BB%93+Ch%C3%AD+Minh&t=&z=15&ie=UTF8&iwloc=&output=embed';

  return (
    <section id="spots" className="py-20 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header Section */}
        <div className="max-w-3xl mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 mb-3">
            <MapPin className="w-3.5 h-3.5" /> Mạng lưới hỗ trợ & Trạm sạc tâm lý
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-body-text tracking-tight">
            Những nơi để bạn chậm lại một nhịp và tìm điểm tựa
          </h2>
          <p className="mt-3 text-base text-[#5A6A7D] leading-relaxed">
            Hành trình chăm sóc tinh thần từ không gian thư giãn yên tĩnh, lắng nghe hỗ trợ học đường
            đến các địa chỉ can thiệp y tế chuyên sâu, bảo mật và an toàn.
          </p>
        </div>

        {/* Healing Quote Banner: Bình thường hóa việc tìm kiếm trợ giúp tâm lý */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-white to-secondary/10 border border-primary/20 p-6 sm:p-8 mb-12 shadow-soft">
          <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-40 h-40 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shrink-0 shadow-md">
                <Heart className="w-6 h-6 fill-white/30" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> Thông điệp thấu cảm
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-body-text leading-snug">
                  "Chăm sóc sức khỏe tinh thần là sự dũng cảm bảo vệ chính mình."
                </h3>
                <p className="mt-1.5 text-sm text-[#5A6A7D] leading-relaxed max-w-2xl">
                  Giống như khi cơ thể bị sốt cần bác sĩ, việc tâm trí mệt mỏi cần được chuyên gia y khoa đồng hành là điều hoàn toàn tự nhiên.
                  Bạn không cần phải chịu đựng áp lực một mình — bước tới tìm kiếm trợ giúp là bước đi dũng cảm nhất để phục hồi nguồn năng lượng của bạn.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex sm:flex-col items-center gap-2">
              <span className="text-xs font-semibold text-secondary bg-secondary/10 px-3 py-1 rounded-full whitespace-nowrap">
                🌿 Bình thường hóa trợ giúp tâm lý
              </span>
            </div>
          </div>
        </div>

        {/* Grid 6 Thẻ Trạm Sạc Nhẹ Nhàng & Tham Vấn Học Đường */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-secondary" />
              <h3 className="text-lg font-bold text-body-text">
                Không gian thư giãn & Lắng nghe đồng hành
              </h3>
            </div>
            <span className="text-xs text-[#5A6A7D] hidden sm:inline">
              Bấm vào từng trạm để mở bản đồ hoặc gọi điện
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SPOTS.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="glass-panel p-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-soft-lg transition-all duration-300 border border-black/5 bg-white/80"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shadow-xs"
                        style={{ background: s.bg, color: s.color }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: s.tagBg, color: s.tagColor }}
                      >
                        {s.tag}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-body-text mb-2 leading-snug">
                      {s.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#5A6A7D] leading-relaxed mb-4">
                      {s.desc}
                    </p>
                  </div>

                  {/* Actions / Interactive Buttons */}
                  <div className="pt-4 border-t border-black/5 mt-auto">
                    {s.address && (
                      <div className="flex items-center gap-1.5 text-xs text-[#7B8B9E] mb-3">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-secondary" />
                        <span className="truncate">{s.address}</span>
                      </div>
                    )}

                    {/* Google Maps link */}
                    {s.mapUrl && (
                      <a
                        href={s.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl text-xs font-semibold text-secondary bg-secondary/10 hover:bg-secondary hover:text-white transition-colors duration-200"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Mở vị trí Google Maps</span>
                        <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                      </a>
                    )}

                    {/* Phone action buttons for 111 / 1800 1567 */}
                    {s.phones && (
                      <div className="grid grid-cols-2 gap-2">
                        {s.phones.map((phone, pIdx) => (
                          <a
                            key={pIdx}
                            href={`tel:${phone.number}`}
                            className={`inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                              phone.highlight
                                ? 'bg-primary text-white hover:bg-primary-hover shadow-xs'
                                : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                            }`}
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>{phone.label}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Featured Card: Bệnh viện Tâm thần TP.HCM — Can thiệp Chuyên sâu & Chữa lành */}
        <div className="glass-panel p-6 sm:p-8 lg:p-9 border-2 border-secondary/20 bg-gradient-to-br from-white via-[#FAFBFD] to-secondary/5 rounded-3xl shadow-soft">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-secondary to-[#4A90E2] shadow-xs">
                    <Stethoscope className="w-3.5 h-3.5" /> Can thiệp y tế chuyên sâu
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Bảo mật 100% danh tính học sinh
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-body-text tracking-tight mb-1">
                  Khoa Khám Tâm lý & Sức khỏe Tâm thần Vị thành niên
                </h3>
                <p className="text-sm font-bold text-secondary mb-4">
                  Bệnh viện Tâm thần Thành phố Hồ Chí Minh (Cơ sở chuyên khoa công lập)
                </p>

                {/* Healing Script — Lời giải thích nhẹ nhàng, thấu cảm, bình thường hóa y khoa */}
                <div className="bg-secondary/5 border-l-4 border-secondary rounded-r-xl p-4 mb-5">
                  <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                    <strong className="text-secondary font-semibold">Tâm sự cùng bạn:</strong> Khi áp lực học tập, lo âu kéo dài hay nỗi buồn khiến bạn cảm thấy cạn kiệt,
                    việc tìm đến bác sĩ chuyên khoa là một <strong>lựa chọn y khoa văn minh và an toàn</strong>. Tại đây, các bác sĩ tâm thần học và chuyên viên tâm lý lâm sàng giàu kinh nghiệm
                    sẽ trực tiếp lắng nghe, đánh giá bằng trắc nghiệm chuyên sâu và hỗ trợ bạn hồi phục mà <strong>không hề có sự phán xét</strong>.
                  </p>
                </div>

                {/* Key Location Information */}
                <div className="space-y-2.5 text-xs sm:text-sm text-[#5A6A7D] mb-6">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-body-text">Địa chỉ tiếp nhận:</span>{' '}
                      <span>766 Võ Văn Kiệt, Phường 1, Quận 5, TP. Hồ Chí Minh</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-secondary shrink-0" />
                    <div>
                      <span className="font-bold text-body-text">Giờ khám tâm lý:</span>{' '}
                      <span>Thứ Hai – Thứ Sáu (7:30 – 16:30) | Cấp cứu tâm thần 24/24</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold text-body-text">Hotline / Điện thoại:</span>{' '}
                      <span className="font-semibold text-body-text">(028) 3923 4675</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={psychiatricHospitalMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-secondary hover:bg-secondary-hover shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Chỉ đường trên Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                <a
                  href="tel:02839234675"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-secondary bg-secondary/10 hover:bg-secondary hover:text-white border border-secondary/20 transition-all duration-200"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Gọi số bệnh viện (028 3923 4675)</span>
                </a>

                <button
                  type="button"
                  onClick={() => setShowEmbeddedMap((prev) => !prev)}
                  className="text-xs font-semibold text-[#7B8B9E] hover:text-secondary underline decoration-dotted ml-auto"
                >
                  {showEmbeddedMap ? 'Thu nhỏ bản đồ' : 'Mở xem bản đồ nhỏ'}
                </button>
              </div>
            </div>

            {/* Right Map Preview (5 cols) */}
            <div className="lg:col-span-5">
              {showEmbeddedMap ? (
                <div className="relative rounded-2xl overflow-hidden border border-black/10 shadow-soft bg-white">
                  <div className="px-3.5 py-2 bg-secondary/10 border-b border-black/5 flex items-center justify-between text-xs text-secondary font-semibold">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> 766 Võ Văn Kiệt, Quận 5, TP.HCM
                    </span>
                    <a
                      href={psychiatricHospitalMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1"
                    >
                      Mở tab mới <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="w-full h-56 sm:h-64 lg:h-72 relative">
                    <iframe
                      title="Google Maps Bệnh viện Tâm thần TP.HCM"
                      src={embedMapSrc}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full"
                    />
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setShowEmbeddedMap(true)}
                  className="h-48 rounded-2xl border-2 border-dashed border-secondary/30 bg-secondary/5 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/10 transition-colors p-6 text-center"
                >
                  <MapPin className="w-8 h-8 text-secondary mb-2" />
                  <p className="text-sm font-bold text-body-text">Bản đồ đang được thu gọn</p>
                  <p className="text-xs text-[#7B8B9E] mt-1">Bấm vào đây để mở khung bản đồ Google Maps</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
