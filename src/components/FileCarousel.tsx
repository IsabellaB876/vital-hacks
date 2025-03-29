import { useState } from "react";
import { Carousel, Stack } from "react-bootstrap";
import FileCard from "./FileCard";

function FileCarousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect} data-bs-theme="dark">
      <Carousel.Item>
        <Stack direction="horizontal" gap={3}>
          <FileCard />
          <FileCard />
          <FileCard />
        </Stack>
      </Carousel.Item>
      <Carousel.Item>
        <Stack direction="horizontal" gap={3}>
          <FileCard />
          <FileCard />
          <FileCard />
        </Stack>
      </Carousel.Item>
      <Carousel.Item>
        <Stack direction="horizontal" gap={3}>
          <FileCard />
          <FileCard />
          <FileCard />
        </Stack>
      </Carousel.Item>
    </Carousel>
  );
}

export default FileCarousel;
