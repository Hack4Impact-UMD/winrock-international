import React, { useState } from "react";
import styles from "../css-modules/ManageAccess.module.css";
import CloseIcon from "@mui/icons-material/CloseRounded";
import CheckIcon from "@mui/icons-material/CheckBoxRounded";
import BoxIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";
import ChevronRight from "@mui/icons-material/ChevronRightRounded";
import ChevronLeft from "@mui/icons-material/ChevronLeftRounded";
import CheckBadge from "@mui/icons-material/Verified";

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
    name: string;
    email: string;
    role: string;
}

interface AlertData {
    text: string;
    type: string;
}

const ManageAccess = (props: ManageAccessProps) => {
    // state variables
    const [emails, setEmails] = useState<EmailCapsuleData[]>([]);
    const [notifyPeople, setNotifyPeople] = useState(true);
    const [showingManageAccess, setShowingManageAccess] = useState(false);

	// used in manage access view
    const [usersWithAccess, setUsersWithAccess] = useState<UserData[]>([
        {
            name: "Jane Doe",
            email: "jdoe@gmail.com",
            role: "Client",
        },
        {
            name: "John Smith",
            email: "john.smith1@icloud.com",
            role: "Supplier",
        },
    ]);

	// all alerts in this array are shown
    const [alerts, setAlerts] = useState<AlertData[]>([
        {
            text: "Access updated",
            type: "success",
        },
        {
            text: "Could not add example@gmail.com because account does not exist",
            type: "error",
        },
    ]);

	// null if not showing confirm dialog, is user to remove if showing (to facilitate actually removing them)
    const [userToRemove, setUserToRemove] = useState<UserData | null>(null);

    // called on keydown in the email input textbox
    const onEmailKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            // check if email is a valid user or not here

            setEmails([
                ...emails,
                {
                    email: (event.target as HTMLInputElement).value,
                    valid: true,
                },
            ]);
            (event.target as HTMLInputElement).value = "";
        }
        // code for populating autocomplete can go here
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

                    <button onClick={(event) => removeAlert(alert)}>
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
                    <button onClick={(event) => removeAlert(alert)}>
                        <CloseIcon
                            fontSize="medium"
                            style={{ color: "gray" }}
                        ></CloseIcon>
                    </button>
                </div>
            );
        }
    };

    // called to close an alert with its x button
    const removeAlert = (alert: AlertData) => {
        setAlerts(alerts.filter((element) => element !== alert));
    };

    return (
        <div style={{ display: props.visible ? "block" : "none" }}>
            <div className={styles.overlay}></div>

            <div className={styles.container}>
                {userToRemove ? (
                    <>
                        <div className={styles.confirmDialogOverlay}></div>
                        <div className={styles.confirmDialog}>
							<h3>Are you sure you want to remove {userToRemove.name} from this project?</h3>
							<div className={styles.confirmButtonsCont}>
								<button onClick={() => {setUserToRemove(null)}}>Cancel</button>
								<button>Yes</button>
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
                                    className={
                                        emailData.valid
                                            ? styles.emailCapsuleValid
                                            : styles.emailCapsuleInvalid
                                    }
                                >
                                    <p>{emailData.email}</p>
                                </div>
                            );
                        })}

                        <input
                            id="email-input"
                            type="email"
                            className={styles.emailInput}
                            placeholder="Add members by email"
                            onKeyDown={onEmailKeyPress}
                        ></input>
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
                    ></textarea>
                    <div className={styles.buttonCont}>
                        <button className={styles.inviteButton}>Invite</button>
                    </div>
                    <h2>Manage access</h2>
                    <div className={styles.accessCont}>
                        {usersPreview(usersWithAccess)}
                        <button onClick={() => setShowingManageAccess(true)}>
                            <ChevronRight
                                fontSize="medium"
                                sx={{ color: "black" }}
                            ></ChevronRight>
                        </button>
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
                                <div className={styles.userDataCont}>
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
                                    <button onClick={() => setUserToRemove(user)}>Remove</button>
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
