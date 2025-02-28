import axios from 'axios';
import { useEffect, useState } from 'react'
import useVideo from '../../contexts/VideoContext';
import { FaPencil, FaCheck, FaTrash } from "react-icons/fa6";
import "./comment.css"
import { useNavigate } from 'react-router-dom';


function CommentSection({ entityId, apiEndpoints, user, token, parentType }) {
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { timeAgo } = useVideo();
  const navigate = useNavigate();

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

    if (newComment === "") {
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

  const handleEditClick = (comment) => {
    setEditingCommentId(comment._id);
    setEditedContent(comment.content);
  };

  const handleSaveEdit = async (commentId) => {
    try {
      setLoading(true);
      const res = await axios.patch(
        `${apiEndpoints.updateComment}/${entityId}/${commentId}`,
        { content: editedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setEditingCommentId(null); // Exit edit mode
        getComments(); // Refresh comments
      }
    } catch (err) {
      console.error("Error updating comment:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      setLoading(true);
      const res = await axios.delete(`${apiEndpoints.deleteComment}/${entityId}/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        getComments(); // Refresh comments after deletion
      }
    } catch (err) {
      console.error("Error deleting comment:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const inspectChannel = (channelName) => {
    navigate(`/user/c/${channelName}`);
  };

  // let limit = 10;
  // const totalPages = Math.ceil(commentCount / parseInt(limit, 10));
  // we need this info for the pagination

  return (
    <div className='relative bg-gray-300 dark:bg-gray-800 rounded-md mx-auto w-full max-w-3xl p-0.5 sm:p-2'>
      <h1 className='text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 m-4'>
        Comments ({commentCount})</h1>
      {/* Comment Input */}
      <form
        onSubmit={handleCommentSubmit}
        className="flex items-center bg-gray-100 dark:bg-gray-700 p-2 rounded-md mx-4 mt-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full flex-1 bg-transparent border-none focus:outline-none text-gray-900 dark:text-white p-0.5 text-sm sm:text-base placeholder-gray-500 dark:placeholder-gray-400"
        />
        <button
          type="submit"
          className={`bg-gray-500 px-3 py-1 ml-2 rounded-md text-white font-semibold 
          ${newComment === "" ? "hover:bg-gray-500 cursor-not-allowed" : "hover:bg-gray-800"} transition`}
          disabled={newComment === ""}
        >
          Post
        </button>
      </form>

      {/* Comment List */}
      {
        comments.length ?
          <div
            className='m-4'>
            {comments.map(((comment) => (
              <div
                key={comment._id}
                className='bg-gray-100 dark:bg-black/40 p-3 rounded-md mt-3'>
                <div className='flex items-center'>
                  <div className='flex cursor-pointer items-center'
                    onClick={() => inspectChannel(comment.owner.username)}>
                    <img
                      src={comment.owner.avatar}
                      alt="user avatar"
                      className='w-5 h-5 rounded-full ' />
                    <p className='text-gray-900 dark:text-white ml-2 hover:underline'>
                      {comment.owner.username}
                    </p>
                  </div>

                  {/* Operations on comment menu */}
                  <div className='ml-auto'>
                    {/* Edit/Save button (Only for the comment owner) */}
                    {user && user._id === comment.owner?._id && (
                      <button
                        onClick={() => {
                          if (editingCommentId === comment._id) {
                            handleSaveEdit(comment._id);
                          } else {
                            handleEditClick(comment);
                          }
                        }}
                        className="ml-auto p-1 transition-transform duration-200 hover:scale-110 hover:text-gray-600 dark:hover:text-gray-300 hover:rotate-[-10deg]"
                      >
                        {loading ?
                          <div className="w-5 h-5 border-2 border-gray-600 dark:border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                          :
                          <div>
                            {editingCommentId === comment._id ? (
                              <FaCheck size={16} className='text-lime-500 dark:text-lime-500' /> // Save icon when editing
                            ) : (
                              <FaPencil size={16} className='text-gray-500 dark:text-white' /> // Edit icon by default
                            )}
                          </div>
                        }
                      </button>
                    )}
                    {/* Delete Button (Only for the comment owner) */}
                    {user && user._id === comment.owner?._id && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="ml-2 p-1 transition-transform duration-200 hover:scale-125 text-red-700/80 dark:text-red-500/90 hover:rotate-[-10deg]"
                      >
                        <FaTrash size={16} className="transition-all duration-200" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Comment created at */}
                <p className='text-gray-600 dark:text-gray-500 text-xs'>{timeAgo(comment.createdAt)}</p>


                {/* content */}
                {/* Comment Text - Editable Only When in Edit Mode */}
                {editingCommentId === comment._id ? (
                  <input
                    type="text"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="bg-gray-300 dark:bg-gray-700 p-2 rounded-md text-gray-900 dark:text-white focus:outline-none mt-2 text-sm sm:text-base w-full"
                  />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                )}
              </div>
            )))}
          </div>
          :
          <div className='text-gray-500 dark:text-gray-400 text-center m-8 '>
            No comment yet
          </div>
      }
    </div >
  )
}

export default CommentSection