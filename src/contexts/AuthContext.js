import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  user: null,
  login: () => { },
  logout: () => { },
});

export const AuthProvider = AuthContext.Provider;


// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // Check if token exists in localStorage
//     const token = localStorage.getItem("token");
//     if (token) {
//       setUser({ token }); // You might want to decode the token for user info
//     }
//   }, []);

//   const login = (token) => {
//     localStorage.setItem("token", token);
//     setUser({ token });
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

export default function useAuth() {
  return useContext(AuthContext);
}
