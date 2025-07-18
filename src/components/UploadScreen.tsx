import React, { useState } from "react";
import Toast from "react-bootstrap/Toast";
import Dropdown from "react-bootstrap/Dropdown";
import upload from "../assets/BlueUploadIcon.svg";
import { Button, Alert, Spinner, Image } from "react-bootstrap";
import { analyzeDocumentFromBuffer } from "../lib/textract";
import { useSidebar } from "../context/appContext";
import { FileData } from "../interfaces/FileData";

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

type DocumentType = "Health Care Proxy" | "HIPAA" | "Medical History" | "Patient Intake Forms";

function UploadScreen({ toggleDisplay, onFileUpload }: UploadScreenProps) {
  const { showSidebar, user } = useSidebar();
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null); // sets to selected file
  const requestedFile = user.files.filter((f) => f.isRequested) // returns a list of requested files
  const handleSelect = (f: FileData) => { setSelectedFile(f) };

  const [file, setFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [selectedDocType, setSelectedDocType] =
    useState<DocumentType>("Health Care Proxy");
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

      // Validate document based on selected document type
      const missingFields = checkForKeywords(textractResult, selectedDocType);
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
  const handleSubmit = async () => {
    if (!file || !validationResult) return;

    // Call the onFileUpload callback with validation results
    if (onFileUpload) {
      const validationMessage = validationResult.isValid
        ? "Document validated successfully"
        : `Missing fields: ${validationResult.missingFields.join(", ")}`;

      onFileUpload(file, validationResult.isValid, validationMessage);
    }

    // Construct form data for API submission
    const formData = new FormData();
    const pdfFile = file;
    formData.append("pdfFile", pdfFile);
    formData.append("filetype", "HIPAA");
    formData.append("username", "user-1");
    formData.append("filename", file.name);
    formData.append("date", new Date().toISOString());
    formData.append("description", `${selectedDocType} document`);

    await fetch("http://localhost:3000/api/uploadPDF", {
      method: "POST",
      body: formData,
    })
      .then((data) => {
        console.log("File uploaded successfully:", data);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
    console.log("File uploaded successfully");
  };

  // Handle document type selection
  const handleDocTypeSelect = (eventKey: string | null) => {
    if (eventKey) {
      setSelectedDocType(eventKey as DocumentType);
  
      if (file) {
        validateDocument(file);
      }
    }
  };
  
  

  // Validation logic from DocumentValidator - updated to check based on document type
  const checkForKeywords = (
    textractResult: TextractResult,
    docType: DocumentType
  ): string[] => {
    const missing: string[] = [];
    const textBlocks = textractResult.Blocks.filter(
      (block) => block.BlockType === "LINE"
    );
    const documentText = textBlocks
      .map((block) => block.Text || "")
      .join(" ")
      .toLowerCase();

    // Define the keywords to check for based on document type
    interface Keyword {
      keyword: string;
      label: string;
    }

    let keywords: Keyword[] = [];

    if (docType === "Health Care Proxy") {
      keywords = [
        {
          keyword: "massachusetts health care proxy",
          label: "Massachusetts Health Care Proxy",
        },
        { keyword: "health care agent", label: "Health Care Agent" },
      ];
    } else if (docType === "HIPAA") {
      keywords = [
        { keyword: "hipaa release form", label: "HIPAA Release Form" },
        { keyword: "health information", label: "Health Information" },
        { keyword: "reason for disclosure", label: "Reason for Disclosure" },
      ];
    } else if (docType === "Medical History") {
      keywords = [
        { keyword: "health history form", label: "Health History Form" },
        {
          keyword: "health insurance information",
          label: "Health Insurance Information",
        },
        { keyword: "medical history", label: "Medical History" },
      ];
    }

    keywords.forEach(({ keyword, label }) => {
      if (!documentText.includes(keyword)) {
        missing.push(label);
      }
    });

    return missing;
  };

  return (
    <Toast
      onClose={toggleDisplay}
      show={true}
      style={{
        marginLeft: showSidebar ? 320 : 0,
        transition: "margin-left 0.3s ease",
      }}
    >

      <Toast.Header>
        <strong className="me-auto">Upload {selectedDocType}</strong>
      </Toast.Header>
      <Toast.Body>
        <div className="d-flex gap-5">
          <div
            className="file-upload-container d-flex gap-4 justify-content-end mb-3"
            style={{ marginTop: "20px" }}
          >
            <div className=" upload-pdf d-flex flex-column justify-content-center align-items-center">
              <Image
                className="mb-2"
                src={upload}
                alt="upload"
                width={26}
                height={25}
              />
              <input
                type="file"
                id="file-upload"
                accept="application/pdf,image/png,image/jpeg,.doc,.docx"
                onChange={handleFileChange}
                title="Click to upload a file"
                style={{ width: "auto" }}
              />
            </div>
          </div>

          <div className="dropdowns d-flex flex-column gap-3 mb-3">
            <Dropdown onSelect={handleDocTypeSelect}>
              <Dropdown.Toggle id="dropdown-basic" className="shadow">
                {selectedFile ? selectedFile.name : 'Requested File'}
              </Dropdown.Toggle>
              <Dropdown.Menu className="shadow">
                {requestedFile.map((f) => (
                  <Dropdown.Item
                    key={f.id}
                    eventKey={f.type}
                    onClick={() => handleSelect(f)}
                  >
                    {f.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <input
              type="text"
              className="doctor-input shadow"
              placeholder="Doctor"
              disabled
              value={selectedFile?.requestedBy || ''}
            />

            <input
              type="text"
              className="type-input shadow"
              placeholder="File Type"
              disabled
              value={selectedFile?.type || ''}
            />


            <Button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={!file || isValidating}
              style={{
                backgroundColor: "#274472",
              }}
            >
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
                    WARNING: This document is likely NOT a {selectedDocType}{" "}
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
