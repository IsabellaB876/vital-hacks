import { useState } from "react";
import { Carousel, Stack, Container } from "react-bootstrap";
import FileCard from "./FileCard";

// Define the type of props
interface CustomCarouselProps {
  text: string;
  bgColor: string;
}

function FileCarousel({ text, bgColor }: CustomCarouselProps) {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  return (
    <Stack gap={3} style={{ backgroundColor: bgColor }}>
      <h3>{text}</h3>
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        data-bs-theme="dark"
        interval={null}
        controls={true}
        indicators={true}
      >
        <Carousel.Item>
          <Stack
            className="carousel-inner col-10 mx-auto"
            direction="horizontal"
            gap={3}
          >
            <FileCard />
            <FileCard />
            <FileCard />
          </Stack>
        </Carousel.Item>
        <Carousel.Item>
          <Stack
            className="carousel-inner col-10 mx-auto"
            direction="horizontal"
            gap={3}
          >
            <FileCard />
            <FileCard />
            <FileCard />
          </Stack>
        </Carousel.Item>
        <Carousel.Item>
          <Stack
            className="carousel-inner col-10 mx-auto"
            direction="horizontal"
            gap={3}
          >
            <FileCard />
            <FileCard />
            <FileCard />
          </Stack>
        </Carousel.Item>
      </Carousel>
    </Stack>
  );
}

export default FileCarousel;
