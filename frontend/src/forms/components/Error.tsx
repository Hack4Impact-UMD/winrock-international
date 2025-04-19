import styles from "../css-modules/Error.module.css";

interface ErrorProps {
    message: string;
}

function Error({ message }: ErrorProps) {
    if (!message) {
        return (<></>);
    }
    
    return (
        <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>
                {message}
            </p>
        </div>
    )
}

export default Error;