import { useState, useEffect } from "react";
import { Carousel, Stack, Container } from "react-bootstrap";
import FileCard from "./FileCard";
import { getUserFiles } from "../Service";

interface File {
  name: string;
  file: string;
  description: string;
  date: string;
  type: string;
  isRequested: boolean;
  id: string;
  requestedFor: string;
  requestBy: string;
}

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

  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    try {
      async function loadFiles() {
        const username = "jimbob";
        const filesData = await getUserFiles(username);
        console.log(filesData);
        setFiles(filesData);
        console.log("FILTERED FILES:", filteredFiles);
      }
      loadFiles();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const filteredFiles =
    text === "Requested Documents"
      ? files.filter((file) => file.isRequested)
      : files.filter((file) => file.type === text);

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
        {filteredFiles.map((file) => (
          <Carousel.Item key={file.unique_id}>
            <FileCard
              hasFile={file.isRequested}
              title={file.file_name}
              date={file.date}
              description={file.description}
            />
          </Carousel.Item>
        ))}
      </Carousel>
      {}
    </Stack>
  );
}

export default FileCarousel;
