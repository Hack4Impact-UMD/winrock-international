import { useState } from "react";
import * as firestore from "firebase/firestore";
import "./temp-renewable.css";

import { db } from "../../src/firebaseConfig.js";

function RenewableProposalForm() {
    const renewableProjectProposalFormID = "project-proposal-form/GG9KZ21emgEDELo9kvTT/project-submission-form";
    const renewableProjectProposalForm = firestore.collection(db, renewableProjectProposalFormID);

    const [parentVendorName, setParentVendorName] = useState("");
    const [vendorCode, setVendorCode] = useState("");
    const [vendorSiteSAPName, setVendorSiteSAPName] = useState("");
    const [spendCategory, setSpendCategory] = useState("");
    const [level2Category, setLevel2Category] = useState("");
    const [vendorSiteCountry, setVendorSiteCountry] = useState("");
    const [vendorSiteCity, setVendorSiteCity] = useState("");
    const [projectType, setProjectType] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [projectImplementationYear, setProjectImplementationYear] = useState("");
    const [impactEvidence, setImpactEvidence] = useState("");

    /**
     * Save a new renewableProjectProposal document with the user-inputted
     * fields into the renewableProjectProposalForm collection.
    */
    async function handleSubmit() {
        try {
            const documentObj = {
                parentVendorName: parentVendorName,
                vendorCode: vendorCode,
                vendorSiteSAPName: vendorSiteSAPName,
                spendCategory: spendCategory,
                level2Category: level2Category,
                vendorSiteCountry: vendorSiteCountry,
                vendorSiteCity: vendorSiteCity,
                projectType: projectType,
                projectDescription: projectDescription,
                projectImplementationYear: projectImplementationYear,
                impactEvidence: impactEvidence
            }
            const documentRef = await firestore.addDoc(renewableProjectProposalForm, documentObj); // addDoc() auto-generates an ID for the doc
            console.log(`renewableProjectProposal submitted successfully with ID ${documentRef.id}`)
        } catch (error) {
            console.error("Error submitting renewableProjectProposal", error);
        }
    }

    return (
        /* Replace the inner divs with question components later on */ 
        <div className="form renewable-proposal-form">
            <h2>
                Renewable Energy Project Proposal Form
            </h2>
            
            <div className="question text-question required">
                <label htmlFor="parent-vendor-name">Parent Vendor Name</label>
                <input
                    type="text"
                    id="parent-vendor-name"
                    value={parentVendorName}
                    onChange={(e) => setParentVendorName(e.target.value)}
                />
            </div>

            <div className="question text-question">
                <label htmlFor="vendor-code">Vendor Code</label>
                <input
                    type="text"
                    id="vendor-code"
                    value={vendorCode}
                    onChange={(e) => setVendorCode(e.target.value)}
                />
            </div>

            <div className="question text-question">
                <label htmlFor="vendor-site-sap-name">Vendor Site SAP Name</label>
                <input
                    type="text"
                    id="vendor-site-sap-name"
                    value={vendorSiteSAPName}
                    onChange={(e) => setVendorSiteSAPName(e.target.value)}
                />
            </div>

            <div className="question dropdown-question required">
                <label htmlFor="spend-category">Spend Category</label>
                <select
                    id="spend-category"
                    value={spendCategory}
                    onChange={(e) => setSpendCategory(e.target.value)}
                >
                    <option value="" disabled>Select...</option>
                    <option value="ingredients">Ingredients</option>
                    <option value="commodities">Commodities</option>
                    <option value="packaging">Packaging</option>
                    <option value="logistics">Logistics</option>
                </select>
            </div>

            <div className="question dropdown-question required">
                <label htmlFor="level-2-category">Level 2 Category</label>
                <select
                    id="level-2-category"
                    value={level2Category}
                    onChange={(e) => setLevel2Category(e.target.value)}
                >
                    <option value="" disabled>Select...</option>
                    <option value="amino-acids">Amino Acids</option>
                    <option value="cereals-and-grains">Cereals & Grains</option>
                    <option value="flexibles">Flexibles</option>
                    <option value="warehousing-services">Warehousing Services</option>
                </select>
            </div>

            <div className="question text-question required">
                <label htmlFor="vendor-site-country">Vendor Site Country</label>
                <input
                    type="text"
                    id="vendor-site-country"
                    value={vendorSiteCountry}
                    onChange={(e) => setVendorSiteCountry(e.target.value)}
                />
            </div>

            <div className="question text-question required">
                <label htmlFor="vendor-site-city">Vendor Site City</label>
                <input
                    type="text"
                    id="vendor-site-city"
                    value={vendorSiteCity}
                    onChange={(e) => setVendorSiteCity(e.target.value)}
                />
            </div>

            <div className="question text-question required">
                <label htmlFor="project-type">Project Type</label>
                <input
                    type="text"
                    id="project-type"
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                />
            </div>

            <div className="question text-question required">
                <label htmlFor="project-description">Provide a brief description of the project's specific activities.</label>
                <textarea
                    id="project-description"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                />
            </div>

            <div className="question text-question required">
                <label htmlFor="project-implementation-year">Project Implementation Year</label>
                <input
                    type="text"
                    id="project-implementation-year"
                    value={projectImplementationYear}
                    onChange={(e) => setProjectImplementationYear(e.target.value)}
                />
            </div>

            <div className="question dropdown-question required">
                <label htmlFor="impact-evidence">How do you plan to evidence the project impact?</label>
                <select
                    id="impact-evidence"
                    value={impactEvidence}
                    onChange={(e) => setImpactEvidence(e.target.value)}
                >
                    <option value="" disabled>Select...</option>
                    <option value="co2-reduction">CO2 Reduction</option>
                    <option value="water-saving">Water Saving</option>
                    <option value="waste-reduction">Waste Reduction</option>
                    <option value="energy-efficiency">Energy Efficiency</option>
                </select>
            </div>

            <button
                className="submit"
                onClick={async () => await handleSubmit()}
            >
                Submit
            </button>
        </div>
    );
}

export default RenewableProposalForm;