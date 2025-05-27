import { Card, Stack, Image, Badge } from "react-bootstrap";
import icon from "../assets/BlueUploadIcon.svg";
import Account from "../assets/Account.svg";

interface FileCardProps {
  hasFile: boolean;
  name: string;
  date: string;
  type: string;
  requestedBy: string;
}

function FileCard({ hasFile, name, date, type, requestedBy }: FileCardProps) {
  const dayDifference = (date1: Date, date2: Date) => {
    const diffInMs = date2.getTime() - date1.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    return Math.floor(diffInDays);
  };

  const dueInDays = dayDifference(new Date(), new Date(date));

  const badgeColor =
    dueInDays < 1 ? "danger" : dueInDays < 5 ? "warning" : "primary";

  return (
    <div
      style={{ width: "fit-content", maxWidth: "400px", borderRadius: "15px" }}
      className="fileCard form-control shadow m-2 mb-4"
    >
      <div
        style={{ maxWidth: "400px", display: "flex", flexDirection: "row" }}
        className="p-2"
      >
        <div className="me-4">
          <Badge bg={badgeColor}>Due in {dueInDays} days</Badge>
          <h2>{name}</h2>
          <h3>{type}</h3>
          <Stack direction="horizontal" gap={2}>
            <Image src={Account} alt="profile pic" />
            <h3>{requestedBy}</h3>
          </Stack>
        </div>
        <Stack
          className="blue-upload"
          style={{ width: "140px", height: "140px", borderRadius: "15px" }}
        >
          <Image
            className="mx-auto"
            style={{ width: "50px" }}
            src={hasFile ? icon : ""}
            alt="Uploaded file"
          />
          <h3>Choose a file or drag here</h3>
        </Stack>
      </div>
    </div>
  );
}

export default FileCard;
