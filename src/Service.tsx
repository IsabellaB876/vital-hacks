import { UserData } from "./interfaces/UserData";

export const getUser = async (username: string) => {
  try {
    const res = await fetch("http://localhost:3000/api/getUser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        username: username,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user details");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null; // Return null if the request fails
  }
};

export const createUser = async (user: UserData) => {
  try {
    const res = await fetch("http://localhost:3000/api/createAccount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (res.status === 409) {
      throw new Error("Username already exists!");
    }

    if (!res.ok) throw new Error("Failed to create user");

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export async function uploadPhoto(
  file: File,
  username: string
): Promise<{ photo: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("username", username);

  const response = await fetch("http://localhost:3000/api/uploadPhoto", {
    method: "PATCH",
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Upload failed: ${message}`);
  }

  const result = await response.json();

  return result;
}

export const editUser = async (
  username: string,
  edits: { key: string; value: any }[]
): Promise<{ message: string }> => {
  try {
    const res = await fetch("http://localhost:3000/api/editUser", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        edits,
      }),
    });

    if (!res.ok) {
      const message = await res.text();
      throw new Error(`Edit failed: ${message}`);
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error editing user:", error);
    throw error;
  }
};
