import { useState } from "react";
import { Carousel, Stack, Container } from "react-bootstrap";
import FileCard from "./FileCard";

// Define the type of props
interface CustomCarouselProps {
  text: string;
  bgColor: string;
}//fetch api here

async function FileCarousel({ text, bgColor }: CustomCarouselProps) {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };
  const fileArray = await fetch('http://localhost:3000/api/getPDF', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'username': `placeholder`
    }
  })


  return (
    <Stack
      gap={3}
      style={{ backgroundColor: bgColor }}
      className="filecarousel"
    >
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
          <Stack direction="horizontal" gap={3}>
            <FileCard hasFile={text === "Requested Documents" ? false : true} />
            <FileCard hasFile={text === "Requested Documents" ? false : true} />
            <FileCard hasFile={text === "Requested Documents" ? false : true} />
          </Stack>
        </Carousel.Item>
        <Carousel.Item>
          <Stack direction="horizontal" gap={3}>
            <FileCard hasFile={text === "Requested Documents" ? false : true} />
            <FileCard hasFile={text === "Requested Documents" ? false : true} />
            <FileCard hasFile={text === "Requested Documents" ? false : true} />
          </Stack>
        </Carousel.Item>
        <Carousel.Item>
          <Stack direction="horizontal" gap={3}>
            <FileCard hasFile={text === "Requested Documents" ? false : true} />
            <FileCard hasFile={text === "Requested Documents" ? false : true} />
            <FileCard hasFile={text === "Requested Documents" ? false : true} />
          </Stack>
        </Carousel.Item>
      </Carousel>
      {}
    </Stack>
  );
}

export default FileCarousel;
