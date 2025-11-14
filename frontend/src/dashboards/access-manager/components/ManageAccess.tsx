import React, { useEffect, useState } from "react";
import styles from "../css-modules/ManageAccess.module.css";
import CloseIcon from "@mui/icons-material/CloseRounded";
import CheckIcon from "@mui/icons-material/CheckBoxRounded";
import BoxIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";
import ChevronRight from "@mui/icons-material/ChevronRightRounded";
import ChevronLeft from "@mui/icons-material/ChevronLeftRounded";
import CheckBadge from "@mui/icons-material/Verified";
import { db } from "../../../firebaseConfig";
import { collection, getDocs, query, where, limit, addDoc, deleteDoc, doc } from "firebase/firestore";

interface ManageAccessProps {
    projectId: string;
    visible: boolean;
    setVisible: (val: boolean) => void;
}

interface EmailCapsuleData {
    email: string;
    valid: boolean;
}

interface UserData {
	firstName: string;
	lastName: string;
    email: string;
    role: string;
    name?: string;
}

interface AlertData {
    text: string;
    type: string;
}

const ManageAccess = (props: ManageAccessProps) => {
    // state variables
    const [emails, setEmails] = useState<EmailCapsuleData[]>([]);
    const [notifyPeople, setNotifyPeople] = useState(true);
	const [message, setMessage] = useState("");
    const [showingManageAccess, setShowingManageAccess] = useState(false);

    // used in manage access view
    const [usersWithAccess, setUsersWithAccess] = useState<UserData[]>([]);

    // all alerts in this array are shown
    const [alerts, setAlerts] = useState<AlertData[]>([]);

    // null if not showing confirm dialog, is user to remove if showing (to facilitate actually removing them)
    const [userToRemove, setUserToRemove] = useState<UserData | null>(null);

    // suggestions currently being shown in autocomplete list
    const [userSuggestions, setUserSuggestions] = useState<UserData[]>([]);

    const [emailIsFocused, setEmailIsFocused] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

	// load users with access
	useEffect(() => {
		const loadUsers = async () => {
			const paQ = query(
				collection(db, "projectAccess"),
				where("projectId", "==", props.projectId)
			);

			const paSnap = await getDocs(paQ);

			if (paSnap.size > 0) {

				const userEmails = paSnap.docs.map(doc => doc.data().userEmail);

				const userQ = query(
					collection(db, "users"),
					where("email", "in", userEmails)
				);

				const userSnap = await getDocs(userQ);

				const result: UserData[] = [];

				userSnap.forEach(doc => {
					const userData = doc.data();
					result.push({
						name: userData.firstName + " " + userData.lastName,
						email: userData.email,
						role: userData.role
					} as UserData);
				});

				setUsersWithAccess(result);
			}

		};

		loadUsers();

	}, [props.projectId]);

    const handleEmailAutocomplete = async (partialEmail: string) => {
        if (!partialEmail || partialEmail.length < 2) {
            setUserSuggestions([]);
            return;
        }

        try {
            const results: UserData[] = [];

            // Query for email matches
            const emailQuery = query(
                collection(db, "users"),
                where("email", ">=", partialEmail.toLowerCase()),
                where("email", "<=", partialEmail.toLowerCase() + "\uf8ff"),
                limit(5)
            );

            // Query for name matches
            const firstNameQuery = query(
                collection(db, "users"),
                where("firstName", ">=", partialEmail),
                where("firstName", "<=", partialEmail + "\uf8ff"),
                limit(5)
            );

            const lastNameQuery = query(
                collection(db, "users"),
                where("lastName", ">=", partialEmail),
                where("lastName", "<=", partialEmail + "\uf8ff"),
                limit(5)
            );

            // Execute all queries
            const [emailSnapshot, firstNameSnapshot, lastNameSnapshot] = await Promise.all([
                getDocs(emailQuery),
                getDocs(firstNameQuery),
                getDocs(lastNameQuery)
            ]);

            // Process email query results
            emailSnapshot.forEach((doc) => {
                const userData = doc.data();
                results.push({
                    name: userData.firstName + " " + userData.lastName,
                    email: userData.email,
                    role: userData.role
                } as UserData);
            });

            // Process name query results (avoid duplicates)
            firstNameSnapshot.forEach((doc) => {
                const userData = doc.data();
                // Check if this user is already in results
                if (!results.some(user => user.email === userData.email)) {
                    results.push({
                        name: userData.firstName + " " + userData.lastName,
                        email: userData.email,
                        role: userData.role
                    } as UserData);
                }
            });

            lastNameSnapshot.forEach((doc) => {
                const userData = doc.data();
                // Check if this user is already in results
                if (!results.some(user => user.email === userData.email)) {
                    results.push({
                        name: userData.firstName + " " + userData.lastName,
                        email: userData.email,
                        role: userData.role
                    } as UserData);
                }
            });

            setUserSuggestions(results);
        } catch (error) {
            console.error("Error searching for users:", error);
            setUserSuggestions([]);
        }
    };

    const checkUserExists = async (email: string): Promise<UserData | null> => {
        try {
            const userQuery = query(
                collection(db, "users"),
                where("email", "==", email.toLowerCase())
            );

            const querySnapshot = await getDocs(userQuery);

            if (querySnapshot.empty) {
                return null;
            }

            const userData = querySnapshot.docs[0].data();
            return {
                name: userData.firstName + " " + userData.lastName,
                email: userData.email,
                role: userData.role
            } as UserData;

        } catch (error) {
            console.error("Error checking if user exists:", error);
            return null;
        }
    };

    const updateUserAccess = async () => {
        if (isProcessing || emails.length === 0) return;

        setIsProcessing(true);

        try {
            const validUsers: UserData[] = [];
            const invalidEmails: string[] = [];

            for (const emailData of emails) {
                const userData = await checkUserExists(emailData.email);
                if (userData) {
                    validUsers.push(userData);
                } else {
                    invalidEmails.push(emailData.email);
                }
            }

            invalidEmails.forEach(email => {
                addAlert("error", email);
            });

            const existingEmails = usersWithAccess.map(user => user.email);
            const newUsers = validUsers.filter(user => !existingEmails.includes(user.email));

            if (newUsers.length > 0) {
                for (const user of newUsers) {
                    await addDoc(collection(db, "projectAccess"), {
                        projectId: props.projectId,
                        userEmail: user.email,
                        role: user.role,
                        addedBy: "current-user-email",
                        addedAt: new Date(),
                        notified: notifyPeople
                    });
                }

                setUsersWithAccess([...usersWithAccess, ...newUsers]);
                addAlert("success");
            }

            setEmails([]);
			setMessage("");

        } catch (error) {
            console.error("Error updating access:", error);
            setAlerts([...alerts, {
                text: "An error occurred while updating access",
                type: "error"
            }]);
        } finally {
            setIsProcessing(false);
        }
    };

    const removeUserAccess = async (user: UserData) => {
        if (!user) return;

        setIsProcessing(true);

        try {
            const accessQuery = query(
                collection(db, "projectAccess"),
                where("projectId", "==", props.projectId),
                where("userEmail", "==", user.email)
            );

            const querySnapshot = await getDocs(accessQuery);

            if (!querySnapshot.empty) {
                await deleteDoc(doc(db, "projectAccess", querySnapshot.docs[0].id));

                setUsersWithAccess(usersWithAccess.filter(u => u.email !== user.email));
                addAlert("success");
            }

        } catch (error) {
            console.error("Error removing access:", error);
            setAlerts([...alerts, {
                text: "An error occurred while removing access",
                type: "error"
            }]);
        } finally {
            setIsProcessing(false);
            setUserToRemove(null);
        }
    };

    // called on keydown in the email input textbox
    const onEmailKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        const emailInput = event.target as HTMLInputElement;

        if (event.key === "Backspace" && emailInput.value === "") {
            setEmails(emails.slice(0, -1));
        } else if (event.key === "Enter") {
            if (emailInput.value.trim() === "") return;

            // Add email to the list immediately, mark as checking validity
            const newEmail = {
                email: emailInput.value,
                valid: false // Initially false until validated
            };

            setEmails([...emails, newEmail]);

            // Check if user exists asynchronously
            const userData = await checkUserExists(emailInput.value);

            // Update the email's valid status based on existence check
            setEmails(currentEmails =>
                currentEmails.map(email =>
                    email.email === newEmail.email
                        ? { ...email, valid: userData !== null }
                        : email
                )
            );

            // Show error if user doesn't exist
            if (!userData) {
                addAlert("error", newEmail.email);
            }

            emailInput.value = "";
			setUserSuggestions([]);
        }
    };

    // called to show preview of users next to the manage access > button
    const usersPreview = (data: UserData[]) => {
        if (data.length === 0) {
            return <p>No other users have access.</p>;
        } else if (data.length === 1) {
            return <p>{data[0].name}</p>;
        } else if (data.length === 2) {
            return (
                <p>
                    {data[0].name} and {data[1].name}
                </p>
            );
        } else if (data.length === 3) {
            return (
                <p>
                    {data[0].name}, {data[1].name}, and 1 other
                </p>
            );
        } else {
            return (
                <p>
                    {data[0].name}, {data[1].name}, and {data.length - 2} others
                </p>
            );
        }
    };

    // called to render an alert in the alerts array
    const alertContent = (alert: AlertData) => {
        if (alert.type === "success") {
            return (
                <div className={styles.alertCont}>
                    <p className={styles.successText}>{alert.text}</p>
                    <CheckBadge
                        fontSize="medium"
                        style={{ color: "green" }}
                    ></CheckBadge>

                    <button onClick={() => removeAlert(alert)}>
                        <CloseIcon
                            fontSize="medium"
                            style={{ color: "gray" }}
                        ></CloseIcon>
                    </button>
                </div>
            );
        } else {
            return (
                <div className={styles.alertCont}>
                    <p className={styles.errorText}>{alert.text}</p>
                    <button onClick={() => removeAlert(alert)}>
                        <CloseIcon
                            fontSize="medium"
                            style={{ color: "gray" }}
                        ></CloseIcon>
                    </button>
                </div>
            );
        }
    };

    // called to add an alert
    const addAlert = (type: string, invalidEmail?: string) => {
        let newAlert: AlertData;
        if (type === "success") {
            newAlert = {
                text: "Access updated",
                type: "success",
            };
        } else {
            newAlert = {
                text:
                    "Could not add " +
                    invalidEmail +
                    " because account does not exist",
                type: "error",
            };
        }

        setAlerts([...alerts, newAlert]);
    };

    // called to close an alert with its x button
    const removeAlert = (alert: AlertData) => {
        setAlerts(alerts.filter((element) => element !== alert));
    };

    // called on Invite button click
    const addAccess = () => {
        updateUserAccess();
    };

    return (
        <div style={{ display: props.visible ? "block" : "none" }}>
            <div className={styles.overlay}></div>

            <div className={styles.container}>
                {userToRemove ? (
                    <>
                        <div className={styles.confirmDialogOverlay}></div>
                        <div className={styles.confirmDialog}>
                            <h3>
                                Are you sure you want to remove{" "}
                                {userToRemove.name} from this project?
                            </h3>
                            <div className={styles.confirmButtonsCont}>
                                <button
                                    onClick={() => {
                                        setUserToRemove(null);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => removeUserAccess(userToRemove)}
                                    disabled={isProcessing}
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <></>
                )}
                <div className={styles.alertsCont}>
                    {alerts.map(alertContent)}
                </div>
                <div
                    className={styles.shareCont}
                    style={{ right: showingManageAccess ? "100%" : "0%" }}
                >
                    <div className={styles.headerCont}>
                        <h1>Share</h1>
                        <button onClick={() => props.setVisible(false)}>
                            <CloseIcon
                                fontSize="medium"
                                sx={{ color: "black" }}
                            ></CloseIcon>
                        </button>
                    </div>
                    <p className={styles.invite}>
                        Invite people to be a part of this project
                    </p>
                    <div className={styles.inputBox}>
                        {emails.map((emailData) => {
                            return (
                                <div
                                    key={emailData.email}
                                    className={
                                        emailData.valid
                                            ? styles.emailCapsuleValid
                                            : styles.emailCapsuleInvalid
                                    }
                                >
                                    <p>{emailData.email}</p>
                                    <button
                                        onClick={() => {
                                            setEmails(
                                                emails.filter((element) => {
                                                    return (
                                                        element !== emailData
                                                    );
                                                })
                                            );
                                        }}
                                    >
                                        <CloseIcon
                                            fontSize="small"
                                            sx={{ color: "#76797C" }}
                                        ></CloseIcon>
                                    </button>
                                </div>
                            );
                        })}

                        <input
                            id="email-input"
                            type="email"
                            className={styles.emailInput}
                            placeholder="Add members by email"
                            onKeyDown={onEmailKeyPress}
                            onChange={(e) => {
                                const inputElement = e.target as HTMLInputElement;
                                handleEmailAutocomplete(inputElement.value);
                            }}
                            onFocus={() => setEmailIsFocused(true)}
                            onBlur={() => {
                                setTimeout(() => {
                                    setEmailIsFocused(false);
                                }, 200);
                            }}
                        ></input>
                    </div>
                    <div className={styles.belowInputCont}>
                        <div
                            id="autocomplete"
                            className={styles.autocompleteCont}
                            style={{
                                display: emailIsFocused ? "block" : "none",
                            }}
                        >
                            {userSuggestions.map((user) => {
                                return (
                                    <button
                                        key={user.email}
                                        className={styles.autocompleteButton}
                                        onClick={() => {
                                            setEmails([
                                                ...emails,
                                                {
                                                    email: user.email,
                                                    valid: true,
                                                },
                                            ]);
                                            const emailInput =
                                                document.getElementById(
                                                    "email-input"
                                                );
                                            if (emailInput) {
                                                (
                                                    emailInput as HTMLInputElement
                                                ).value = "";
                                            }
											setUserSuggestions([]);
                                        }}
                                    >
                                        <p>{user.name}</p>
                                        <p>{user.email}</p>
                                        <p>{user.role}</p>
                                    </button>
                                );
                            })}
                        </div>

                        <div
                            className={styles.notifyCont}
                            onClick={() => setNotifyPeople(!notifyPeople)}
                        >
                            {notifyPeople ? (
                                <CheckIcon
                                    fontSize="large"
                                    sx={{ color: "#005293" }}
                                ></CheckIcon>
                            ) : (
                                <BoxIcon
                                    fontSize="large"
                                    sx={{ color: "#005293" }}
                                ></BoxIcon>
                            )}
                            <p>Notify people</p>
                        </div>
                        <textarea
                            className={styles.messageBox}
                            placeholder="Enter optional message"
							value={message}
							onChange={(event) => {
								setMessage(event.target.value)
							}}
                        ></textarea>
                        <div className={styles.buttonCont}>
                            <button
                                className={styles.inviteButton}
                                onClick={addAccess}
                                disabled={isProcessing || emails.length === 0}
                            >
                                {isProcessing ? "Processing..." : "Invite"}
                            </button>
                        </div>
                        <h2>Manage access</h2>
                        <div className={styles.accessCont}>
                            {usersPreview(usersWithAccess)}
                            <button
                                onClick={() => setShowingManageAccess(true)}
                            >
                                <ChevronRight
                                    fontSize="medium"
                                    sx={{ color: "black" }}
                                ></ChevronRight>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={styles.manageAccessCont}
                    style={{ left: showingManageAccess ? "0%" : "100%" }}
                >
                    <div className={styles.buttonsHeaderCont}>
                        <button
                            className={styles.leftButton}
                            onClick={() => setShowingManageAccess(false)}
                        >
                            <ChevronLeft fontSize="large"></ChevronLeft>
                        </button>
                        <button onClick={() => props.setVisible(false)}>
                            <CloseIcon
                                fontSize="medium"
                                sx={{ color: "black" }}
                            ></CloseIcon>
                        </button>
                    </div>
                    <h2>Manage access</h2>
                    <div className={styles.usersCont}>
                        {usersWithAccess.map((user) => {
                            return (
                                <div key={user.email} className={styles.userDataCont}>
                                    <div className={styles.userNameEmail}>
                                        <p className={styles.userName}>
                                            {user.name}
                                        </p>
                                        <p className={styles.userEmail}>
                                            {user.email}
                                        </p>
                                    </div>
                                    <div className={styles.userRole}>
                                        <p>{user.role}</p>
                                    </div>
                                    <button
                                        onClick={() => setUserToRemove(user)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageAccess;