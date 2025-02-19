import { createContext, useContext } from "react";

export const VideoContext = createContext({
  videoList: []
});  // const [user, setUser] = useState(null); // ✅ State to store the logged-in user


export const AuthProvider = VideoContext.Provider;

export default function useAuth() {
  return useContext(VideoContext);
}
