import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiTruck, FiShield, FiGift, FiX } from 'react-icons/fi';
import LuxuryFeatureSection from "./LuxuryFeatureSection";
import { SiVisa, SiMastercard, SiGoogleplay, SiRoblox } from 'react-icons/si';

import ToggleButton from './ToggleButton';

// بيانات الخدمات المتاحة (ليست وسائل دفع)
const SERVICES = [
  { id: 'visa', name: 'Visa', content: 'VISA', type: 'text' },
  { id: 'mastercard', name: 'Mastercard', content: 'circles', type: 'special' },
  { id: 'googleplay', name: 'Google Play', content: '▶', type: 'symbol' },
  { id: 'roblox', name: 'Roblox', content: 'R', type: 'text' },
  { id: 'playstation', name: 'PlayStation', content: '◐◒◑◓', type: 'symbol' },
  { id: 'amazon', name: 'Amazon', content: 'amazon', type: 'text' },
  { id: 'itunes', name: 'iTunes', content: '♪', type: 'symbol' },
  { id: 'shein', name: 'Shein', content: 'SHEIN', type: 'text' },
  { id: 'steam', name: 'Steam', content: '◉', type: 'symbol' },
  { id: 'fortnite', name: 'Fortnite', content: 'F', type: 'text' },
  { id: 'razer', name: 'Razer Gold', content: '⧨', type: 'symbol' },
  { id: 'flower', name: 'Flower', content: '❀', type: 'symbol' }
];

// عنصر الخدمة
const ServiceItem = ({ service, showLabel = false }) => (
  <li className={`payment-card ${service.id}`} aria-label={service.name}>
    <div className={`card-icon premium-card ${service.id}`}>
      {service.content === 'circles' ? (
        <div className="card-circles">
          <div className="circle red"></div>
          <div className="circle yellow"></div>
        </div>
      ) : (
        <div className="card-brand">{service.content}</div>
      )}
    </div>
    {showLabel && <div className="label-text">{service.name}</div>}
  </li>
);

