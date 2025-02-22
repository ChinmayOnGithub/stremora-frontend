import { useEffect, useState } from "react";
import useAuth from "../contexts/AuthContext"
import axios from "axios";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading/Loading";
import Container from "../components/Container";

function Channel() {
  const { token, loading, setLoading } = useAuth(); // ✅ Get loading state from context
  const { channelName } = useParams();
  // console.log(useParams());

  const [channel, setChannel] = useState(null);

  useEffect(() => {
    if (!channelName.trim()) return;
    setLoading(true);
    axios.get(
      `https://youtube-backend-clone.onrender.com/api/v1/users/c/${channelName}`,
      // `http://localhost:8000/api/v1/users/c/${channelName}`,
      {
        headers: {
          Authorization: `Bearer ${token}` // Ensure authToken is correctly set
        }
      }
    )
      .then((res) => {
        console.log("API Response:", res.data);
        setChannel(res.data?.data || null); // Ensure we set the correct object
      })
      .catch((err) => {
        console.error("Something went wrong", err);
        setChannel(null); // Ensure state resets when an error occurs
      })
      .finally(() => {
        setLoading(false);
      });
  }, [channelName]);

  if (loading || !channel) {
    return <Loading />
  }

  if (!channel && !loading) {
    return (
      <p>
        No channel found
      </p>
    )
  }



  return (
    <Container>
      <div className="relative card h-auto">

        <h1 className="text-bold text-lg italic absolute right-0 bottom-0 m-2">Channel Page</h1>
        {channel?.coverImage ? (
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
    </Container>
  );
}

export default Channel;
