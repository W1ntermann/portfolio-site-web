"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import ProjectCard from "../sub/ProjectCard";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Projects = () => {
    const swiperRef = useRef<SwiperType | null>(null);

    const projects = [
        {
            src: "/metalmaster.jpg",
            title: "Armada Industries Website",
            description: "Corporate website for an industrial brand with a strong visual identity, clear service structure, and a conversion-focused layout."
        },
        {
            src: "/lemoners.jpg",
            title: "Startup Website",
            description: "Modern startup landing page designed to present the product clearly, build trust fast, and guide visitors toward sign-up or contact."
        },
        {
            src: "/insurance.jpg",
            title: "Landing Page",
            description: "Clean promotional page for an insurance service with structured content blocks, strong calls to action, and an easy-to-scan interface."
        },
        
        {
            src: "/digital-psychplogy.jpg",
            title: "Landing Page",
            description: "A thoughtful landing page for a digital psychology product, focused on clarity, calm visuals, and approachable user experience."
        },
        {
            src: "/cottage-airy.jpg",
            title: "Cottage Rental Website",
            description: "Booking-oriented website for a cottage rental business featuring inviting presentation, property highlights, and a relaxed travel aesthetic."
        },
        {
            src: "/shanti-site.jpg",
            title: "Fintech Website",
            description: "Fintech product website built to communicate reliability, simplify complex information, and support confident decision-making."
        },
    ];

    return (
        <div
            className="flex flex-col items-center justify-center py-20 relative"
            id="projects"
        >
            <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-20">
                My Projects
            </h1>
            
            <div className="w-full max-w-6xl px-4 relative">
                {/* Custom Navigation Buttons */}
                <button 
                    onClick={() => swiperRef.current?.slidePrev()}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-purple-500/20 hover:bg-purple-500/40 text-white p-3 rounded-full transition-all duration-300 hidden md:block"
                    aria-label="Previous slide"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>

                <button 
                    onClick={() => swiperRef.current?.slideNext()}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-purple-500/20 hover:bg-purple-500/40 text-white p-3 rounded-full transition-all duration-300 hidden md:block"
                    aria-label="Next slide"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>

                <Swiper
                    onSwiper={(swiper: SwiperType) => {
                        swiperRef.current = swiper;
                    }}
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    breakpoints={{
                        640: {
                            slidesPerView: 1,
                            spaceBetween: 20,
                        },
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 30,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 30,
                        },
                    }}
                    pagination={{ 
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    className="mySwiper"
                >
                    {projects.map((project, index) => (
                        <SwiperSlide key={index}>
                            <ProjectCard
                                src={project.src}
                                title={project.title}
                                description={project.description}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Custom styles for pagination bullets */}
            <style>{`
                .swiper-pagination-bullet {
                    background: rgba(168, 85, 247, 0.5) !important;
                    width: 10px !important;
                    height: 10px !important;
                    transition: all 0.3s !important;
                }
                .swiper-pagination-bullet-active {
                    background: rgb(168, 85, 247) !important;
                    width: 30px !important;
                    border-radius: 5px !important;
                }
                .swiper-pagination {
                    position: relative !important;
                    margin-top: 40px !important;
                }
            `}</style>
        </div>
    );
};

export default Projects;