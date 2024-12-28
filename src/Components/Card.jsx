import React from "react";
import { useNavigate } from "react-router-dom";

function Card({ name, id, isActive }) {
    const navigate = useNavigate();

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

    const handleViewClick = () => {
        if (isActive) {
            navigate(`/question/${id}`);
        } else {
            alert("This question is not public yet. Please wait for the admin to make it active.");
        }
    };

    return (
        <div style={cardStyle}>
            <h3 style={nameStyle}>{name}</h3>
            <button
                style={buttonStyle}
                onClick={handleViewClick}
                onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
                onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
            >
                View
            </button>
        </div>
    );
}

export default Card;
