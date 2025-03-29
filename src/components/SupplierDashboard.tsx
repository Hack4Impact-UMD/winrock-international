import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    Divider,
    Chip
} from '@mui/material';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase/config';

interface FormSubmission {
    id: string;
    formType: string;
    submittedAt: any;
    userEmail: string;
    data: any;
    assignedSupplier?: string;
}

interface UserSubmissions {
    [key: string]: FormSubmission[];
}

interface SupplierDashboardProps {
    supplierEmail: string;
}

function SupplierDashboard({ supplierEmail }: SupplierDashboardProps) {
    const [users, setUsers] = useState<UserSubmissions>({});
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [selectedForm, setSelectedForm] = useState<FormSubmission | null>(null);

    useEffect(() => {
        fetchAssignedSubmissions();
    }, [supplierEmail]);

    const fetchAssignedSubmissions = async () => {
        const formTypes = ['agricultural', 'techEnergy', 'renewable', 'forestry'];
        const allSubmissions: FormSubmission[] = [];

        for (const type of formTypes) {
            const q = query(
                collection(db, `${type}Forms`),
                where('assignedSupplier', '==', supplierEmail)
            );
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                allSubmissions.push({
                    id: doc.id,
                    formType: type,
                    submittedAt: doc.data().submittedAt,
                    userEmail: doc.data().userEmail,
                    data: doc.data(),
                    assignedSupplier: doc.data().assignedSupplier
                });
            });
        }

        // Group submissions by user
        const userSubmissions: UserSubmissions = {};
        allSubmissions.forEach((submission) => {
            if (!userSubmissions[submission.userEmail]) {
                userSubmissions[submission.userEmail] = [];
            }
            userSubmissions[submission.userEmail].push(submission);
        });

        setUsers(userSubmissions);
    };

    const handleViewForms = (userEmail: string) => {
        setSelectedUser(userEmail);
    };

    const handleViewFormDetails = (form: FormSubmission) => {
        setSelectedForm(form);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Supplier Dashboard
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Assigned Forms for: {supplierEmail}
            </Typography>

            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Client Email</TableCell>
                            <TableCell>Number of Forms</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(users).map(([email, submissions]) => (
                            <TableRow key={email}>
                                <TableCell>{email}</TableCell>
                                <TableCell>{submissions.length}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleViewForms(email)}
                                    >
                                        View Forms
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* User Forms Dialog */}
            <Dialog
                open={!!selectedUser}
                onClose={() => setSelectedUser(null)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Forms for Client: {selectedUser}
                </DialogTitle>
                <DialogContent>
                    <List>
                        {selectedUser && users[selectedUser].map((form) => (
                            <div key={form.id}>
                                <ListItem>
                                    <ListItemText
                                        primary={`${form.formType.charAt(0).toUpperCase() + form.formType.slice(1)} Form`}
                                        secondary={`Submitted on: ${form.submittedAt?.toDate().toLocaleString()}`}
                                    />
                                    <Button
                                        variant="outlined"
                                        onClick={() => handleViewFormDetails(form)}
                                    >
                                        View Details
                                    </Button>
                                </ListItem>
                                <Divider />
                            </div>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedUser(null)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Form Details Dialog */}
            <Dialog
                open={!!selectedForm}
                onClose={() => setSelectedForm(null)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Form Details
                </DialogTitle>
                <DialogContent>
                    {selectedForm && (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                {selectedForm.formType.charAt(0).toUpperCase() + selectedForm.formType.slice(1)} Form
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Client: {selectedForm.userEmail}
                            </Typography>
                            <Typography variant="subtitle2" gutterBottom>
                                Submitted on: {selectedForm.submittedAt?.toDate().toLocaleString()}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Form Data:
                            </Typography>
                            <pre style={{ whiteSpace: 'pre-wrap' }}>
                                {JSON.stringify(selectedForm.data, null, 2)}
                            </pre>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedForm(null)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default SupplierDashboard; 