import SectionHeader from "./components/headers/SectionHeader";
import TitleHeader from "../forms/components/headers/TitleHeader";
import CoBenefitsDropdownQuestion from "./components/questions/CoBenefitsDropdownQuestion";
import RisksDropdownQuestion from "./components/questions/RisksDropdownQuestion";
import DropdownQuestion from "./components/questions/DropdownQuestion";
import TextQuestion from "./components/questions/TextQuestion";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../dashboards/winrock-dashboard/components/Sidebar";
import styles from "./css-modules/FormViewer.module.css";
import { useSearchParams } from "react-router-dom";
import { getAuth } from "firebase/auth";

interface Question {
    label: string;
    type: string;
    options?: string[]; // Made optional for types like "section" or "text"
    title?: string;
    id: string;
}

interface FormStructure {
    title: string;
    createdAt: any; // Firestore timestamps are objects, not standard Dates
    questions: Question[];
}


const SupplierFormViewer = () => {
    const { formType, id, projectID } = useParams<{ formType: string; id: string; projectID: string }>();
    const [form, setForm] = useState<FormStructure | null>(null);
    const [loading, setLoading] = useState(true);
    const [saveMessage, setSaveMessage] = useState("");
    const [searchParams] = useSearchParams();
    const editable = searchParams.get("editable") === "true";
    const readOnly = !editable;
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [responses, setResponses] = useState<Record<string, any>>({});

    const pages: Question[][] = [];
    let currentPage: Question[] = [];

    const handleSave = async () => {
        if (!id || !projectID) return;

        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            console.error("No logged in user");
            return;
        }

        const responseID = `${projectID}_${id}`;

        try {
            await setDoc(
                doc(db, "form-responses", responseID),
                {
                    projectID,
                    formID: id,
                    email: user.email,
                    responses: responses,
                    updatedAt: serverTimestamp(),
                },
                { merge: true }
            );

            console.log("Form saved");
            setSaveMessage("Form saved successfully!");

            // Hide the message after 3 seconds
            setTimeout(() => setSaveMessage(""), 3000);

        } catch (err) {
            console.error("Error saving form:", err);
            setSaveMessage("Failed to save form. Please try again.");
            setTimeout(() => setSaveMessage(""), 3000);
        }
    };

    useEffect(() => {
        const fetchResponses = async () => {
            if (!id || !projectID) return;
            const responseID = `${projectID}_${id}`;
            try {
                const snap = await getDoc(doc(db, "form-responses", responseID));
                if (snap.exists()) {
                    setResponses(snap.data().responses || {});
                }
            } catch (err) {
                console.error("Error loading responses:", err);
            }
        };
        fetchResponses();
    }, [id, projectID]);

    useEffect(() => {
        const fetchForm = async () => {
            if (!id) return;
            const collectionName = formType === 'proposal'
                ? "custom-project-proposal-forms"
                : "custom-risk-cobenefits-forms";

            try {
                const docRef = doc(db, collectionName, id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setForm(docSnap.data() as FormStructure);
                }
            } catch (err) {
                console.error("Error fetching document:", err);
            }
            setLoading(false);
        };
        fetchForm();
    }, [id, formType]);

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
                    {pages[currentPageIndex]?.map((question, index) => {  // ✅ use pages[currentPageIndex]
                        const noop = () => { };
                        const questionKey = (question as any).id || `${question.type}-${index}`; // ✅ stable key

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
                                            setResponses(prev => ({ ...prev, [questionKey]: value }))
                                        }
                                        disabled={readOnly}
                                    />
                                );

                            case "dropdown":
                                if (question.label.toLowerCase() === 'geography') {
                                    console.log(question.label)
                                    return (
                                        <DropdownQuestion
                                            key={questionKey}
                                            label={question.label}
                                            disabled={readOnly}
                                            controlledValue={responses[questionKey] || ""}
                                            onSelect={(value) =>
                                                setResponses(prev => ({ ...prev, [questionKey]: value }))
                                            }
                                            options={question.options || []}
                                        />
                                    );
                                }
                                else {
                                    return (
                                        <DropDownComponent
                                            key={questionKey}
                                            label={question.label}
                                            disabled={readOnly}
                                            controlledValues={
                                                Array.isArray(responses[questionKey])
                                                    ? responses[questionKey]
                                                    : ["", ""]
                                            }
                                            onSelect={noop}
                                            onChange={(values: string[]) =>
                                                setResponses(prev => ({ ...prev, [questionKey]: values }))
                                            }
                                            {...(formType === 'proposal'
                                                ? { benefitItems: question.options || [] }
                                                : { options: question.options || [] }
                                            )}
                                        />
                                    );
                                }

                            default:
                                return <div key={questionKey}>Unknown type: {question.type}</div>;

                        }
                    })}
                </div>
                {/* Floating Back Button Container */}
                <div className={styles.footerActions}>
                    {saveMessage && <div className={styles.saveMessage}>{saveMessage}</div>}

                    {editable && (
                        <button onClick={handleSave} className={styles.saveBtn}>
                            Save
                        </button>
                    )}
                    <button
                        className={styles.backBtn}
                        onClick={() => window.close()}
                    >
                        Close Window
                    </button>
                </div>
                <div className={styles.pagination}>
                    <button onClick={() => setCurrentPageIndex(p => Math.max(p - 1, 0))} disabled={currentPageIndex === 0}>
                        Previous
                    </button>
                    {currentPageIndex < pages.length - 1 && (
                        <button onClick={() => setCurrentPageIndex(p => p + 1)}>
                            Next
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
};
export default SupplierFormViewer;
