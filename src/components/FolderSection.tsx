import { Stack } from "react-bootstrap";
import Folder from "./Folder";

const FolderSection = () => {
  return (
    <div>
      <h2>All Files</h2>
      <Stack direction="horizontal" gap={3}>
        <Folder title="Treatments and Prescriptions" />
        <Folder title="HIPAA and Consent" />
        <Folder title="Patient Intake Forms" />
        <Folder title="Insurance" />
      </Stack>
    </div>
  );
};

export default FolderSection;
