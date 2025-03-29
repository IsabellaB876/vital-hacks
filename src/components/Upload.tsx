import { Button, Stack, Toast, Dropdown } from "react-bootstrap";

function UploadScreen({ toggleDisplay }: { toggleDisplay: any }) {
  return (
    <Toast onClose={toggleDisplay}>
      <Toast.Header>
        <strong className="me-auto">Upload File</strong>
      </Toast.Header>
      <Toast.Body>
        <Stack gap={5} direction="horizontal">
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic">
              Requested Files
            </Dropdown.Toggle>

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
        </Stack>
      </Toast.Body>
    </Toast>
  );
}

export default UploadScreen;
