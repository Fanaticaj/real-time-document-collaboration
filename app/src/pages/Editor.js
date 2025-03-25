import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

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
        <div className="container mt-5">
            <div className="card shadow p-4">
                <h2 className="text-center">Real-time Collaborative Editor</h2>

                {/* Formatting Controls */}
                <div className="d-flex justify-content-center gap-2 mt-3 mb-3">
                    <button
                        className={`btn ${bold ? 'btn-dark' : 'btn-outline-dark'}`}
                        onClick={() => toggleStyle(bold, setBold, 'bold')}
                    >
                        <b>B</b>
                    </button>
                    <button
                        className={`btn ${italic ? 'btn-dark' : 'btn-outline-dark'}`}
                        onClick={() => toggleStyle(italic, setItalic, 'italic')}
                    >
                        <i>I</i>
                    </button>
                    <button
                        className={`btn ${underline ? 'btn-dark' : 'btn-outline-dark'}`}
                        onClick={() => toggleStyle(underline, setUnderline, 'underline')}
                    >
                        <u>U</u>
                    </button>
                </div>

                {/* Editor Text Area */}
                <textarea
                    className="form-control"
                    value={content}
                    onChange={handleEdit}
                    rows={10}
                    placeholder="Start typing..."
                    style={{
                        fontWeight: bold ? 'bold' : 'normal',
                        fontStyle: italic ? 'italic' : 'normal',
                        textDecoration: underline ? 'underline' : 'none'
                    }}
                ></textarea>
            </div>
        </div>
    );
}

export default Editor;
