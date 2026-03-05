import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Sidebar from '../dashboards/winrock-dashboard/components/Sidebar';
import styles from './css-modules/FormDashboard.module.css';

interface FormSummary {
    id: string;
    title: string;
    // You can add more metadata here like category or date
}

const FormDashboard = () => {
    const [forms, setForms] = useState<FormSummary[]>([]);
    const [activeTab, setActiveTab] = useState<'proposal' | 'risk'>('proposal');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchForms = async () => {
            let current_collection
            if (activeTab === 'proposal') {
                current_collection = "custom-project-proposal-forms"
            } else {
                current_collection = 'custom-risk-cobenefits-forms'
            }
            const q = query(collection(db, current_collection), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const formsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                title: doc.data().title,
            }));
            setForms(formsData);
        };

        fetchForms();
    }, []);

    return (
        <div className={styles.pageWrapper}>
            <Sidebar currentTab="forms" />

            <main className={styles.mainContent}>
                <div className={styles.headerRow}>
                    <h1 className={styles.pageTitle}>Forms</h1>
                    <button
                        className={styles.createBtn}
                        onClick={() => navigate('/form-builder')}
                    >
                        + Create New Form
                    </button>
                </div>

                <div className={styles.tabContainer}>
                    <button
                        className={`${styles.tab} ${activeTab === 'proposal' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('proposal')}
                    >
                        Project Proposal
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'risk' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('risk')}
                    >
                        Risk and Co-benefit
                    </button>
                </div>

                <div className={styles.formList}>
                    {forms.map((form) => (
                        <div key={form.id} className={styles.formItem}>
                            <span className={styles.formTitle}>{form.title}</span>
                            <div className={styles.actionGroup}>
                                <button className={styles.viewBtn}>View</button>
                                <button className={styles.editBtn}>Edit</button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default FormDashboard;