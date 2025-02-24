// hooks/useSubscriberCount.js
import { useEffect, useState } from "react";
import axios from "axios";

const useSubscriberCount = (channelId, dependency = []) => {
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [countLoading, setCountLoading] = useState(false);

  useEffect(() => {
    if (!channelId) return;

    setCountLoading(true);

    axios.get(
      `https://youtube-backend-clone.onrender.com/api/v1/subscription/get-subscriber-count/${channelId}`
    )
      .then((res) => {
        if (res.data.success) {
          setSubscriberCount(res.data.message.subscriberCount);
        }
      })
      .catch((err) => {
        console.error("Error fetching subscriber count", err);
      })
      .finally(() => {
        setCountLoading(false);
      });

  }, [channelId, ...dependency]); // ✅ Add subscriptionChanged as dependency

  return { subscriberCount, countLoading };
};

export default useSubscriberCount;