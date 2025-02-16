import { useState, useEffect } from 'react'
import useAuth from '../contexts/AuthContext'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Subscription() {
  const [subscription, setSubscriptions] = useState([]);
  const { user, loading, setLoading } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    if (!user?._id) {
      setLoading(false); // ✅ Stop loading if no user is found
      return;
    }
    setLoading(true); // ✅ Start loading before fetching data

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

  // bug in backend 
  // when getting the channel subscribed to... getting way too much information than needed

  if (loading) {
    return (
      <p>Loading subscriptions</p>
    )
  }

  const inspectChannel = (channelName) => {
    navigate(`users/c/${channelName}`);
  }

  return (

    <div className="bg-stone-950 h-full shadow-xl w-full sm:w-3/4 mx-auto rounded-md">
      <h2 className='text-left p-4 text-lg'>Channels you are subscribed to:</h2>
      <div className='flex flex-col items-center'>
        {subscription.length ?
          subscription.map((channel) => (
            <div
              key={channel._id}
              className='bg-white'
              onClick={() => inspectChannel(channel.username)} // ✅ Pass the video ID when clicked
            >
              <div className='bg-gray-700 w-150 p-4 m-2 rounded-sm flex flex-row'>
                <img className='w-10 h-10 object-cover rounded-md' src={channel.channelDetails.avatar} alt="" />
                <p className='text-1xl ml-4'>{channel.channelDetails.username}</p>
              </div>
            </div>
          ))
          :
          <p className='text-center p-16 text-4xl font-bold self-center'>No subscriptions</p>
        }
      </div>
    </div>
  )
}

export default Subscription