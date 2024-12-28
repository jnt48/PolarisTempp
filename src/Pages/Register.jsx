import React, { useState } from 'react';
import { useFirebase } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
    const [teamName, setTeamName] = useState('');
    const [leaderEmail, setLeaderEmail] = useState('');
    const [members, setMembers] = useState(['', '', '', '']);
    const firebase = useFirebase();
    const navigate = useNavigate();

    async function handleCreate(event) {
        event.preventDefault();
        const password = teamName;

        try {
           
            const userCredential = await firebase.signUpUser(leaderEmail, password);
            const user = userCredential.user;

            // Prepare the team data
            const teamData = {
                teamName,
                leaderEmail,
                members,
                uid: user.uid,
                round1: 0,
                round2: 0,
                round3: 0,
                round4: 0,
                overall: 0,
            };

        
            const apiURL = `https://polaris-5c2b4-default-rtdb.firebaseio.com/teams/${user.uid}.json`;

            const response = await fetch(apiURL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(teamData),
            });

            if (!response.ok) {
                throw new Error('Failed to save team data to Realtime Database');
            }

            alert('Team Registered Successfully!');
            navigate('/');
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
                    maxWidth: '500px',
                    width: '100%',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                    borderRadius: '10px',
                    backgroundColor: '#fff',
                    padding: '30px',
                }}
            >
                <h3 style={{ textAlign: 'center', fontWeight: '700', color: '#007bff' }}>
                    Register Your Team
                </h3>
                <form onSubmit={handleCreate}>
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
                    {members.map((member, index) => (
                        <input
                            key={index}
                            type="text"
                            placeholder={`Member ${index + 1}`}
                            value={member}
                            onChange={(e) =>
                                setMembers((prev) => {
                                    const newMembers = [...prev];
                                    newMembers[index] = e.target.value;
                                    return newMembers;
                                })
                            }
                            style={{
                                width: '100%',
                                padding: '10px',
                                marginBottom: '15px',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                            }}
                        />
                    ))}
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
                        Register
                    </button>
                </form>
                <p
                    style={{
                        textAlign: 'center',
                        marginTop: '20px',
                        fontSize: '14px',
                        color: '#555',
                    }}
                >
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        style={{
                            color: '#007bff',
                            textDecoration: 'none',
                            fontWeight: '500',
                        }}
                    >
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
