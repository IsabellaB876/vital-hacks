export const getUserFiles = async (username: string) => {
  try {
    const res = await fetch("http://localhost:3000/api/getFiles", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        username: username,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch files");

    const data = await res.json();
    console.log(data.files);
    return data.files;
  } catch (error) {
    console.error(error);
    return [];
  }
};

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
