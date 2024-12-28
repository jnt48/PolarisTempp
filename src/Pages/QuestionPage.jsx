import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFirebase } from '../firebase';
import { getDatabase, ref, get } from 'firebase/database'; 
import CodeEditor from '../Components/CodeEditor';

function QuestionPage() {
    const { id } = useParams();
    const [questionData, setQuestionData] = useState(null);
    const [error, setError] = useState(null);
    const [evaluationResult, setEvaluationResult] = useState(null);
    const firebase = useFirebase();

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
        }
    };

    useEffect(() => {
        fetchQuestionData();
    }, [id]);

    const evaluateCode = async (teacherCode, studentCode) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/evaluate/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    teacher_code: teacherCode,
                    student_code: studentCode,
                }),
            });
            const data = await response.json();
            setEvaluationResult(data.result);
        } catch (error) {
            setError("Error evaluating the code");
            console.error("Error:", error);
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!questionData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>{questionData.name}</h2>
            <p>{questionData.question}</p>
            <CodeEditor teacherCode={questionData.solution} />
            {evaluationResult && (
                <div>
                    <h3>Evaluation Result:</h3>
                    <p>{evaluationResult}</p>
                </div>
            )}
        </div>
    );
}

export default QuestionPage;
