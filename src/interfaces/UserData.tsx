import { FileData } from "./FileData";

export interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  role: string;
  birthDate: string;
  files: FileData[];
}

export const userDataDefault = {
  firstName: "",
  lastName: "",
  username: "",
  role: "",
  birthDate: "",
  files: [],
};
