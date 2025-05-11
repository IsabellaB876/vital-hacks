import { Button, Card } from "react-bootstrap";
import icon from "../assets/UploadIcon.svg";

// Define the type of props
interface FileCardProps {
  hasFile: boolean;
  title: string;
  date: string;
  description: string;
}

function FileCard({ hasFile, title, date, description }: FileCardProps) {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Img variant="top" src={hasFile ? "" : icon} alt="Uploaded file" />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>
          {date} <br />
          {description}
        </Card.Text>
        {hasFile ? <Button variant="primary">View File</Button> : <></>}
      </Card.Body>
    </Card>
  );
}

export default FileCard;
