import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TicketForm from './TicketForm';
import Register from './Register';
import Login from './Login';

function App() {
    return (
        <Router>
            <div className="App">
	    	<h1 style={{ textAlign: 'center', fontSize: '3em', marginTop: '20px' }}>
	    Bienvenido a mi Aplicacion React GG
        	</h1>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/register">Register</Link>
                        </li>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                    </ul>
                </nav>

                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<TicketForm />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
