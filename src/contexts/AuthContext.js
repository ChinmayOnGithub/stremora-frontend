import { createContext, useContext } from "react";

export const AuthContext = createContext({
  user: null,
  token: localStorage.getItem("accessToken"),
  loading: true,
  login: () => { },
  logout: () => { },
  fetchCurrentUser: () => { },
  error: null
});  // const [user, setUser] = useState(null); // ✅ State to store the logged-in user


export const AuthProvider = AuthContext.Provider;

export default function useAuth() {
  return useContext(AuthContext);
}
