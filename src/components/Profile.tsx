import { useState, useEffect } from "react";
import { Stack, Image, Button } from "react-bootstrap";
import NavBar from "./NavBar";
import { useSidebar } from "../context/appContext";
import Account from "../assets/Account.svg";
import { getUser, uploadPhoto, editUser } from "../Service";
import { UserData } from "../interfaces/UserData";

function PatientHome() {
  const { showSidebar, user, editMode, toggleEditMode, updateUserData } =
    useSidebar();
  const [people, setPeople] = useState<UserData[]>([]);
  const [newUser, setNewUser] = useState("");
  const [invalidUser, setInvalidUser] = useState("");

  useEffect(() => {
    async function fetchPeople() {
      const fetched = await Promise.all(
        user.users.map(async (person) => {
          try {
            const userData = await getUser(person);
            if (!userData) {
              console.error(`Failed to fetch user ${person}`);
              return null;
            }
            return userData.user;
          } catch (error) {
            console.error(`Failed to fetch user ${person}`, error);
            return null;
          }
        })
      );
      setPeople(fetched.filter((user) => user !== null));
    }

    if (user?.users?.length) {
      fetchPeople();
    }
  }, [user]);

  /*useEffect(() => {
    const rawBase64Data = user.photo ?? "";
    if (rawBase64Data) {
      const fullDataUrl = `data:image/png;base64,${rawBase64Data}`;
      setImageUrl(fullDataUrl);
    }
  }, []);*/

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await uploadPhoto(file, user.username);
      if (result && result.photo) {
        updateUserData("photo", result.photo);
      }
    } catch (err) {
      console.error("Failed to upload photo", err);
    }
  };

  const handleBirthDateChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const result = await editUser(user.username, [
        { key: "birthDate", value: e.target.value },
      ]);
      if (result) {
        updateUserData("birthDate", e.target.value);
      }
    } catch (err) {
      console.error("Failed to update user data", err);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.trim()) return;
    try {
      const userData = await getUser(newUser);
      if (!userData || !userData.user) {
        setInvalidUser("User not found");
        return;
      }
      const result = await editUser(user.username, [
        { key: "users", value: [...user.users, newUser] },
      ]);
      if (result) {
        updateUserData("users", [...user.users, newUser]);
        setNewUser("");
        setInvalidUser("");
      }
    } catch (err) {
      console.error("Failed to update user data", err);
    }
  };

  return (
    <Stack gap={3} className="text-start" style={{ marginTop: "8%" }}>
      <NavBar />
      {!editMode ? (
        <div
          className="flex-grow-1"
          style={{
            marginLeft: showSidebar ? 320 : 0,
            transition: "margin-left 0.3s ease",
          }}
        >
          <Stack gap={3} className="text-start p-3">
            <h1>My Profile</h1>
            <div
              className="d-flex align-items-center shadow gap-5 px-4 py-3"
              style={{ borderRadius: "15px" }}
            >
              <Image
                className="profile-img"
                src={
                  user.photo ? `data:image/png;base64,${user.photo}` : Account
                }
                alt="Profile"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
              <div className="d-flex flex-column text-start">
                <h2 className="name">{user.firstName + " " + user.lastName}</h2>
                <p className="email">{user.username}</p>
                {people.map((person) => {
                  const photoSrc = person.photo
                    ? `data:image/png;base64,${person.photo}`
                    : Account;

                  return (
                    <Image
                      style={{
                        width: "30px",
                        height: "30px",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                      src={photoSrc}
                      alt="Profile"
                    />
                  );
                })}
              </div>
            </div>
            <h2>Personal Information</h2>
            <div className="d-flex gap-5">
              <h2>
                <span style={{ color: "#497FD5" }}>First Name</span> <br />{" "}
                {user.firstName}
              </h2>
              <h2>
                <span style={{ color: "#497FD5" }}>Last Name</span> <br />{" "}
                {user.lastName}
              </h2>
              <h2>
                <span style={{ color: "#497FD5" }}>Username</span> <br />{" "}
                {user.username}
              </h2>
              <h2>
                <span style={{ color: "#497FD5" }}>Date of Birth</span> <br />{" "}
                {user.birthDate}
              </h2>
            </div>
            <h2>
              <span style={{ color: "#497FD5" }}>Health Insurance</span> <br />{" "}
              Not coded yet...
            </h2>
            <h2>
              <span style={{ color: "#497FD5" }}>Health Restrictions</span>{" "}
              <br /> Not coded yet...
            </h2>
            <h2>
              <span style={{ color: "#497FD5" }}>
                {user.role === "Patient" ? "Doctors" : "Patients"}
              </span>
              <br />
              {people.map((person) => {
                const photoSrc = person.photo
                  ? `data:image/png;base64,${person.photo}`
                  : Account;

                return (
                  <span
                    key={person.username}
                    style={{ display: "block", gap: "10px" }}
                  >
                    <Image
                      style={{
                        width: "30px",
                        height: "30px",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                      src={photoSrc}
                      alt="Profile"
                    />
                    {} {person.firstName} {person.lastName}
                  </span>
                );
              })}
            </h2>
          </Stack>
        </div>
      ) : (
        <div
          className="flex-grow-1"
          style={{
            marginLeft: showSidebar ? 320 : 0,
            transition: "margin-left 0.3s ease",
          }}
        >
          <Stack gap={3} className="text-start p-3">
            <h1>My Profile</h1>
            <div
              className="d-flex align-items-center shadow gap-5 px-4 py-3"
              style={{ borderRadius: "15px" }}
            >
              <div className="d-flex flex-column text-start">
                <Image
                  className="profile-img"
                  src={
                    user.photo ? `data:image/png;base64,${user.photo}` : Account
                  }
                  alt="Profile"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
                <input
                  type="file"
                  id="file-upload"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handlePhotoUpload}
                  title="Click to upload a file"
                  style={{ width: "auto", marginTop: "1rem" }}
                />
              </div>
              <div className="d-flex flex-column text-start">
                <h2 className="name">{user.firstName + " " + user.lastName}</h2>
                <p className="email">{user.username}</p>
                {people.map((person) => {
                  const photoSrc = person.photo
                    ? `data:image/png;base64,${person.photo}`
                    : Account;

                  return (
                    <Image
                      style={{
                        width: "30px",
                        height: "30px",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                      src={photoSrc}
                      alt="Profile"
                    />
                  );
                })}
              </div>
            </div>
            <h2>Personal Information</h2>
            <div className="d-flex gap-5">
              <h2>
                <span style={{ color: "#497FD5" }}>First Name</span> <br />{" "}
                {user.firstName}
              </h2>
              <h2>
                <span style={{ color: "#497FD5" }}>Last Name</span> <br />{" "}
                {user.lastName}
              </h2>
              <h2>
                <span style={{ color: "#497FD5" }}>Username</span> <br />{" "}
                {user.username}
              </h2>
              <Stack>
                <h2>
                  <span style={{ color: "#497FD5" }}>Date of Birth</span> <br />{" "}
                </h2>
                <input
                  type="text"
                  placeholder={user.birthDate || "MM/DD/YYYY"}
                  className="input"
                  onChange={handleBirthDateChange}
                />
              </Stack>
            </div>
            <Stack>
              <h2>
                <span style={{ color: "#497FD5" }}>Health Insurance</span>{" "}
                <br />{" "}
              </h2>
              <input
                type="text"
                placeholder="Not coded yet..."
                className="input"
              />
            </Stack>
            <Stack>
              <h2>
                <span style={{ color: "#497FD5" }}>Health Restrictions</span>{" "}
                <br />{" "}
              </h2>
              <input
                type="text"
                placeholder="Not coded yet..."
                className="input"
              />
            </Stack>
            <h2>
              <span style={{ color: "#497FD5" }}>
                {user.role === "Patient" ? "Doctors" : "Patients"}
              </span>
              <br />
              {people.map((person) => {
                const photoSrc = person.photo
                  ? `data:image/png;base64,${person.photo}`
                  : Account;

                return (
                  <span
                    key={person.username}
                    style={{ display: "block", gap: "10px" }}
                  >
                    <Image
                      style={{
                        width: "30px",
                        height: "30px",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                      src={photoSrc}
                      alt="Profile"
                    />
                    {} {person.firstName} {person.lastName}
                  </span>
                );
              })}
              <div className="d-flex gap-2">
                <input
                  type="text"
                  placeholder="username"
                  className="input"
                  value={newUser}
                  onChange={(e) => setNewUser(e.target.value)}
                ></input>
                <Button onClick={handleAddUser}>Add</Button>
              </div>
              <h3 style={{ color: "red" }}>{invalidUser}</h3>
            </h2>
            <Button onClick={toggleEditMode}>Done</Button>
          </Stack>
        </div>
      )}
    </Stack>
  );
}

export default PatientHome;
