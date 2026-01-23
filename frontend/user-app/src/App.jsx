import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Chatbot from './components/Chatbot';
import UserRoutes from './routes/UserRoutes';
import './index.css';

function App() {
    return (
        <div className="App">
            <Navbar />
            <main>
                <UserRoutes />
            </main>
            <Footer />
            <Chatbot />
        </div>
    );
}

export default App;
