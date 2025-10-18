import { useRef, useState } from "react";
import * as firestore from "firebase/firestore";
import { db } from "../../firebaseConfig.js";
import FormField from "../FormField.js";

import LogoHeader from "../components/headers/LogoHeader.js";
import TitleHeader from "../components/headers/TitleHeader.js";
import ProgressBar from "../components/ProgressBar.js";
import SectionHeader from "../components/headers/SectionHeader.js";
import TextQuestion from "../components/questions/TextQuestion.js";
import DropdownQuestion from "../components/questions/DropdownQuestion.js";
import NavigationButtons from "../components/NavigationButtons.js";
import ConfirmationPage from "../ConfirmationPage.js";
import GuidanceDropdownAgriculture from "../components/GuidanceDropdownAgriculture.tsx";
import Error from "../components/Error.js";
import FormLock from "../components/FormLock.js";
import tableImage from '../../assets/connectiontovaluetable.png';
import tableImage2 from '../../assets/table2.png';



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
    keyContactName: FormField;
    keyContactEmail: FormField;
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
    coFinancingSupplement: FormField;
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
    mitigationPlan: FormField;
    ingredientDetails: FormField

}

function AgricultureProposalForm() {
    const title = "Greenhouse Gas Emissions Project Proposal Form for Project Validation"
    
    // TODO: Lock flag - set to true to prevent form editing
    const locked = true;

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 4;

    const collectionID = "agriculture-proposal-form";
    const collectionRef = firestore.collection(db, collectionID);
    const answersRef = useRef<AgricultureProposalFormData>({
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
        keyContactName: new FormField('', true),
        keyContactEmail: new FormField('', true),
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
        coFinancingSupplement: new FormField('', true),
        benefitSharing: new FormField('', true),
        ghgOption: new FormField('', true),
        beforeEmissionFactor: new FormField('', true),
        afterEmissionFactor: new FormField('', true),
        emissionReductionEstimate: new FormField('', true),
        emissionRemovalEstimate: new FormField('', true),
        ghgSheetAttached: new FormField('', false),
        ghgBuffer: new FormField('', false),
        gbElaboration: new FormField('', false),
        mitigationPlan: new FormField('', false),
        ingredientDetails: new FormField('', true) // Add this line

    });

    // Used to change the answersRef's fields dynamically
    function handleChange(field: keyof AgricultureProposalFormData, value: string) {
        if (locked) {
            handleLockedAction();
            return;
        }
        
        const isRequired = answersRef.current[field]!.isRequired;
        answersRef.current = {
            ...answersRef.current,
            [field]: new FormField(value, isRequired)
        }
        // Auto-save whenever form changes
        saveChanges();
    }

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    // Initialize form lock
    const { handleLockedAction, LockedPopup } = FormLock({ locked });

    /**
     * Insert a new AgricultureProjectProposal document with the user-inputted
     * fields into the AgricultureProjectProposalForm collection.
    */
    async function handleSubmit() {
        for (const [_, v] of Object.entries(answersRef.current)) {
            if (v.isRequired && v.value === '') {
                setError("Cannot submit: You have not completed one or more sections in the form");
                return;
            }
        }

        // Convert the answersRef into a submission object
        const submissionObj: Record<string, string> = {}
        Object.keys(answersRef.current).forEach((field) => {
            submissionObj[field] = answersRef.current[field as keyof AgricultureProposalFormData]!.value;
        });

        try {
            await firestore.addDoc(collectionRef, submissionObj); // addDoc() auto-generates an ID for the submission
            setIsSubmitted(true);
        } catch (error) {
            console.error("Error submitting AgricultureProjectProposal", error);
        }
    }

    const saveChanges = () => {
        // TODO: Implement save functionality
        console.log('Changes saved');
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
                pageLabels={["Proposal Form (Page 1)", "Proposal Form (Page 2)", "Proposal Form (Page 3)", "Proposal Form (Page 4)"]}
            />
            <GuidanceDropdownAgriculture></GuidanceDropdownAgriculture>
            {currentPage === 1 && (
                <>
                    <SectionHeader label="Ingredient/Crop Supplied" />

                    <DropdownQuestion
                        label="Please select the primary category of ingredient or crop you are supplying to Nestlé linked to this project?"
                        options={["Acids & Alkalis", "Amino Acids", "Animal Fats", "Cereals & Grains", "Chicory", "Chocolate", "Chocolate Equivalent", "Cocoa", "Coffee",
                            "Colors", "Dairy Products", "Egg & Products", "Elaborated & Mixed Products", "Enzymes", "Fiber", "Fish/Seafood ByProd (PetCare)", "Flavor Enhancers",
                            "Flavors", "Food Chemicals", "Fruit & Berry Preparations", "Fruits & Berries", "Gas", "Herbs", "Honey", "Hydrocolloids & Emulsifiers", "Intensive Sweetener",
                            "Lecithin", "Leguminous Seeds", "Meat", "Meat ByProducts (PetCare)", "Microorganisms", "Nucleotides", "Nutraceuticals & Capsules", "Nuts & Seeds", "Oilseed",
                            "Pasta", "Plant Proteins", "Polymer", "Poultry", "Poultry ByProducts (PetCare)", "Salt & Minerals", "Soya (excluding Lecithin)", "Spices", "Starch & Derivatives",
                            "Strategic Nutritional Ingredients", "Sucrose", "Tea", "Vegetable Fats & Oils", "Vegetables", "Vitamins & Micronutrients", "Water", "Wine, Liquor & Vinegar"]}
                        controlledValue={answersRef.current.ingredientPrimary.value}
                        onSelect={(value: string) => handleChange("ingredientPrimary", value)}
                        required={true}
                        popup={{
                            guidance: "This section requests written information on the primary category for the ingredient or crop (raw material) being supplied to Nestlé.",
                            example: "Cereals and Grains"
                        }}
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
                        controlledValue={answersRef.current.ingredientSub.value}
                        onSelect={(value: string) => handleChange("ingredientSub", value)}
                        required={true}
                        popup={{
                            guidance: "If known, please also provide a more specific sub-category for the ingredient or crop (raw material) you are supplying to Nestlé.",
                            example: "Within the 'Cereals & Grains' category, the sub-category of ingredient we are supplying is Corn Gluten Meal (CGM)."
                        }}
                    />

                    <TextQuestion
                        label="List additional ones here manually (if applicable)"
                        controlledValue={answersRef.current.ingredientSub.value}  // Adjust based on actual data structure if needed
                        onChange={(value) => handleChange("ingredientSub", value)}  // Adjust based on actual data structure if needed
                        size="small"
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
                        controlledValue={answersRef.current.mainIntervention.value}
                        onSelect={(value: string) => handleChange("mainIntervention", value)}
                        required={true}
                        popup={{
                            guidance: "This section requests categorizing information on the project, selecting from one choice among several outlined in the Interventions List for Reference tab. In the event that a project fits into multiple categories, please provide each one that is relevant.",
                            example: "Farm-improvement"
                        }}
                    />

                    <TextQuestion
                        label="Please provide a short written description of the specific project activities that will be implemented."
                        controlledValue={answersRef.current.projectDescription.value}
                        onChange={(value: string) => handleChange("projectDescription", value)}
                        required={true}
                        popup={{
                            guidance: "This section requests more specific information on the project's activities itself: description of baseline conditions, project activities (as many projects will involve multiple activities, it is important for the sake of validation that the activities be described in as clear terms as possible). Clearly describing and separating the activities enables the analyst to validate the individual impact made by each activity.",
                            example: "Our project focuses on implementing regenerative agricultural practices on U.S. agricultural land, specifically targeting corn production. The project aims to improve soil health, sequester carbon, and reduce GHG emissions. The main components of the project include: \n\n1. Adopting no-till farming: We encourage farmers to adopt no-till farming techniques, which help prevent soil erosion and improve soil structure, ultimately contributing to carbon sequestration. \n\n2. Cover cropping: We promote the use of cover crops to protect the soil during off-season periods, which can also help sequester carbon and improve soil health. \n\n3. Crop rotation: We encourage farmers to implement crop rotation strategies to enhance soil fertility, reduce pest infestations, and promote biodiversity, which can contribute to overall soil health and carbon sequestration."
                        }}
                    />
                    <TextQuestion
                        label="Please provide details including if a mitigation plan is in place. If not applicable, please justify."
                        controlledValue={answersRef.current.mitigationPlan.value}  // Adjust based on actual data structure if needed
                        onChange={(value) => handleChange("mitigationPlan", value)}  // Adjust based on actual data structure if needed
                        required={true}
                        size="small"

                    />
                    <SectionHeader label="Project Volumes in Relation to Nestlé" />
                    <TextQuestion
                        label="Average volume of sub-category of ingredient(s) or crop(s) purchased by Nestlé from only the project per year (tonnes) (L2 Spend category)"
                        controlledValue={answersRef.current.averageVolumePurchased.value}
                        onChange={(value: string) => handleChange("averageVolumePurchased", value)}
                        required={true}
                        size="small"
                        popup={{
                            guidance: "This section provides data on the volume of the project compared to the overall volume of Nestlé's purchases in an ingredient category.",
                            example: "450 Tonnes Corn Gluten Meal"
                        }}
                        hideInput={true}  // This hides the input field
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ flex: 1, paddingRight: '10px' }}>

                            <TextQuestion
                                label="Please enter only the numeric value here"
                                controlledValue={answersRef.current.averageVolumePurchased.value}
                                onChange={(value: string) => handleChange("averageVolumePurchased", value)}
                                required={true}
                                size="small"
                            />
                        </div>
                        <div style={{ flex: 1, paddingLeft: '10px' }}>

                            <TextQuestion
                                label="Please provide the unit and ingredient corresponding to the value"
                                controlledValue={answersRef.current.ingredientDetails.value}
                                onChange={(value: string) => handleChange("ingredientDetails", value)}
                                required={true}
                                size="small"
                            />
                        </div>
                    </div>




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
                        controlledValue={answersRef.current.mainCountry.value}
                        onSelect={(value: string) => handleChange("mainCountry", value)}
                        required={true}
                        popup={{
                            guidance: "This section requests the country where the GHG reduction project is occurring. Knowing the project geography is essential for understanding its environmental context and potential impact on GHG emissions.",
                            example: "United States"
                        }}
                    />

                    <TextQuestion
                        label="If the project is implemented in more than one country, please list the countries (If applicable)"
                        controlledValue={answersRef.current.otherCountries!.value}
                        onChange={(value: string) => handleChange("otherCountries", value)}
                        popup={{
                            guidance: "If the project occurs in more than one country, please list all the countries",
                            example: "Canada"
                        }}
                    />

                    <TextQuestion
                        label="What is the sub-national region or regions where the project is located? (If Applicable)"
                        controlledValue={answersRef.current.subNationalRegions!.value}
                        onChange={(value: string) => handleChange("subNationalRegions", value)}
                        popup={{
                            guidance: "If applicable, provide details about the sub-national region (e.g., province, state) where the project is located. If the project spans multiple countries or regions, select the primary one – where most activities occur or have the most significant impact on GHG emissions.",
                            example: "Iowa"
                        }}
                    />

                    <SectionHeader label="Project Contracting Party and Project Partners" />

                    <TextQuestion
                        label="What is the name of the contracting party (i.e., Nestlé Supplier)?"
                        controlledValue={answersRef.current.contractingParty.value}
                        onChange={(value: string) => handleChange("contractingParty", value)}
                        required={true}
                        popup={{
                            guidance: "This section requests contact information for the relevant supplier(s) contracting with Nestlé for project implementation, as well as the name and role of the staff member connected to the submitted project.",
                            example: "ABC Company"
                        }}
                    />
                    <TextQuestion
                        label="What is full name and email of the key contact or key contacts at the contracting party?"
                        controlledValue={answersRef.current.keyContactName.value}
                        onChange={(value: string) => handleChange("keyContactName", value)}
                        required={true}
                        size="small"
                        popup={{
                            guidance: "Please enter the name of the key contact.",
                            example: "John Doe"
                        }}
                        hideInput={true} // Ensures the input is shown
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>

                        <div style={{ flex: 1, paddingRight: '10px' }}>

                            <TextQuestion
                                label="Name of key contact"
                                controlledValue={answersRef.current.keyContactName.value}
                                onChange={(value: string) => handleChange("keyContactName", value)}
                                required={true}
                                size="small"

                                hideInput={false} // Ensures the input is shown
                            />
                        </div>

                        <div style={{ flex: 1, paddingLeft: '10px' }}>
                            <TextQuestion
                                label="Email of key contact"
                                controlledValue={answersRef.current.keyContactEmail.value}
                                onChange={(value: string) => handleChange("keyContactEmail", value)}
                                required={true}
                                size="small"

                                hideInput={false} // Ensures the input is shown
                            />
                        </div>
                    </div>


                    <TextQuestion
                        label="Is another partner(s) involved with the project? If so, please name them and provide a brief description of their roles and responsibilities."
                        controlledValue={answersRef.current.projectPartnerOne!.value}
                        onChange={(value: string) => handleChange("projectPartnerOne", value)}
                        popup={{
                            guidance: "This section requests contact information for the relevant supplier(s) contracting with Nestlé for project implementation, as well as the name and role of the staff member connected to the submitted project.",
                            example: "X Organization - Technical Assistance: X Organization will provide technical guidance and expertise on implementing regenerative agricultural practices, such as no-till farming, cover cropping, and crop rotation."
                        }}
                    />

                    <TextQuestion
                        label="Second partner name, roles and responsibilities"
                        controlledValue={answersRef.current.projectPartnerTwo!.value}
                        onChange={(value: string) => handleChange("projectPartnerTwo", value)}
                        popup={{
                            guidance: "This section requests contact information for the relevant supplier(s) contracting with Nestlé for project implementation, as well as the name and role of the staff member connected to the submitted project.",
                            example: "Y Organization - Training and Capacity Building: Y Organization will develop and deliver training programs for farmers and other stakeholders to learn about regenerative agricultural practices and their benefits, as well as best practices for implementing these techniques."
                        }}
                    />

                    <TextQuestion
                        label="Third partner name, roles and responsibilities"
                        controlledValue={answersRef.current.projectPartnerThree!.value}
                        onChange={(value: string) => handleChange("projectPartnerThree", value)}
                        popup={{
                            guidance: "This section requests contact information for the relevant supplier(s) contracting with Nestlé for project implementation, as well as the name and role of the staff member connected to the submitted project.",
                            example: "Z Organization - Monitoring and Evaluation: Z Organization will collaborate with us to monitor and evaluate the project's impact on soil health, carbon sequestration, and GHG emissions, ensuring that the project's objectives are met and that the implemented practices are effective in reducing GHG emissions."
                        }}
                    />

                    <SectionHeader label="Planned Timeline" />

                    <TextQuestion
                        label="What is the month and year that the project started or is planned to be started? (format: Month-Year)"
                        controlledValue={answersRef.current.projectStartDate.value}
                        onChange={(value: string) => handleChange("projectStartDate", value)}
                        required={true}
                        popup={{
                            guidance: "This section requests information on the timing of the project. The information provided in this section enables the analyst to understand not only the impact, but within what time frame that impact may occur.",
                            example: "Jan-2023"
                        }}
                    />

                    <TextQuestion
                        label="What is the expected duration of project? (In Years)"
                        controlledValue={answersRef.current.expectedDuration.value}
                        onChange={(value: string) => handleChange("expectedDuration", value)}
                        required={true}
                        popup={{
                            guidance: "This section requests information on the timing of the project. The information provided in this section enables the analyst to understand not only the impact, but within what time frame that impact may occur.",
                            example: "20 years"
                        }}
                    />

                    <TextQuestion
                        label="When do you expect the first reported impact (actual GHG emissions reduction or removal)?"
                        controlledValue={answersRef.current.expectedFirstImpact.value}
                        onChange={(value: string) => handleChange("expectedFirstImpact", value)}
                        required={true}
                        popup={{
                            guidance: "Depending on the category of the intervention and the project activities, this impact may begin immediately, or take place after a period of time has passed.",
                            example: "We expect the first reported impact (actual GHG emissions reduction or removal) to occur in the second year of the project, specifically by December 31, 2024. Impact is not anticipated to vary greatly between years over the lifespan of the project."
                        }}
                    />

                    <SectionHeader label="Connection to the Nestlé Value Chain" />

                    <TextQuestion
                        label="What is the project's connection to the Nestlé value chain as defined by Nestlé's Supply Chain (Scope 3) and Sourcing Landscape Removals Framework?"
                        controlledValue={answersRef.current.connectionToValueChain.value}
                        onChange={(value: string) => handleChange("connectionToValueChain", value)}
                        required={true}
                        popup={{
                            guidance: "This section requests information on the method being used to establish the product's connection to the Nestlé supply shed. Supply chain and sourcing landscape removals are defined by Nestlé in relation to their connection to Nestlé's value chain with four project zones defined in the Supply Chain & Sourcing Landscapes Removals Framework. Projects are categorized based upon the clarity in the connection between the farm and Nestlé's commodities. These Zones are categorized as:\n\nZone 1 - On-Farm, Commodity-specific\nZone 2 - Supply shed farm, commodity-specific\nZone 3 - Supply Shed Farm, Non commodity-specific\nZone 4 - Sourcing Landscape\n\nPlease note that Zone 3 or 4 will not be considered for scope 3 GHG reduction/removal projects",
                            example: "Based upon the Nestlé Zones, our commodity is designed as Zone 2. We can clearly describe that the farms covered by the management practices are providing ingredients to Nestlé's direct suppliers, but have difficulty connecting the farm and its product directly to Nestlé itself."
                        }}
                    />

                    <TextQuestion
                        label="If multiple zones, please describe here"
                        controlledValue={answersRef.current.otherZones!.value}
                        onChange={(value: string) => handleChange("otherZones", value)}
                    />

                    <DropdownQuestion
                        label="For projects with an associated commodity, can the material/product purchased by Nestlé be traced to a specific farm or plantation engaged in project activities?"
                        options={["Yes", "No"]}
                        controlledValue={answersRef.current.physicalTraceability!.value}
                        onSelect={(value: string) => handleChange("physicalTraceability", value)}
                        popup={{
                            guidance: "This section requests information on Nestlé's ability to trace a product to its origin, and thus how clear the connection between the supplier and Nestlé is, for the purpose of calculating emissions reductions.",
                            example: "Yes"
                        }}
                    />

                    <TextQuestion
                        label="Please provide additional relevant information here"
                        controlledValue={answersRef.current.ptAdditionalInfo!.value}
                        onChange={(value: string) => handleChange("ptAdditionalInfo", value)}

                    />

                    <TextQuestion
                        label="What chain of custody model is followed for this ingredient within Nestlé's supply chain?"
                        controlledValue={answersRef.current.chainOfCustody.value}
                        onChange={(value: string) => handleChange("chainOfCustody", value)}
                        required={true}
                        popup={{
                            guidance: "This section requests information on the method being used to establish the product's chain of custody. The chain of custody model describes how the connection between the supplier and Nestlé is established for the purpose of calculating emissions reductions. Models include:(Source: ISEAL) \n\n1. Identity Preserved- Materials originate from a single source and maintain their unique characteristics throughout the entire supply chain. This model ensures complete traceability to the original source. For this method to be appropriate, the product must be able to be clearly traced to its origin.\n2. Segregation - Materials with specified characteristics from certified sources are kept separate from non-certified materials throughout the supply chain, ensuring the end product is 100% certified. For this method to be appropriate, it would be necessary to possess records which clearly separate the product of a participating farm from that of a non-participating farm.\n3. Mass Balance - Control Blending: Associated documentation must refer to the mix of proportions of certified physical product. For this method to be appropriate, it would be necessary to maintain records and practices that demonstrate the proportion of the blended project--for each shipment--that comes from participating project farms and non-project farms.\n4. Mass Balance: Associated documentation must refer to the mix of proportions of certified physical product.​For this method to be appropriate, it would be necessary to maintain records and practices that demonstrate the proportion of the blended project--on average--comes from participating project farms and non-project farms\n5. Book and Claim - The administrative record flow is not necessarily connected to the physical flow of material through the supply chain. For this method to be appropriate, the supplier or Nestlé would need to maintain documentation describing volumes sold or purchased.",
                            example: "Segregation Model"
                        }}
                    />

                    <TextQuestion
                        label="Please provide additional relevant information here"
                        controlledValue={answersRef.current.cocAdditionalInfo!.value}
                        onChange={(value: string) => handleChange("cocAdditionalInfo", value)}

                    />
                </>
            )}
            {/* Page 2: Everything from "Information related to Carbon credits" onwards */}
            {currentPage === 2 && (
                <>
                    <SectionHeader label="Information related to Carbon credits (insets)" />

                    <DropdownQuestion
                        label="Is your project intended to generate carbon inset credits?"
                        options={["Yes", "No"]}
                        controlledValue={answersRef.current.carbonCredits.value}
                        onSelect={(value: string) => handleChange("carbonCredits", value)}
                        required={true}
                        popup={{
                            guidance: "This section aims to identify which recognized and approved carbon standard is being used to validate and certify the carbon credits generated by a project. Some examples include CAR, VCS, Gold standard.",
                            example: "VCS"
                        }}
                    />

                    <TextQuestion
                        label="What carbon standard is used to verify the credits generated?"
                        controlledValue={answersRef.current.carbonStandard!.value}
                        onChange={(value: string) => handleChange("carbonStandard", value)}
                        popup={{
                            guidance: "This section aims to identify which recognized and approved carbon standard is being used to validate and certify the carbon credits generated by a project. Some examples include CAR, VCS, Gold standard.",
                            example: "VCS"
                        }}
                    />

                    <DropdownQuestion
                        label="Is the quantification approach verified by 3rd party entities approved for use by crediting programs?"
                        options={["Yes", "No"]}
                        controlledValue={answersRef.current.carbonCreditsVerified.value}
                        onSelect={(value: string) => handleChange("carbonCreditsVerified", value)}
                        required={true}
                        popup={{
                            guidance: "To ensure that the method used to measure and estimate GHG reductions or removals has been reviewed and validated by independent, reputable organizations. These third-party entities are usually approved and recognized by established crediting programs, such as the Verified Carbon Standard (VCS) or the Gold Standard. Their role is to ensure that the quantification methods used are scientifically sound, accurate, and reliable.",
                            example: "Yes"
                        }}
                    />

                    <TextQuestion
                        label="If Yes: In short, describe the 3rd party verification and verifier here. If No: Describe the verification procedure to ensure the credibility and quality of these carbon credits."
                        controlledValue={answersRef.current.ccvSupplement.value}
                        onChange={(value: string) => handleChange("ccvSupplement", value)}
                        required={true}
                        popup={{
                            guidance: "To ensure that the method used to measure and estimate GHG reductions or removals has been reviewed and validated by independent, reputable organizations. These third-party entities are usually approved and recognized by established crediting programs, such as the Verified Carbon Standard (VCS) or the Gold Standard. Their role is to ensure that the quantification methods used are scientifically sound, accurate, and reliable.",
                            example: "3rd party verification in place to verify practices implementation and quantification of impact. 3rd party entity name 'XXX'"
                        }}
                    />

                    <DropdownQuestion
                        label="Is there a mechanism in place to minimize the risk of double counting? (external registry/ledger, or contracts)"
                        options={["Yes", "No"]}
                        controlledValue={answersRef.current.carbonCreditsDoubleCount.value}
                        onSelect={(value: string) => handleChange("carbonCreditsDoubleCount", value)}
                        required={true}
                        popup={{
                            guidance: "This could include mechanisms like an external registry, which is a centralized database that tracks all carbon credits to ensure they are only counted once. Alternatively, it could involve maintaining a ledger that records transactions and ownership of carbon credits, or having contracts in place that specify the ownership and exclusivity of the credits. These measures help ensure the integrity and accuracy of the carbon credit system by avoiding duplication and ensuring that each credit represents a unique reduction in GHG emissions.",
                            example: "Yes"
                        }}
                    />

                    <TextQuestion
                        label="If Yes: Please provide a description of the registry here. If No: Please desribe if there is any other measure in place to prevent against double counting here."
                        controlledValue={answersRef.current.ccdcSupplement.value}
                        onChange={(value: string) => handleChange("ccdcSupplement", value)}
                        required={true}
                        popup={{
                            guidance: "This could include mechanisms like an external registry, which is a centralized database that tracks all carbon credits to ensure they are only counted once. Alternatively, it could involve maintaining a ledger that records transactions and ownership of carbon credits, or having contracts in place that specify the ownership and exclusivity of the credits. These measures help ensure the integrity and accuracy of the carbon credit system by avoiding duplication and ensuring that each credit represents a unique reduction in GHG emissions.",
                            example: "Supplier will register Nestle scope 3 emission claims with Registry 'AAA' for claims tracking and provide additional check for double counting on claim on specific location boundaries"
                        }}
                    />

                    <TextQuestion
                        label="Date of issuance of credit/certificate (format: Month, Year)"
                        controlledValue={answersRef.current.dateOfIssuance.value}
                        onChange={(value: string) => handleChange("dateOfIssuance", value)}
                        required={true}
                        popup={{
                            guidance: "Expected date (month) when the credit will be issued after project implementation",
                            example: "Dec, 2025"
                        }}
                    />

                    <SectionHeader label="Project Co-Financing and Benefit Sharing" />

                    <DropdownQuestion
                        label="Please select the proposed co-financing structure."
                        options={["Cost sharing model to be agreed between the Supplier and Nestle", "Cost sharing model to be agreed between the Supplier, Nestle and other parties", "No cost sharing model, 100% project cost to Nestle"]}
                        controlledValue={answersRef.current.coFinancingStructure.value}
                        onSelect={(value: string) => handleChange("coFinancingStructure", value)}
                        required={true}
                        popup={{
                            guidance: "Co-financing refers to a practice where multiple entities collaborate to provide funds for a project or a company.",
                            example: "Cost sharing model to be agreed between the Supplier, Nestle and other parties."
                        }}
                    />

                    <TextQuestion
                        label="Please provide breakdown here, and any additional information if applicable."
                        controlledValue={answersRef.current.coFinancingSupplement.value}
                        onChange={(value: string) => handleChange("coFinancingSupplement", value)}
                        required={true}
                        popup={{
                            guidance: "A text description explaining any potential co-financing (cost-sharing), its amount, and the relevant investors. Co-financing refers to a practice where multiple entities collaborate to provide funds for a project or a company.",
                            example: "Our project involves a co-financing model. Supplier XYZ will provide 75% of the cost, in complement to the 25% of the cost that Nestlé is providing. In addition, further costs throughout the lifespan of the project will also be broken down along this 75/25 ratio."
                        }}
                    />

                    <TextQuestion
                        label="Does the project include benefit sharing? (if so, please explain the benefit sharing proposal)"
                        controlledValue={answersRef.current.benefitSharing.value}
                        onChange={(value: string) => handleChange("benefitSharing", value)}
                        required={true}
                        popup={{
                            guidance: "A text description explaining any potential sharing of the GHG benefits. Potential benefit sharing refers to the distribution of GHG emission reductions.",
                            example: "As we will be in different stages of the value chain, both Supplier XYZ, and Nestlé will be allotted 100% of the benefits, or 75,000 t CO2e."
                        }}
                    />

                    <SectionHeader label="Information on GHG Benefits Estimates" />
                    <p style={{
                        color: 'black',
                        fontSize: '16px',
                        fontFamily: 'Neue Haas Grotesk Display Pro',
                        fontWeight: '500',
                        lineHeight: '24px',
                        letterSpacing: '0.48px',
                        wordWrap: 'break-word',
                        padding: '20px',
                        margin: '0 60px',
                    }}>
                        (For more than one ingredient, please list  its corresponding emissions factor (EF) or reduction/removals estimates separately)

                        Please note: For early stage projects we recognize that this represents a best initial estimate and is subject to change as the project is further developed. If you encounter any difficulties in completing this section, Winrock will provide guidance on the calculation process and assist in gathering the necessary information during the project validation process.
                    </p>
                    <DropdownQuestion
                        label="Select one of the options and add the values in the respective rows based on applicability (accounting approach used for project, availability of data, type and stage of project)"
                        options={["Compare Before and After Emissions Factor", "Project Carbon Intensity/Carbon credit project"]}
                        controlledValue={answersRef.current.ghgOption.value}
                        onSelect={(value: string) => handleChange("ghgOption", value)}
                        required={true}
                        popup={{
                            guidance: "Select one of the options and add the answers to the respective questions based on applicability (accounting approach used for project, availability of data, type and stage of project)\n\n1. Compare Before and After Emissions Factor\n2. Project Carbon Intensity/Carbon credit project\n\nPlease note: For early stage projects we recognize that this represents a best initial estimate and is subject to change as the project is further developed. If you encounter any difficulties in completing this section, Winrock will provide guidance on the calculation process and assist in gathering the necessary information during the project validation process.",
                            example: "Compare Before and After Emissions Factor"
                        }}
                    />

                    <TextQuestion
                        label="Emissions Factor BEFORE the Intervention (tCO2e/ ton of ingredient)"
                        controlledValue={answersRef.current.beforeEmissionFactor.value}
                        onChange={(value: string) => handleChange("beforeEmissionFactor", value)}
                        required={true}
                        popup={{
                            guidance: "If the project accounts for GHG benefits by changing the full LCA Emission Factor (EF) for the final product/ingredient that Nestle sources, or by comparing project carbon intensity to the average ingredient purchased from the supply shed, please provide:\nBefore EF based on chosen approach for baseline calculation:\n1. Supplier EF (farm-level inputs)\n2. Supply shed average EF (modeled based on supply shed agronomic practces on field, or industry average)",
                            example: "1.5 tCO2e/ ton of corn"
                        }}
                    />

                    <TextQuestion
                        label="Emissions Factor AFTER the Intervention (tCO2e/ ton of ingredient)"
                        controlledValue={answersRef.current.afterEmissionFactor.value}
                        onChange={(value: string) => handleChange("afterEmissionFactor", value)}
                        required={true}
                        popup={{
                            guidance: "If the project accounts for GHG benefits by changing the full LCA Emission Factor (EF) for the final product/ingredient that Nestle sources, or by comparing project carbon intensity to the average ingredient purchased from the supply shed, please provide project-specific Emissions factor after the project in tCO2e/ton of ingredient.",
                            example: "1.2 tonnes, corn"
                        }}
                    />

                    <TextQuestion
                        label="Emissions reduction estimate from the project (in tCO2e)"
                        controlledValue={answersRef.current.emissionReductionEstimate.value}
                        onChange={(value: string) => handleChange("emissionReductionEstimate", value)}
                        required={true}
                        popup={{
                            guidance: "Estimate of the expected GHG reductions due to the project activities on a given farm area (tCO2e)",
                            example: "0.3 tCO2e"
                        }}
                    />

                    <TextQuestion
                        label="Emissions removal estimate from the project (in tCO2e)"
                        controlledValue={answersRef.current.emissionRemovalEstimate.value}
                        onChange={(value: string) => handleChange("emissionRemovalEstimate", value)}
                        required={true}
                        popup={{
                            guidance: "Estimate of the expected GHG removals due to the project activities on a given farm area (tCO2e)",
                            example: "0.004 tCO2e"
                        }}
                    />

                    <SectionHeader label="Supplementary Information on GHG Emissions Benefits" />

                    <DropdownQuestion
                        label="Is the GHG calculation sheet for the noted benefits attached with the project submission email?"
                        options={["Yes", "No"]}
                        controlledValue={answersRef.current.ghgSheetAttached.value}
                        onSelect={(value: string) => handleChange("ghgSheetAttached", value)}
                        popup={{
                            guidance: "The Calculation sheet should include inputs, outputs, data sources, baseline conditions, methodology used (IPCC tier 1/2/3), third-party models IF ANY, embedded calculations, and references used to derive the GHG impact/benefits from this project to Nestle.\nNote: For Data type,\nPrimary data includes: direct measurement or activity-based data\nSecondary data includes: literature or industry average or crop-specific emissions factor",
                            example: "Yes"
                        }}
                    />

                    <DropdownQuestion
                        label="If your project has emission removals, please confirm your project establishes a 20% emissions buffer for potential reversal of the emission removals? Please note: For removals projects, a 20% buffer must be considered on reported carbon removals to manage the reversal risk."
                        options={["Yes", "No", "N/A"]}
                        controlledValue={answersRef.current.ghgBuffer!.value}
                        onSelect={(value: string) => handleChange("ghgBuffer", value)}
                        popup={{
                            guidance: "Once emissions are physically captured, removed from the atmosphere, and then sequestered, there can be a 'risk of reversal' where emissions are again released into the atmosphere. To hedge against this risk of reversal, your project needs to establish a buffer of additional emissions removals in addition to the below project proposal numbers. If a project developer is planting trees as their project intervention, they can plant 20% more trees and not sell to buyers this extra amount of emissions removals.",
                            example: "Yes"
                        }}
                    />

                    <TextQuestion
                        label="Please elaborate here - why you have/have not established a buffer."
                        controlledValue={answersRef.current.gbElaboration!.value}
                        onChange={(value: string) => handleChange("gbElaboration", value)}
                        popup={{
                            guidance: "Once emissions are physically captured, removed from the atmosphere, and then sequestered, there can be a 'risk of reversal' where emissions are again released into the atmosphere. To hedge against this risk of reversal, your project needs to establish a buffer of additional emissions removals in addition to the below project proposal numbers. If a project developer is planting trees as their project intervention, they can plant 20% more trees and not sell to buyers this extra amount of emissions removals.",
                            example: "20% buffer included in the calculation sheet to mitigate reversal risks from expected removals "
                        }}
                    />
                </>
            )}
            {/* Page 3: GHG emissions benefits, buffer, and supplementary info */}
            {currentPage === 3 && (
                <>
                    <SectionHeader label="Connection to the Nestlé Value Chain"></SectionHeader>
                    <p style={{
                        color: 'black',
                        fontSize: '16px',
                        fontFamily: 'Neue Haas Grotesk Display Pro',
                        fontWeight: '500',
                        lineHeight: '24px',
                        letterSpacing: '0.48px',
                        wordWrap: 'break-word',
                        padding: '20px',
                        margin: '0 60px',
                    }}>
                        In the early stages of scoping out a new project, it can be challenging to provide cost and benefit forecasts. However, initial estimates are critical for our initial evaluation of project proposals. As such, Nestlé requires that this section be completed for all project submissions. Please note: For early stage projects we recognize that this represents a best initial estimate and is subject to change as the project is further developed.  </p>
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <img
                            src={tableImage}
                            alt="Evidentiary Documentation Table"
                            style={{ width: '100%', maxWidth: '1200px' }}
                        />
                    </div>
                </>
            )}
            {currentPage === 4 && (
                <>
                    <SectionHeader label="Evidentiary Documentation Checklist"></SectionHeader>
                    <p style={{
                        color: 'black',
                        fontSize: '16px',
                        fontFamily: 'Neue Haas Grotesk Display Pro',
                        fontWeight: '500',
                        lineHeight: '24px',
                        letterSpacing: '0.48px',
                        wordWrap: 'break-word',
                        padding: '20px',
                        margin: '0 60px',
                    }}>
                        The project proposal form is used to record information critical to the completion of the validation process for your project. It requests information both technical and administrative in nature. These questions are split within ten key categories, each of which requests one or more pieces of key information to kick off the project validation process. In Columns F ("Guidance") of this tab defines key terms and describes information sought in the fields in Column D/E ("Supplier answers"). It also includes key guidance including relevant examples and links to helpful sources. Please complete all required fields. Required questions must be answered before a project validation may commence. Optional questions are welcomed and may lead to a faster validation process.
                       </p>
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <img
                                src={tableImage2}
                                alt="Evidentiary Documentation Table"
                                style={{ width: '100%', maxWidth: '1200px' }}
                            />
                        </div>
                    </>
            )}
                    <NavigationButtons
                        onNext={() => {
                            if (locked) {
                                handleLockedAction();
                                return;
                            }
                            if (currentPage < totalPages) {
                                setCurrentPage(currentPage + 1);
                                window.scroll(0, 0);
                            } else {
                                handleSubmit();
                            }
                        }}
                        onBack={() => {
                            if (locked) {
                                handleLockedAction();
                                return;
                            }
                            if (currentPage > 1) {
                                setCurrentPage(currentPage - 1)
                                window.scroll(0, 0);
                            }
                        }}
                        canGoBack={currentPage > 1}
                        nextLabel={currentPage === totalPages ? 'Submit' : 'Next'}
                    />

                    <Error message={error} />

                    {/* Locked Form Popup */}
                    {LockedPopup}

                </>
            );
}

            export default AgricultureProposalForm;