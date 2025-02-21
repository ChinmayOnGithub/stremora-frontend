import axios from 'axios';
import { useEffect, useState } from 'react'
import useVideo from '../contexts/VideoContext';
import { FaPencil } from "react-icons/fa6";


function CommentSection({ entityId, apiEndpoints, user, token, parentType }) {
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [newComment, setNewComment] = useState("");
  const { timeAgo } = useVideo();

  const getComments = async () => {
    try {
      const res = await axios.get(`${apiEndpoints.getComments}/${entityId}?parentType=${parentType}`)
      if (res.data.success) {
        setCommentCount(res.data.message.totalComments);
        setComments(res.data.message.comments);
      }
    } catch (err) {
      console.log("Something went wrong", err);
    }
  }
  useEffect(() => {
    getComments();
  }, [entityId])


  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      console.log("Please login to comment on a video");

      return
    }

    try {
      const res = await axios.post(`${apiEndpoints.addComment}/${entityId}?parentType=${parentType}`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}` // Ensure authToken is correctly set
          }
        }
      )
      if (res.data.success) {
        console.log("Added comment successfully.");
        // ✅ Update UI by fetching new comments
        setNewComment(""); // Clear input field after successful comment
        getComments(); // Fetch updated comments
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className='relative bg-gray-800/60 h-full rounded-md mx-auto w-full'>
      <h1 className='m-4'>Comments ({commentCount})</h1>
      {/* Comment Input */}
      <form onSubmit={handleCommentSubmit} className="flex items-center bg-gray-700 p-1 rounded-md mx-4">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-grow bg-transparent border-none focus:outline-none text-white p-2"
        />
        <button
          type="submit"
          className="bg-gray-500 px-2  py-1 m-1 rounded-md text-white font-semibold hover:bg-gray-800 transition">
          Post
        </button>
      </form>

      {
        comments ?
          <div
            className='m-4'>
            {comments.map(((comment) => (
              <div
                key={comment._id}
                className='bg-black/40 p-2 rounded-md mt-3'>
                <div className='flex'>
                  <img src={comment.owner.avatar} alt="user avatar" className='w-5 h-5 rounded-full' />
                  <p className='text-white/80 ml-2'>{comment.owner.username}</p>
                  <FaPencil
                    size={16} color="white"
                    className='ml-auto mr-1'
                  />

                </div>
                <p className='text-white/70 text-xs'>{timeAgo(comment.createdAt)}</p>
                {/* content */}
                <div className=''>
                  {/* <input type="text"
                    value={comment.content}
                    className='read-only select-none' /> */}
                  {comment.content}
                </div>
              </div>
            )))}
          </div>
          :
          <div>
            No comment
          </div>
      }

    </div >
  )
}

export default CommentSection