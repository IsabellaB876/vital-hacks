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
    description: boolean;
    type: boolean;
    requestedBy: boolean;
    requestedFor: boolean;
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
          {/* Simple Search Bar */}
          <div className="search-container position-relative w-50">
            <form className="d-flex" onSubmit={handleSearchSubmit}>
              <div className="position-relative w-100">
                <input
                  className="search-bar form-control shadow"
                  type="search"
                  placeholder="Search for files, descriptions, types..."
                  aria-label="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchResults.length > 0 && setShowResults(true)}
                  onBlur={() => setTimeout(() => setShowResults(false), 200)}
                />
                
                {/* Loading indicator */}
                {isSearching && (
                  <div 
                    className="position-absolute end-0 top-50 translate-middle-y me-3"
                    style={{ zIndex: 5 }}
                  >
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Searching...</span>
                    </div>
                  </div>
                )}
              </div>
            </form>

            {/* Search Results Dropdown */}
            {showResults && (
              <div 
                className="search-results position-absolute w-100 bg-white border rounded shadow-lg mt-1"
                style={{ 
                  zIndex: 1000, 
                  maxHeight: '400px', 
                  overflowY: 'auto',
                  top: '100%'
                }}
              >
                {searchResults.length > 0 ? (
                  <>
                    <div className="px-3 py-2 border-bottom bg-light">
                      <small className="text-muted">
                        Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                      </small>
                    </div>
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        className="search-result-item px-3 py-2 border-bottom cursor-pointer hover-bg-light"
                        onClick={() => handleResultClick(result)}
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <div className="fw-bold text-primary mb-1">
                              {result.name}
                            </div>
                            {result.description && (
                              <div className="text-muted small mb-1">
                                {result.description}
                              </div>
                            )}
                            <div className="d-flex gap-2 align-items-center">
                              <span className={`badge ${result.type === 'HIPAA' ? 'bg-danger' : 'bg-info'}`}>
                                {result.type}
                              </span>
                              {result.isRequested && (
                                <span className="badge bg-warning text-dark">
                                  Requested
                                </span>
                              )}
                              <small className="text-muted">
                                Due: {result.date}
                              </small>
                            </div>
                          </div>
                          <div className="text-end">
                            {result.requestedBy && (
                              <small className="text-muted d-block">
                                By: {result.requestedBy}
                              </small>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="px-3 py-4 text-center text-muted">
                    <div className="mb-2">
                      <i className="bi bi-search fs-1 text-muted"></i>
                    </div>
                    <div>No files found matching "{searchQuery}"</div>
                    <small>Try searching for file names, descriptions, or types</small>
                  </div>
                )}
              </div>
            )}
          </div>

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
