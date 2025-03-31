import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export const submitFormToFirebase = async (
    formType: 'agricultural' | 'techEnergy' | 'renewable' | 'forestry',
    formData: any,
    userEmail: string
) => {
    try {
        const collectionName = `${formType}Forms`;
        const docRef = await addDoc(collection(db, collectionName), {
            ...formData,
            userEmail,
            submittedAt: serverTimestamp(),
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error submitting form:', error);
        return { success: false, error };
    }
}; 