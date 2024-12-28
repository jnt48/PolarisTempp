import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

function Leaderboard() {
    const [teams, setTeams] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
       
        const db = getDatabase();
        const teamsRef = ref(db, 'teams');

        const unsubscribe = onValue(
            teamsRef,
            (snapshot) => {
                const data = snapshot.val();

                if (data) {
              
                    const teamData = Object.keys(data).map((key) => ({
                        id: key,
                        ...data[key],
                    }));

                    
                    teamData.sort((a, b) => b.overall - a.overall);
                    setTeams(teamData);
                } else {
                    setTeams([]);
                }
            },
            (error) => {
                console.error('Error fetching teams:', error);
                setError(error.message);
            }
        );

        return () => unsubscribe();
    }, []);

    return (
        <div className="wrapper-about" style={{ padding: '20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Leaderboard</h1>
            {error ? (
                <h2 style={{ color: 'red', textAlign: 'center' }}>Error: {error}</h2>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Rank</th>
                            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Team Name</th>
                            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Overall Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams.map((team, index) => (
                            <tr key={team.id}>
                                <td
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: '10px',
                                        textAlign: 'center',
                                    }}
                                >
                                    {index + 1}
                                </td>
                                <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                                    {team.teamName}
                                </td>
                                <td
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: '10px',
                                        textAlign: 'center',
                                    }}
                                >
                                    {team.overall}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Leaderboard;