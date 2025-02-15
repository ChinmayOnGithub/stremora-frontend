import { createContext, useContext } from "react";

export const AuthContext = createContext({
  user: null,
  login: () => { },
  logout: () => { },
  fetchCurrentUser: () => { }
});  // const [user, setUser] = useState(null); // ✅ State to store the logged-in user


export const AuthProvider = AuthContext.Provider;

export default function useAuth() {
  return useContext(AuthContext);
}
