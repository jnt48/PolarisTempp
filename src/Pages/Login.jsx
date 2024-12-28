import React, { useState } from 'react';
import { useFirebase } from '../firebase';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [teamName, setTeamName] = useState('');
    const [leaderEmail, setLeaderEmail] = useState('');
    const firebase = useFirebase();
    const navigate = useNavigate();

    async function handleLogin(event) {
        event.preventDefault();
        try {
            const userCredential = await firebase.signInUser(leaderEmail, teamName);
            const user = userCredential.user;

            const teamData = await firebase.getTeamByUID(user.uid);
            if (teamData.teamName === teamName) {
                alert('Login Successful!');
                navigate('/');
            } else {
                throw new Error('Team Name does not match records!');
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f4f6f8',
                padding: '20px',
            }}
        >
            <div
                style={{
                    maxWidth: '400px',
                    width: '100%',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                    borderRadius: '10px',
                    backgroundColor: '#fff',
                    padding: '30px',
                }}
            >
                <h3 style={{ textAlign: 'center', fontWeight: '700', color: '#007bff' }}>
                    Team Login
                </h3>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Team Name"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '10px',
                            marginBottom: '15px',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                        }}
                    />
                    <input
                        type="email"
                        placeholder="Leader's Email"
                        value={leaderEmail}
                        onChange={(e) => setLeaderEmail(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '10px',
                            marginBottom: '15px',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            fontSize: '16px',
                            cursor: 'pointer',
                        }}
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
export default Login;