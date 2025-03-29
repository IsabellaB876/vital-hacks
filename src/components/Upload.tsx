import Toast from "react-bootstrap/Toast";
import Dropdown from "react-bootstrap/Dropdown";
import { Button } from "react-bootstrap";

function UploadScreen() {
  return (
    <Toast style={{ width: "2500vw", padding: "20px" }}>
      <Toast.Header>
        <strong className="me-auto">Upload File</strong>
      </Toast.Header>
      <Toast.Body>
        <Dropdown>
          <Dropdown.Toggle id="dropdown-basic">Requested Files</Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item>Action</Dropdown.Item>
            <Dropdown.Item>Action</Dropdown.Item>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Button> Submit </Button>

        <div
          className="file-upload-container"
          style={{ marginTop: "20px", textAlign: "right" }}
        >
          <label htmlFor="file-upload">Upload PDF:</label>
          <input
            type="file"
            id="file-upload"
            accept="application/pdf"
            title="Click to upload a PDF file"
          />
        </div>
      </Toast.Body>
    </Toast>
  );
}

export default UploadScreen;
