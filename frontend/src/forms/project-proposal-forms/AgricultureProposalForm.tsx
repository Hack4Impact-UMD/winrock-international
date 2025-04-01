import { useState } from "react";
import * as firestore from "firebase/firestore";
import { db } from "../../../src/firebaseConfig.js";
import styles from "../css-modules/AgricultureForm.module.css";

import LogoHeader from "../../components/headers/LogoHeader.js";
import TitleHeader from "../../components/headers/TitleHeader.js";
import ProgressBar from "../../components/ProgressBar.js";
import SectionHeader from "../../components/headers/SectionHeader.js";
import TextQuestion from "../../components/questions/TextQuestion.js";
import Dropdown from "../../components/questions/DropdownQuestion.js";
import NavigationButtons from "../../components/NavigationButtons.js";

interface RenewableProposalFormData {
    ingredientPrimary: string;
    ingredientSub: string;
    mainIntervention: string;
    mainCountry: string;
}

const AgricultureForm = () => {
    const [dropdownResponses, setDropdownResponses] = useState<{ [key: string]: string }>({});

    const handleSelect = (id: string, response: string) => {
        setDropdownResponses({
            ...dropdownResponses,
            [id]: response
        });
    };

    async function saveDropdowns() {
        for (const dropdownId in dropdownResponses) {
            await firestore.setDoc(firestore.doc(db, "ag-form-testing", dropdownId), {
                id: dropdownId,
                response: dropdownResponses[dropdownId]
            });
        }
    }

    return (
        <div>
            <LogoHeader />
            <TitleHeader
                title="Agriculture Form"
                description="This project proposal form asks for comprehensive details including the specific ingredient, project activity, geographic location, project partners, timeline, connection to Nestle's value chain, GHG estimates calculation, costs, and benefit sharing."
            />
            <ProgressBar currentPage={1} totalPages={3} pageLabels={["Proposal Form", "Project Costs", "Document Checklist"]}/>
            <SectionHeader
                label="Ingredient/Crop Supplied"
            />
            <div className={styles.questionscontainer}>
                <Dropdown
                    label="Please select the primary category of ingredient or crop you are supplying to Nestlé linked to this project?"
                    options={["Acids & Alkalis", "Amino Acids", "Animal Fats", "Cereals & Grains", "Chicory", "Chocolate", "Chocolate Equivalent", "Cocoa", "Coffee",
                        "Colors", "Dairy Products", "Egg & Products", "Elaborated & Mixed Products", "Enzymes", "Fiber", "Fish/Seafood ByProd (PetCare)", "Flavor Enhancers",
                        "Flavors", "Food Chemicals", "Fruit & Berry Preparations", "Fruits & Berries", "Gas", "Herbs", "Honey", "Hydrocolloids & Emulsifiers", "Intensive Sweetener",
                        "Lecithin", "Leguminous Seeds", "Meat", "Meat ByProducts (PetCare)", "Microorganisms", "Nucleotides", "Nutraceuticals & Capsules", "Nuts & Seeds", "Oilseed",
                        "Pasta", "Plant Proteins", "Polymer", "Poultry", "Poultry ByProducts (PetCare)", "Salt & Minerals", "Soya (excluding Lecithin)", "Spices", "Starch & Derivatives",
                        "Strategic Nutritional Ingredients", "Sucrose", "Tea", "Vegetable Fats & Oils", "Vegetables", "Vitamins & Micronutrients", "Water", "Wine, Liquor & Vinegar"]}
                    onSelect={(selected: string) => handleSelect("ingredientPrimary", selected)}
                />
                <Dropdown
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
                    onSelect={(selected: string) => handleSelect("ingredientSub", selected)}
                />
            </div>

            <SectionHeader
                label="General Project Activity Description"
            />
            <div className={styles.questionscontainer}>
                <Dropdown
                    label="Please select the main intervention and description that best matches the project?"
                    options={[
                        "Dairy & Livestock - Animal Productivity",
                        "Dairy & Livestock - Feed", "Dairy & Livestock - Health",
                        "Dairy & Livestock - Manure Management", "Farm - Improvement",
                        "Forest & Wetland",
                        "Soil", "Supplier low carbon energy"
                    ]}
                    onSelect={(selected: string) => handleSelect("mainIntervention", selected)}
                />
                <TextQuestion
                    label="Please provide a short written description of the specific project activities that will be implemented."
                    isRequired={true}
                />
            </div>

            <SectionHeader
                label="Project Volumes in Relation to Nestlé"
            />
            <div className={styles.questionscontainer}>
                <TextQuestion
                    label="Average volume of sub-category of ingredient(s) or crop(s) purchased by Nestlé from only the project per year (tonnes) (format: number, units, ingredients)"
                />
            </div>


            <SectionHeader
                label="Project Geography"
            />
            <div className={styles.questionscontainer}>
                <Dropdown
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
                    onSelect={(selected: string) => handleSelect("mainCountry", selected)}
                />
                <TextQuestion
                    label="If the project is implemented in more than one country, please list the countries (If applicable)"
                    
                />
                <TextQuestion
                    label="What is the sub-national region or regions where the project is located? (If Applicable)"
                    
                />
            </div>


            <SectionHeader
                label="Project Contracting Party and Project Partners"
            />
            <div className={styles.questionscontainer}>
                <TextQuestion
                    label="What is the name of the contracting party (i.e., Nestlé Supplier)?"
                    
                />
                <TextQuestion
                    label="What is full name and email of the key contact or key contacts at the contracting party?"
                    
                />
                <TextQuestion
                    label="Is another partner(s) involved with the project? If so, please name them and provide a brief description of their roles and responsibilities."
                    
                ></TextQuestion>
                <TextQuestion
                    label="Second partner name, roles and responsibilities"
                    
                ></TextQuestion>
                <TextQuestion
                    label="Third partner name, roles and responsibilities"
                    
                ></TextQuestion>
            </div>

            <SectionHeader label="Planned Timeline"></SectionHeader>
            <div className={styles.questionscontainer}>
                <TextQuestion
                    label="What is the month and year that the project started or is planned to be started?"
                    
                ></TextQuestion>
                <TextQuestion
                    label="What is the expected duration of project? (In Years)"
                    
                ></TextQuestion>
                <TextQuestion
                    label="When do you expect the first reported impact (actual GHG emissions reduction or removal)?"
                    
                ></TextQuestion>
            </div>

            <SectionHeader label="Connection to the Nestlé Value Chain"></SectionHeader>
            <div className={styles.questionscontainer}>
                <TextQuestion
                    label="What is the project's connection to the Nestlé value chain as defined by Nestlé's Supply Chain (Scope 3) and Sourcing Landscape Removals Framework?"
                    
                ></TextQuestion>
                <TextQuestion
                    label="If multiple zones, please describe here"
                    
                ></TextQuestion>
                <Dropdown
                    label="For projects with an associated commodity, can the material/product purchased by Nestlé be traced to a specific farm or plantation engaged in project activities?"
                    options={["Yes", "No"]}
                    onSelect={(selected: string) => handleSelect("physicalTraceability", selected)}
                ></Dropdown>
                <TextQuestion
                    label="Please provide additional relevant information here"
                    
                ></TextQuestion>
                <TextQuestion
                    label="What chain of custody model is followed for this ingredient within Nestlé's supply chain?"
                    
                ></TextQuestion>
                <TextQuestion
                    label="Please provide additional relevant information here"
                    
                ></TextQuestion>
            </div>


            <SectionHeader label="Information related to Carbon credits (insets)"></SectionHeader>
            <div className={styles.questionscontainer}>
                <Dropdown
                    label="Is your project intended to generate carbon inset credits?"
                    options={["Yes", "No"]}
                    onSelect={(selected: string) => handleSelect("carbonCredits", selected)}
                ></Dropdown>
                <TextQuestion
                    label="What carbon standard is used to verify the credits generated?"
                    
                ></TextQuestion>
                <Dropdown
                    label="Is the quantification approach verified by 3rd party entities approved for use by crediting programs?"
                    options={["Yes", "No"]}
                    onSelect={(selected: string) => handleSelect("carbonCreditsVerified", selected)}
                ></Dropdown>
                <TextQuestion
                    label="If Yes: In short, describe the 3rd party verification and verifier here. If No: Describe the verification procedure to ensure the credibility and quality of these carbon credits."
                    
                ></TextQuestion>
                <Dropdown
                    label="Is there a mechanism in place to minimize the risk of double counting? (external registry/ledger, or contracts)"
                    options={["Yes", "No"]}
                    onSelect={(selected: string) => handleSelect("carbonCreditsDoubleCount", selected)}
                ></Dropdown>
                <TextQuestion
                    label="If Yes: Please provide a description of the registry here. If No: Please desribe if there is any other measure in place to prevent against double counting here."
                ></TextQuestion>
                <TextQuestion
                    label="Date of issuance of credit/certificate"
                ></TextQuestion>
            </div>

            <SectionHeader label="Project Co-Financing and Benefit Sharing"></SectionHeader>
            <div className={styles.questionscontainer}>
                <TextQuestion
                    label="Please select the co-financing structure"
                ></TextQuestion>
                <TextQuestion
                    label="Please provide breakdown here, and any additional information if applicable."
                ></TextQuestion>
                <TextQuestion
                    label="Does the project include benefit sharing? (if so, please explain the benefit sharing proposal)"
                ></TextQuestion>
            </div>

            <SectionHeader label="Information on GHG Benefits Estimates"></SectionHeader>
            <div className={styles.questionscontainer}>
                <Dropdown
                    label="Select one of the options below and add the values in the respective rows based on applicability (accounting approach used for project, availability of data, type and stage of project)"
                    options={["Compare Before and After Emissions Factor", "Project Carbon Intensity/Carbon credit project"]}
                    onSelect={(selected: string) => handleSelect("ghgOption", selected)}
                ></Dropdown>
                <TextQuestion
                    label="Emissions Factor BEFORE the Intervention (tCO2e/ ton of ingredient)"
                ></TextQuestion>
                <TextQuestion
                    label="Emissions Factor AFTER the Intervention (tCO2e/ ton of ingredient)"
                ></TextQuestion>
                <TextQuestion
                    label="Emissions reductions estimate from the project (in tCO2e)"
                ></TextQuestion>
                <TextQuestion
                    label="Emissions removals estimate from the project (in tCO2e)"
                ></TextQuestion>
            </div>

            <SectionHeader label="Supplementary Information on GHG Emissions Benefits"></SectionHeader>
            <div className={styles.questionscontainer}>
                <Dropdown
                    label="Is the GHG calculation sheet for the noted benefits attached with the project submission email?"
                    options={["Yes", "No"]}
                    onSelect={(selected: string) => handleSelect("ghgSheetAttached", selected)}
                ></Dropdown>
                <Dropdown
                    label="If your project has emission removals, please confirm your project establishes a 20% emissions buffer for potential reversal of the emission removals? Please note: For removals projects, a 20% buffer must be considered on reported carbon removals to manage the reversal risk."
                    options={["Yes", "No"]}
                    onSelect={(selected: string) => handleSelect("ghgBuffer", selected)}
                ></Dropdown>
                <TextQuestion
                    label="Please elaborate here - why you have/have not established a buffer."
                    
                ></TextQuestion>
            </div>

            <NavigationButtons onBack={saveDropdowns} onSaveChanges={saveDropdowns} onSaveAndExit={saveDropdowns} onNext={saveDropdowns}/>
        </div>
    );
};

export default AgricultureForm;