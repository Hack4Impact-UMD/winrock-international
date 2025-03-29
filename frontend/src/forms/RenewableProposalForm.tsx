import { useState } from "react";
import * as firestore from "firebase/firestore";
import { db } from "../../src/firebaseConfig.js";

import LogoHeader from "../components/LogoHeader.js";
import SectionHeader from "../components/SectionHeader.js";
import TitleHeader from "../components/TitleHeader.js";

interface RenewableProposalFormData {
    parentVendorName: string;
    vendorCode: string;
    vendorSiteSAPName: string;
    spendCategory: string;
    level2Category: string;
    vendorSiteCity: string;
    vendorSiteCountry: string;
    projectType: string;
    projectDescription: string;
    projectImplementationYear: string;
    impactEvidence: string;
}

function RenewableProposalForm() {
    const collectionID = "project-proposal-form/GG9KZ21emgEDELo9kvTT/project-submission-form";
    const collectionRef = firestore.collection(db, collectionID);
    const [submissionObj, setSubmissionObj] = useState<RenewableProposalFormData>({
        parentVendorName: '',
        vendorCode: '',
        vendorSiteSAPName: '',
        spendCategory: '',
        level2Category: '',
        vendorSiteCountry: '',
        vendorSiteCity: '',
        projectType: '',
        projectDescription: '',
        projectImplementationYear: '',
        impactEvidence: ''
    });

    const [impactEvidenceDropdownLabel, setImpactEvidenceDropdownLabel] = useState("");
    const [displayImpactEvidenceTextbox, setDisplayImpactEvidenceTextbox] = useState(false);

    // Used to change the submissionObj's fields dynamically
    function handleChange(field: keyof RenewableProposalFormData, value: string) {
        setSubmissionObj((prev: RenewableProposalFormData) => ({
            ...prev,
            [field]: value
        }));
    };

    /**
     * Save a new renewableProjectProposal submission with the user-inputted
     * fields into the renewableProjectProposalForm collection.
    */
    async function handleSubmit() {
        try {
            console.log(submissionObj);
            const submissionRef = await firestore.addDoc(collectionRef, submissionObj); // addDoc() auto-generates an ID for the submission
            console.log(`renewableProjectProposal submitted successfully with ID ${submissionRef.id}`)
        } catch (error) {
            console.error("Error submitting renewableProjectProposal", error);
        }
    }

    return (
        <div className="form renewable-proposal-form">
            <LogoHeader />
            <TitleHeader
                title="Renewable Energy Project Proposal Form"
                description="This is an intake form for renewable energy/energy reduction projects to support Nestlé's
                             goal of achieving Net Zero GHG emissions by 2050."
            />
            <br /> {/* ProgressBar will go here */}

            <SectionHeader label="Generic Information" />

            <div className="question text-question required">
                <label htmlFor="parent-vendor-name">Parent Vendor Name</label>
                <input
                    type="text"
                    id="parent-vendor-name"
                    value={submissionObj.parentVendorName}
                    onChange={(e) => handleChange("parentVendorName", e.target.value)}
                />
            </div>

            <div className="question text-question">
                <label htmlFor="vendor-code">Vendor Code</label>
                <input
                    type="text"
                    id="vendor-code"
                    value={submissionObj.vendorCode}
                    onChange={(e) => handleChange("vendorCode", e.target.value)}
                />
            </div>

            <div className="question text-question">
                <label htmlFor="vendor-site-sap-name">Vendor Site SAP Name</label>
                <input
                    type="text"
                    id="vendor-site-sap-name"
                    value={submissionObj.vendorSiteSAPName}
                    onChange={(e) => handleChange("vendorSiteSAPName", e.target.value)}
                />
            </div>

            <div className="question dropdown-question required">
                <label htmlFor="spend-category">Spend Category</label>
                <select
                    id="spend-category"
                    value={submissionObj.spendCategory}
                    onChange={(e) => handleChange("spendCategory", e.target.value)}
                >
                    <option value="" disabled>-- select --</option>
                    <option value="Ingredients">Ingredients</option>
                    <option value="Commodities">Commodities</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Logistics">Logistics</option>
                </select>
            </div>

            <div className="question dropdown-question required">
                <label htmlFor="level-2-category">Level 2 Category</label>
                <select
                    id="level-2-category"
                    value={submissionObj.level2Category}
                    onChange={(e) => handleChange("level2Category", e.target.value)}
                >
                    <option value="" disabled>-- select --</option>
                    <option value="Amino Acids">Amino Acids</option>
                    <option value="Cereals & Grains">Cereals & Grains</option>
                    <option value="Flexibles">Flexibles</option>
                    <option value="Warehousing Services">Warehousing Services</option>
                </select>
            </div>

            <div className="question text-question required">
                <label htmlFor="vendor-site-country">Vendor Site Country</label>
                <input
                    type="text"
                    id="vendor-site-country"
                    value={submissionObj.vendorSiteCountry}
                    onChange={(e) => handleChange("vendorSiteCountry", e.target.value)}
                />
            </div>

            <div className="question text-question required">
                <label htmlFor="vendor-site-city">Vendor Site City</label>
                <input
                    type="text"
                    id="vendor-site-city"
                    value={submissionObj.vendorSiteCity}
                    onChange={(e) => handleChange("vendorSiteCity", e.target.value)}
                />
            </div>

            <div className="question text-question required">
                <label htmlFor="project-type">Project Type</label>
                <input
                    type="text"
                    id="project-type"
                    value={submissionObj.projectType}
                    onChange={(e) => handleChange("projectType", e.target.value)}
                />
            </div>

            <div className="question text-question required">
                <label htmlFor="project-description">Provide a brief description of the project's specific activities.</label>
                <textarea
                    id="project-description"
                    value={submissionObj.projectDescription}
                    onChange={(e) => handleChange("projectDescription", e.target.value)}
                />
            </div>

            <div className="question text-question required">
                <label htmlFor="project-implementation-year">Project Implementation Year</label>
                <input
                    type="text"
                    id="project-implementation-year"
                    value={submissionObj.projectImplementationYear}
                    onChange={(e) => handleChange("projectImplementationYear", e.target.value)}
                />
            </div>

            <div className="question dropdown-question required">
                <label htmlFor="impact-evidence-dropdown">How do you plan to evidence the project impact?</label>
                <select
                    id="impact-evidence-dropdown"
                    value={impactEvidenceDropdownLabel}
                    onChange={(e) => {
                        setImpactEvidenceDropdownLabel(e.target.value);
                        if (e.target.value === "other") {
                            handleChange("impactEvidence", "");
                            setDisplayImpactEvidenceTextbox(true);
                        } else {
                            handleChange("impactEvidence", e.target.value);
                            setDisplayImpactEvidenceTextbox(false);
                        }
                    }}
                >
                    <option value="" disabled>-- select --</option>
                    <option value="Project implementation partner (2nd/3rd party)">Project implementation partner (2nd/3rd party)</option>
                    <option value="Electronic metering tool">Electronic metering tool</option>
                    <option value="other">Other (please describe)</option>
                </select>
                {displayImpactEvidenceTextbox &&
                    <textarea
                        id="impact-evidence-textbox"
                        value={submissionObj.impactEvidence}
                        onChange={(e) => handleChange("impactEvidence", e.target.value)}
                    />}
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