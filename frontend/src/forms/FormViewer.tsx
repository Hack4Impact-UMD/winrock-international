import SectionHeader from "./components/headers/SectionHeader";
import TitleHeader from "auth/components/TitleHeader";
import LogoHeader from "auth/components/LogoHeader";
import CoBenefitsDropdownQuestion from "./components/questions/CoBenefitsDropdownQuestion";
import RisksDropdownQuestion from "./components/questions/RisksDropdownQuestion";
import TextQuestion from "./components/questions/TextQuestion";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

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
    const { formType, id } = useParams<{ formType: string; id: string }>();
    const [form, setForm] = useState<FormStructure | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchForm = async () => {
            const collectionName = formType === 'proposal'
                ? "custom-project-proposal-forms"
                : "custom-risk-cobenefits-forms";

            const q = query(collection(db, collectionName), where("id", "==", id));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const data = querySnapshot.docs[0].data() as FormStructure;
                setForm(data);
            }
            setLoading(false);
        };
        fetchForm();
    }, [id, formType]);

    if (loading) return <div>Loading form...</div>;
    if (!form) return <div>Form not found.</div>;

    const DropDownComponent = formType === 'proposal'
        ? CoBenefitsDropdownQuestion
        : RisksDropdownQuestion;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-8">{form.title}</h1>

            {form.questions.map((question, index) => {
                // Shared handlers to satisfy TypeScript
                const noop = () => { };

                switch (question.type) {
                    case "section":
                        return (
                            <SectionHeader
                                key={index}
                                label={question.label}
                            />
                        );

                    case "text":
                        return (
                            <TextQuestion
                                key={index}
                                label={question.label}
                                controlledValue="" // This would ideally be fetched from a 'submissions' collection
                                onChange={noop}
                                disabled={readOnly}
                            />
                        );

                    case "dropdown":
                        return (
                            <DropDownComponent
                                key={index}
                                label={question.label}
                                disabled={readOnly}
                                // Specialized Dropdowns expect an array for values
                                controlledValues={["", ""]}
                                onSelect={noop}
                                onChange={noop}
                                // CoBenefitsDropdownQuestion uses 'benefitItems' instead of 'options'
                                {...(formType === 'proposal'
                                    ? { benefitItems: question.options || [] }
                                    : { options: question.options || [] }
                                )}
                            />
                        );

                    default:
                        return <div key={index}>Unknown type: {question.type}</div>;
                }
            })}
        </div>
    );
};
export default FormViewer;