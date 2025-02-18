import React from "react";
import "./CommentSection.css";
const CommentSection = () => {
  return (
    <div className="CommentSectionMain">
      <div className="divabovecommentsections">
        <p className="commentNumber">30 COMENTARII</p>
        <button className="sharebtncommentpage">SHARE</button>
      </div>
      <hr className="hrundercommentsection" />
      <div>
        <div className="CommentComponent">
          <div>
            <div className="avatarnamedate">
              <img
                className="CommentAvatar"
                alt="AvatarImage"
                src="https://icon-library.com/images/icon-man-png/icon-man-png-2.jpg"
              />
              <div>
                <p className="CommentName">Marian</p>
                <p className="CommentPostDate">
                  marți, 18 februarie 2025, 15:0
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
            <button className="replycommentbtn">Reply</button>
          </div>
          <div className="LikeDislikeComment">
            <div className="divLikeDislikeComment">
              <img
                className="likebtn"
                alt="likeButton"
                src="https://img.freepik.com/free-vector/follow-social-media-icon-isolated_24640-134160.jpg"
              />
              <p className="likenumber">9</p>
            </div>
            <div className="divLikeDislikeComment">
              <img
                className="likebtn"
                alt="likeButton"
                src="https://img.freepik.com/free-vector/follow-social-media-icon-isolated_24640-134160.jpg"
              />
              <p className="dislikenumber">9</p>
            </div>
          </div>
        </div>
        <hr className="hrundercommentsection" />
      </div>
    </div>
  );
};

export default CommentSection;
