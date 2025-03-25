// src/App.js

import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Editor from "./pages/Editor";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="*" element={<Login />} /> {/* Default route */}
            </Routes>
        </Router>
    );
}

export default App;
