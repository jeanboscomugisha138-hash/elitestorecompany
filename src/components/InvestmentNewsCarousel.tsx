import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';
import news1 from '@/assets/news-1.png';
import news2 from '@/assets/news-2.png';
import news3 from '@/assets/news-3.png';
import news4 from '@/assets/news-4.png';
import news5 from '@/assets/news-5.png';

const slides = [news1, news2, news3, news4, news5];

export function InvestmentNewsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center', dragFree: false },
    [Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: false }), Fade()]
  );
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSel = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSel);
    onSel();
  }, [emblaApi]);

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-card mb-5 animate-fade-in">
      <div className="overflow-hidden aspect-[16/10]" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((src, i) => (
            <div key={i} className="relative flex-[0_0_100%] min-w-0 h-full">
              <img
                src={src}
                alt={`Investment news ${i + 1}`}
                loading={i === 0 ? 'eager' : 'lazy'}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* dots */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-2 rounded-full transition-all ${
              selected === i ? 'w-6 bg-primary-foreground' : 'w-2 bg-primary-foreground/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
