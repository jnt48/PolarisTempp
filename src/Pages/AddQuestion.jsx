import React, { useState } from "react";
import { getDatabase, ref, push } from "firebase/database";

export default function AddQuestion() {
  const [questionNo, setQuestionNo] = useState("");
  const [name, setName] = useState("");
  const [solution, setSolution] = useState("");
  const [question, setQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!questionNo || !name || !solution || !question) {
      alert("Please fill all fields.");
      return;
    }

    if (isNaN(questionNo)) {
      alert("Question Number must be a numeric value.");
      return;
    }

    try {
      setSubmitting(true);
      const db = getDatabase(undefined, "https://polaris-5c2b4-default-rtdb.firebaseio.com/");
      const questionsRef = ref(db, "Question4");
      await push(questionsRef, {
        questionNo: Number(questionNo),
        name,
        solution,
        question,
        isActive: false,
      });

      alert("Question added successfully!");
      setQuestionNo("");
      setName("");
      setSolution("");
      setQuestion("");
    } catch (error) {
      alert("Failed to add question.");
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const containerStyle = {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const titleStyle = {
    textAlign: "center",
    fontSize: "1.8em",
    marginBottom: "20px",
    color: "#333",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
  };

  const formGroupStyle = {
    marginBottom: "15px",
  };

  const labelStyle = {
    display: "block",
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#555",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "1em",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    padding: "10px 15px",
    fontSize: "1.1em",
    color: "#fff",
    backgroundColor: submitting ? "#ccc" : "#007bff",
    border: "none",
    borderRadius: "4px",
    cursor: submitting ? "not-allowed" : "pointer",
    transition: "background-color 0.3s ease",
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Add Question Here</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="questionNo">Question Number:</label>
          <input
            type="number"
            id="questionNo"
            value={questionNo}
            onChange={(e) => setQuestionNo(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="name">Question Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="question">Question Text:</label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
          ></textarea>
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="solution">Solution:</label>
          <textarea
            id="solution"
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            required
            style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
          ></textarea>
        </div>
        <button type="submit" style={buttonStyle} disabled={submitting}>
          {submitting ? "Submitting..." : "Add Question"}
        </button>
      </form>
    </div>
  );
}
