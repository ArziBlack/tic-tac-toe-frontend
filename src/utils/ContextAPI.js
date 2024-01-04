import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
};

const ContextAPIProvider = ({ children }) => {
    const [name, setName] = useState("");
    const values = {
        name,
        setName
    }
    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    )
}

export default ContextAPIProvider;