import { useState, useEffect } from "react";
import { Stack, Image } from "react-bootstrap";
import NavBar from "./NavBar";
import { useSidebar } from "../context/appContext";
import Account from "../assets/Account.svg";
import { getUser } from "../Service";
import { UserData } from "../interfaces/UserData";

function PatientHome() {
  const { showSidebar, user } = useSidebar();
  const [imageUrl, setImageUrl] = useState("");
  const [people, setPeople] = useState<UserData[]>([]);

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

  useEffect(() => {
    const rawBase64Data = user.photo ?? "";
    if (rawBase64Data) {
      const fullDataUrl = `data:image/png;base64,${rawBase64Data}`;
      setImageUrl(fullDataUrl);
    }
  }, []);

  return (
    <Stack gap={3} className="text-start" style={{ marginTop: "8%" }}>
      <NavBar />
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
              src={imageUrl ?? Account}
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
            <span style={{ color: "#497FD5" }}>Health Restrictions</span> <br />{" "}
            Not coded yet...
          </h2>
          <h2>
            <span style={{ color: "#497FD5" }}>
              {user.role === "Patient" ? "Doctors" : "Patients"}
            </span>
            <br />
            {people.map((person) => (
              <span key={person.username} style={{ display: "block" }}>
                {person.firstName} {person.lastName}
              </span>
            ))}
          </h2>
        </Stack>
      </div>
    </Stack>
  );
}

export default PatientHome;
