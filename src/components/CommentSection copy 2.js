import React, { useState, useEffect } from "react";
import "./CommentSection.css";
import FormComment from "../components/FormComment";
import { addComment, getComments, addReply } from "../firebase";
import { v4 as uuidv4 } from "uuid";

const CommentSection = ({ comment, postId }) => {
  const [replyVisible, setReplyVisible] = useState(null);
  const [mainFormVisible, setMainFormVisible] = useState(true);
  const [replyData, setReplyData] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    name: "",
    comment: "",
  });
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

  const handleReplyClick = (commentId) => {
    setReplyVisible(replyVisible === commentId ? null : commentId);
    setMainFormVisible(replyVisible === commentId);

    // Inițializează un obiect pentru reply
    if (replyVisible === commentId) {
      setReplyData({ ...replyData, comment: "" }); // Resetează doar comentariul din reply
    }
  };

  const handleCancelReply = () => {
    setReplyVisible(null);
    setMainFormVisible(true);
  };

  // Funcție de actualizare pentru reply
  const handleReplyInputChange = (e) => {
    const { name, value } = e.target;
    setReplyData({
      ...replyData,
      [name]: value,
    });
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    if (!replyData.comment.trim() || !replyData.name) {
      console.error("Comentariul sau numele lipsește!");
      return;
    }

    const reply = {
      id: new Date().getTime(), // Poți folosi și uuid pentru un ID unic
      name: replyData.name,
      comment: replyData.comment,
      date: new Date().toLocaleString(),
    };

    try {
      // Asigură-te că 'comment' este definit corect și îl folosești
      if (comment && comment.id) {
        await addReply(postId, comment.id, reply); // Folosește comment.id
        setComments((prevComments) =>
          prevComments.map((existingComment) =>
            existingComment.id === comment.id
              ? {
                  ...existingComment,
                  replies: [...existingComment.replies, reply],
                }
              : existingComment
          )
        );
        setReplyData({ ...replyData, comment: "" }); // Resetează doar câmpul de răspuns
      } else {
        console.error("Comentariul la care se răspunde nu este definit");
      }
    } catch (error) {
      console.error("Eroare la adăugarea răspunsului:", error);
    }
  };

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
                  onClick={() => handleReplyClick(comment.id)}
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
            {replyVisible === comment.id && (
              <div className="reply-form">
                <FormComment
                  onCancel={handleCancelReply}
                  isReply={true}
                  onInputChange={handleReplyInputChange}
                  newComment={newComment}
                  setNewComment={setNewComment}
                  onSubmit={(e) => handleReplySubmit(e, comment.id)} // Trimite cu ID-ul comentariului
                  postId={postId} // Transmite ID-ul postării
                  commentId
                />
              </div>
            )}
            {/* Afișează reply-urile */}
            {comment.replies.map((reply, index) => (
              <div className="replycommentdiv">
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
                        <p className="replyCommentName">reply name</p>
                        <p className="replyCommentPostDate">reply date</p>
                      </div>
                    </div>
                    <div className="replydivCommentNumber">
                      <p className="replycommentNumber">#3</p>
                    </div>
                  </div>
                  <div className="replycommentdowndata">
                    <div className="replyWhatUserCommented">
                      <p className="replyWhatUserCommented-comment">
                        reply comment
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
            onCancel={handleCancelReply}
            onInputChange={handleInputChange}
            newComment={newComment}
            setNewComment={setNewComment}
            handleSubmit={handleCommentSubmit} // Funcția de submit a comentariului
            postId={postId} // Transmite ID-ul postării
            commentId
          />
        )}
      </div>
    </div>
  );
};

export default CommentSection;
