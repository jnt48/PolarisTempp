
import React, { useEffect, useState } from "react";
import Card2 from "../Components/CasdIsActive";
import Leaderboard from "../Components/LeaderBoard";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { useFirebase } from "../firebase";

function Admin() {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [lightState, setLightState] = useState("green");
  const firebase = useFirebase();

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

    const db = getDatabase(firebase.app);
    const lightRef = ref(db, 'lightState');
    onValue(lightRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setLightState(data.current);
      }
    });
  }, []);

  const toggleLight = async (newState) => {
    try {
      const db = getDatabase(firebase.app);
      const lightRef = ref(db, 'lightState');
      await set(lightRef, {
        current: newState,
        timestamp: Date.now()
      });
      setLightState(newState);
    } catch (err) {
      console.error("Error toggling light:", err);
      setError("Failed to toggle light state");
    }
  };

  const LightControl = () => (
    <div style={{ 
      display: 'flex', 
      gap: '10px', 
      justifyContent: 'center', 
      marginBottom: '20px',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px'
    }}>
      <button
        style={{
          padding: '10px 20px',
          backgroundColor: lightState === 'green' ? '#4CAF50' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
        onClick={() => toggleLight('green')}
      >
        Green Light
      </button>
      <button
        style={{
          padding: '10px 20px',
          backgroundColor: lightState === 'red' ? '#dc3545' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
        onClick={() => toggleLight('red')}
      >
        Red Light
      </button>
      <div style={{
        padding: '10px 20px',
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        Current State: <strong>{lightState.toUpperCase()}</strong>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "20px" }}>
      {error ? (
        <h1>{error}</h1>
      ) : (
        <>
          <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
            Admin Dashboard
          </h1>
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
          
          {/* Add Light Control Component */}
          <LightControl />

          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Questions</h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {questions.map((question) => (
              <Card2
                key={question.id}
                name={`${question.name} (Active: ${
                  question.isActive ? "Yes" : "No"
                })`}
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