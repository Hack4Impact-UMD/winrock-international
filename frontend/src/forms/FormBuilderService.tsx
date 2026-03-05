import { db } from "../firebaseConfig"; // Adjust path to your firebase config
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export interface QuestionDefinition {
    id: string;
    type: 'text' | 'dropdown' | 'section'; // Add 'section' here
    label: string;
    options?: string[];
}

export interface FormSchema {
    title: string;
    questions: QuestionDefinition[];
    createdAt: any;
}

export const FormBuilderService = {
    publishForm: async (title: string, questions: QuestionDefinition[], formType: string) => {
        try {
            // Determine the collection name based on user selection
            const collectionName = formType === 'risk'
                ? "custom-risk-cobenefits-forms"
                : "custom-project-proposal-forms";

            const formsCollection = collection(db, collectionName);

            const formPayload = {
                title,
                questions: questions.map(q => ({
                    type: q.type,
                    label: q.label,
                    options: q.type === 'dropdown' ? q.options : []
                })),
                createdAt: serverTimestamp()
            };

            const docRef = await addDoc(formsCollection, formPayload);
            return docRef.id;
        } catch (error) {
            console.error("Error publishing form:", error);
            throw error;
        }
    }
};