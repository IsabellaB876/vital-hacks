import { Container, Button, Image } from "react-bootstrap";
import Penciel from "../assets/Penciel.svg";
import Navbar from "react-bootstrap/Navbar";
import logo from "../assets/logo.svg";
import hammy from "../assets/menu.svg";
import uploadIcon from "../assets/WhiteUploadIcon.svg";
import taskAdd from "../assets/taskAdd.svg";
import UploadScreen from "./UploadScreen";
import SideBar from "./SideBar";
import { useState, useEffect, useRef } from "react";
import { useSidebar } from "../context/appContext";
import { useLocation } from "react-router-dom";
import DocNavBar from "./DocNavBar";

interface SearchResult {
  id: number;
  name: string;
  description: string;
  date: string;
  type: string;
  isRequested: boolean;
  requestedBy: string;
  requestedFor: string;
  matchedFields: {
    name: boolean;
    description: string;
    type: string;
    requestedBy: string;
    requestedFor: string;
  };
}

interface SearchResponse {
  message: string;
  query: string;
  results: SearchResult[];
  totalCount: number;
}

function NavBar() {
  const [display, setDisplay] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { toggleSidebar, toggleEditMode, user } = useSidebar();

  const toggleDisplay = () => setDisplay(!display);

  const location = useLocation();
  const isProfile = location.pathname === "/Profile";

  // function for immediate search
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'username': user.username,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: SearchResponse = await response.json();
        setSearchResults(data.results);
        setShowResults(true);
      } else {
        console.error('Search failed: ', response.statusText);
        setSearchResults([]);
        setShowResults(false);
      }
    } catch (error) {
      console.error('Search error: ', error);
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  // handle changes to search text
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // performs search with every key clicked
    performSearch(query);
  };

  // handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  }

  // handle clicking on a search result
  const handleResultClick = (result: SearchResult) => {
    console.log('Selected file: ', result);
    setShowResults(false);
    setSearchQuery(result.name);
    // navigate(`/file/${result.id}` - navigate to specific file - not correct yet
  }

  if (user.role === "Doctor") {
    return <DocNavBar />;
  }

  return (
    <>
      <Navbar
        data-bs-theme="light"
        fixed="top"
        style={{ backgroundColor: "white" }}
      >
        <SideBar />
        <div
          className="full-logo d-flex align-items-center gap-2"
          style={{ zIndex: 10, position: "relative" }}
        >
          <Image
            onClick={toggleSidebar}
            className="hammy"
            src={hammy}
            alt="hammy"
          />{" "}
          <br />
          <Navbar.Brand href="/PatientHome" className="m-0">
            <Image className="logo" src={logo} alt="Logo" /> MedVault
          </Navbar.Brand>
        </div>

        <Container className="d-flex justify-content-center align-items-center gap-5">
          {/* Search Bar */}
          <form className="d-flex w-50">
            <input
              className="search-bar form-control shadow"
              type="search"
              placeholder="Search for anything..."
              aria-label="Search"
            />
          </form>

          {/* Upload and Request Buttons */}
          <div className="d-flex gap-5 ms-5">
            {!isProfile ? (
              <>
                <Button
                  onClick={toggleDisplay}
                  className="upload-btn d-flex align-items-center px-3 py-2"
                >
                  <Image className="me-2" src={uploadIcon} alt="upload" />
                  Upload
                </Button>

                <Button className="request-btn d-flex align-items-center px-3 py-2">
                  <Image className="me-2" src={taskAdd} alt="task" />
                  Request
                </Button>
              </>
            ) : (
              <Button
                className="edit-btn d-flex align-items-center px-3 py-2"
                onClick={toggleEditMode}
              >
                <Image className="me-2" src={Penciel} alt="edit" />
                Edit
              </Button>
            )}
          </div>
        </Container>
      </Navbar>
      {display && <UploadScreen toggleDisplay={toggleDisplay} />}
    </>
  );
}

export default NavBar;
