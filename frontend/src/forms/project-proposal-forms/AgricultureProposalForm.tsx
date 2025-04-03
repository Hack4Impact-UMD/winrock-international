import { useState } from "react";
import * as firestore from "firebase/firestore";
import { db } from "../../testFirebaseConfig.js";
import FormField from "../FormField.js";

import LogoHeader from "../../components/headers/LogoHeader.js";
import TitleHeader from "../../components/headers/TitleHeader.js";
import ProgressBar from "../../components/ProgressBar.js";
import SectionHeader from "../../components/headers/SectionHeader.js";
import TextQuestion from "../../components/questions/TextQuestion.js";
import DropdownQuestion from "../../components/questions/DropdownQuestion.js";
import NavigationButtons from "../../components/NavigationButtons.js";
import ConfirmationPage from "../ConfirmationPage.js";
import Error from "../../components/Error.js";

interface AgricultureProposalFormData {
    // Ingredient/Crop Supplied
    ingredientPrimary: FormField;
    ingredientSub: FormField;

    // General Project Activity Description
    mainIntervention: FormField;
    projectDescription: FormField;

    // Project Volumes in Relation to Nestlé
    averageVolumePurchased: FormField;

    // Project Geography
    mainCountry: FormField;
    otherCountries?: FormField;
    subNationalRegions?: FormField;

    // Project Contracting Party and Project Partners
    contractingParty: FormField;
    contractingNameAndEmail: FormField;
    projectPartnerOne?: FormField;
    projectPartnerTwo?: FormField;
    projectPartnerThree?: FormField;

    // Planned Timeline
    projectStartDate: FormField;
    expectedDuration: FormField;
    expectedFirstImpact: FormField;

    // Connection to the Nestlé Value Chain
    connectionToValueChain: FormField;
    otherZones?: FormField;
    physicalTraceability?: FormField;
    ptAdditionalInfo?: FormField;
    chainOfCustody: FormField;
    cocAdditionalInfo?: FormField;

    // Information related to Carbon credits (insets)
    carbonCredits: FormField;
    carbonStandard?: FormField;
    carbonCreditsVerified: FormField;
    ccvSupplement: FormField;
    carbonCreditsDoubleCount: FormField;
    ccdcSupplement: FormField;
    dateOfIssuance: FormField;

    // Project Co-Financing and Benefit Sharing
    coFinancingStructure: FormField;
    cfsBreakdown: FormField;
    benefitSharing: FormField;

    // Information on GHG Benefits Estimates
    ghgOption: FormField;
    beforeEmissionFactor: FormField;
    afterEmissionFactor: FormField;
    emissionReductionEstimate: FormField;
    emissionRemovalEstimate: FormField;

    // Supplementary Information on GHG Emissions Benefits
    ghgSheetAttached: FormField;
    ghgBuffer?: FormField;
    gbElaboration?: FormField;
}

