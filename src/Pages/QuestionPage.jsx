
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFirebase } from '../firebase';
import { getDatabase, ref, onValue, get } from 'firebase/database';
import CodeEditor from '../Components/CodeEditor';

function QuestionPage() {
    const { id } = useParams();
    const [questionData, setQuestionData] = useState(null);
    const [error, setError] = useState(null);
    const [evaluationResult, setEvaluationResult] = useState(null);
    const [lightState, setLightState] = useState('green');
    const firebase = useFirebase();

<<<<<<< HEAD
    useEffect(() => {
        const fetchQuestionData = async () => {
            try {
                const db = getDatabase(firebase.app);
                const questionRef = ref(db, `Question4/${id}`);
                const snapshot = await get(questionRef);

                if (snapshot.exists()) {
                    setQuestionData(snapshot.val());
                } else {
                    setError('Question not found');
                }
            } catch (err) {
                setError('Error fetching question data');
                console.error('Error fetching question:', err);
=======
    const fetchQuestionData = async () => {
        try {
            const db = getDatabase(firebase.app);
            const questionRef = ref(db, `Question4/${id}`);
            const snapshot = await get(questionRef);

            if (snapshot.exists()) {
                setQuestionData(snapshot.val());
            } else {
                setError('Question not found');
>>>>>>> 6ef4c230293d99f71e9bb5d7e919bcdd5cd9babd
            }
        };

        fetchQuestionData();

        
        const db = getDatabase(firebase.app);
        const lightRef = ref(db, 'lightState');
        const unsubscribe = onValue(lightRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setLightState(data.current);
            }
        });

        return () => unsubscribe();
    }, [id, firebase.app]);

    const pageStyle = {
        minHeight: '100vh',
        backgroundColor: lightState === 'red' ? '#d32f2f' : '#e8f5e9',
        transition: 'background-color 0.5s ease',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
    };

<<<<<<< HEAD
    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: lightState === 'red' ? '#d32f2f' : 'transparent',
        color: 'white',
        display: lightState === 'red' ? 'flex' : 'none',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '30px',
        fontWeight: 'bold',
        zIndex: 2000,
    };

=======
    useEffect(() => {

           fetchQuestionData();

        // Set up listener for light state
        const db = getDatabase(firebase.app);
        const lightRef = ref(db, 'lightState');
        const unsubscribe = onValue(lightRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setLightState(data.current);
            }
        });

        return () => unsubscribe();
    }, [id, firebase.app]);

    const pageStyle = {
        minHeight: '100vh',
        backgroundColor: lightState === 'red' ? '#d32f2f' : '#e8f5e9',
        transition: 'background-color 0.5s ease',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
    };

    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: lightState === 'red' ? '#d32f2f' : 'transparent',
        color: 'white',
        display: lightState === 'red' ? 'flex' : 'none',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '30px',
        fontWeight: 'bold',
        zIndex: 2000,
    };

>>>>>>> 6ef4c230293d99f71e9bb5d7e919bcdd5cd9babd
    const contentStyle = {
        marginTop: '60px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    };

    if (error) {
        return <div style={pageStyle}>
            <div style={overlayStyle}>🔴 RED LIGHT - STOP CODING!</div>
            <div style={contentStyle}>{error}</div>
        </div>;
    }

    if (!questionData) {
        return <div style={pageStyle}>
            <div style={overlayStyle}>🔴 RED LIGHT - STOP CODING!</div>
            <div style={contentStyle}>Loading...</div>
        </div>;
    }

    return (
        <div style={pageStyle}>
            {/* Full-page red overlay when light state is red */}
            {lightState === 'red' && (
                <div style={overlayStyle}>
                    🔴 RED LIGHT - STOP CODING!
                </div>
            )}

            {/* Main content */}
            {lightState !== 'red' && (
                <div>
                    <div style={contentStyle}>
                        <h2 style={{
                            color: lightState === 'red' ? '#d32f2f' : '#2e7d32',
                            transition: 'color 0.5s ease',
                        }}>
                            {questionData.name}
                        </h2>

                        <div style={{
                            padding: '15px',
                            backgroundColor: lightState === 'red' ? '#fff5f5' : '#f5fff5',
                            borderRadius: '4px',
                            marginBottom: '20px',
                            border: `1px solid ${lightState === 'red' ? '#ffcdd2' : '#c8e6c9'}`,
                            transition: 'all 0.5s ease',
                        }}>
                            <p>{questionData.question}</p>
                        </div>

                        {/* Pass both teacherCode and lightState to CodeEditor */}
                        <CodeEditor
                            teacherCode={questionData.solution}
                            lightState={lightState}
                        />

                        {evaluationResult && (
                            <div style={{
                                marginTop: '20px',
                                padding: '15px',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '4px',
                            }}>
                                <h3>Evaluation Result:</h3>
                                <p>{evaluationResult}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default QuestionPage;

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { useFirebase } from '../firebase';
// import { getDatabase, ref, get } from 'firebase/database'; 
// import CodeEditor from '../Components/CodeEditor';

// function QuestionPage() {
//     const { id } = useParams();
//     const [questionData, setQuestionData] = useState(null);
//     const [error, setError] = useState(null);
//     const [evaluationResult, setEvaluationResult] = useState(null);
//     const firebase = useFirebase();

//     const fetchQuestionData = async () => {
//         try {
//             const db = getDatabase(firebase.app); 
//             const questionRef = ref(db, `Question4/${id}`); 
//             const snapshot = await get(questionRef);

//             if (snapshot.exists()) {
//                 setQuestionData(snapshot.val()); 
//             } else {
//                 setError('Question not found');
//             }
//         } catch (err) {
//             setError('Error fetching question data');
//             console.error('Error fetching question:', err);
//         }
//     };

//     useEffect(() => {
//         fetchQuestionData();
//     }, [id]);

//     const evaluateCode = async (teacherCode, studentCode) => {
//         try {
//             const response = await fetch("http://127.0.0.1:8000/evaluate/", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     teacher_code: teacherCode,
//                     student_code: studentCode,
//                 }),
//             });
//             const data = await response.json();
//             setEvaluationResult(data.result);
//         } catch (error) {
//             setError("Error evaluating the code");
//             console.error("Error:", error);
//         }
//     };

//     if (error) {
//         return <div>{error}</div>;
//     }

//     if (!questionData) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div>
//             <h2>{questionData.name}</h2>
//             <p>{questionData.question}</p>
//             <CodeEditor teacherCode={questionData.solution} />
//             {evaluationResult && (
//                 <div>
//                     <h3>Evaluation Result:</h3>
//                     <p>{evaluationResult}</p>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default QuestionPage;

