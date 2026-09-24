import React, { useState, useEffect } from 'react';
import { Wind, Menu, X, Image as ImageIcon } from 'lucide-react';

interface NavbarProps {
  onOpenPoster: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPoster }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Tự động đóng menu mobile khi resize lên màn hình desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Khóa cuộn trang khi menu mobile mở
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navLinks = [
    { label: 'Kiểm tra', href: '#quiz' },
    { label: 'Số liệu', href: '#stats' },
    { label: 'Bấm giờ', href: '#timer' },
    { label: 'Trạm sạc', href: '#spots' },
    { label: 'Thư giãn', href: '#relief' },
    { label: 'Góp ý', href: '#form' },
  ];

  return (
    <>
      {/* Header cố định luôn hiển thị khi scroll (Fixed Header) */}
      <header className="fixed top-0 left-0 right-0 z-40 w-full bg-page-bg/90 backdrop-blur-md border-b border-black/10 shadow-2xs transition-all">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#top" className="flex items-center gap-3 font-extrabold text-xl text-body-text">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md">
              <Wind className="w-5 h-5" />
            </div>
            <span>Thở</span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <nav>
              <ul className="flex items-center gap-6">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="font-semibold text-sm text-[#5A6A7D] hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <button
              type="button"
              onClick={onOpenPoster}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm bg-white border border-black/10 hover:border-secondary hover:text-secondary shadow-sm transition-all"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Xem poster nhóm</span>
            </button>
          </div>

          {/* Mobile Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="md:hidden w-11 h-11 rounded-xl bg-white border border-black/10 flex items-center justify-center text-body-text shadow-sm hover:bg-slate-50 transition-colors"
            aria-label="Mở menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* 
        Mobile Drawer (Được đặt NGOÀI header để không bị ảnh hưởng bởi backdrop-blur của header)
        Kèm md:hidden để tuyệt đối không bao giờ hiển thị trên desktop!
      */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-in fade-in duration-200">
          {/* Dark Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div className="relative ml-auto w-72 max-w-[80vw] h-full bg-white shadow-2xl p-6 flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-black/10">
                <div className="flex items-center gap-2 font-extrabold text-lg text-body-text">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white">
                    <Wind className="w-4 h-4" />
                  </div>
                  <span>Thở</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                  aria-label="Đóng menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex flex-col gap-2 mt-6">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-semibold text-base py-2.5 px-2 rounded-xl text-body-text hover:bg-primary/10 hover:text-primary transition-all border-b border-slate-100"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenPoster();
              }}
              className="w-full py-3.5 rounded-full font-bold text-sm bg-primary text-white shadow-primary-glow flex items-center justify-center gap-2 hover:bg-primary-hover active:scale-95 transition-all"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Xem poster nhóm</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
