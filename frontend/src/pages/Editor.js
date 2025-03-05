// src/pages/Editor.js

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import '../App.css'; // Keep styling if needed

const socket = io('http://localhost:5000');

function Editor() {
    const [content, setContent] = useState('');
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [underline, setUnderline] = useState(false);

    useEffect(() => {
        socket.on('updateContent', (updatedContent) => setContent(updatedContent));
        socket.on('updateStyleBold', (bold) => setBold(bold));
        socket.on('updateStyleItalic', (italic) => setItalic(italic));
        socket.on('updateStyleUnderline', (underline) => setUnderline(underline));

        return () => {
            socket.off('updateContent');
            socket.off('updateStyleBold');
            socket.off('updateStyleItalic');
            socket.off('updateStyleUnderline');
        };
    }, []);

    const handleEdit = (event) => {
        const updatedContent = event.target.value;
        setContent(updatedContent);
        socket.emit('edit', updatedContent);
    };

    const toggleStyle = (style, setter, eventName) => {
        setter((prev) => {
            const newState = !prev;
            socket.emit(eventName, newState);
            return newState;
        });
    };

    return (
        <div className="Editor">
            <h1>Real-time Collaborative Editor</h1>
            <div className="controls">
                <button onClick={() => toggleStyle(bold, setBold, 'bold')}>BOLD</button>
                <button onClick={() => toggleStyle(italic, setItalic, 'italic')}>ITALIC</button>
                <button onClick={() => toggleStyle(underline, setUnderline, 'underline')}>UNDERLINE</button>
            </div>
            <textarea
                value={content}
                onChange={handleEdit}
                rows={10}
                cols={50}
                style={{
                    fontWeight: bold ? 'bold' : 'normal',
                    fontStyle: italic ? 'italic' : 'normal',
                    textDecoration: underline ? 'underline' : 'none'
                }}
            />
        </div>
    );
}

export default Editor;
