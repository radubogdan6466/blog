import React, { useState } from "react";
import "./CommentSection.css";
import FormComment from "../components/FormComment";
const CommentSection = () => {
  const [replyVisible, setReplyVisible] = useState(null);
  const [mainFormVisible, setMainFormVisible] = useState(true);
  const handleReplyClick = (commentId) => {
    setReplyVisible(replyVisible === commentId ? null : commentId);
    setMainFormVisible(replyVisible === commentId);
  };
  const handleCancelReply = () => {
    setReplyVisible(null);
    setMainFormVisible(true);
  };
  return (
    <div className="CommentSectionMain">
      <div className="divabovecommentsections">
        <p className="commentNumber">30 COMENTARII</p>
        <button className="sharebtncommentpage">somethingbtn</button>
      </div>
      <hr className="hrundercommentsection" />
      <div>
        <div className="CommentComponent">
          <div>
            <div className="avatarnamedate">
              <img
                className="CommentAvatar"
                alt="User Image Comment"
                src="https://icon-library.com/images/icon-man-png/icon-man-png-2.jpg"
              />
              <div>
                <p className="CommentName">Allen</p>
                <p className="CommentPostDate">
                  marți, 18 februarie 2025, 15:00
                </p>
              </div>
            </div>
          </div>
          <div className="divCommentNumber">
            <p className="commentNumber">#1</p>
          </div>
        </div>
        <div className="WhatUserCommented">
          <p className="WhatUserCommented-comment">
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using 'Content here, content
            here',
          </p>
        </div>
        <div className="ActionCommentSection">
          <div className="ReplyDiv">
            <button
              className="replycommentbtn"
              onClick={() => handleReplyClick(1)}
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
        {/* Formularul de răspuns apare doar sub comentariul corespunzător */}
        {replyVisible === 1 && (
          <div className="reply-form">
            <FormComment onCancel={handleCancelReply} isReply={true} />
          </div>
        )}
        <div className="replycommentdiv">
          <div className="replyarrowupdiv">
            <i class="fa-solid fa-caret-up upreply"></i>
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
                  <p className="replyCommentName">Rashid</p>
                  <p className="replyCommentPostDate">
                    marți, 18 februarie 2025, 15:23
                  </p>
                </div>
              </div>

              <div className="replydivCommentNumber">
                <p className="replycommentNumber">#2</p>
              </div>
            </div>
            <div className="replycommentdowndata">
              <div className="replyWhatUserCommented">
                <p className="replyWhatUserCommented-comment">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s.
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
        <hr className="hrundercommentsection" />
        {/* Formularul principal este ascuns când se deschide un reply */}
        {mainFormVisible && <FormComment />}{" "}
      </div>
    </div>
  );
};

export default CommentSection;
