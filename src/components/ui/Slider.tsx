import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
  type CarouselOptions,
} from "~/shadcn/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

type Props = {
  data: Record<string, unknown>[];
  key: string;
  render: (item: unknown) => ReactNode;
  showDots?: boolean;
  carouselOpts?: Partial<CarouselOptions>;
  autoplay?: boolean;
  ciClassName?: string;
  ccClassName?: string;
};

export default function Slider({ showDots = true, ...props }: Props) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const plugin = useRef(
    Autoplay({
      delay: 5000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      active: props.autoplay,
    }),
  );

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative">
      <Carousel
        setApi={setApi}
        opts={{ loop: props.autoplay, ...props.carouselOpts }}
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className={props.ccClassName}>
          {props.data.map((item) => {
            return (
              <CarouselItem
                key={item[props.key] as string}
                className={props.ciClassName}
              >
                {props.render(item)}
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* Dot Indicators */}
      {showDots && (
        <div className="absolute bottom-[6vh] left-1/2 -translate-x-1/2 py-2 flex justify-center gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                index === current ? "bg-primary" : "bg-grey hover:bg-grey/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
