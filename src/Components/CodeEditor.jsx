import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { oneDark } from "@codemirror/theme-one-dark";
import { doc, updateDoc, increment } from "firebase/firestore"; 
import { useFirebase } from "../firebase"; 

const CodeEditor = ({ teacherCode }) => {
  const firebase = useFirebase(); 
  const navigate = useNavigate(); 
  const [code, setCode] = useState("#include<stdio.h>\nint main() {\n    printf(\"Hello, World!\\n\");\n    return 0;\n}");
  const [output, setOutput] = useState("");
  const [evaluationResult, setEvaluationResult] = useState("");

  const handleRunCode = async () => {
    try {
      const response = await fetch("http://localhost:5000/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setOutput(result.output);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const handleSubmitCode = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/evaluate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacher_code: teacherCode,
          student_code: code,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      setEvaluationResult(result.result);
  
     
      const scoreMatch = result.result.match(/Score:\s(\d+)/);
      const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
  
     
      if (firebase.user) {
        const teamDocRef = doc(firebase.firestore, "Teams", firebase.user.uid);
        await updateDoc(teamDocRef, {
          round4: score, 
          overall: increment(score),
        });
  
     
        const backendResponse = await fetch("http://127.0.0.1:8000/save-score/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: firebase.user.uid, 
            score: score, 
            round: "round4", 
          }),
        });
  
        if (!backendResponse.ok) {
          throw new Error(`Failed to send score to backend! Status: ${backendResponse.status}`);
        }
  
        const backendResult = await backendResponse.json();
        console.log("Score sent to backend:", backendResult);
  
        
        alert(`Your score is: ${score}`);
        navigate("/");
      }
    } catch (error) {
      setEvaluationResult(`Error: ${error.message}`);
      console.error("Error updating Firestore or sending to backend:", error);
    }
  };
  

  return (
    <div style={{ padding: "20px" }}>
      <h2>C Code Editor</h2>
      <CodeMirror
        value={code}
        height="200px"
        theme={oneDark}
        extensions={[cpp()]}
        onChange={(value) => setCode(value)}
      />
      <button
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={handleRunCode}
      >
        Run Code
      </button>

      <h3>Output:</h3>
      <pre style={{ backgroundColor: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>
        {output || "No output"}
      </pre>

      <button
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={handleSubmitCode}
      >
        Submit Code
      </button>

      <h3>Evaluation Result:</h3>
      <pre style={{ backgroundColor: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>
        {evaluationResult || "No evaluation result"}
      </pre>
    </div>
  );
};

export default CodeEditor;
