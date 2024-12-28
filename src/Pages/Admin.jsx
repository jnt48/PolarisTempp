import React, { useEffect, useState } from "react";
import Card2 from "../Components/CasdIsActive";
import Leaderboard from "../Components/LeaderBoard";

function Admin() {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch(
          "https://polaris-5c2b4-default-rtdb.firebaseio.com/Question4.json"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }
        const data = await response.json();
        if (data) {
          const questionList = Object.entries(data).map(([id, question]) => ({
            id,
            ...question,
          }));
          setQuestions(questionList);
        } else {
          setQuestions([]);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching questions:", err);
      }
    }

    fetchQuestions();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      {error ? (
        <h1>{error}</h1>
      ) : (
        <>
          <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Admin Dashboard</h1>
          <button
            style={{
              padding: "10px 20px",
              marginBottom: "20px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => {
          
              console.log("User signed out");
            }}
          >
            Log Out
          </button>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Questions</h2>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
            {questions.map((question) => (
              <Card2
                key={question.id}
                name={`${question.name} (Active: ${question.isActive ? "Yes" : "No"})`}
                id={question.id}
                isActive={question.isActive}
              />
            ))}
          </div>
          <Leaderboard />
        </>
      )}
    </div>
  );
}

export default Admin;
