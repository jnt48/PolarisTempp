import React from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../firebase"; 

function Card2({ name, id, isActive }) {
    const navigate = useNavigate();
    const { updateQuestionStatus } = useFirebase(); 

    const cardStyle = {
        width: "250px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        margin: "16px auto",
        fontFamily: "Arial, sans-serif",
    };

    const nameStyle = {
        fontSize: "18px",
        marginBottom: "12px",
        color: "#333",
    };

    const buttonStyle = {
        padding: "8px 16px",
        fontSize: "14px",
        color: "#fff",
        backgroundColor: "#007bff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    };

    const buttonHoverStyle = {
        backgroundColor: "#0056b3",
    };

    const deactivateButtonStyle = {
        ...buttonStyle,
        backgroundColor: "#dc3545",
    };

    const deactivateButtonHoverStyle = {
        backgroundColor: "#a71d2a",
    };

    const handleMakeActive = async () => {
        try {
            await updateQuestionStatus(id, true);
            alert("Question marked as active successfully!");
        } catch (error) {
            console.error("Error updating question:", error.message);
            alert("Failed to update the question. See console for details.");
        }
    };

    const handleDeactivate = async () => {
        try {
            await updateQuestionStatus(id, false); 
            alert("Question deactivated successfully!");
        } catch (error) {
            console.error("Error updating question:", error.message);
            alert("Failed to update the question. See console for details.");
        }
    };

    return (
        <div style={cardStyle}>
            <h3 style={nameStyle}>{name}</h3>
            <p>Status: {isActive ? "Active" : "Inactive"}</p>
            <button
                style={buttonStyle}
                onClick={handleMakeActive}
                onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
                onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
                disabled={isActive} 
            >
                Make Active
            </button>
            <button
                style={deactivateButtonStyle}
                onClick={handleDeactivate}
                onMouseOver={(e) => (e.target.style.backgroundColor = deactivateButtonHoverStyle.backgroundColor)}
                onMouseOut={(e) => (e.target.style.backgroundColor = deactivateButtonStyle.backgroundColor)}
                disabled={!isActive} 
            >
                Deactivate
            </button>
            <button
                style={{ ...buttonStyle, backgroundColor: "#28a745", marginTop: "10px" }}
                onClick={() => navigate(`/question/${id}`)}
            >
                Go to Question
            </button>
        </div>
    );
}

export default Card2;
