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

    if (!res.ok) throw new Error("Failed to fetch user details");

    const data = await res.json();
    console.log(data.firstName);
    return data;
  } catch (error) {
    console.error(error);
    return;
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
