//FormComment.js
import React from "react";
import "./FormComment.css";
const FormComment = ({
  handleSubmit,
  newComment,
  setNewComment,
  onCancel,
  isReply,
  commentId,
}) => {
  // Funcție pentru a actualiza valorile din formular
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Actualizează starea 'newComment' cu datele din formular
    setNewComment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={`main-form-comment ${isReply ? "reply-form" : ""}`}>
      {!isReply && (
        <p className="form-info">
          Câmpurile marcate cu * sunt obligatorii! Adresa de email nu va fi
          publicata.
        </p>
      )}
      {isReply && (
        <button className="cancel-reply-btn" onClick={onCancel}>
          Anulează răspunsul
        </button>
      )}

      <form
        className="comment-form"
        onSubmit={(e) => handleSubmit(e, commentId)}
      >
        <div className="form-group">
          <input
            placeholder="Nume*"
            className="form-input"
            type="text"
            id="name"
            name="name"
            value={newComment.name} // Folosește newComment.name
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            placeholder="Adresa email *"
            className="form-input"
            type="email"
            id="email"
            name="email"
            // value={newComment.email}
            // onChange={onInputChange}
          />
        </div>

        <div className="form-group">
          <input
            placeholder="Website"
            className="form-input"
            type="url"
            id="website"
            name="website"
          />
        </div>

        <div className="form-group">
          <textarea
            placeholder={isReply ? "Scrie un răspuns..." : "Comentariu *"}
            className="form-textarea"
            id="comment"
            name="comment"
            value={newComment.comment}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        <button className="form-button" type="submit">
          {isReply ? "Trimite răspuns" : "Trimite comentariu"}
        </button>
      </form>
    </div>
  );
};

export default FormComment;
