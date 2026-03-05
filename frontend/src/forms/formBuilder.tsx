import React, { useState } from 'react';
import TextQuestion from './components/questions/TextQuestion.js';
import DropdownQuestion from './components/questions/DropdownQuestion.js';
import SectionHeader from './components/headers/SectionHeader.js';
import LogoHeader from './components/headers/LogoHeader.js'
import Sidebar from '../dashboards/winrock-dashboard/components/Sidebar.js';
import styles from './css-modules/FormBuilder.module.css';
import { FormBuilderService, QuestionDefinition } from './FormBuilderService';

const FormBuilder = () => {
    const [title, setTitle] = useState("New Custom Form");
    const [questions, setQuestions] = useState<QuestionDefinition[]>([]);
    const [showOptions, setShowOptions] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    const addQuestion = (type: 'text' | 'dropdown') => {
        const newQuestion: QuestionDefinition = {
            id: crypto.randomUUID(),
            type: type,
            label: `New ${type === 'text' ? 'Open-ended' : 'Dropdown'} Question`,
            options: type === 'dropdown' ? ['Option 1', 'Option 2'] : undefined
        };
        setQuestions([...questions, newQuestion]);
        setShowOptions(false);
    };

    const handlePublish = async () => {
        if (questions.length === 0) return alert("Please add at least one question.");

        setIsPublishing(true);
        try {
            const formId = await FormBuilderService.publishForm(title, questions);
            alert(`Form published successfully! ID: ${formId}`);
            // Optional: Reset form or redirect
        } catch (err) {
            alert("Failed to publish form. Check console for details.");
        } finally {
            setIsPublishing(false);
        }
    };

    const deleteQuestion = (id: string) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    const updateLabel = (id: string, newLabel: string) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, label: newLabel } : q));
    };

    const updateOptions = (id: string, optionsString: string) => {
        const optionsArray = optionsString.split(',').map(s => s.trim()).filter(s => s !== "");
        setQuestions(questions.map(q => q.id === id ? { ...q, options: optionsArray } : q));
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.sidebarContainer}>
                <Sidebar currentTab="projects" />
            </div>

            <main className={styles.mainContent}>
                <div className={styles.formContainer}>
                    <LogoHeader />

                    <div style={{ marginBottom: '40px', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
                        <input
                            style={{ fontSize: '2rem', width: '100%', border: 'none', outline: 'none', fontWeight: 'bold' }}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter Form Title..."
                        />
                    </div>

                    {questions.map((q, index) => (
                        <div key={q.id} className={styles.questionCard}>
                            <button
                                onClick={() => deleteQuestion(q.id)}
                                className={styles.deleteBtn}
                            >
                                ✕ Delete
                            </button>

                            <SectionHeader label={`Question ${index + 1}`} />

                            <div style={{ marginBottom: '20px' }}>
                                <input
                                    className={styles.labelInput}
                                    value={q.label}
                                    onChange={(e) => updateLabel(q.id, e.target.value)}
                                />
                            </div>

                            <div className={styles.previewArea}>
                                {q.type === 'text' ? (
                                    <TextQuestion label={q.label} controlledValue="" onChange={() => { }} />
                                ) : (
                                    <>
                                        <DropdownQuestion label={q.label} options={q.options || []} controlledValue="" onSelect={() => { }} />
                                        <div style={{ marginTop: '15px' }}>
                                            <label style={{ fontSize: '0.85rem', color: '#666' }}>Edit Dropdown Options (comma separated):</label>
                                            <input
                                                className={styles.optionsInput}
                                                value={q.options?.join(', ')}
                                                onChange={(e) => updateOptions(q.id, e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}

                    <div className={styles.addButtonWrapper}>
                        {showOptions && (
                            <div className={styles.typeSelector}>
                                <button onClick={() => addQuestion('text')}>+ Text Field</button>
                                <button onClick={() => addQuestion('dropdown')}>+ Dropdown</button>
                            </div>
                        )}

                        <button
                            onClick={() => setShowOptions(!showOptions)}
                            className={`${styles.fab} ${showOptions ? styles.fabActive : ''}`}
                        >
                            +
                        </button>
                        <p className={styles.fabLabel}>{showOptions ? "Cancel" : "Add a new question"}</p>
                    </div>

                    {questions.length > 0 && (
                        <div style={{ marginTop: '60px', textAlign: 'right' }}>
                            <button
                                className={styles.publishBtn}
                                onClick={handlePublish}
                                disabled={isPublishing}
                            >
                                {isPublishing ? 'Publishing...' : 'Publish Form to Firebase'}
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default FormBuilder;