import React, { useState } from "react";
import Toast from "react-bootstrap/Toast";
import Dropdown from "react-bootstrap/Dropdown";
import { Button } from "react-bootstrap";
import { MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';

interface RequestScreenProps {
  toggleDisplay: () => void;
  onSubmit?: (
    documentType: string,
    isValid: boolean,
    validationMessage?: string
  ) => void;
}

// creating dropdown with write-in option
const CustomTag = () => {
  // define JSON of data
  const medDocList: { [key: string]: Object } [] = [
    { Id: 'Doc1', Doc: 'HIPAA' },
    { Id: 'Doc2', Doc: 'TB Test' },
    { Id: 'Doc3', Doc: 'Blood Test' },
    { Id: 'Doc4', Doc: 'Insulin Prescription' },
    { Id: 'Doc5', Doc: 'Health Care Proxy' },
    { Id: 'Doc6', Doc: 'Medical History' }
  ];
  const fields: object = { text: "Doc", value: "Id" };
}

type DocumentType = "Health Care Proxy" | "HIPAA" | "Medical History";

function RequestScreen({ toggleDisplay, onSubmit }: RequestScreenProps) {
  const [selectedDocType, setSelectedDocType] =
    useState<DocumentType>("Health Care Proxy");

  // Handle document type selection
  const handleDocTypeSelect = (eventKey: string | null) => {
    if (eventKey) {
      setSelectedDocType(eventKey as DocumentType);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Call the onSubmit callback with current selection
    if (onSubmit) {
      onSubmit(selectedDocType, true, "Selection submitted successfully");
    }
  };

  return (
    <Toast onClose={toggleDisplay} show={true}>
      <Toast.Header>
        <strong className="me-auto">Select Documents to Request</strong>
      </Toast.Header>
      <Toast.Body>
        <div className="d-flex justify-content-between mb-3">
          <Dropdown onSelect={handleDocTypeSelect}>
            <Dropdown.Toggle id="dropdown-basic">
              {selectedDocType}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="Health Care Proxy">
                Health Care Proxy
              </Dropdown.Item>
              <Dropdown.Item eventKey="HIPAA">HIPAA</Dropdown.Item>
              <Dropdown.Item eventKey="Medical History">
                Medical History
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Button onClick={handleSubmit}>
            Submit
          </Button>
        </div>


      </Toast.Body>
    </Toast>
  );
}

export default RequestScreen;