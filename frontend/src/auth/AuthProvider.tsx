import { type User, type IdTokenResult, onIdTokenChanged } from "@firebase/auth";
import { useState, useEffect, useMemo, createContext, useContext } from "react";
import { auth } from "../firebaseConfig.js";

// We'll need this AuthProvider to provide info about the signed-in user to various pages.

// How it will work is we'll wrap the app returned in App.tsx inside an AuthProvider.
// Then, all components within the app will be consumers subscribed to the provided AuthContext.

// Reference example: https://github.com/Hack4Impact-UMD/ADR-Mobile/blob/main/adrmobileapp/components/AuthProvider.tsx

interface AuthContextType {
    user: User | null; // Includes info like email, uid, etc.
    token: IdTokenResult; // A JWT token used for secure authorization in things like API requests
}

const AuthContext = createContext<AuthContextType>(null!);

// Used by children to access the props stored in the context given by the AuthProvider.
function useAuth() {
    return useContext(AuthContext);
}

interface AuthProviderProps {
    children: JSX.Element;
}

function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null!);
    const [token, setToken] = useState<IdTokenResult>(null!);

    // Cache these props and re-compute them only when they're changed,
    // preventing unnecessary re-renders of children.
    const providerProps = useMemo(() => {
        return { user, token };
    }, [user, token]);

    // Handle setting and updating the user upon signup, login, logout,
    // and the periodic refresh of Firebase ID tokens.
    useEffect(() => {
        onIdTokenChanged(auth, async (newUser: User | null) => {
            setUser(newUser);
            if (!newUser) {
                return;
            }

            try {
                const newToken = await newUser.getIdTokenResult();
                setToken(newToken);
            } catch (error) {
                console.error("Server error refreshing ID token: ", error);
            }
        })
    }, []);

    return (
        <AuthContext.Provider value={ providerProps }>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthProvider;
export { useAuth };