import { FileData } from "./FileData";

export interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  role: string;
  birthDate: string;
  files: FileData[];
  photo: any;
  users: UserData[];
  password: string;
}

export const userDataDefault = {
  firstName: "",
  lastName: "",
  username: "",
  role: "",
  birthDate: "",
  files: [],
  photo: null,
  users: [],
  password: null,
};
