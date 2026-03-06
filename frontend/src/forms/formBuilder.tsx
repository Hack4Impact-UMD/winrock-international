import { useEffect, useState } from 'react';
import Sidebar from '../dashboards/winrock-dashboard/components/Sidebar.js';
import styles from './css-modules/FormBuilder.module.css';
import { FormBuilderService, QuestionDefinition } from './FormBuilderService.js';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig.js';

// Define the updated type to include 'section'
interface FormElement extends Omit<QuestionDefinition, 'type'> {
    type: 'text' | 'dropdown' | 'section';
}

const FormBuilder = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("New Custom Form");
    const [formType, setFormType] = useState<string>('proposal');
    const [elements, setElements] = useState<FormElement[]>([]);
    const [showOptions, setShowOptions] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const { formType: urlFormType, id } = useParams<{ formType: string; id: string }>();

    useEffect(() => {
        const loadExistingForm = async () => {
            // Use the formType from the URL params to ensure we check the right collection
            if (id && urlFormType) {
                const collectionName = urlFormType === 'proposal'
                    ? "custom-project-proposal-forms"
                    : "custom-risk-cobenefits-forms";

                try {
                    const docRef = doc(db, collectionName, id);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setTitle(data.title);
                        setFormType(urlFormType); // Sync the dropdown state with the actual form type
                        // Generate IDs for loaded questions since they aren't stored in Firestore
                        const loadedElements = (data.questions || []).map((q: any) => ({
                            ...q,
                            id: crypto.randomUUID(),
                        }));
                        setElements(loadedElements);
                    }
                } catch (err) {
                    console.error("Error loading form:", err);
                }
            }
        };
        loadExistingForm();
    }, [id, urlFormType]);

    const addElement = (type: 'text' | 'dropdown' | 'section') => {
        const newElement: FormElement = {
            id: crypto.randomUUID(),
            type: type,
            label: type === 'section' ? "New Section Header" : "New Question Label",
            options: type === 'dropdown' ? ['Option 1', 'Option 2'] : undefined
        };
        setElements([...elements, newElement]);
        setShowOptions(false);
    };

    const updateLabel = (id: string, newLabel: string) => {
        setElements(elements.map(el => el.id === id ? { ...el, label: newLabel } : el));
    };

    const updateOptions = (id: string, optionsString: string) => {
        const optionsArray = optionsString.split(',').map(s => s.trim()).filter(s => s !== "");
        setElements(elements.map(el => el.id === id ? { ...el, options: optionsArray } : el));
    };

    const deleteElement = (id: string) => {
        setElements(elements.filter(el => el.id !== id));
    };

    const handlePublish = async () => {
        setIsPublishing(true);
        try {
            // Pass the 'id' to the service. If ID exists, it updates; otherwise, it creates.
            await FormBuilderService.publishForm(title, elements, formType, id);
            alert(id ? "Form Updated Successfully!" : "Form Published Successfully!");
            navigate("/forms/dashboard");
        } catch (err) {
            alert("Error saving form.");
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.sidebarContainer}>
                <Sidebar currentTab="forms" />
            </div>

            <main className={styles.mainContent}>
                <div className={styles.formContainer}>
                    {/* Form Configuration Area */}
                    <div style={{ padding: '2rem', background: '#f8f9fa', borderRadius: '8px', marginBottom: '2rem' }}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.label}>Form Configuration</h2>
                        </div>
                        <select className={styles.dropdownButton} value={formType} onChange={(e) => setFormType(e.target.value)}>
                            <option value="proposal">Project Proposal Form</option>
                            <option value="risk">Risk and Co-benefit Form</option>
                        </select>
                        <input
                            className={styles.labelInput}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter Form Title..."
                        />
                    </div>

                    {elements.map((el) => (
                        <div key={el.id} className={el.type === 'section' ? styles.sectionWrapper : styles.dropdownQuestion}>
                            <button onClick={() => deleteElement(el.id)} className={styles.deleteBtn}>✕ Delete</button>

                            {el.type === 'section' ? (
                                <div className={styles.sectionHeader}>
                                    <input
                                        className={styles.label}
                                        value={el.label}
                                        onChange={(e) => updateLabel(el.id, e.target.value)}
                                        style={{ background: 'transparent', border: 'none', width: '100%' }}
                                    />
                                </div>
                            ) : (
                                <>
                                    <div className={styles.labelRow}>
                                        <input
                                            className={styles.label}
                                            value={el.label}
                                            style={{ color: '#333', border: 'none', borderBottom: '1px dashed #ccc' }}
                                            onChange={(e) => updateLabel(el.id, e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.dropdownContainer}>
                                        <div className={styles.dropdownButton}>
                                            <p>{el.type === 'text' ? 'Open-ended text field preview' : 'Dropdown selection preview'}</p>
                                        </div>
                                        {el.type === 'dropdown' && (
                                            <input
                                                className={styles.description}
                                                placeholder="Options (comma separated)..."
                                                value={el.options?.join(', ')}
                                                onChange={(e) => updateOptions(el.id, e.target.value)}
                                            />
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}

                    {/* Expandable Menu */}
                    <div className={styles.addButtonWrapper}>
                        {showOptions && (
                            <div className={styles.typeSelector}>
                                <button onClick={() => addElement('section')}>+ Add Section</button>
                                <button onClick={() => addElement('text')}>+ Text Field</button>
                                <button onClick={() => addElement('dropdown')}>+ Dropdown</button>
                            </div>
                        )}
                        <button onClick={() => setShowOptions(!showOptions)} className={styles.fab}>+</button>
                    </div>

                    <button className={styles.publishBtn} onClick={handlePublish} disabled={isPublishing}>
                        {isPublishing ? 'Publishing...' : 'Publish Form'}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default FormBuilder;