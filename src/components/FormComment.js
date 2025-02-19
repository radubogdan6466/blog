import React from "react";
import "./FormComment.css";

const FormComment = () => {
  return (
    <div className="main-form-comment">
      <p className="form-info">
        Câmpurile marcate cu * sunt obligatorii! Adresa de email nu va fi
        publicata.
      </p>
      <form className="comment-form">
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Nume *
          </label>
          <input
            className="form-input"
            type="text"
            id="name"
            name="name"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Adresa email *
          </label>
          <input
            className="form-input"
            type="email"
            id="email"
            name="email"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="website">
            Website
          </label>
          <input
            className="form-input"
            type="url"
            id="website"
            name="website"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="comment">
            Comentariu *
          </label>
          <textarea
            className="form-textarea"
            id="comment"
            name="comment"
            required
          ></textarea>
        </div>

        <button className="form-button" type="submit">
          Trimite comentariu
        </button>
      </form>
    </div>
  );
};

export default FormComment;
