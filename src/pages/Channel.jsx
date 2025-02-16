import { useEffect, useState } from "react";
import useAuth from "../contexts/AuthContext"
import axios from "axios";
import { useParams } from "react-router-dom";

function Channel() {
  const { user, loading } = useAuth(); // ✅ Get loading state from context
  const { channelName } = useParams();
  const [channel, setChannel] = useState(null);

  useEffect(() => {

    if (!channelName) return; // ✅ Prevent API call if channelName is undefined

    axios.get(
      `https://youtube-backend-clone.onrender.com/api/v1/users/c/${channelName}`,
    ).then((res) => {
      console.log(res);
      setChannel(res.data.data)
    }).catch((err) => {
      console.error("Something went wrong", err);
    })
  }, [channelName])


  if (!user) {
    console.log("No user found");
    return <p>No user found. Please log in.</p>; // ✅ Handle case when user is null
  }


  if (loading || !channel) {
    return (
      <div className="flex flex-col items-center p-6">
        <div className="skeleton w-40 h-40 rounded-full"></div>
        <div className="skeleton w-32 h-4 mt-4"></div>
        <div className="skeleton w-24 h-4 mt-2"></div>
      </div>
    ); // ✅ Show loading skeleton
  }



  return (
    <div className="bg-stone-950 h-full shadow-xl w-full sm:w-3/4 mx-auto rounded-md">
      <div className="relative card h-auto">
        {channel.coverImage ? (
          <img src={channel.coverImage} alt="Cover" className="w-full h-32 sm:h-64 object-cover rounded-t-md" />
        ) : (
          <p className="text-center text-gray-400">No cover image</p>
        )}

        <div className="absolute bottom-0 left-20 transform -translate-x-1/2 translate-y-1/2 w-20 h-20 flex items-center">
          <img src={channel.avatar} alt="User Avatar" className="h-32 w-32 rounded-md border-2 border-primary object-cover" />
          <div className="ml-4">
            <p className="text-lg font-bold">@{channel.username}</p>
            <p className="text-gray-500">{channel.fullname}</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Channel;
