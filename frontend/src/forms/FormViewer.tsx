import SectionHeader from "./components/headers/SectionHeader";
import TitleHeader from "../forms/components/headers/TitleHeader";
import CoBenefitsDropdownQuestion from "./components/questions/CoBenefitsDropdownQuestion";
import RisksDropdownQuestion from "./components/questions/RisksDropdownQuestion";
import DropdownQuestion from "./components/questions/DropdownQuestion";
import TextQuestion from "./components/questions/TextQuestion";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../dashboards/winrock-dashboard/components/Sidebar";
import styles from "./css-modules/FormViewer.module.css";
import { useSearchParams } from "react-router-dom";

interface Question {
    label: string;
    type: string;
    options?: string[]; // Made optional for types like "section" or "text"
    title?: string;
    id: string; // Add this!
}

interface FormStructure {
    title: string;
    createdAt: any; // Firestore timestamps are objects, not standard Dates
    questions: Question[];
}


const FormViewer = () => {
    const navigate = useNavigate();
    const { formType, id, projectID } = useParams<{ formType: string; id: string; projectID: string }>();
    const [form, setForm] = useState<FormStructure | null>(null);
    const [loading, setLoading] = useState(true);
    const [saveMessage, setSaveMessage] = useState(""); // Add this at the top with other state


    const [searchParams] = useSearchParams();
    const editable = searchParams.get("editable") === "true";
    const readOnly = !editable;
    const pages: Question[][] = [];
    let currentPage: Question[] = [];
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [responses, setResponses] = useState<Record<string, any>>({});
    // In handleSave — preserve supplier email, don't overwrite with admin email
    const handleSave = async () => {
        if (!id || !projectID) return;
        const responseID = `${projectID}_${id}`;

        try {
            // Fetch existing doc to preserve supplier email
            const existingSnap = await getDoc(doc(db, "form-responses", responseID));
            const existingData = existingSnap.exists() ? existingSnap.data() : {};

            await setDoc(
                doc(db, "form-responses", responseID),
                {
                    projectID,
                    formID: id,
                    email: existingData.email || null, // preserve supplier email only
                    responses,
                    updatedAt: serverTimestamp(),
                },
                { merge: true }
            );
            setSaveMessage("Form saved successfully!");
            setTimeout(() => setSaveMessage(""), 3000);
        } catch (err) {
            console.error("Error saving form:", err);
            setSaveMessage("Failed to save form. Please try again.");
            setTimeout(() => setSaveMessage(""), 3000);
        }
    };

    useEffect(() => {
        setLoading(true);
        setCurrentPageIndex(0);
        setResponses({});
        setSaveMessage("");



        const fetchForm = async () => {
            if (!id || !projectID) {
                setLoading(false);
                return;
            }
            const collectionName = formType === 'proposal'
                ? "custom-project-proposal-forms"
                : "custom-risk-cobenefits-forms";

            try {
                const [formSnap, responseSnap] = await Promise.all([
                    getDoc(doc(db, collectionName, id)),
                    getDoc(doc(db, "form-responses", `${projectID}_${id}`)),
                ]);

                if (formSnap.exists()) {
                    setForm(formSnap.data() as FormStructure);
                }

                if (responseSnap.exists()) {
                    setResponses(responseSnap.data().responses ?? {});
                } else {
                    setResponses({});
                }
            } catch (err) {
                console.error("Error fetching document:", err);
            }
            setLoading(false);
        };
        fetchForm();
    }, [id, formType, projectID]);

    if (loading) return <div className={styles.centeredState}>Loading form...</div>;
    if (!form) return <div className={styles.centeredState}>Form not found.</div>;

    form.questions.forEach(q => {
        if (q.type === "pageBreak") {
            pages.push(currentPage);
            currentPage = [];
        } else {
            currentPage.push(q);
        }
    });

    pages.push(currentPage);
    const DropDownComponent: React.ComponentType<any> = formType === 'proposal'
        ? CoBenefitsDropdownQuestion
        : RisksDropdownQuestion;

    return (
        <div className={styles.pageWrapper}>
            <Sidebar currentTab="forms" />

            <main className={styles.mainContent}>
                {/* Centered Grey Header */}
                <header className={styles.headerBanner}>
                    <TitleHeader title={form.title} />
                </header>

                {/* Question List Area */}
                <div className={styles.formContainer}>
                    {pages[currentPageIndex]?.map((question) => {
                        const noop = () => { };
                        // Use the unique ID for state management
                        const questionKey = question.id || question.label;

                        switch (question.type) {
                            case "section":
                                return <SectionHeader key={questionKey} label={question.label} />;

                            case "text":
                                return (
                                    <TextQuestion
                                        key={questionKey}
                                        label={question.label}
                                        controlledValue={responses[questionKey] || ""}
                                        onChange={(value) =>
                                            setResponses(prev => ({
                                                ...prev,
                                                [questionKey]: value
                                            }))
                                        }
                                        disabled={readOnly}
                                    />
                                );

                            case "dropdown":
                                if (question.label.toLowerCase() === 'geography') {
                                    return (
                                        <DropdownQuestion
                                            key={questionKey}
                                            label={question.label}
                                            disabled={readOnly}
                                            // FIX: Use questionKey
                                            controlledValue={responses[questionKey] ?? ""}
                                            onSelect={(value) =>
                                                setResponses(prev => ({
                                                    ...prev,
                                                    [questionKey]: value
                                                }))
                                            }
                                            options={question.options || []}
                                        />
                                    );
                                } else {
                                    return (
                                        <DropDownComponent
                                            key={questionKey}
                                            label={question.label}
                                            disabled={readOnly}
                                            // FIX: Use questionKey
                                            controlledValues={
                                                Array.isArray(responses[questionKey])
                                                    ? responses[questionKey]
                                                    : ["", ""]
                                            }
                                            onSelect={noop}
                                            onChange={(values: string[]) =>
                                                setResponses(prev => ({
                                                    ...prev,
                                                    [questionKey]: values
                                                }))
                                            }
                                            {...(formType === 'proposal'
                                                ? { benefitItems: question.options || [] }
                                                : { options: question.options || [] }
                                            )}
                                        />
                                    );
                                }

                            default:
                                return <div key={question.id}>Unknown type: {question.type}</div>;
                        }
                    })}
                </div>
                <div className={styles.pagination}>
                    <button
                        onClick={() => setCurrentPageIndex(p => Math.max(p - 1, 0))}
                        disabled={currentPageIndex === 0} // Optional: disable if on first page
                    >
                        Previous
                    </button>

                    {currentPageIndex < pages.length - 1 && (
                        <button onClick={() => setCurrentPageIndex(p => p + 1)}>
                            Next
                        </button>
                    )}
                </div>
                <div className={styles.footerActions}>
                    {saveMessage && <div className={styles.saveMessage}>{saveMessage}</div>}

                    {editable && (
                        <button onClick={handleSave} className={styles.saveBtn}>
                            Save
                        </button>
                    )}

                    <button
                        className={styles.backBtn}
                        onClick={() => navigate('/forms/dashboard')}
                    >
                        ← Back to Forms
                    </button>
                </div>
            </main>
        </div>
    );
};
export default FormViewer;