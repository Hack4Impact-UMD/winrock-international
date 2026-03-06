import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Sidebar from '../dashboards/winrock-dashboard/components/Sidebar';
import styles from './css-modules/FormDashboard.module.css';

interface FormSummary {
    id: string;
    title: string;
}

const FormDashboard = () => {
    const [forms, setForms] = useState<FormSummary[]>([]);
    const [activeTab, setActiveTab] = useState<'proposal' | 'risk'>('proposal');

    const proposalFormsRef = useRef<FormSummary[]>([]);
    const riskFormsRef = useRef<FormSummary[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchForms = async () => {
            const proposalCollection = "custom-project-proposal-forms";
            const riskCollection = "custom-risk-cobenefits-forms";

            const q1 = query(collection(db, proposalCollection), orderBy("createdAt", "desc"));
            const q2 = query(collection(db, riskCollection), orderBy("createdAt", "desc"));

            const querySnapshot1 = await getDocs(q1);
            proposalFormsRef.current = querySnapshot1.docs.map(doc => ({
                id: doc.id,
                title: doc.data().title,
            }));

            const querySnapshot2 = await getDocs(q2);
            riskFormsRef.current = querySnapshot2.docs.map(doc => ({
                id: doc.id,
                title: doc.data().title,
            }));

            setForms(proposalFormsRef.current);
        };

        fetchForms();
    }, []);

    const switchTab = (tab: 'proposal' | 'risk') => {
        setActiveTab(tab);

        if (tab === 'proposal') {
            setForms(proposalFormsRef.current);
        } else {
            setForms(riskFormsRef.current);
        }
    };

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
                        onClick={() => switchTab('proposal')}
                    >
                        Project Proposal
                    </button>

                    <button
                        className={`${styles.tab} ${activeTab === 'risk' ? styles.activeTab : ''}`}
                        onClick={() => switchTab('risk')}
                    >
                        Risk and Co-benefit
                    </button>
                </div>

                <div className={styles.formList}>
                    {forms.map((form) => (
                        <div className={styles.actionGroup}>
                            <button
                                className={styles.viewBtn}
                                onClick={() => navigate(`/view-form/${activeTab}/${form.id}`)}
                            >
                                View
                            </button>
                            <button className={styles.editBtn} onClick={() => navigate(`/form-builder/${activeTab}/${form.id}`)}>Edit</button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default FormDashboard;