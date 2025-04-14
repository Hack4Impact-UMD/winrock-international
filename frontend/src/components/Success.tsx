import { useState } from "react";
import { useNavigate } from "react-router-dom";
import checkmarkImage from '../assets/checkmark.png'; // Import the checkmark image

import LogoHeader from "./LogoHeader"; // Assuming you have a logo component
import styles from "../css-modules/SuccessPage.module.css"; // CSS for styling the success page

const Success = () => {
    const navigate = useNavigate();

    const goToNextPage = () => {
        navigate('/page3'); // Adjust the route as needed
    };

    const goBack = () => {
        navigate(-1); // Go back to the previous page in browser history
    };

    return (
        <div className={styles.successContainer}>
            <LogoHeader />
            <p ><br /><br /><br /></p>
            <div className={styles.successMessage}>
                <img src={checkmarkImage} alt="Success" className={styles.checkmark} />
                <h1>Renewable Energy Project Proposal</h1>
                <p style={{ fontStyle: 'italic' }}>Your response has been recorded. You may exit the page now.</p>
            </div>
        </div>
    );
};

export default Success;
