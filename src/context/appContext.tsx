import { createContext, useContext, useState, ReactNode } from "react";
import { UserData, userDataDefault } from "../interfaces/UserData";

interface ContextType {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  toggleSidebar: () => void;
  user: UserData;
  setUser: React.Dispatch<React.SetStateAction<UserData>>;
  updateUserData: <K extends keyof UserData>(
    field: K,
    value: UserData[K]
  ) => void;
}

const Context = createContext<ContextType | undefined>(undefined);

export const Provider = ({ children }: { children: ReactNode }) => {
  const [showSidebar, setShowSidebar] = useState(true);

  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  const [user, setUser] = useState<UserData>(userDataDefault);

  const updateUserData = <K extends keyof UserData>(
    field: K,
    value: UserData[K]
  ) => {
    console.log("UPDATE: " + field + value);
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Context.Provider
      value={{
        showSidebar,
        setShowSidebar,
        toggleSidebar,
        user,
        setUser,
        updateUserData,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("Error in context");
  }
  return context;
};
