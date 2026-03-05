import React, { useState } from 'react';
import TextQuestion from './components/questions/TextQuestion.js';
import DropdownQuestion from './components/questions/DropdownQuestion.js';
import SectionHeader from './components/headers/SectionHeader.js';
import LogoHeader from './components/headers/LogoHeader.js'

interface QuestionDefinition {
    id: string;
    type: 'text' | 'dropdown';
    label: string;
    options?: string[];
}

const FormBuilder = () => {
    const [title, setTitle] = useState("New Custom Form");
    const [questions, setQuestions] = useState<QuestionDefinition[]>([]);
    const [showOptions, setShowOptions] = useState(false); // Controls the expansion

    const addQuestion = (type: 'text' | 'dropdown') => {
        const newQuestion: QuestionDefinition = {
            id: crypto.randomUUID(),
            type: type,
            label: `New ${type === 'text' ? 'Open-ended' : 'Dropdown'} Question`,
            options: type === 'dropdown' ? ['Option 1', 'Option 2'] : undefined
        };
        setQuestions([...questions, newQuestion]);
        setShowOptions(false); // Collapse menu after selection
    };

    const deleteQuestion = (id: string) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    const updateLabel = (id: string, newLabel: string) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, label: newLabel } : q));
    };

    const updateOptions = (id: string, optionsString: string) => {
        const optionsArray = optionsString.split(',').map(s => s.trim());
        setQuestions(questions.map(q => q.id === id ? { ...q, options: optionsArray } : q));
    };

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <LogoHeader />

            <div style={{ marginBottom: '40px', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
                <input
                    style={{ fontSize: '2rem', width: '100%', border: 'none', outline: 'none', fontWeight: 'bold' }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter Form Title..."
                />
            </div>

            {/* Questions List */}
            {questions.map((q, index) => (
                <div key={q.id} style={{
                    marginBottom: '30px',
                    padding: '25px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    position: 'relative'
                }}>
                    <button
                        onClick={() => deleteQuestion(q.id)}
                        style={{ position: 'absolute', right: '15px', top: '15px', border: 'none', background: 'none', color: '#ff4d4f', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        ✕ Delete
                    </button>

                    <SectionHeader label={`Question ${index + 1}`} />

                    <div style={{ marginBottom: '20px' }}>
                        <input
                            style={{ width: '100%', padding: '10px', fontSize: '1.1rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            value={q.label}
                            onChange={(e) => updateLabel(q.id, e.target.value)}
                        />
                    </div>

                    <div style={{ padding: '15px', borderRadius: '8px', border: '1px dashed #ddd' }}>
                        {q.type === 'text' ? (
                            <TextQuestion label={q.label} controlledValue="" onChange={() => { }} />
                        ) : (
                            <>
                                <DropdownQuestion label={q.label} options={q.options || []} controlledValue="" onSelect={() => { }} />
                                <div style={{ marginTop: '15px' }}>
                                    <label style={{ fontSize: '0.85rem', color: '#666' }}>Edit Dropdown Options (comma separated):</label>
                                    <input
                                        style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #eee' }}
                                        value={q.options?.join(', ')}
                                        onChange={(e) => updateOptions(q.id, e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ))}

            {/* Expandable Add Button Area */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px', gap: '15px' }}>
                {showOptions && (
                    <div style={{ display: 'flex', gap: '15px', animation: 'fadeIn 0.2s ease-in-out' }}>
                        <button
                            onClick={() => addQuestion('text')}
                            style={{ padding: '10px 20px', borderRadius: '20px', border: '1px solid #007bff', background: '#fff', color: '#007bff', cursor: 'pointer' }}
                        >
                            + Text Field
                        </button>
                        <button
                            onClick={() => addQuestion('dropdown')}
                            style={{ padding: '10px 20px', borderRadius: '20px', border: '1px solid #007bff', background: '#fff', color: '#007bff', cursor: 'pointer' }}
                        >
                            + Dropdown
                        </button>
                    </div>
                )}

                <button
                    onClick={() => setShowOptions(!showOptions)}
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '30px',
                        backgroundColor: showOptions ? '#666' : '#007bff',
                        color: 'white',
                        fontSize: '24px',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,123,255,0.3)',
                        transition: 'transform 0.2s, background-color 0.2s',
                        transform: showOptions ? 'rotate(45deg)' : 'rotate(0deg)'
                    }}
                >
                    +
                </button>
                <p style={{ color: '#888', fontSize: '0.9rem' }}>
                    {showOptions ? "Cancel" : "Add a new question"}
                </p>
            </div>

            {/* Save Action */}
            {questions.length > 0 && (
                <div style={{ marginTop: '60px', textAlign: 'right' }}>
                    <button
                        style={{ padding: '12px 30px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        onClick={() => console.log("Final JSON Schema:", { title, questions })}
                    >
                        Generate Form
                    </button>
                </div>
            )}
        </div>
    );
};

export default FormBuilder;