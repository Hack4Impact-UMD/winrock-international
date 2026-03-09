import { db } from "../firebaseConfig"; // Adjust path to your firebase config
import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";

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
    publishForm: async (title: string, questions: any[], formType: string, published: boolean, id?: string,) => {
        try {
            const collectionName = formType === 'risk'
                ? "custom-risk-cobenefits-forms"
                : "custom-project-proposal-forms";

            const formPayload = {
                title,
                published: published,   // ✅ store at form level
                questions: questions.map(q => ({
                    type: q.type,
                    label: q.label,
                    options: q.type === 'dropdown' ? q.options : [],
                    id: q.id,

                })),
                updatedAt: serverTimestamp(),
                ...(id ? {} : { createdAt: serverTimestamp() })
            };

            if (id) {
                // UPDATE: Use setDoc with merge to preserve fields like the original 'id' string if needed
                const docRef = doc(db, collectionName, id);
                await setDoc(docRef, formPayload, { merge: true });
                return id;
            } else {
                // CREATE: Use addDoc for a brand new entry
                const formsCollection = collection(db, collectionName);
                const docRef = await addDoc(formsCollection, formPayload);
                return docRef.id;
            }
        } catch (error) {
            console.error("Error publishing form:", error);
            throw error;
        }
    }
};