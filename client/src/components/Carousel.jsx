import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    url: "https://img.freepik.com/premium-photo/world-saree-day-copy-space-background_548646-56427.jpg?w=1380",
  },
  {
    id: 2,
    url: "https://www.chinayabanaras.com/cdn/shop/articles/Blog_Banner_-260923-_Festive_wear_sarees_by_Chinaya_Banaras.jpg?v=1695712882",
  },
  {
    id: 3,
    url: "https://byshree.com/cdn/shop/articles/Banner-1.jpg?v=1667985708&width=2048",
  },
];

const Carousel = () => {
  const [index, setIndex] = useState(0);


  useEffect(() => {
    const t = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-2xl ">
      {/* Slides */}
      {slides.map((s, i) => (
        <img
          key={s.id}
          src={s.url}
          alt="carousel"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Overlay text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute bottom-10 left-10 text-white">
        <h2 className="text-3xl font-extrabold">
          Where tradition meets modern grace India
        </h2>
      </div>

      {/* Prev Button */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/70 transition"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/70 transition"
      >
        <ChevronRight size={28} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 w-full flex justify-center space-x-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full ${
              index === i ? "bg-orange-500" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
