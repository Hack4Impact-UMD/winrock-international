import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';

import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import SupplierLogin from './components/SupplierLogin';
import AdminDashboard from './components/AdminDashboard';
import SupplierDashboard from './components/SupplierDashboard';
import AgriculturalProjectForm from './components/AgriculturalProjectForm';
import TechEnergyRisksForm from './components/TechEnergyRisksForm';
import RenewableProjectForm from './components/RenewableProjectForm';
import ForestryRisksForm from './components/ForestryRisksForm';

function App() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSupplier, setIsSupplier] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsAdmin(user?.email?.endsWith('@winrock.org') || false);
            setIsSupplier(user?.email?.endsWith('@supplier.com') || false);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={user ? <Navigate to="/" /> : <Login onLogin={setUser} />}
                />
                <Route
                    path="/admin/login"
                    element={isAdmin ? <Navigate to="/admin" /> : <AdminLogin onLogin={setUser} />}
                />
                <Route
                    path="/admin"
                    element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin/login" />}
                />
                <Route
                    path="/supplier/login"
                    element={isSupplier ? <Navigate to="/supplier" /> : <SupplierLogin onLogin={setUser} />}
                />
                <Route
                    path="/supplier"
                    element={isSupplier ? <SupplierDashboard supplierEmail={user?.email} /> : <Navigate to="/supplier/login" />}
                />
                <Route
                    path="/"
                    element={user ? <Navigate to="/agricultural" /> : <Navigate to="/login" />}
                />
                <Route
                    path="/agricultural"
                    element={user ? <AgriculturalProjectForm userEmail={user.email} /> : <Navigate to="/login" />}
                />
                <Route
                    path="/tech-energy"
                    element={user ? <TechEnergyRisksForm userEmail={user.email} /> : <Navigate to="/login" />}
                />
                <Route
                    path="/renewable"
                    element={user ? <RenewableProjectForm userEmail={user.email} /> : <Navigate to="/login" />}
                />
                <Route
                    path="/forestry"
                    element={user ? <ForestryRisksForm userEmail={user.email} /> : <Navigate to="/login" />}
                />
            </Routes>
        </Router>
    );
}

export default App; 