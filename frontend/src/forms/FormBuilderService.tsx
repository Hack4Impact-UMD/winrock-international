import { db } from "../firebaseConfig"; // Adjust path to your firebase config
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export interface QuestionDefinition {
    id: string;
    type: 'text' | 'dropdown';
    label: string;
    options?: string[];
}

export interface FormSchema {
    title: string;
    questions: QuestionDefinition[];
    createdAt: any;
}

export const FormBuilderService = {
    /**
     * Publishes the constructed form schema to the 'forms' collection
     */
    publishForm: async (title: string, questions: QuestionDefinition[]) => {
        try {
            const formsCollection = collection(db, "forms");

            const formPayload: FormSchema = {
                title,
                questions: questions.map(q => ({
                    type: q.type,
                    label: q.label,
                    options: q.type === 'dropdown' ? q.options : []
                })) as QuestionDefinition[], // Clean up IDs if you don't want the UI-only IDs in DB
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