function AgricultureProposalForm() {
    const title = "Agriculture Project Proposal Form"
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 1;

    const collectionID = "agriculture-proposal-form";
    const collectionRef = firestore.collection(db, collectionID);
    const [answers, setAnswers] = useState<AgricultureProposalFormData>({
        ingredientPrimary: new FormField('', true),
        ingredientSub: new FormField('', true),
        mainIntervention: new FormField('', true),
        projectDescription: new FormField('', true),
        averageVolumePurchased: new FormField('', true),
        mainCountry: new FormField('', true),
        otherCountries: new FormField('', false),
        subNationalRegions: new FormField('', false),
        contractingParty: new FormField('', true),
        contractingNameAndEmail: new FormField('', true),
        projectPartnerOne: new FormField('', false),
        projectPartnerTwo: new FormField('', false),
        projectPartnerThree: new FormField('', false),
        projectStartDate: new FormField('', true),
        expectedDuration: new FormField('', true),
        expectedFirstImpact: new FormField('', true),
        connectionToValueChain: new FormField('', true),
        otherZones: new FormField('', false),
        physicalTraceability: new FormField('', false),
        ptAdditionalInfo: new FormField('', false),
        chainOfCustody: new FormField('', true),
        cocAdditionalInfo: new FormField('', false),
        carbonCredits: new FormField('', true),
        carbonStandard: new FormField('', false),
        carbonCreditsVerified: new FormField('', true),
        ccvSupplement: new FormField('', true),
        carbonCreditsDoubleCount: new FormField('', true),
        ccdcSupplement: new FormField('', true),
        dateOfIssuance: new FormField('', true),
        coFinancingStructure: new FormField('', true),
        cfsBreakdown: new FormField('', true),
        benefitSharing: new FormField('', true),
        ghgOption: new FormField('', true),
        beforeEmissionFactor: new FormField('', true),
        afterEmissionFactor: new FormField('', true),
        emissionReductionEstimate: new FormField('', true),
        emissionRemovalEstimate: new FormField('', true),
        ghgSheetAttached: new FormField('', false),
        ghgBuffer: new FormField('', false),
        gbElaboration: new FormField('', false)
    });

    // Used to change the answers dynamically
    function handleChange(field: keyof AgricultureProposalFormData, value: string) {
        const isRequired = answers[field]!.isRequired;
        setAnswers((prev: AgricultureProposalFormData) => ({
            ...prev,
            [field]: new FormField(value, isRequired)
        }));
    };

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    /**
     * Insert a new AgricultureProjectProposal document with the user-inputted
     * fields into the AgricultureProjectProposalForm collection.
    */
    async function handleSubmit() {
        for (const [_, v] of Object.entries(answers)) {
            if (v.isRequired && v.value === '') {
                setError("Cannot submit: You have not completed one or more sections in the form");
                return;
            }
        }

        // Convert the answers into a submission object
        const submissionObj: Record<string, string> = {}
        Object.keys(answers).forEach((field) => {
            submissionObj[field] = answers[field as keyof AgricultureProposalFormData]!.value;
        });

        try {
            await firestore.addDoc(collectionRef, submissionObj); // addDoc() auto-generates an ID for the submission
            setIsSubmitted(true);
        } catch (error) {
            console.error("Error submitting AgricultureProjectProposal", error);
        }
    }

    const saveChanges = () => {
        console.log('Changes saved');
    }

    const saveAndExit = () => {
        console.log('Changes saved and exiting');
    }

    if (isSubmitted) {
        return <ConfirmationPage formName={title} />
    }

    return (
        <>
            <LogoHeader />
            <TitleHeader
                title={title}
                description='The project proposal form is used to record information critical to the completion of the validation process for your project. It requests information both technical and administrative in nature. These questions are split within ten key categories, each of which requests one or more pieces of key information to kick off the project validation process. In Columns F ("Guidance") of this tab defines key terms and describes information sought in the fields in Column D/E ("Supplier answers"). It also includes key guidance including relevant examples and links to helpful sources. Please complete all required fields. Required questions must be answered before a project validation may commence. Optional questions are welcomed and may lead to a faster validation process.' 					
            />
            <ProgressBar
                currentPage={currentPage}
                totalPages={totalPages}
                pageLabels={["Proposal Form", "Project Costs", "Document Checklist"]}
            />

            <SectionHeader label="Ingredient/Crop Supplied" />

            <DropdownQuestion
                label="Please select the primary category of ingredient or crop you are supplying to Nestlé linked to this project?"
                options={["Acids & Alkalis", "Amino Acids", "Animal Fats", "Cereals & Grains", "Chicory", "Chocolate", "Chocolate Equivalent", "Cocoa", "Coffee",
                    "Colors", "Dairy Products", "Egg & Products", "Elaborated & Mixed Products", "Enzymes", "Fiber", "Fish/Seafood ByProd (PetCare)", "Flavor Enhancers",
                    "Flavors", "Food Chemicals", "Fruit & Berry Preparations", "Fruits & Berries", "Gas", "Herbs", "Honey", "Hydrocolloids & Emulsifiers", "Intensive Sweetener",
                    "Lecithin", "Leguminous Seeds", "Meat", "Meat ByProducts (PetCare)", "Microorganisms", "Nucleotides", "Nutraceuticals & Capsules", "Nuts & Seeds", "Oilseed",
                    "Pasta", "Plant Proteins", "Polymer", "Poultry", "Poultry ByProducts (PetCare)", "Salt & Minerals", "Soya (excluding Lecithin)", "Spices", "Starch & Derivatives",
                    "Strategic Nutritional Ingredients", "Sucrose", "Tea", "Vegetable Fats & Oils", "Vegetables", "Vitamins & Micronutrients", "Water", "Wine, Liquor & Vinegar"]}
                onSelect={(value: string) => handleChange("ingredientPrimary", value)}
                required={true}
            />

            <DropdownQuestion
                label="Please select the sub-category of ingredient(s) or crop(s) you are supplying to Nestlé linked to this project?"
                options={["Acid", "Alkali", "Buffer System", "Pre Mix", "Single", "Beef", "Lamb", "Pork", "Poultry", "Fish", "Amaranth", "Barley", "Buckwheat", "Corn", "Durum Wheat",
                    "Millet", "Mixed Grains", "Oat", "Quinoa", "Rice", "Rye", "Sorghum", "Spelt", "Triticale", "Wheat (not Durum)", "Wild Rice", "Brown Rice", "Dehydrated Root", "Extract", "Roasted Root",
                    "Dark", "Milk", "White", "Dark", "Milk", "White", "Bean", "Butter", "Cake", "Mass", "Powder", "Nibs", "Arabica Green Coffee", "Blended Green Coffee", "Roast & Ground", "Robusta Green Coffee",
                    "Soluble", "Oil, Aroma & Extract", "Artificial", "Non-artificial", "Affordable Milk Powder", "Casein", "Cheese", "Growing Up Milk Powder", "Lactose", "Lactose Derivatives", "Milk Fat",
                    "Milk Mineral", "Milk Protein Concentrate", "Processed Liquid Milk", "Raw Milk", "Skimmed Milk Powder", "Whey", "Whole Milk Powder", "Yoghurt", "Buttermilk",
                    "Milk Powder", "Albumen", "Elaborated Egg Product", "Whole Egg", "Yolk", "Adult Nutrition", "Beverage", "Chilled Product", "Chocolate & Confection",
                    "Culinary Product", "Dairy Product", "Frozen Food", "Ice Cream", "Infant Nutrition", "Pet Care", "Carbohydrate active", "Others",
                    "Protein active", "Dehydrated", "Liquid", "Cellulose", "Cereals & Grains", "Fruits", "Inulin & FOS", "Leguminous Seeds", "Nuts & Seeds",
                    "Plants", "Vegetables", "Crustacean", "Fish", "Mollusc", "Crustacean", "Fish", "Mixed Byproduct", "Mollusc",
                    "Glutamate", "HVP", "Ribonucleotides", "Yeast Extracts", "Yeast Inactive", "Savory", "Sweet", "Essential Oil", "Modifiers", "Vanillin & Ethyl Vanill", "Antioxidant", "Preservative", "Wax", "Coconut",
                    "Apricot", "Banana", "Blackberry", "Blackcurrant", "Blueberry", "Cherry", "Cranberry", "Dates", "Grape", "Guava",
                    "Kiwi", "Lemon", "Lime", "Mango", "Mangosteen", "Melon", "Mixed Fruit", "Orange", "Other Berries",
                    "Papaya", "Passion Fruit", "Peach", "Pear", "Pineapple", "Plum", "Pomegranante", "Raisin", "Raspberry", "Sour Cherry",
                    "Strawberry", "Tangerine & Mandarin", "Acai", "Acerola", "Apple", "Apricot", "Avocado", "Banana", "Bilberry", "Blackberry", "Blackcurrant",
                    "Blueberry", "Cherry", "Cranberry", "Dates", "Fig", "Grape", "Grapefruit", "Guava", "Kiwi", "Lemon",
                    "Lichee", "Lime", "Mango", "Melon", "Mixed Fruit", "Orange", "Other Berries", "Other Fruits", "Papaya", "Passion Fruit",
                    "Peach", "Pear", "Pineapple", "Plum", "Pomegranate", "Prune", "Quince", "Raisin", "Raspberry", "Sour Cherry",
                    "Strawberry", "Tangerine & Mandarin", "Juice", "Pulp & Puree", "Whole & Piece", "CO2", "Nitrogen", "Basil", "Bay Leaf", "Camomile",
                    "Celery Leaf", "Chervil", "Chive", "Coriander", "Dill", "Fenugreek", "Ginseng", "Hibiscus", "Lemongrass", "Marjoram",
                    "Mixed Herb", "Oregano", "Parsley", "Rooibos", "Rosemary", "Sage", "Savory", "Tarragon", "Thyme",
                    "Mint", "Dehydrated", "Liquid", "Refined", "Unrefined", "Emulsifier", "H&E Blends", "Hydrocolloid", "Acesulfam - k", "Aspartame",
                    "Cyclamate", "Saccharine", "Stevia", "Sucralose", "Rape Seed", "Soja", "Sunflower", "Bean", "Chickpeas", "Lentil", "Mungbean", "Other", "Pea"
                ]}
                onSelect={(value: string) => handleChange("ingredientSub", value)}
                required={true}
            />

            <SectionHeader label="General Project Activity Description" />

            <DropdownQuestion
                label="Please select the main intervention and description that best matches the project?"
                options={[
                    "Dairy & Livestock - Animal Productivity",
                    "Dairy & Livestock - Feed", "Dairy & Livestock - Health",
                    "Dairy & Livestock - Manure Management", "Farm - Improvement",
                    "Forest & Wetland",
                    "Soil", "Supplier low carbon energy"
                ]}
                onSelect={(value: string) => handleChange("mainIntervention", value)}
                required={true}
            />

            <TextQuestion
                label="Please provide a short written description of the specific project activities that will be implemented."
                onChange={(value: string) => handleChange("projectDescription", value)}
                required={true}
            />

            <SectionHeader
                label="Project Volumes in Relation to Nestlé"
            />

            <TextQuestion
                label="Average volume of sub-category of ingredient(s) or crop(s) purchased by Nestlé from only the project per year (tonnes) (format: number, units, ingredients)"
                onChange={(value: string) => handleChange("averageVolumePurchased", value)}
                required={true}
            />

            <SectionHeader label="Project Geography" />

            <DropdownQuestion
                label="What is the main country where the project is located?"
                options={["Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra",
                    "Anglo Dutch Caribbean Region", "Angola", "Anguilla", "Antigua, Barbuda",
                    "Argentina", "Armenia", "Aruba", "Australia", "Austria",
                    "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
                    "Belgium", "Belize", "Belorussia", "Benin", "Bermuda",
                    "Bhutan", "Bolivia", "Bosnia", "Botswana", "Brazil",
                    "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
                    "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands",
                    "Central African Rep.", "Chad", "China", "Colombia", "Comoros", "Congo", "Consolidated Congo",
                    "Cook Islands", "Costa Rica", "Croatia", "Cuba", "Curacao Bonaire",
                    "Cyprus", "Czech Republic", "Dem. Rep. of Congo", "Denmark", "Djibouti",
                    "Dominica", "Dominican Rep.", "Dubai", "East Timor", "Ecuador",
                    "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
                    "Ethiopia", "Faeroe Islands", "Falkland Islands (Malvinas)", "Fiji", "Finland",
                    "France", "French Guiana", "French Polynesia", "Gabon", "Gambia",
                    "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey",
                    "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia",
                    "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jersey",
                    "Jordan", "Kazakhstan", "Kenya", "Kosovo", "Kuwait", "Kyrgyzstan",
                    "Lao People's Rep.", "Latin Caribbean Region", "Latvia", "Lebanon",
                    "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxemburg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia",
                    "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique",
                    "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federal States o",
                    "Moldavia", "Monaco", "Mongolia", "Montenegro, Republic of", "Montserrat",
                    "Morocco", "Multiple", "Myanmar", "Namibia", "Nauru",
                    "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand",
                    "Nicaragua", "Niger", "Nigeria", "North Korea", "Northern Mariana Islands",
                    "Norway", "NPPA", "NWNA", "Oman", "Pakistan", "Palau",
                    "Palestinian Auth.", "Panama", "Panama + Central America Region", "Papua New Guinea", "Paraguay",
                    "Peru", "Philippines", "Plata Region", "Poland", "Portugal",
                    "Puerto Rico", "Qatar", "Rep.of Mozambique", "Reunion", "Romania",
                    "Russia", "Rwanda", "Saint Kitts, Nevis", "Saint Lucia", "Saint Martin",
                    "Sao Tome+Principe", "Saudi Arabia", "Senegal", "Serbia, Republic of", "Seychelles",
                    "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
                    "Somalia", "South Africa", "South Korea", "South of Sudan", "Spain",
                    "Sri Lanka", "St.Vincent+Gren.", "St-Pierre and Miquelon", "Sudan", "Suriname", "Swaziland",
                    "Sweden", "Switzerland", "Syrian Arab Rep.", "Taiwan", "Tajikistan",
                    "Tanzania", "Thailand", "Togo", "Trinidad+Tobago", "Tunisia",
                    "Turkey", "Turkmenistan", "Turks+Caicos isl.", "Uganda", "Ukraine",
                    "Un. Arab Emirates", "United Kingdom", "United States", "Uruguay", "US Virgin Islands",
                    "Uzbekistan", "Vatican City State", "Venezuela", "Vietnam", "Wallis and Futuna",
                    "Yemen", "Zambia", "Zimbabwe"]}
                onSelect={(value: string) => handleChange("mainCountry", value)}
                required={true}
            />

            <TextQuestion
                label="If the project is implemented in more than one country, please list the countries (If applicable)"
                onChange={(value: string) => handleChange("otherCountries", value)}
            />

            <TextQuestion
                label="What is the sub-national region or regions where the project is located? (If Applicable)"
                onChange={(value: string) => handleChange("subNationalRegions", value)}
            />

            <SectionHeader label="Project Contracting Party and Project Partners" />

            <TextQuestion
                label="What is the name of the contracting party (i.e., Nestlé Supplier)?"
                onChange={(value: string) => handleChange("contractingParty", value)}
                required={true}
            />

            <TextQuestion
                label="What is full name and email of the key contact or key contacts at the contracting party?"
                onChange={(value: string) => handleChange("contractingNameAndEmail", value)}
                required={true}
            />

            <TextQuestion
                label="Is another partner(s) involved with the project? If so, please name them and provide a brief description of their roles and responsibilities."
                onChange={(value: string) => handleChange("projectPartnerOne", value)}
            />

            <TextQuestion
                label="Second partner name, roles and responsibilities"
                onChange={(value: string) => handleChange("projectPartnerTwo", value)}
            />

            <TextQuestion
                label="Third partner name, roles and responsibilities"
                onChange={(value: string) => handleChange("projectPartnerThree", value)}
            />

            <SectionHeader label="Planned Timeline" />

            <TextQuestion
                label="What is the month and year that the project started or is planned to be started?"
                onChange={(value: string) => handleChange("projectStartDate", value)}
                required={true}
            />

            <TextQuestion
                label="What is the expected duration of project? (In Years)"
                onChange={(value: string) => handleChange("expectedDuration", value)}
                required={true}
            />

            <TextQuestion
                label="When do you expect the first reported impact (actual GHG emissions reduction or removal)?"
                onChange={(value: string) => handleChange("expectedFirstImpact", value)}
                required={true}
            />

            <SectionHeader label="Connection to the Nestlé Value Chain" />

            <TextQuestion
                label="What is the project's connection to the Nestlé value chain as defined by Nestlé's Supply Chain (Scope 3) and Sourcing Landscape Removals Framework?"
                onChange={(value: string) => handleChange("connectionToValueChain", value)}
                required={true}
            />

            <TextQuestion
                label="If multiple zones, please describe here"
                onChange={(value: string) => handleChange("otherZones", value)}
            />

            <DropdownQuestion
                label="For projects with an associated commodity, can the material/product purchased by Nestlé be traced to a specific farm or plantation engaged in project activities?"
                options={["Yes", "No"]}
                onSelect={(value: string) => handleChange("physicalTraceability", value)}
            />

            <TextQuestion
                label="Please provide additional relevant information here"
                onChange={(value: string) => handleChange("ptAdditionalInfo", value)}
            />

            <TextQuestion
                label="What chain of custody model is followed for this ingredient within Nestlé's supply chain?"
                onChange={(value: string) => handleChange("chainOfCustody", value)}
                required={true}
            />

            <TextQuestion
                label="Please provide additional relevant information here"
                onChange={(value: string) => handleChange("cocAdditionalInfo", value)}
            />

            <SectionHeader label="Information related to Carbon credits (insets)" />

            <DropdownQuestion
                label="Is your project intended to generate carbon inset credits?"
                options={["Yes", "No"]}
                onSelect={(value: string) => handleChange("carbonCredits", value)}
                required={true}
            />

            <TextQuestion
                label="What carbon standard is used to verify the credits generated?"
                onChange={(value: string) => handleChange("carbonStandard", value)}
            />

            <DropdownQuestion
                label="Is the quantification approach verified by 3rd party entities approved for use by crediting programs?"
                options={["Yes", "No"]}
                onSelect={(value: string) => handleChange("carbonCreditsVerified", value)}
                required={true}
            />

            <TextQuestion
                label="If Yes: In short, describe the 3rd party verification and verifier here. If No: Describe the verification procedure to ensure the credibility and quality of these carbon credits."
                onChange={(value: string) => handleChange("ccvSupplement", value)}
                required={true}
            />

            <DropdownQuestion
                label="Is there a mechanism in place to minimize the risk of double counting? (external registry/ledger, or contracts)"
                options={["Yes", "No"]}
                onSelect={(value: string) => handleChange("carbonCreditsDoubleCount", value)}
                required={true}
            />

            <TextQuestion
                label="If Yes: Please provide a description of the registry here. If No: Please desribe if there is any other measure in place to prevent against double counting here."
                onChange={(value: string) => handleChange("ccdcSupplement", value)}
                required={true}
            />

            <TextQuestion
                label="Date of issuance of credit/certificate"
                onChange={(value: string) => handleChange("dateOfIssuance", value)}
                required={true}
            />

            <SectionHeader label="Project Co-Financing and Benefit Sharing" />

            <TextQuestion
                label="Please select the co-financing structure"
                onChange={(value: string) => handleChange("coFinancingStructure", value)}
                required={true}
            />

            <TextQuestion
                label="Please provide breakdown here, and any additional information if applicable."
                onChange={(value: string) => handleChange("cfsBreakdown", value)}
                required={true}
            />

            <TextQuestion
                label="Does the project include benefit sharing? (if so, please explain the benefit sharing proposal)"
                onChange={(value: string) => handleChange("benefitSharing", value)}
                required={true}
            />

            <SectionHeader label="Information on GHG Benefits Estimates" />

            <DropdownQuestion
                label="Select one of the options below and add the values in the respective rows based on applicability (accounting approach used for project, availability of data, type and stage of project)"
                options={["Compare Before and After Emissions Factor", "Project Carbon Intensity/Carbon credit project"]}
                onSelect={(value: string) => handleChange("ghgOption", value)}
                required={true}
            />

            <TextQuestion
                label="Emissions Factor BEFORE the Intervention (tCO2e/ ton of ingredient)"
                onChange={(value: string) => handleChange("beforeEmissionFactor", value)}
                required={true}
            />

            <TextQuestion
                label="Emissions Factor AFTER the Intervention (tCO2e/ ton of ingredient)"
                onChange={(value: string) => handleChange("afterEmissionFactor", value)}
                required={true}
            />

            <TextQuestion
                label="Emissions reduction estimate from the project (in tCO2e)"
                onChange={(value: string) => handleChange("emissionReductionEstimate", value)}
                required={true}
            />

            <TextQuestion
                label="Emissions removal estimate from the project (in tCO2e)"
                onChange={(value: string) => handleChange("emissionRemovalEstimate", value)}
                required={true}
            />

            <SectionHeader label="Supplementary Information on GHG Emissions Benefits" />

            <DropdownQuestion
                label="Is the GHG calculation sheet for the noted benefits attached with the project submission email?"
                options={["Yes", "No"]}
                onSelect={(value: string) => handleChange("ghgSheetAttached", value)}
            />

            <DropdownQuestion
                label="If your project has emission removals, please confirm your project establishes a 20% emissions buffer for potential reversal of the emission removals? Please note: For removals projects, a 20% buffer must be considered on reported carbon removals to manage the reversal risk."
                options={["Yes", "No"]}
                onSelect={(value: string) => handleChange("ghgBuffer", value)}
            />
            
            <TextQuestion
                label="Please elaborate here - why you have/have not established a buffer."
                onChange={(value: string) => handleChange("gbElaboration", value)}
            />

            <NavigationButtons
                onNext={() => {
                    if (currentPage < totalPages) {
                        setCurrentPage(currentPage + 1);
                        window.scroll(0, 0);
                    } else {
                        handleSubmit();
                    }
                }}
                onBack={() => {
                    if (currentPage > 1) {
                        setCurrentPage(currentPage - 1)
                        window.scroll(0, 0);
                    }
                }}
                onSaveChanges={saveChanges}
                onSaveAndExit={saveAndExit}
                canGoBack={currentPage > 1}
                nextLabel={currentPage === totalPages ? 'Submit' : 'Next'}
            />

            <Error message={error} />
        </>
    );
};

export default AgricultureProposalForm;