import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"

import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { SparklesIcon, HeartPulse } from "lucide-react"
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules"

import { Badge } from "./badge"

export interface HealthTipItem {
  id: string;
  icon: string;
  category: string;
  title: string;
  text: string;
  color: string;
}

interface CardCarouselProps {
  tips: HealthTipItem[];
  autoplayDelay?: number;
  showPagination?: boolean;
  showNavigation?: boolean;
}

export const CardCarousel: React.FC<CardCarouselProps> = ({
  tips,
  autoplayDelay = 3500,
  showPagination = true,
  showNavigation = true,
}) => {
  const customCss = `
  .health-swiper {
    width: 100%;
    padding-top: 10px;
    padding-bottom: 45px;
  }
  
  .health-swiper .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 320px;
    height: 220px;
  }
  
  .health-swiper .swiper-3d .swiper-slide-shadow-left,
  .health-swiper .swiper-3d .swiper-slide-shadow-right {
    background-image: none;
    background: none;
  }

  .health-swiper .swiper-pagination-bullet {
    background: rgba(255, 255, 255, 0.4);
    opacity: 1;
  }

  .health-swiper .swiper-pagination-bullet-active {
    background: #06b6d4 !important;
    width: 20px;
    border-radius: 9999px;
  }
  `;

  return (
    <section className="w-full space-y-4">
      <style>{customCss}</style>
      <div className="mx-auto w-full rounded-[24px] border border-cyan-500/20 bg-[#111927] p-3 md:p-5 shadow-2xl">
        <div className="relative mx-auto flex w-full flex-col rounded-[20px] border border-slate-800 bg-slate-900/60 p-4 md:items-start md:gap-4 md:p-6">
          
          <Badge
            variant="outline"
            className="rounded-[14px] border border-cyan-500/30 bg-cyan-950/80 text-cyan-300 text-xs py-1 px-3 flex items-center gap-1.5"
          >
            <SparklesIcon className="w-3.5 h-3.5 fill-cyan-400 stroke-1 text-cyan-950" />
            Daily AI Wellness Guide
          </Badge>

          <div className="flex flex-col justify-center pt-2 md:items-start">
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <HeartPulse className="w-6 h-6 text-cyan-400" /> Daily Health Tips
            </h3>
          </div>

          <div className="flex w-full items-center justify-center pt-2">
            <div className="w-full">
              <Swiper
                className="health-swiper"
                spaceBetween={30}
                autoplay={{
                  delay: autoplayDelay,
                  disableOnInteraction: false,
                }}
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                slidesPerView={"auto"}
                coverflowEffect={{
                  rotate: 0,
                  stretch: 0,
                  depth: 120,
                  modifier: 2.5,
                }}
                pagination={showPagination ? { clickable: true } : false}
                navigation={showNavigation}
                modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
              >
                {tips.map((tip) => (
                  <SwiperSlide key={tip.id}>
                    <div className={`h-full w-full rounded-2xl p-5 bg-gradient-to-br ${tip.color} text-white shadow-xl border border-white/20 flex flex-col justify-between select-none hover:scale-105 transition-transform duration-300`}>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                            {tip.category}
                          </span>
                          <span className="text-3xl">{tip.icon}</span>
                        </div>
                        <h4 className="text-lg font-black mt-3 text-white drop-shadow-sm">{tip.title}</h4>
                        <p className="text-xs mt-1.5 opacity-95 leading-relaxed font-medium">{tip.text}</p>
                      </div>

                      <div className="pt-2 text-[10px] font-bold text-white/80 border-t border-white/20 flex items-center justify-between">
                        <span>Swasthya Setu Care</span>
                        <span>Daily Tip • Verified</span>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
