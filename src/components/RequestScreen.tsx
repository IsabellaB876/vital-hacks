import React, { useState } from "react";
import Toast from "react-bootstrap/Toast";
import Dropdown from "react-bootstrap/Dropdown";
import { Button, Alert, Spinner } from "react-bootstrap";

interface RequestScreenProps {
  toggleDisplay: () => void;
  onSubmit?: (
    documentType: string,
    isValid: boolean,
    validationMessage?: string
  ) => void;
}

type DocumentType = "Health Care Proxy" | "HIPAA" | "Medical History";

function RequestScreen({ toggleDisplay, onSubmit }: RequestScreenProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [selectedDocType, setSelectedDocType] =
    useState<DocumentType>("Health Care Proxy");
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    missingFields: string[];
  } | null>(null);

  // Handle document type selection
  const handleDocTypeSelect = (eventKey: string | null) => {
    if (eventKey) {
      setSelectedDocType(eventKey as DocumentType);
      validateSelection();
    }
  };

  // Validate selection
  const validateSelection = async () => {
    try {
      setIsValidating(true);
      
      // Simulated validation process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, all selections are valid
      setValidationResult({
        isValid: true,
        missingFields: []
      });

    } catch (error) {
      console.error("Error processing selection:", error);
      
      setValidationResult({
        isValid: false,
        missingFields: ["Error processing selection."],
      });
    } finally {
      setIsValidating(false);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validationResult) return;

    // Call the onSubmit callback with validation results
    if (onSubmit) {
      const validationMessage = validationResult.isValid
        ? "Selection validated successfully"
        : `Issues: ${validationResult.missingFields.join(", ")}`;

      onSubmit(selectedDocType, validationResult.isValid, validationMessage);
    }
  };

  return (
    <Toast onClose={toggleDisplay} show={true}>
      <Toast.Header>
        <strong className="me-auto">Select Document Type</strong>
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

          <Button onClick={handleSubmit} disabled={isValidating || !validationResult}>
            {isValidating ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span className="ms-2">Processing...</span>
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>

        {/* Validation Results */}
        {validationResult && !isValidating && (
          <div className="validation-results mt-3">
            {validationResult.isValid ? (
              <Alert variant="success">
                <Alert.Heading>Selection Validated!</Alert.Heading>
                <p>Ready to submit!</p>
              </Alert>
            ) : (
              <Alert variant="danger">
                <Alert.Heading>Issues:</Alert.Heading>
                <ul>
                  {validationResult.missingFields.map((field, index) => (
                    <li key={index}>{field}</li>
                  ))}
                </ul>
              </Alert>
            )}
          </div>
        )}
      </Toast.Body>
    </Toast>
  );
}

export default RequestScreen;