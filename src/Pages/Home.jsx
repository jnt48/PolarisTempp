import React, { useEffect, useState } from 'react';
import { getDatabase, ref, get, child } from "firebase/database";
import { useFirebase } from '../firebase';
import Card from '../Components/Card';
import Leaderboard from '../Components/LeaderBoard';

function Home() {
    const firebase = useFirebase();
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState(null);
    const [teamName, setTeamName] = useState('');

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const db = getDatabase();
                const dbRef = ref(db);
                const snapshot = await get(child(dbRef, "Question4"));
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const questionList = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    }));
                    setQuestions(questionList);
                } else {
                    setError("No questions available.");
                }
            } catch (err) {
                setError("Failed to fetch questions");
                console.error("Error fetching questions:", err);
            }
        }

        async function fetchTeamName() {
            try {
                if (firebase.user) {
                    const db = getDatabase();
                    const dbRef = ref(db, `teams/${firebase.user.uid}`);
                    const snapshot = await get(dbRef);
                    if (snapshot.exists()) {
                        const teamData = snapshot.val();
                        setTeamName(teamData.teamName);
                    } else {
                        console.error("Team name not found.");
                    }
                }
            } catch (err) {
                console.error("Error fetching team name:", err);
            }
        }

        fetchQuestions();
        fetchTeamName();
    }, [firebase]);

    return (
        <div style={{ padding: '20px' }}>
            {error ? (
                <h1>{error}</h1>
            ) : (
                <>
                    {teamName && <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Welcome, Team {teamName}!</h1>}
                    <button onClick={() => { firebase.signOutUser() }}>Log Out</button>
                    <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Questions</h1>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {questions.map((question, index) => (
                            <Card key={index} name={question.name} id={question.id} isActive={question.isActive} />
                        ))}
                    </div>
                    <Leaderboard />
                </>
            )}
        </div>
    );
}

export default Home;
