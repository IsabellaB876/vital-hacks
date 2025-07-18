import React, { useState } from "react";
import Toast from "react-bootstrap/Toast";
import { Button, Form } from "react-bootstrap";
import { UserData } from "../interfaces/UserData";
import { useSidebar } from "../context/appContext";
// import { FileData } from "../interfaces/FileData";

interface RequestScreenProps {
  toggleDisplay: () => void;
  onSubmit?: (
    documentType: string,
    isValid: boolean,
    validationMessage?: string
  ) => void;
}

function RequestScreen({ toggleDisplay, onSubmit }: RequestScreenProps) {
  const [selectedDocType, setSelectedDocType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const [customDocType, setCustomDocType] = useState<string>("");
  const { user } = useSidebar();
  const [selectedPatient] = useState<UserData | null>(null);;
  const PatientList = user.users;

  // define document list
  const medDocList = [
    { Id: "Doc1", Doc: "HIPAA" },
    { Id: "Doc2", Doc: "TB Test" },
    { Id: "Doc3", Doc: "Blood Test" },
    { Id: "Doc4", Doc: "Insulin Prescription" },
    { Id: "Doc5", Doc: "Health Care Proxy" },
    { Id: "Doc6", Doc: "Medical History" },
  ];

  // Handle document type selection
  const handleDocTypeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value) {
      setSelectedDocType(value);
      // Clear custom input when selecting from dropdown
      setCustomDocType("");
    }
  };

  // Handle custom document type input
  const handleCustomDocType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomDocType(event.target.value);
  };

  // const handleSelectPatient = (event: React)

  // Handle form submission
  const handleSubmit = async () => {
    // Call the onSubmit callback with current selection
    if (onSubmit) {
      // If there's a custom document type, use that instead of the dropdown selection
      const finalDocType = customDocType.trim()
        ? customDocType
        : selectedDocType;
      onSubmit(finalDocType, true, "Selection submitted successfully");
    }
  };

  return (
    <Toast onClose={toggleDisplay} show={true}>
      <Toast.Header>
        <strong className="me-auto">Select Documents to Request</strong>
      </Toast.Header>
      <Toast.Body>
        <div className="mb-3">
          <Form.Group className="mb-3">
            <Form.Label>Select from predefined documents</Form.Label>
            <Form.Select
              aria-label="Select document type"
              value={selectedDocType}
              onChange={handleDocTypeSelect}
            >
              <option value="">Select a document</option>
              {medDocList.map((doc) => (
                <option key={doc.Id} value={doc.Doc}>
                  {doc.Doc}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Or enter a custom document type</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter custom document type here"
              value={customDocType}
              onChange={handleCustomDocType}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>{selectedPatient ? selectedPatient.firstName : 'Select a Patient'}</Form.Label>
            <Form.Select
              aria-label="Select a Patient"
            >
              <option value="">Select a Patient</option>
              {PatientList.map((p) => (
                <option>
                  {p}
                </option>
              ))}
            </Form.Select>
          </Form.Group>


          <Form.Group className="mb-3">
            <Form.Label>Enter a Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter a description of the document"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Enter Due Date</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Form.Group>


          <div className="d-flex justify-content-end">
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </div>
      </Toast.Body>
    </Toast>
  );
}

export default RequestScreen;
