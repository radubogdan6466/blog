import React, { useState, useEffect } from "react";
import "./CommentSection.css";
import FormComment from "../components/FormComment";
import { addComment, getComments, addReply } from "../firebase";
import { v4 as uuidv4 } from "uuid";

const CommentSection = ({ postId }) => {
  const [replyVisible, setReplyVisible] = useState(null);
  const [mainFormVisible, setMainFormVisible] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    name: "",
    comment: "",
  });
  const [newReply, setNewReply] = useState({ name: "", comment: "" });
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {}, [postId]);
  console.log("PostId încărcat:", postId);

  // Functie pentru a adăuga un comentariu
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    // Verifică dacă numele și comentariul sunt completate
    if (!newComment.name || !newComment.comment) {
      return; // Nu trimite comentariul dacă nu sunt completate câmpurile
    }

    const commentData = {
      id: uuidv4(), // Generează un ID unic
      name: newComment.name,
      comment: newComment.comment,
      date: new Date().toLocaleString(),
      replies: [], // Asigură-te că acest câmp nu este undefined
    };

    try {
      await addComment(postId, commentData); // Adaugă în Firebase
      setComments([...comments, commentData]); // Actualizează lista de comentarii (fără să folosești `id`)
      setNewComment({ name: "", comment: "" }); // Resetează câmpurile formularului
    } catch (error) {
      console.error("Eroare la adăugarea comentariului:", error);
    }
  };
  useEffect(() => {
    // Încarcă comentariile la încărcarea componentului
    const fetchComments = async () => {
      const fetchedComments = await getComments(postId);
      setComments(fetchedComments);
    };

    fetchComments(); // Apelează funcția
  }, [postId]); // Depinde de postId pentru a se reîncărca când se schimbă

  // Funcție pentru actualizarea valorilor din formular
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancelReply = () => {
    setReplyVisible(null);
    setMainFormVisible(true);
  };
  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();

    if (!newReply.name || !newReply.comment) {
      return;
    }

    const replyData = {
      id: uuidv4(),
      name: newReply.name,
      comment: newReply.comment,
      date: new Date().toLocaleString(),
    };

    try {
      await addReply(postId, commentId, replyData);

      // Actualizăm local comentariile
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, replies: [...comment.replies, replyData] }
            : comment
        )
      );

      setNewReply({ name: "", comment: "" });
      setReplyingTo(null);
    } catch (error) {
      console.error("Eroare la adăugarea răspunsului:", error);
    }
  };
  useEffect(() => {
    console.log("State updated! replyingTo is now:", replyingTo);
  }, [replyingTo]);
  return (
    <div className="CommentSectionMain">
      <div className="divabovecommentsections">
        <p className="commentNumber">{comments.length} COMENTARII</p>
        <button className="sharebtncommentpage">somethingbtn</button>
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
                    <p className="CommentName">{comment.name}</p>
                    <p className="CommentPostDate">{comment.date}</p>
                  </div>
                </div>
              </div>
              <div className="divCommentNumber">
                <p className="commentNumber">#{index + 1}</p>
              </div>
            </div>
            <div className="WhatUserCommented">
              <p className="WhatUserCommented-comment">{comment.comment}</p>
            </div>
            <div className="ActionCommentSection">
              <div className="ReplyDiv">
                <button
                  className="replycommentbtn"
                  onClick={() => {
                    console.log(
                      "replyingTo:",
                      replyingTo,
                      "comment.id:",
                      comment.id
                    );
                    setReplyingTo(comment.id);
                  }}
                >
                  <i className="fa-solid fa-reply replycon"></i>reply
                </button>
              </div>
              <div className="LikeDislikeComment">
                <div className="divLikeDislikeComment">
                  <i className="fa-solid fa-thumbs-up likebtn"></i>
                  <p className="likenumber">0</p>
                </div>
                <div className="divLikeDislikeComment">
                  <i className="fa-solid fa-thumbs-down dislikebtn"></i>
                  <p className="dislikenumber">0</p>
                </div>
              </div>
            </div>
            {/* <hr className="hrundercommentsection" /> */}
            {/* Formularul de răspuns apare doar sub comentariul corespunzător */}
            {replyingTo === comment.id && (
              <div className="reply-form">
                <FormComment
                  handleSubmit={(e) => handleReplySubmit(e, comment.id)}
                  newComment={newReply}
                  setNewComment={setNewReply}
                  onCancel={() => setReplyingTo(null)}
                  isReply={true}
                  commentId={comment.id}
                />
              </div>
            )}
            {/* Afișează reply-urile */}
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
                        <p className="replyCommentName">{reply.name}</p>
                        <p className="replyCommentPostDate">{reply.date}</p>
                      </div>
                    </div>
                    <div className="replydivCommentNumber">
                      <p className="replycommentNumber">#{index + 1}</p>
                    </div>
                  </div>
                  <div className="replycommentdowndata">
                    <div className="replyWhatUserCommented">
                      <p className="replyWhatUserCommented-comment">
                        {reply.comment}
                      </p>
                    </div>
                  </div>
                  <div className="replyLikeDislikeComment">
                    <div className="replydivLikeDislikeComment">
                      <i className="fa-solid fa-thumbs-up replylikebtn"></i>
                      <p className="replylikenumber">0</p>
                    </div>
                    <div className="replydivLikeDislikeComment">
                      <i className="fa-solid fa-thumbs-down replydislikebtn"></i>
                      <p className="replydislikenumber">0</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <hr className="hrundercommentsection" />
          </div>
        ))}
        {/* Formularul principal este ascuns când se deschide un reply */}
        {mainFormVisible && (
          <FormComment
            handleSubmit={handleCommentSubmit}
            newComment={newComment}
            setNewComment={setNewComment}
            onCancel={() => setReplyingTo(null)}
            postId={postId}
          />
        )}
      </div>
    </div>
  );
};

export default CommentSection;