const ProductCard = () => {
  const [miniOpen, setMiniOpen] = useState(false);
  const toggleRef = useRef(null);
  const overlayRef = useRef(null);
  const closeBtnRef = useRef(null);
  const contentRootRef = useRef(null);

  const openMini = useCallback(() => {
    setMiniOpen(true);
  }, []);

  const closeMini = useCallback(() => {
    setMiniOpen(false);
    // إعادة التركيز لزر التبديل بعد الإغلاق
    setTimeout(() => {
      try { toggleRef.current && toggleRef.current.focus(); } catch {}
    }, 0);
  }, []);

  // Trap Focus + ESC
  useEffect(() => {
    if (!miniOpen) return;

    const overlayEl = overlayRef.current;
    const focusableSelectors = [
      'a[href]', 'button', 'input', 'select', 'textarea', '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    const getFocusable = () => Array.from(overlayEl.querySelectorAll(focusableSelectors))
      .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));

    // تركيز أول عنصر (زر الإغلاق)
    try { closeBtnRef.current && closeBtnRef.current.focus(); } catch {}

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMini();
        return;
      }
      if (e.key === 'Tab') {
        const focusables = getFocusable();
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [miniOpen, closeMini]);

  return (
    <StyledWrapper data-open={miniOpen}>
      <div className="card">
        {/* خلفية المودال */}
        {miniOpen && (
          <div className="screen-dim" onClick={closeMini} aria-hidden="true" />
        )}

        {/* المودال المصغر */}
        {miniOpen && (
          <div
            className="mini-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="صفحة مصغرة"
            ref={overlayRef}
          >
            <button
              className="close-btn"
              onClick={closeMini}
              aria-label="إغلاق"
              ref={closeBtnRef}
            >
              <FiX size={16} />
            </button>
            <div className="mini-content">
              <div className="mini-payments">
                <ul className="colors-container">
                  {SERVICES.map(service => (
                    <ServiceItem key={service.id} service={service} showLabel={true} />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* محتوى الكرت الرئيسي - يُخفى لقارئات الشاشة عند فتح المودال */}
        <div ref={contentRootRef} aria-hidden={miniOpen ? true : undefined}>
          {/* حاوي الصورة */}
          <div className="image-container">
            {/* النقطة الخضراء: تحسين بصري فقط */}
            <span className="status-dot online" aria-hidden="true" />
            <div className="toggle-wrapper" title="فتح الصفحة المصغرة">
              <ToggleButton active={miniOpen} onClick={openMini} ref={toggleRef} />
            </div>

            {/* خلفية SVG محسنة */}
            <svg viewBox="0 0 1921 1081" className="svg" aria-hidden="true">
              <defs>
                <radialGradient id="bg-gradient" cx="0.5" cy="0.5" r="1.2">
                  <stop stopColor="#ffffff" offset={0} />
                  <stop stopColor="#f8fafc" offset={0.3} />
                  <stop stopColor="#e2e8f0" offset={0.7} />
                  <stop stopColor="#cbd5e0" offset={1} />
                </radialGradient>
              </defs>
              <rect fill="url(#bg-gradient)" width="100%" height="100%" />
            </svg>

            {/* صورة الخدمات */}
            <div className="animated-cards-stack">
              <img src="/assets/credit-cards-stack.png" alt="مجموعة بطائق إلكترونية" />
            </div>
          </div>

          {/* زر المفضلة */}
          <label className="favorite">
            <input defaultChecked type="checkbox" />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000000">
              <circle cx="12" cy="12" r="10"/>
            </svg>
          </label>

          {/* المحتوى */}
          <div className="content">
            <div className="brand">بطائق إلكترونية مسبقة الدفع</div>
            <div className="product-name">بطاقة دفع رقمية جاهزة للاستخدام الفوري</div>
            
            {/* مؤشر التحميل */}
            <div className="loading-indicator">
              <div className="dot"></div>
              <div className="dot"></div>      
              <div className="dot"></div>
            </div>
            
            {/* معاينة الخدمات المتاحة */}
            <div className="color-size-container">
              <div className="colors">
                <ul className="colors-container" aria-label="معاينة العلامات">
                  <li className="payment-card visa" aria-label="Visa">
                    <div className="card-icon premium-card visa">
                      <img className="brand-img" src="/assets/visa-user.png" alt="Visa" />
                    </div>
                  </li>
                  <li className="payment-card mastercard" aria-label="Mastercard">
                    <div className="card-icon premium-card mastercard">
                      <img className="brand-img" src="/assets/mastercard-user.png" alt="Mastercard" />
                    </div>
                  </li>
                  <li className="payment-card googleplay" aria-label="Google Play">
                    <div className="card-icon premium-card googleplay">
                      <img className="brand-img" src="/assets/google-play-user.png" alt="Google Play" />
                    </div>
                  </li>
                  <li className="payment-card roblox" aria-label="Roblox">
                    <div className="card-icon premium-card roblox">
                      <img className="brand-img" src="/assets/roblox-user.png" alt="Roblox" />
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* شريط المعلومات - محتوى جديد فخم داخل نفس المربع */}
            <div className="service-info-bar">
              <div className="w-full">
                <div className="hidden">
                  {/* reserved for accessibility landmarks if needed */}
                </div>
                <div className="lux-feature-wrapper">
                  {/* Tailwind/Framer/Shadcn section */}
                  <LuxuryFeatureSection />
                </div>
              </div>
            </div>
            
            <div className="divider" aria-hidden="true" />

            {/* شريط الثقة */}
            <div className="trust-bar" role="list" aria-label="شريط الثقة">
              <div className="trust-item" role="listitem" aria-label="أمان">
                <span className="trust-icon" aria-hidden="true">🛡️</span>
                <span className="trust-label">أمان</span>
              </div>
              <div className="trust-item" role="listitem" aria-label="سرعة">
                <span className="trust-icon" aria-hidden="true">⚡</span>
                <span className="trust-label">سرعة</span>
              </div>
              <div className="trust-item" role="listitem" aria-label="ثقة">
                <span className="trust-icon" aria-hidden="true">📈</span>
                <span className="trust-label">ثقة</span>
              </div>
              <div className="trust-item" role="listitem" aria-label="جودة">
                <span className="trust-icon" aria-hidden="true">🏅</span>
                <span className="trust-label">جودة</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    --accent-color: #ffd426;
    position: relative;
    width: 260px;
    background: white;
    border-radius: 1.2rem;
    padding: 0.48rem; /* +0.08rem لضبط الحافة */
    padding-bottom: 0.9rem;
    box-shadow:
      0 8px 12px rgba(16, 24, 40, 0.06),
      0 24px 48px -24px rgba(16, 24, 40, 0.18),
      inset 0 1px 0 rgba(255, 255, 255, 0.35);
    transition: transform 220ms ease, box-shadow 220ms ease;
    direction: rtl;
    overflow: visible;
    z-index: 10;
    transform-origin: center; /* مهم للتحجيم على الشاشات الكبيرة */
  }
  .card:hover {
    transform: translateY(-2px);
    box-shadow:
      0 10px 16px rgba(16, 24, 40, 0.08),
      0 30px 56px -26px rgba(16, 24, 40, 0.22),
      inset 0 1px 0 rgba(255, 255, 255, 0.35);
  }

  /* تحسينات شاشة صغيرة 360-400px: مسافات آمنة وعدم اقتراب العناصر من الحواف */
  @media (max-width: 400px) {
    .card { padding-left: 0.6rem; padding-right: 0.6rem; }
    .card .image-container { height: 136px; }
    .card .image-container .toggle-wrapper { left: 28px; bottom: -20px; }
    .card .content .service-info-bar {
      margin-left: -14px;
      margin-right: -14px;
      width: calc(100% + 28px);
    }
  }

  /* تحجيم لطيف على الشاشات الواسعة حتى لا يبدو الكرت صغيراً جداً */
  @media (min-width: 1280px) {
    .card { transform: scale(1.06); }
    .card:hover { transform: translateY(-2px) scale(1.08); }
  }
  @media (min-width: 1536px) {
    .card { transform: scale(1.12); }
    .card:hover { transform: translateY(-2px) scale(1.14); }
  }

  /* المودال */
  .screen-dim { 
    position: fixed; 
    inset: 0; 
    background: rgba(17,24,39,0.6); 
    backdrop-filter: blur(0.5px); 
    z-index: 9998; 
    pointer-events: auto; 
  }

  .mini-overlay { 
    position: absolute; 
    inset: 0; 
    background: transparent; 
    border-radius: inherit; 
    z-index: 10000; 
    display: flex; 
    flex-direction: column; 
    box-shadow: none; 
    animation: fadeIn 200ms ease-out; 
  }

  .mini-overlay .close-btn { 
    position: absolute; 
    top: -20px; 
    left: 50%; 
    transform: translateX(-50%); 
    background: #111827; 
    color: #fff; 
    border: none; 
    border-radius: 999px; 
    width: 26px; 
    height: 26px; 
    display: inline-flex; 
    align-items: center; 
    justify-content: center; 
    cursor: pointer; 
    opacity: 0.96; 
    z-index: 30; 
    box-shadow: 0 8px 20px rgba(0,0,0,0.25); 
  }

  .mini-overlay .close-btn:focus-visible {
    outline: 3px solid #2563EB;
    outline-offset: 2px;
  }

  .mini-content { 
    padding: 0.8rem 0.8rem 1rem 0.8rem; 
    padding-top: 2.2rem; 
    color: #1f2937; /* رفع التباين */
    height: 100%; 
    font-family: 'Tajawal', 'IBM Plex Sans Arabic', 'Cairo', sans-serif;
  }

  .mini-payments { 
    display: flex; 
    justify-content: center; 
  }

  .mini-overlay .colors-container { 
    list-style-type: none; 
    display: grid; 
    grid-template-columns: repeat(4, 50px); 
    gap: 10px 10px; 
    justify-content: center; 
    justify-items: center; 
    align-items: start; 
    font-size: 0.5rem; 
    margin: 0; 
    padding: 0; 
    width: 100%; 
    max-width: 240px; 
  }

  .mini-overlay .payment-card { 
    position: relative; 
    cursor: pointer; 
    transition: transform 0.22s ease, box-shadow 0.22s ease; 
    width: 56px; 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    gap: 0.15rem; 
  }

  .mini-overlay .payment-card:hover { 
    transform: translateY(-2px) scale(1.06); 
  }

  .mini-overlay .payment-card .label-text { 
    font-size: 0.55rem; 
    color: #374151; 
    font-family: 'Tajawal', 'IBM Plex Sans Arabic', 'Cairo', sans-serif;
    font-weight: 600; 
    line-height: 1.3; 
    text-align: center; 
  }

  /* حاوي الصورة */
  .card .image-container { 
    position: relative; 
    width: 100%; 
    height: 140px; 
    border-radius: 0.8rem; 
    border-top-left-radius: 4.5rem; 
    margin-bottom: 1.35rem; 
    overflow: visible; 
  }

  .card .image-container .status-dot { 
    position: absolute; 
    top: 8px; 
    left: 10px; 
    width: 10px; 
    height: 10px; 
    border-radius: 50%; 
    box-shadow: 0 0 0 3px #ffffff, 0 2px 4px rgba(0,0,0,0.15); 
    background: #22c55e;
  }

  .card .image-container .animated-cards-stack {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    animation: cards-entrance 1.1s ease-out forwards;
    filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.28));
  }

  .card .image-container .animated-cards-stack img {
    width: 100px;
    height: auto;
    max-width: 100px;
    border-radius: 8px;
  }

  @keyframes cards-entrance {
    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
    50% { transform: translate(-50%, -50%) scale(1.06); opacity: 0.9; }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  }

  .card .image-container .svg { 
    height: 100%; 
    width: 100%; 
    border-radius: inherit;
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 25%, #e2e8f0 50%, #cbd5e0 75%, #94a3b8 100%);
    box-shadow: 
      inset 0 8px 16px rgba(255,255,255,0.8),
      inset 0 -8px 16px rgba(0,0,0,0.25),
      inset 8px 0 12px rgba(255,255,255,0.35),
      inset -8px 0 12px rgba(0,0,0,0.18);
  }

  .card .image-container .svg::before {
    content: '';
    position: absolute;
    top: 0;
    left: -150px;
    width: 150px;
    height: 100%;
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%);
    animation: shine 3s ease-in-out infinite;
    z-index: 2;
  }

  @keyframes shine {
    0% { left: -150px; opacity: 0; }
    30% { opacity: 1; }
    70% { opacity: 1; }
    100% { left: calc(100% + 50px); opacity: 0; }
  }

  .card .image-container .toggle-wrapper { 
    position: absolute; 
    left: 22px; 
    bottom: -22px; 
    z-index: 4; 
    transform: scale(0.65); 
    transform-origin: left bottom; 
  }

  /* زر المفضلة */
  .card .favorite { 
    position: absolute; 
    width: 18px; 
    height: 18px; 
    top: 10px; 
    left: 10px; 
    cursor: pointer; 
    z-index: 5; 
  }

  .card .favorite input { 
    position: absolute; 
    opacity: 0; 
    width: 0; 
    height: 0; 
  }

  .card .favorite input:checked ~ svg { 
    animation: circle-bounce 0.3s; 
    fill: #22c55e; 
    filter: drop-shadow(0px 2px 3px rgba(34, 197, 94, 0.4)); 
  }

  .card .favorite svg { 
    fill: #d1d5db; 
    transition: all 0.2s ease; 
  }

  /* المحتوى */
  .card .content { 
    padding: 0 20px; 
    margin-bottom: 8px; 
  }

  .card .content .brand { 
    font-family: 'Tajawal', 'IBM Plex Sans Arabic', 'Noto Sans Arabic', 'Cairo', sans-serif;
    font-weight: 800; 
    font-size: 0.94rem; 
    color: #1f2937; /* تباين أعلى */
    text-align: right; 
    margin-bottom: 12px; 
    line-height: 1.25; 
    letter-spacing: 0.01em; 
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.06); 
    white-space: nowrap; 
    overflow: hidden; 
    text-overflow: ellipsis; 
  }

  .card .content .product-name { 
    font-family: 'Tajawal', 'IBM Plex Sans Arabic', 'Noto Sans Arabic', 'Cairo', sans-serif;
    font-weight: 600; 
    color: #111827; 
    font-size: 0.86rem; 
    margin-bottom: 16px; 
    text-align: right; 
    line-height: 1.55; 
    letter-spacing: 0.005em; 
    text-shadow: 0 0.5px 2px rgba(0, 0, 0, 0.05); 
    max-width: 100%;
    word-spacing: 0.08em; 
  }

  /* مؤشر التحميل */
  .card .content .loading-indicator { 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    gap: 0.3rem; 
    margin-bottom: 1.2rem; 
    padding: 0.4rem 0; 
  }

  .card .content .loading-indicator .dot { 
    width: 5px; 
    height: 5px; 
    border-radius: 50%; 
    background-color: #F79E1B; 
    animation: typing-dots 1.4s infinite ease-in-out; 
  }

  .card .content .loading-indicator .dot:nth-child(1) { animation-delay: -0.32s; }
  .card .content .loading-indicator .dot:nth-child(2) { animation-delay: -0.16s; }
  .card .content .loading-indicator .dot:nth-child(3) { animation-delay: 0; }

  @keyframes typing-dots { 
    0%, 80%, 100% { transform: scale(1); opacity: 0.5; } 
    40% { transform: scale(1.2); opacity: 1; } 
  }

  /* حاوي الألوان والأحجام */
  .card .content .color-size-container { 
    display: flex; 
    justify-content: space-between; 
    text-transform: uppercase; 
    font-size: 0.7rem; 
    font-weight: 700; 
    color: #9ca3af; /* رمادي متوازن */
    gap: 2rem; 
    margin-bottom: 1.5rem; 
  }

  .card .content .color-size-container > * { 
    flex: 1; 
  }

  .card .content .color-size-container .colors .colors-container { 
    list-style-type: none; 
    display: flex; 
    flex-wrap: wrap; 
    align-items: center; 
    justify-content: space-between; 
    gap: 0.3rem; 
    font-size: 0.5rem; 
    margin-top: 0.2rem; 
  }

  /* معاينة العلامات - توحيد الخلفية وألوان الشعارات */
  .card .content .color-size-container .colors .colors-container .premium-card {
    background: #F5F7FB !important;
    border: 0.25px solid #9CA3AF !important; /* رمادي فائق النحافة */
    box-shadow:
      0 2px 6px rgba(0,0,0,0.06),
      inset 0 1px 0 rgba(255,255,255,0.35) !important;
  }
  .card .content .color-size-container .colors .colors-container .premium-card .brand-icon svg {
    width: 20px; height: 20px;
  }
  /* ألوان الشعار الرسمية */
  .card .content .color-size-container .colors .colors-container .premium-card.visa .brand-img { width: 20px; height: 20px; object-fit: contain; }
  .card .content .color-size-container .colors .colors-container .premium-card.mastercard .brand-icon svg { color: #EB001B; }
  .card .content .color-size-container .colors .colors-container .premium-card.googleplay .brand-icon svg { color: #34A853; }
  .card .content .color-size-container .colors .colors-container .premium-card.roblox .brand-icon svg { color: #E2231A; }

  /* تصميم بطاقات الخدمة المميزة */
  .premium-card {
    width: 40px !important;
    height: 26px !important;
    border-radius: 6px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    position: relative !important;
    cursor: default !important;
    transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.22s ease !important;
    box-shadow: 
      0 3px 10px rgba(0, 0, 0, 0.18),
      0 2px 4px rgba(0, 0, 0, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
    border: 1px solid rgba(255, 255, 255, 0.14) !important;
    overflow: hidden !important;
  }

  /* ضبط حجم الأيقونة الرسمية داخل البطاقة */
  .premium-card .brand-icon { display: inline-flex; align-items: center; justify-content: center; }
  .premium-card .brand-icon svg { width: 22px; height: 22px; }
  .premium-card .brand-img { width: 22px; height: 22px; object-fit: contain; display: block; }
  .premium-card.roblox .brand-img { width: 18px; height: 18px; }
  .premium-card.googleplay .brand-img { width: 18px; height: 18px; }


  /* ألوان بطاقات الخدمة */
  .premium-card.visa {
    background: linear-gradient(135deg, #1a1f71 0%, #4757a9 50%, #1a1f71 100%) !important;
    color: #ffffff !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  }
  .premium-card.mastercard { background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%) !important; color: #ffffff !important; }
  .premium-card.googleplay { background: linear-gradient(135deg, #34a853 0%, #4caf50 50%, #2e7d32 100%) !important; color: #ffffff !important; font-size: 12px !important; }
  .premium-card.roblox { background: linear-gradient(135deg, #e74c3c 0%, #c0392b 50%, #a93226 100%) !important; color: #ffffff !important; font-size: 12px !important; font-weight: 900 !important; }
  .premium-card.playstation { background: linear-gradient(135deg, #003791 0%, #0050c7 50%, #003791 100%) !important; color: #ffffff !important; font-size: 10px !important; }
  .premium-card.amazon { background: linear-gradient(135deg, #ff9900 0%, #ffb84d 50%, #e68a00 100%) !important; color: #000000 !important; font-weight: 900 !important; text-shadow: 0 1px 0 rgba(255, 255, 255, 0.2) !important; }
  .premium-card.itunes { background: linear-gradient(135deg, #fa2d48 0%, #ff5470 50%, #e91e40 100%) !important; color: #ffffff !important; font-size: 14px !important; }
  .premium-card.shein { background: linear-gradient(135deg, #000000 0%, #2c2c2c 50%, #000000 100%) !important; color: #ffffff !important; font-size: 7px !important; font-weight: 900 !important; }
  .premium-card.steam { background: linear-gradient(135deg, #1b2838 0%, #2a475e 50%, #1b2838 100%) !important; color: #66c0f4 !important; font-size: 14px !important; }
  .premium-card.fortnite { background: linear-gradient(135deg, #6a5acd 0%, #8a7dda 50%, #5a4fcf 100%) !important; color: #ffffff !important; font-size: 12px !important; font-weight: 900 !important; }
  .premium-card.razer { background: linear-gradient(135deg, #00ff00 0%, #44ff44 50%, #00cc00 100%) !important; color: #000000 !important; font-size: 12px !important; font-weight: 900 !important; text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3) !important; }
  .premium-card.flower { background: linear-gradient(135deg, #ff69b4 0%, #ff99cc 50%, #ff1493 100%) !important; color: #ffffff !important; font-size: 14px !important; }

  /* دوائر Mastercard */
  .card-circles { display: flex !important; align-items: center !important; gap: -2px !important; }
  .card-circles .circle { width: 12px !important; height: 12px !important; border-radius: 50% !important; opacity: 0.9 !important; }
  .card-circles .circle.red { background: #eb001b !important; z-index: 2 !important; }
  .card-circles .circle.yellow { background: #ff5f00 !important; margin-left: -6px !important; z-index: 1 !important; }

  /* تأثيرات التمرير */
  .card .premium-card:hover {
    transform: translateY(-2px) scale(1.08) !important;
    box-shadow: 
      0 8px 25px rgba(0, 0, 0, 0.25),
      0 4px 12px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
  }
  .card .premium-card:active { transform: translateY(0px) scale(1.02) !important; box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2), 0 1px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important; }

  /* أنماط المودال المصغر */
  .mini-overlay .premium-card { width: 50px !important; height: 32px !important; font-size: 9px !important; }
  .mini-overlay .premium-card.googleplay,
  .mini-overlay .premium-card.itunes,
  .mini-overlay .premium-card.steam,
  .mini-overlay .premium-card.flower { font-size: 16px !important; }
  .mini-overlay .premium-card.playstation { font-size: 12px !important; }
  .mini-overlay .premium-card.razer { font-size: 14px !important; }
  .mini-overlay .premium-card:hover { transform: translateY(-3px) scale(1.1) !important; box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3), 0 6px 15px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4) !important; border: 1px solid rgba(255, 255, 255, 0.3) !important; }
  .mini-overlay .premium-card:active { transform: translateY(-1px) scale(1.05) !important; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25), 0 3px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2) !important; }

  /* الخط الأزرق الفاصل */
  .card .divider { 
    height: 1.5px; 
    width: calc(100% + 40px); 
    margin: 2.8rem 0 0.9rem; 
    margin-left: -20px;
    margin-right: -20px;
    background: linear-gradient(90deg, #2563EB 0%, #3b82f6 100%); 
    opacity: 0.95; 
    border-radius: 1px; 
  }

  /* شريط المعلومات */
  .card .content .service-info-bar {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border: 1px solid #cbd5e0;
    border-radius: 12px;
    padding: 12px;
    padding-top: 22px; /* زيادة إضافية لحماية الدوائر من ملامسة حد المربع العلوي */
    margin-bottom: 0.9rem;
    margin-left: -20px;
    margin-right: -20px;
    width: calc(100% + 40px);
    font-family: 'Tajawal', 'IBM Plex Sans Arabic', 'Cairo', sans-serif;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  }

  .card .content .service-info-bar .service-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .card .content .service-info-bar .service-level, .card .content .service-info-bar .service-duration { display: flex; align-items: center; gap: 4px; }
  .card .content .service-info-bar .level-icon, .card .content .service-info-bar .duration-icon { font-size: 14px; }
  .card .content .service-info-bar .level-text { color: #1f2937; font-weight: 800; font-size: 0.76rem; }
  .card .content .service-info-bar .duration-text { color: #374151; font-weight: 700; font-size: 0.7rem; }

  .card .content .service-info-bar .progress-container { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
  .card .content .service-info-bar .progress-bar { flex: 1; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden; }
  .card .content .service-info-bar .progress-fill { height: 100%; background: linear-gradient(90deg, #22c55e 0%, #16a34a 50%, #22c55e 100%); border-radius: 3px; transition: width 0.5s ease; }
  .card .content .service-info-bar .progress-percentage { color: #16a34a; font-weight: 800; font-size: 0.7rem; min-width: 30px; text-align: right; }

  .card .content .service-info-bar .service-stats { display: flex; justify-content: space-between; gap: 8px; }
  .card .content .service-info-bar .stat-item { display: flex; align-items: center; gap: 3px; flex: 1; }
  .card .content .service-info-bar .stat-icon { font-size: 12px; }
  .card .content .service-info-bar .stat-text { color: #374151; font-weight: 700; font-size: 0.65rem; line-height: 1.2; }

  .card .content .service-info-bar .service-features { display: flex; justify-content: space-between; gap: 6px; margin-top: 8px; padding-top: 8px; border-top: 1px solid #e2e8f0; }
  .card .content .service-info-bar .feature-item { display: flex; flex-direction: column; align-items: center; gap: 2px; flex: 1; padding: 6px; border-radius: 8px; transition: transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease; border: none; box-shadow: none; background: transparent; }
  .card .content .service-info-bar .feature-item:hover { background: transparent; transform: translateY(-1px); box-shadow: none; }
  .card .content .service-info-bar .feature-item:active { transform: translateY(0); }
  .card .content .service-info-bar .feature-item:focus-visible { outline: 0; background: transparent; }
  .card .content .service-info-bar .feature-icon { width: 16px; height: 16px; color: #2563EB; flex-shrink: 0; }
  /* إزالة أي حدود/إطارات حول الأيقونة والنص داخل الشبكة */
  .card .content .service-info-bar .feature-item, 
  .card .content .service-info-bar .feature-item * {
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
    background: transparent !important;
  }
  .card .content .service-info-bar .feature-text { font-family: 'Tajawal', 'IBM Plex Sans Arabic', 'Cairo', sans-serif; font-weight: 700; font-size: 0.62rem; color: #1f2937; line-height: 1.2; text-align: center; }

  .card .content .service-info-bar:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12); }

  /* شريط الثقة */
  /* حركة دخول متدرجة لشريط الثقة (staggered entrance) */
  @keyframes trust-stagger-up {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  /* الحالة الابتدائية قبل الحركة */
  .card .content .trust-bar .trust-item .trust-icon,
  .card .content .trust-bar .trust-item .trust-label {
    opacity: 0;
    transform: translateY(8px);
    will-change: transform, opacity;
  }
  /* التدرّج الزمني لكل عنصر (أيقونة ثم النص) */
  .card .content .trust-bar .trust-item:nth-child(1) .trust-icon { animation: trust-stagger-up 420ms ease-out forwards; animation-delay: 60ms; }
  .card .content .trust-bar .trust-item:nth-child(1) .trust-label { animation: trust-stagger-up 420ms ease-out forwards; animation-delay: 120ms; }
  .card .content .trust-bar .trust-item:nth-child(2) .trust-icon { animation: trust-stagger-up 420ms ease-out forwards; animation-delay: 180ms; }
  .card .content .trust-bar .trust-item:nth-child(2) .trust-label { animation: trust-stagger-up 420ms ease-out forwards; animation-delay: 240ms; }
  .card .content .trust-bar .trust-item:nth-child(3) .trust-icon { animation: trust-stagger-up 420ms ease-out forwards; animation-delay: 300ms; }
  .card .content .trust-bar .trust-item:nth-child(3) .trust-label { animation: trust-stagger-up 420ms ease-out forwards; animation-delay: 360ms; }
  .card .content .trust-bar .trust-item:nth-child(4) .trust-icon { animation: trust-stagger-up 420ms ease-out forwards; animation-delay: 420ms; }
  .card .content .trust-bar .trust-item:nth-child(4) .trust-label { animation: trust-stagger-up 420ms ease-out forwards; animation-delay: 480ms; }

  .card .content .trust-bar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; align-items: center; padding: 0.1rem 0; margin: 0; font-family: 'Tajawal', 'IBM Plex Sans Arabic', 'Cairo', sans-serif; background: none; border: none; box-shadow: none; }
  .card .content .trust-bar .trust-item { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; padding: 5px 3px; border-radius: 10px; min-height: 40px; }
  .card .content .trust-bar .trust-item:focus-visible { outline: 2px solid #2563EB; outline-offset: 2px; }
  .card .content .trust-bar .trust-icon { font-size: 0.9rem; line-height: 1; transition: all 0.22s ease; }
  .card .content .trust-bar .trust-label { font-weight: 800; font-size: 0.58rem; color: #1f2937; letter-spacing: 0.01em; }

  /* شارة ثلاثية الأبعاد لعنصر ثقة */
  .card .content .trust-bar .trust-item[aria-label="ثقة"] .trust-icon-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px; height: 28px; border-radius: 999px;
    background: radial-gradient(140% 140% at 30% 15%, rgba(255,255,255,0.85), rgba(255,255,255,0) 35%),
                linear-gradient(135deg, #60A5FA 0%, #3B82F6 45%, #2563EB 100%);
    box-shadow:
      inset 0 1px 1px rgba(255,255,255,0.7),
      inset 0 -3px 6px rgba(0,0,0,0.18),
      0 6px 14px rgba(37,99,235,0.15),
      0 3px 6px rgba(37,99,235,0.12);
  }
  .card .content .trust-bar .trust-item[aria-label="ثقة"] .trust-icon--invert {
    color: #ffffff; /* أيقونة بيضاء فوق الشارة */
    width: 19px; height: 19px;
    stroke-width: 2.2px;
  }
  /* حلقة محيطية رفيعة */
  .card .content .trust-bar .trust-item[aria-label="ثقة"] .trust-icon-wrap::after {
    content: '';
    position: absolute; inset: 0; border-radius: inherit;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.18), inset 0 0 0 1px rgba(0,0,0,0.06);
    pointer-events: none;
  }

  /* نُخفّف توهج الهالة/النبض حول عنصر ثقة حتى لا يتعارض مع 3D */
  .card .content .trust-bar .trust-item[aria-label="ثقة"] .trust-icon { filter: drop-shadow(0 0 4px rgba(59,130,246,0.28)); }
  .card .content .trust-bar .trust-item[aria-label="ثقة"] .trust-icon::after { opacity: 0.22; filter: blur(5px); }

  /* هالة توهّج ناعمة حول الأيقونة (بدون خلفية للعنصر) */
  .card .content .trust-bar .trust-item { background: none; }
  .card .content .trust-bar .trust-icon { position: relative; z-index: 1; }
  .card .content .trust-bar .trust-icon::after { content: ''; position: absolute; inset: -8px; border-radius: 50%; opacity: 0.3; filter: blur(6px); z-index: -1; transition: opacity 160ms ease, filter 160ms ease, transform 160ms ease; }

  /* ألوان الهالة حسب الدلالة */
  .card .content .trust-bar .trust-item[aria-label="أمان"] .trust-icon { filter: drop-shadow(0 0 6px rgba(16,185,129,0.35)); }
  .card .content .trust-bar .trust-item[aria-label="أمان"] .trust-icon::after { background: radial-gradient(40% 40% at 50% 50%, rgba(16,185,129,0.55), rgba(16,185,129,0)); }

  .card .content .trust-bar .trust-item[aria-label="سرعة"] .trust-icon { filter: drop-shadow(0 0 6px rgba(245,158,11,0.35)); }
  .card .content .trust-bar .trust-item[aria-label="سرعة"] .trust-icon::after { background: radial-gradient(40% 40% at 50% 50%, rgba(245,158,11,0.55), rgba(245,158,11,0)); }

  .card .content .trust-bar .trust-item[aria-label="ثقة"] .trust-icon { filter: drop-shadow(0 0 6px rgba(59,130,246,0.35)); }
  .card .content .trust-bar .trust-item[aria-label="ثقة"] .trust-icon::after { background: radial-gradient(40% 40% at 50% 50%, rgba(59,130,246,0.55), rgba(59,130,246,0)); }

  .card .content .trust-bar .trust-item[aria-label="جودة"] .trust-icon { filter: drop-shadow(0 0 6px rgba(168,85,247,0.35)); }
  .card .content .trust-bar .trust-item[aria-label="جودة"] .trust-icon::after { background: radial-gradient(40% 40% at 50% 50%, rgba(168,85,247,0.55), rgba(168,85,247,0)); }

  /* تكبير وتوهّج أقوى عند التحويم/التركيز */
  .card .content .trust-bar .trust-item:hover .trust-icon,
  .card .content .trust-bar .trust-item:focus-visible .trust-icon { transform: translateY(-1px) scale(1.06); }
  .card .content .trust-bar .trust-item:hover .trust-icon::after,
  .card .content .trust-bar .trust-item:focus-visible .trust-icon::after { opacity: 0.5; filter: blur(7px); }

  /* حركة دخول متدرجة لشريط الثقة (staggered entrance) */
  @keyframes trust-stagger-up { from { opacity: 0; transform: translateY(8px);} to { opacity: 1; transform: translateY(0);} }
  /* الحالة الابتدائية قبل الحركة */
  .card .content .trust-bar .trust-item .trust-icon,
  .card .content .trust-bar .trust-item .trust-label { opacity: 0; transform: translateY(8px); will-change: transform, opacity; }
  /* التدرّج الزمني لكل عنصر (أيقونة ثم النص) */
  .card .content .trust-bar .trust-item:nth-child(1) .trust-icon { animation: trust-stagger-up 420ms ease-out forwards; animation-delay: 60ms; }
  .card .content .trust-bar .trust-item:nth-child(1) .trust-label { animation: trust-stagger-up 420ms ease-out forwards; animation-delay: 120ms; }
  .card .content .trust-bar .trust-item:nth-child(2) .trust-icon { animation: trust-stagger-up 420ms ease-out forwards; animation-delay: 180ms; }
  .card .content .trust-bar .trust-item:nth-child(2) .trust-label { animation: trust-stagger-up 420ms ease-out forwards; animation-delay: 240ms; }
  .card .content .trust-bar .trust-item:nth-child(3) .trust-icon { animation: trust-stagger-up 420ms ease-out forwards; animation-delay: 300ms; }
  .card .content .trust-bar .trust-item:nth-child(3) .trust-label { animation: trust-stagger-up 420ms ease-out forwards; animation-delay: 360ms; }
  .card .content .trust-bar .trust-item:nth-child(4) .trust-icon { animation: trust-stagger-up 420ms ease-out forwards; animation-delay: 420ms; }
  .card .content .trust-bar .trust-item:nth-child(4) .trust-label { animation: trust-stagger-up 420ms ease-out forwards; animation-delay: 480ms; }

  /* انيميشن النقاط الجذابة */
  @keyframes circle-bounce { 0% { transform: scale(1); } 50% { transform: scale(1.3); } 100% { transform: scale(1); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  /* تحسينات شاشة صغيرة جداً */

/* عناصر الشبكة النظيفة بدون أطر */
.glass-tile-clean, .glass-tile-clean * {
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
  background: transparent !important;
}


/* إزالة أي إطار حول عناصر الشبكة داخل القسم الفخم */
.glass-tile, .glass-tile * {
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
}

  @media (max-width: 390px) {
    .card .content .service-info-bar {
      margin-left: -14px;
      margin-right: -14px;
      width: calc(100% + 28px);
    }
    .card .image-container { height: 136px; }
  }
`;

export default ProductCard;