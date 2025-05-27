import { useState, useEffect } from "react";
import { Carousel, Stack, Container } from "react-bootstrap";
import FileCard from "./FileCard";
import { getUserFiles } from "../Service";
import { useSidebar } from "../context/appContext";

// Define the type of props
interface CustomCarouselProps {
  text: string;
  bgColor: string;
}

function FileCarousel({ text }: CustomCarouselProps) {
  const { user } = useSidebar();

  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    try {
      async function loadFiles() {
        const filesData = user.files;
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
    <Stack gap={3} className="filecarousel m-1">
      <h2>{text}</h2>
      <div className="d-flex overflow-auto flex-nowrap" style={{ gap: "1rem" }}>
        {filteredFiles.map((file) => (
          <FileCard
            hasFile={file.isRequested}
            name={file.name}
            date={file.date}
            type={file.type}
            requestedBy={file.requestedBy}
          />
        ))}
      </div>
    </Stack>
  );
}

export default FileCarousel;
