import { useState, useEffect } from 'react'
import useAuth from '../contexts/AuthContext'
import axios from 'axios';

function Subscription() {
  const [subscription, setSubscriptions] = useState([]);
  const { user, loading, setLoading } = useAuth();


  useEffect(() => {
    if (!user?._id) {
      setLoading(false); // ✅ Stop loading if no user is found
      return;
    }
    setLoading(true); // ✅ Start loading before fetching data

    axios.get(
      `http://localhost:8000/api/v1/subscription/get-subscribed-channels/${user._id}`
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

  return (
    <div>
      {subscription.length ?
        subscription.map((channel) => (
          <div key={channel._id} className='flex justify-center'>
            <div className='bg-gray-700 w-1/2 p-4 m-2 rounded-sm flex flex-row'>
              <img className='w-10 h-10 object-cover rounded-md' src={channel.channelDetails.avatar} alt="" />
              <p className='text-1xl ml-4'>{channel.channelDetails.username}</p>
            </div>
          </div>
        ))
        :
        <p className='text-center p-16 text-4xl font-bold'>No subscriptions</p>
      }
    </div>
  )
}

export default Subscription