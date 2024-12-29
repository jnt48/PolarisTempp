import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './Pages/Register'
import Login from './Pages/Login';
import Home from './Pages/Home';
import { useFirebase } from './firebase';
import QuestionPage from './Pages/QuestionPage';
import AddQuestion from './Pages/AddQuestion';
import Admin from './Pages/Admin';

function App() {
    const firebase = useFirebase();

    function ProtectedRoute({ children }) {
        if (!firebase.user) {
            return <Navigate to="/register" />;
        }
        return children;
    }

    return (
        <div className="wrapper-about">
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="register" element={firebase.user ? <Navigate to="/" /> : <Register />} />
                    <Route path="login" element={firebase.user ? <Navigate to="/" /> : <Login />} />
                    <Route path="question/:id" element={ <QuestionPage /> }/>
                    <Route path="add-question" element={ <AddQuestion/> }/>
                    <Route path="admin" element={ <Admin/> }/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
