import React, { useState, useEffect } from "react";
import Toast from "react-bootstrap/Toast";
import Dropdown from "react-bootstrap/Dropdown";
import { Button, Alert, Spinner } from "react-bootstrap";
import { analyzeDocumentFromBuffer } from "../lib/textract";

// Define types for the Textract result
interface TextractBlock {
  Id?: string;
  BlockType?: string;
  Text?: string;
  EntityTypes?: string[];
  Relationships?: {
    Type: string;
    Ids: string[];
  }[];
}

interface TextractResult {
  Blocks: TextractBlock[];
}

interface UploadScreenProps {
  toggleDisplay: () => void;
  onFileUpload?: (
    file: File,
    isValid: boolean,
    validationMessage?: string
  ) => void;
}

function UploadScreen({ toggleDisplay, onFileUpload }: UploadScreenProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    missingFields: string[];
  } | null>(null);

  // Handle file selection and trigger automatic validation
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const selectedFile = files[0];
    setFile(selectedFile);

    // Start validation immediately after file selection
    validateDocument(selectedFile);
  };

  // Validate document function
  const validateDocument = async (documentFile: File) => {
    try {
      setIsValidating(true);

      // Convert file to buffer for Textract
      const fileArrayBuffer = await documentFile.arrayBuffer();
      const fileBuffer = new Uint8Array(fileArrayBuffer);

      // Process with Textract
      const textractResult = (await analyzeDocumentFromBuffer(
        fileBuffer
      )) as TextractResult;

      // Validate document
      const missingFields = checkForKeywords(textractResult);
      const isValid = missingFields.length === 0;

      // Update validation result state
      setValidationResult({
        isValid,
        missingFields,
      });

      // No callback here - we'll wait for the Submit button press
    } catch (error) {
      console.error("Error processing document:", error);

      // Update validation result state with error
      setValidationResult({
        isValid: false,
        missingFields: ["Error analyzing document."],
      });
    } finally {
      setIsValidating(false);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!file || !validationResult) return;

    // Call the onFileUpload callback with validation results
    if (onFileUpload) {
      const validationMessage = validationResult.isValid
        ? "Document validated successfully"
        : `Missing fields: ${validationResult.missingFields.join(", ")}`;

      onFileUpload(file, validationResult.isValid, validationMessage);
    }

    // Optionally close the dialog or show a success message
    // toggleDisplay();

    const formData = new FormData();
    const pdfFile = file;
    formData.append("pdfFile", pdfFile);
    formData.append("filetype", "placeholder type");
    formData.append("username", "user-1");
    formData.append("filename", "placeholder name");
    formData.append("date", "placeholder date");
    formData.append("description", "placeholder description");
  };

  // Validation logic from DocumentValidator
  const checkForKeywords = (textractResult: TextractResult): string[] => {
    const missing: string[] = [];
    const textBlocks = textractResult.Blocks.filter(
      (block) => block.BlockType === "LINE"
    );
    const documentText = textBlocks
      .map((block) => block.Text || "")
      .join(" ")
      .toLowerCase();

    // Define the keywords to check for
    const keywords = [
      {
        keyword: "Massachusetts Health Care Proxy",
        label: "Massachusetts Health Care Proxy",
      },
      { keyword: "Health Care Agent", label: "Health Care Agent" },
    ];

    keywords.forEach(({ keyword, label }) => {
      if (!documentText.includes(keyword.toLowerCase())) {
        missing.push(label);
      }
    });

    return missing;
  };

  return (
    <Toast onClose={toggleDisplay} show={true}>
      <Toast.Header>
        <strong className="me-auto">Upload File</strong>
      </Toast.Header>
      <Toast.Body>
        <div className="d-flex justify-content-between mb-3">
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic">
              Requested Files
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Health Care Proxy</Dropdown.Item>
              <Dropdown.Item>Advanced Directive</Dropdown.Item>
              <Dropdown.Item>Medical History</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Button onClick={handleSubmit} disabled={!file || isValidating}>
            {isValidating ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span className="ms-2">Validating...</span>
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>

        <div
          className="file-upload-container d-flex align-items-center justify-content-end"
          style={{ marginTop: "20px" }}
        >
          <label htmlFor="file-upload" className="me-2">
            Upload PDF:
          </label>
          <div className="d-flex">
            <input
              type="file"
              id="file-upload"
              accept="application/pdf,image/png,image/jpeg"
              onChange={handleFileChange}
              title="Click to upload a file"
              style={{ width: "auto" }}
            />
          </div>
        </div>

        {file && (
          <div className="selected-file mt-2">
            <strong>Selected file:</strong> {file.name}
            {isValidating && (
              <span className="ms-2">
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span className="ms-1">Validating...</span>
              </span>
            )}
          </div>
        )}

        {/* Validation Results */}
        {validationResult && !isValidating && (
          <div className="validation-results mt-3">
            {validationResult.isValid ? (
              <Alert variant="success">
                <Alert.Heading>Document Validated!</Alert.Heading>
                <p>Ready to submit!</p>
              </Alert>
            ) : (
              <Alert variant="danger">
                {validationResult.missingFields.length >= 2 && (
                  <div className="fw-bold mb-2">
                    WARNING: This document is likely NOT a healthcare proxy
                    form.
                  </div>
                )}
                <Alert.Heading>Missing Fields:</Alert.Heading>
                <ul>
                  {validationResult.missingFields.map((field, index) => (
                    <li key={index}>{`${field} is missing`}</li>
                  ))}
                </ul>
                <p className="mt-2">
                  You may still submit this document, but it may not be
                  processed correctly.
                </p>
              </Alert>
            )}
          </div>
        )}
      </Toast.Body>
    </Toast>
  );
}

export default UploadScreen;
