import SectionHeader from "./components/headers/SectionHeader";
import TitleHeader from "../forms/components/headers/TitleHeader";
import CoBenefitsDropdownQuestion from "./components/questions/CoBenefitsDropdownQuestion";
import RisksDropdownQuestion from "./components/questions/RisksDropdownQuestion";
import DropdownQuestion from "./components/questions/DropdownQuestion";
import TextQuestion from "./components/questions/TextQuestion";
import { db } from "../firebaseConfig";
import { doc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../dashboards/winrock-dashboard/components/Sidebar";
import styles from "./css-modules/FormViewer.module.css";

interface Question {
    label: string;
    type: string;
    options?: string[]; // Made optional for types like "section" or "text"
    title?: string;
}

interface FormStructure {
    title: string;
    createdAt: any; // Firestore timestamps are objects, not standard Dates
    questions: Question[];
}


const FormViewer = () => {
    const navigate = useNavigate();
    const { formType, id } = useParams<{ formType: string; id: string }>();
    const [form, setForm] = useState<FormStructure | null>(null);
    const [loading, setLoading] = useState(true);

    const readOnly = true; // Prevents the 'readOnly is not defined' error

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

    const DropDownComponent = formType === 'proposal'
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
                    {form.questions.map((question, index) => {
                        const noop = () => { };

                        switch (question.type) {
                            case "section":
                                return <SectionHeader key={index} label={question.label} />;

                            case "text":
                                return (
                                    <TextQuestion
                                        key={index}
                                        label={question.label}
                                        controlledValue=""
                                        onChange={noop}
                                        disabled={readOnly}
                                    />
                                );

                            case "dropdown":
                                if (question.label.toLowerCase() === 'geography') {
                                    console.log(question.label)
                                    return (
                                        <DropdownQuestion
                                            key={index}
                                            label={question.label}
                                            disabled={readOnly}
                                            controlledValue=""
                                            onSelect={noop}
                                            options={question.options || []}
                                        />
                                    );
                                }
                                else {
                                    return (
                                        <DropDownComponent
                                            key={index}
                                            label={question.label}
                                            disabled={readOnly}
                                            controlledValues={["", ""]}
                                            onSelect={noop}
                                            onChange={noop}
                                            {...(formType === 'proposal'
                                                ? { benefitItems: question.options || [] }
                                                : { options: question.options || [] }
                                            )}
                                        />
                                    );
                                }

                            default:
                                return <div key={index}>Unknown type: {question.type}</div>;
                        }
                    })}
                </div>
                {/* Floating Back Button Container */}
                <div className={styles.footerActions}>
                    <button
                        className={styles.backBtn}
                        onClick={() => navigate('/forms/dashboard')} // Adjust path to your dashboard route
                    >
                        ← Back to Forms
                    </button>
                </div>
            </main>
        </div>
    );
};
export default FormViewer;