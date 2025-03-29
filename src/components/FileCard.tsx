import { Button, Card } from "react-bootstrap";
import icon from "../assets/UploadIcon.svg"

// Define the type of props
interface FileCardProps {
  hasFile: boolean;
}

function FileCard({ hasFile }: FileCardProps) {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Img variant="top" src={icon} alt="Uploaded file" />
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        <Card.Text>
          Doctor's Name <br />
          Due Date <br />
          The files description. lorem ipsum dolor.
        </Card.Text>
        {hasFile ? <Button variant="primary">View File</Button> : <></>}
      </Card.Body>
    </Card>
  );
}

export default FileCard;
