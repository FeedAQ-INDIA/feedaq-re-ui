import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

function ImageCarousel({ imageList, style, width, height, customClass }) {
  return (
    <div className=" ">
      {imageList ? (
        <Carousel>
          <CarouselContent>
            {imageList.map((item, index) => {
              return (
                <CarouselItem>
                  <Image
                    src={item}
                    alt="Picture of the author"
                    sizes="100vw"
                    style={style}
                    width={width}
                    height={height}
                    className={customClass}

                  />
                </CarouselItem>
              );
            })}
          </CarouselContent>

          <CarouselPrevious className="absolute left-[1rem] top-1/2 transform -translate-y-1/2 z-10" />
          <CarouselNext className="absolute right-[1rem] top-1/2 transform -translate-y-1/2 z-10" />
        </Carousel>
      ) : (
        <div className="w-full h-[200px] bg-slate-200 animate-pulse rounded-lg"></div>
      )}
    </div>
  );
}

export default ImageCarousel;
