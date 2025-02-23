import { useState, useEffect } from 'react'
import useAuth from '../contexts/AuthContext'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Container from '../components/Container';
import SubscribeButton from '../components/SubscribeButton';
import useUser from '../contexts/UserContext';

function Subscription() {
  const { subscriptions, loading, setLoading } = useUser();
  const { user } = useAuth();
  const navigate = useNavigate();


  // useEffect(() => {
  //   if (!user?._id) {
  //     setLoading(false); // ✅ Stop loading if no user is found
  //     return;
  //   }
  //   axios.get(
  //     `https://youtube-backend-clone.onrender.com/api/v1/subscription/get-subscribed-channels/${user._id}`
  //   ).then((res) => {
  //     if (res.data.success) {
  //       // console.log(res);
  //       setSubscriptions(res.data.message.channels);
  //     }
  //   }
  //   ).catch((error) => {
  //     console.log("Error fetching subscriptions:", error);
  //   }
  //   ).finally(() => {
  //     setLoading(false); // ✅ Stop loading after request completes
  //   });
  // }, [user?._id, setLoading])

  // bug in backend 
  // when getting the channel subscribed to... getting way too much information than needed

  if (loading) {
    return (
      <p>Loading subscriptions...</p>
    )
  }

  const inspectChannel = (channelName) => {
    navigate(`/user/c/${channelName}`);
  }


  const recommendedChannels = [
    { id: 1, name: "Code Master", avatar: "https://i.pravatar.cc/40?img=1" },
    { id: 2, name: "Gadget Review", avatar: "https://i.pravatar.cc/40?img=2" },
    { id: 3, name: "AI Explorer", avatar: "https://i.pravatar.cc/40?img=3" }
  ];

  console.log(recommendedChannels);



  return (
    <Container>
      <h2 className="text-left p-4 text-lg text-black dark:text-white">Subscriptions & Recommendations</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* ✅ Left Side: Subscribed Channels */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg">
          <h3 className="text-black dark:text-white text-xl mb-4">Your Subscribed Channels</h3>
          {subscriptions.length > 0 ? (
            <div className="space-y-3">
              {subscriptions.map((channel) => (
                <div
                  key={channel._id}
                  className="flex items-center bg-gray-100 dark:bg-gray-800 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <div className='flex items-center'
                    onClick={() => inspectChannel(channel.channelDetails.username)}>
                    <img className="w-10 h-10 object-cover rounded-full" src={channel.channelDetails.avatar} alt="" />
                    <p className="text-black dark:text-white ml-4">{channel.channelDetails.username}</p>
                  </div>
                  {/* <SubscribeButton
                    channelId={channel._id}
                    channelName={channel.channelDetails.username}
                    isSubscribed={subscriptions.some(sub => sub._id === channel._id)} // ✅ Pass `isSubscribed`
                  /> */}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center p-4">No subscriptions yet.</p>
          )}
        </div>

        {/* ✅ Right Side: Recommended Channels */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg">
          <h3 className="text-black dark:text-white text-xl mb-4">Recommended Channels</h3>
          <div className="space-y-3">
            {recommendedChannels.map((channel) => (
              <div key={channel.id}
                className="flex items-center bg-gray-100 dark:bg-gray-800 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
              >
                <img className="w-10 h-10 object-cover rounded-full" src={channel.avatar} alt="" />
                <p className="text-black dark:text-white ml-4">{channel.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Subscription