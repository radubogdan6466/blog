import React, { useState, useEffect } from "react";
import "../components/CommentSection.css";
import { getComments } from "../firebase";
import { deleteComment, deleteReply } from "../firebase";
const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {}, [postId]);
  console.log("PostId încărcat:", postId);

  useEffect(() => {
    // Încarcă comentariile la încărcarea componentului
    const fetchComments = async () => {
      const fetchedComments = await getComments(postId);
      setComments(fetchedComments);
    };

    fetchComments(); // Apelează funcția
  }, [postId]); // Depinde de postId pentru a se reîncărca când se schimbă

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(postId, commentId);
      console.log("comentariu id sters: ", commentId); // Funcție care șterge din Firebase
      setComments(comments.filter((comment) => comment.id !== commentId)); // Elimină local comentariul
    } catch (error) {
      console.error("Eroare la ștergerea comentariului:", error);
    }
  };
  const handleDeleteReply = async (commentId, replyId) => {
    try {
      await deleteReply(postId, commentId, replyId);
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: comment.replies.filter(
                  (reply) => reply.id !== replyId
                ),
              }
            : comment
        )
      );
    } catch (error) {
      console.error("Eroare la ștergerea răspunsului:", error);
    }
  };
  return (
    <div className="CommentSectionMain">
      <div className="divabovecommentsections">
        <p className="commentNumber">{comments.length} COMENTARII</p>
      </div>
      <hr className="hrundercommentsection" />
      <div>
        {comments.map((comment, index) => (
          <div key={comment.id}>
            <div className="CommentComponent">
              {/* Folosește comment.id dacă există */}
              <div>
                <div className="avatarnamedate">
                  <img
                    className="CommentAvatar"
                    alt="User Image Comment"
                    src="https://icon-library.com/images/icon-man-png/icon-man-png-2.jpg"
                  />
                  <div>
                    <p className="CommentName">Name: {comment.name}</p>
                    <p className="CommentPostDate">Date: {comment.date}</p>
                  </div>
                </div>
              </div>
              <div className="divCommentNumber">
                <p className="commentNumber">comment #{index + 1}</p>
              </div>
            </div>
            <div className="WhatUserCommented">
              <p className="WhatUserCommented-comment">
                Comment: {comment.comment}
              </p>
            </div>
            <div className="ActionCommentSection">
              <div className="ReplyDiv">
                <button
                  className="deletecommentbtn"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  <i className="fa-solid fa-trash"></i> Delete
                </button>
              </div>
            </div>

            {comment.replies.map((reply, index) => (
              <div key={reply.id} className="replycommentdiv">
                <div className="replyarrowupdiv">
                  <i className="fa-solid fa-caret-up upreply"></i>
                </div>
                <div className="replyCommentComponent">
                  <div className="replycommentupdata">
                    <div className="replyavatarnamedate">
                      <img
                        className="replyCommentAvatar"
                        alt="User Image Reply"
                        src="https://icon-library.com/images/icon-man-png/icon-man-png-2.jpg"
                      />
                      <div>
                        <p className="replyCommentName">Name:{reply.name}</p>
                        <p className="replyCommentPostDate">
                          Date:{reply.date}
                        </p>
                      </div>
                    </div>
                    <div className="replydivCommentNumber">
                      <p className="replycommentNumber">reply#{index + 1}</p>
                    </div>
                  </div>
                  <div className="replycommentdowndata">
                    <div className="replyWhatUserCommented">
                      <p className="replyWhatUserCommented-comment">
                        reply: {reply.comment}
                      </p>
                    </div>
                  </div>
                  <div className="replyLikeDislikeComment">
                    <button
                      className="delete-reply-btn"
                      onClick={() => handleDeleteReply(comment.id, reply.id)}
                    >
                      🗑️ Șterge
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <hr className="hrundercommentsection" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
