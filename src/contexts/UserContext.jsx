import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import useAuth from "./AuthContext";

export const UserContext = createContext();  // const [user, setUser] = useState(null); // ✅ State to store the logged-in user

export function UserProvider({ children }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();



  // remeber to take id with res.data.message.channels.channelDetails._id
  // remeber to take id with res.data.message.channels._id

  useEffect(() => {
    if (!user?._id) {
      setLoading(false); // ✅ Stop loading if no user is found
      return;
    }

    setLoading(true);
    axios.get(
      `https://youtube-backend-clone.onrender.com/api/v1/subscription/get-subscribed-channels/${user._id}`
    ).then((res) => {
      if (res.data.success) {
        // console.log(res);
        setSubscriptions(res.data.message.channels);
      }
    }
    ).catch((error) => {
      console.log("Error fetching subscriptions:", error);
    }
    ).finally(() => {
      setLoading(false); // ✅ Stop loading after request completes
    });
  }, [user?._id, setLoading])

  return (
    <UserContext.Provider value={{ subscriptions, setSubscriptions, loading, setLoading }}>
      {children}
    </UserContext.Provider>
  )
}

export default function useUser() {
  return useContext(UserContext);
}
