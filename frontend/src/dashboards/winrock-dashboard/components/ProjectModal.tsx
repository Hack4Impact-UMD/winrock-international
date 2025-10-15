import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "../css-modules/ProjectModal.module.css";
import { Project } from "../../../types/Project";
import { addProject } from "../projects/winrockDashboardService";

interface ProjectModalProps {
    onClose: () => void;
    projects: Project[];
}

const ProjectModal: React.FC<ProjectModalProps> = ({ onClose, projects }) => {
    const popupRef = useRef<HTMLDivElement>(null);
    const [projectName, setProjectName] = useState<string>("");
    const [clientName, setClientName] = useState<string>("");
    const [supplierName, setSupplierName] = useState<string>("");
    const [supplierEmail, setSupplierEmail] = useState<string>("");
    const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
    const [clientSuggestions, setClientSuggestions] = useState<string[]>([]);
    const [supplierSuggestions, setSupplierSuggestions] = useState<string[]>([]);
    const [showClientDropdown, setShowClientDropdown] = useState<boolean>(false);
    const [showClientDropdownArrow, setShowClientDropdownArrow] = useState<boolean>(false);
    const [toggleClientDropdownArrow, setToggleClientDropdownArrow] = useState<boolean>(true);
    const [showSupplierDropdown, setShowSupplierDropdown] = useState<boolean>(false);
    const [showSupplierDropdownArrow, setShowSupplierDropdownArrow] = useState<boolean>(false);
    const [toggleSupplierDropdownArrow, setToggleSupplierDropdownArrow] = useState<boolean>(true);

    const clients = Array.from(new Set(projects.map(p => p.clientName))).sort((a,b) => a.localeCompare(b));
    const suppliers = Array.from(new Set(projects.map(p => p.supplierName))).sort((a,b) => a.localeCompare(b));

    function manageClientChange (e : React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setClientName(value);
        if (value.trim() === "") {
            setShowClientDropdown(false);
            setShowClientDropdownArrow(false);
            setClientSuggestions([]);
            return;
        }
        const filtered = clients.filter(c => c.toLowerCase().startsWith(value.toLowerCase()));
        setShowClientDropdown(toggleClientDropdownArrow && filtered.length > 0);
        setShowClientDropdownArrow(filtered.length > 0);
        setClientSuggestions(filtered);
    };

    function manageSupplierChange (e : React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setSupplierName(value);
        if (value.trim() === "") {
            setShowSupplierDropdown(false);
            setSupplierSuggestions([]);
            return;
        }
        const filtered = suppliers.filter(s => s.toLowerCase().startsWith(value.toLowerCase()));
        setShowSupplierDropdown(toggleSupplierDropdownArrow && filtered.length > 0);
        setShowSupplierDropdownArrow(filtered.length > 0);
        setSupplierSuggestions(filtered);
    };

    function setRandomProjectName() : void {
        const words = ["Agile", "Brisk", "Calm", "Daring", "Eager", "Fierce", "Gentle", "Heroic", "Icy", "Jolly"];
        let random = "";
        for (let i = 0; i < 3;) {
            const curr = words[Math.floor(Math.random() * words.length)];
            if (random.includes(curr)) {
                continue;
            }
            random += curr + (i < 2 ? ' ' : '');
            i++;
        }
        setProjectName(random);
    }

    function anyInvalidInputs() : boolean {
        return projectName.trim() === "" || clientName.trim() === "" || supplierName.trim() === "" || !isValidEmail;
    }

    return createPortal(
        <div className={styles.overlay}>
            <div
                ref={popupRef}
                className={styles.modalContainer}
                onMouseDown={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <div className={styles.header}>
                    <span className={styles.modalTitle}>Create new project</span>
                    <button onClick={onClose} className={styles.closeButton}>
                        &times;
                    </button>
                </div>
                <div className={styles.content}>
                    <div className={styles.fieldContainer}>
                        <span className={styles.fieldLabel}>Project name</span>
                        <div className={styles.projectContainer}>
                            <input type="text" className={styles.fieldInput} value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                            <svg className={styles.randomButton} onClick={setRandomProjectName} version="1.1" id="svg2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200">
                                <path id="path18074" d="M935.926,42.203v186.061H763.958c-54.408,0-114.484,26.559-164.729,77.32  c-50.242,50.761-104.842,126.065-191.527,249.904c-87.076,124.394-135.567,199.565-165.807,233.346  c-30.24,33.78-25.376,30.882-69.388,30.882H2.08H0v147.863h2.08h170.427c66.078,0,132.54-27.619,179.515-80.093  c46.975-52.475,91.312-125.164,176.742-247.208c85.82-122.601,140.381-195.159,175.512-230.651  c35.129-35.491,36.641-33.5,59.685-33.5h171.967v194.147L1200,306.276L935.926,42.203z M0,228.263v147.863h2.08h170.427  c44.012,0,39.148-2.975,69.388,30.805c19.456,21.734,51.507,67.826,91.49,125.915c5.419-7.773,7.973-11.521,13.708-19.716  c21.78-31.114,41.563-59.187,59.838-84.79c6.36-8.91,11.688-15.939,17.714-24.259c-27.021-39.039-49.525-70.001-72.623-95.803  c-46.975-52.474-113.437-80.015-179.515-80.015H2.079H0L0,228.263z M935.926,629.727v189.988H763.958  c-23.043,0-24.554,1.915-59.684-33.577c-23.237-23.477-56.146-65.093-99.809-124.76c-5.281,7.49-9.555,13.418-15.095,21.333  c-30.571,43.674-51.648,75.183-73.777,107.816c31.395,41.578,58.12,73.875,83.637,99.652  c50.242,50.763,110.319,77.397,164.729,77.397h171.968v190.22L1200,893.801L935.926,629.727z"/>
                            </svg>
                        </div>
                        <span className={styles.note}>Temporary name&mdash;you can rename this project anytime.</span>
                    </div>
                    <div></div>
                    <div className={styles.fieldContainer}>
                        <span className={styles.fieldLabel}>Client name</span>
                        <input 
                            type="text" 
                            className={styles.fieldInput} 
                            value={clientName} 
                            onChange={manageClientChange}
                            onFocus={() => {
                                setShowClientDropdownArrow(clientSuggestions.length > 0);
                                setShowClientDropdown(toggleClientDropdownArrow && clientSuggestions.length > 0);
                            }}
                            onBlur={(e) => {
                                const clicked = e.relatedTarget;
                                if (!clicked || clicked.parentElement !== e.currentTarget.parentElement) {
                                    setShowClientDropdown(false);
                                    setShowClientDropdownArrow(false);
                                }
                            }}
                        />
                        {showClientDropdownArrow && (
                            <button 
                                className={toggleClientDropdownArrow ? styles.dropdownArrow : (styles.dropdownArrow + ' ' + styles.flipped) } 
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                    setToggleClientDropdownArrow(!toggleClientDropdownArrow);
                                    setShowClientDropdown(!showClientDropdown);
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                        <path d="M297.4 438.6C309.9 451.1 330.2 451.1 342.7 438.6L502.7 278.6C515.2 266.1 515.2 245.8 502.7 233.3C490.2 220.8 469.9 220.8 457.4 233.3L320 370.7L182.6 233.4C170.1 220.9 149.8 220.9 137.3 233.4C124.8 245.9 124.8 266.2 137.3 278.7L297.3 438.7z"/>
                                    </svg>
                            </button>
                        )}
                        {showClientDropdown && (
                        <ul className={styles.dropdownMenu}>
                            {clientSuggestions.map((client, idx) => (
                            <li
                                key={idx}
                                className={styles.dropdownItem}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    setClientName(client);
                                    setShowClientDropdown(false);
                                    setShowClientDropdownArrow(false);
                                }}
                            >
                                {client}
                            </li>
                            ))}
                        </ul>
                        )}
                    </div>
                    <div></div>
                    <div className={styles.fieldContainer}>
                        <span className={styles.fieldLabel}>Supplier name</span>
                        <input 
                            type="text" 
                            className={styles.fieldInput} 
                            value={supplierName}
                            onChange={manageSupplierChange}
                            onFocus={() => {
                                setShowSupplierDropdownArrow(supplierSuggestions.length > 0);
                                setShowSupplierDropdown(toggleSupplierDropdownArrow && supplierSuggestions.length > 0);
                            }}
                            onBlur={(e) => {
                                const clicked = e.relatedTarget;
                                if (!clicked || clicked.parentElement !== e.currentTarget.parentElement) {
                                    setShowSupplierDropdown(false);
                                    setShowSupplierDropdownArrow(false);
                                }
                            }}
                        />
                        {showSupplierDropdownArrow && (
                            <button 
                                className={toggleSupplierDropdownArrow ? styles.dropdownArrow : (styles.dropdownArrow + ' ' + styles.flipped)} 
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                    setToggleSupplierDropdownArrow(!toggleSupplierDropdownArrow);
                                    setShowSupplierDropdown(!showSupplierDropdown);
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                        <path d="M297.4 438.6C309.9 451.1 330.2 451.1 342.7 438.6L502.7 278.6C515.2 266.1 515.2 245.8 502.7 233.3C490.2 220.8 469.9 220.8 457.4 233.3L320 370.7L182.6 233.4C170.1 220.9 149.8 220.9 137.3 233.4C124.8 245.9 124.8 266.2 137.3 278.7L297.3 438.7z"/>
                                    </svg>
                            </button>
                        )}
                        {showSupplierDropdown && (
                        <ul className={styles.dropdownMenu}>
                            {supplierSuggestions.map((supplier, idx) => (
                            <li
                                key={idx}
                                className={styles.dropdownItem}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    setSupplierName(supplier);
                                    setShowSupplierDropdown(false);
                                    setShowSupplierDropdownArrow(false);
                                }}
                            >
                                {supplier}
                            </li>
                            ))}
                        </ul>
                        )}
                    </div>
                    <div className={styles.fieldContainer}>
                        <span className={styles.fieldLabel}>Supplier email</span>
                        <input 
                            type="email" 
                            className={styles.fieldInput} 
                            value={supplierEmail} 
                            onChange={(e) => {
                                setSupplierEmail(e.target.value);
                                setIsValidEmail(e.target.value.trim() !== '' && e.target.checkValidity());
                            }} 
                         />
                    </div>
                </div>
                <div className={styles.footer}>
                    <div className={styles.createContainer}>
                        <button 
                            className={styles.createButton} 
                            onClick={() => {
                                addProject(projectName, clientName, supplierName, supplierEmail);
                                onClose();
                            }} 
                            disabled={anyInvalidInputs()}
                        >
                            Create
                        </button>
                        <span className={styles.note}>
                            New project will be created, and supplier will be notified by email.
                        </span>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ProjectModal;