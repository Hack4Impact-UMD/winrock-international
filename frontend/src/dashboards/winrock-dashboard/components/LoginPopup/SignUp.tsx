import {
  useRef,
  useState
} from "react";
import { useNavigate } from "react-router-dom";
import Result, { toReadableError } from "../../../../types/Result.js";
import Role from "../../../../types/Role.js";
import {
  fetchCompanySuggestions,
  handleSignup,
  SignupInfo
} from "../../../../auth/authService.js";
import { getSupplierProjectNameByToken, validateSupplierEmail } from "../../projects/winrockDashboardService.js";

import "../../../../auth/styles/SignupPage.css";

import TitleHeader from "../../../../auth/components/TitleHeader.js";
import BackButton from "../../../../auth/components/BackButton.js";
import NextButton from "../../../../auth/components/NextButton.js";
import DropdownField from "../../../../auth/components/DropdownField.js";
import TextField from "../../../../auth/components/TextField.js";
import BottomLink from "../../../../auth/components/BottomLink.js";
import PasswordField from "../../../../auth/components/PasswordField.js";
import Divider from "../../../../auth/components/Divider.js";
import OutlookButton from "../../../../auth/components/OutlookButton.js";
import ToastMessage from "../../../../auth/components/ToastMessage.js";

import styles from "../../css-modules/LoginPopup.module.css";

interface StepOneProps {
  answersRef: React.RefObject<SignupInfo>;
  handleChange: (field: keyof SignupInfo, value: string) => void;
  role: Role | "";
  setRole: React.Dispatch<React.SetStateAction<Role | "">>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

interface StepTwoProps {
  answersRef: React.RefObject<SignupInfo>;
  handleChange: (field: keyof SignupInfo, value: string) => void;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

interface StepThreeProps {
  answersRef: React.RefObject<SignupInfo>;
  handleChange: (field: keyof SignupInfo, value: string) => void;
  confirmPassword: string;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  supplierToken: string;
  onClose: () => void;
}

const MAX_FIELD_LENGTH = 256;
const MIN_PASSWORD_LENGTH = 8;

function SignupPopup({ onClose, supplierToken }: Readonly<{ onClose: () => void; supplierToken: string }>) {
  const answersRef = useRef<SignupInfo>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: '' as Role,
    company: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [role, setRole] = useState<Role | "">(""); // tracks dynamic changes
  const [confirmPassword, setConfirmPassword] = useState("");

  // Used to change the answersRef's fields dynamically
  function handleChange(field: keyof SignupInfo, value: string) {
    answersRef.current = {
      ...answersRef.current,
      [field]: value
    }
  }

  return (
      <div className={styles.pageContainer}>
        {currentStep === 1 &&
          <StepOne
            answersRef={answersRef}
            handleChange={handleChange}
            role={role}
            setRole={setRole}
            setCurrentStep={setCurrentStep}
          />}

        {currentStep === 2 &&
          <StepTwo
            answersRef={answersRef}
            handleChange={handleChange}
            setCurrentStep={setCurrentStep}
          />}

        {currentStep === 3 &&
          <StepThree
            answersRef={answersRef}
            handleChange={handleChange}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            setCurrentStep={setCurrentStep}
            onClose={onClose}
            supplierToken={supplierToken}
          />}
      </div>
  )
}

const StepOne = ({ answersRef, handleChange, role, setRole, setCurrentStep }: StepOneProps) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [companySuggestions, setCompanySuggestions] = useState<string[]>([]);
  
  const handleCompanySuggestions = async (input: string) => {
    const result = await fetchCompanySuggestions(input);
    if (result.success) {
      setCompanySuggestions(result.data as string[]);
    } else {
      console.error("Error fetching company suggestions, ", result.errorCode);
    }
  }

  function handleNext() {
    if (!answersRef.current.role) {
      setErrorMessage("Missing role");
      return;
    }
    // Role must be supplier for this flow
    if (answersRef.current.role !== 'supplier') {
      setErrorMessage("Invalid role. Please select Supplier.");
      return;
    }
    if (!answersRef.current.company) {
      setErrorMessage("Missing company");
      return;
    }

    if (answersRef.current.company.length > MAX_FIELD_LENGTH) {
      setErrorMessage("Company name is too long");
      return;
    }
    setCurrentStep(2);
  }

  return (
    <div
      className="step-one-form-container"
      style={{gridTemplateRows: role === "supplier"
        ? "8.5rem 8rem 7rem 6.5rem 3rem"
        : "8.5rem 8rem 13.5rem 3rem"
    }}>
      {errorMessage &&
          <ToastMessage
            message={errorMessage}
            isError={true}
          />}

      <TitleHeader
        title="Create Your Account"
        subtitle="Create an account or log in to view content."
      />

      <DropdownField
        label="What is your role?"
        blankOption="I am a..."
        options={["Supplier", "Winrock International Employee"]}
        values={["supplier", "admin"]}
        controlledValue={answersRef.current.role}
        onSelect={(value) => {
          setRole(value as Role);
          handleChange("role", value as Role);
          setErrorMessage("");
        }}
      />

      {role === "supplier" &&
        <TextField
          label="Company name"
          controlledValue={answersRef.current.company!}
          onChange={(value) => {
            handleChange("company", value);
            handleCompanySuggestions(value);
            setErrorMessage("");
          }}
          suggestions={companySuggestions}
          onSuggestionClick={(value) => {
            handleChange("company", value);
            setErrorMessage("");
          }}
        />}

      <NextButton
        label="Continue"
        onClick={handleNext}
      />
    </div>
  )
}

const StepTwo = ({ answersRef, handleChange, setCurrentStep }: StepTwoProps) => {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string>("");
  
  function handleNext() {
    if (!answersRef.current.firstName) {
      setErrorMessage("Missing first name");
      return;
    }

    if (!answersRef.current.lastName) {
      setErrorMessage("Missing last name");
      return;
    }

    if (answersRef.current.firstName.length > MAX_FIELD_LENGTH) {
      setErrorMessage("First name is too long");
      return;
    }

    if (answersRef.current.lastName.length > MAX_FIELD_LENGTH) {
      setErrorMessage("Last name is too long");
      return;
    }

    setCurrentStep(3);
  }

  return (
    <div
      className="step-two-form-container"
      style={{gridTemplateRows: "0 8.5rem 8.5rem 7rem 6rem 3.5rem 1rem"}}
    >
      {errorMessage &&
          <ToastMessage
            message={errorMessage}
            isError={true}
          />}
        
      <BackButton onClick={() => setCurrentStep(1)} />
        
      <TitleHeader
        title="Create Your Account"
        subtitle="Create an account or log in to view content."
      />

      <TextField
        label="First Name"
        controlledValue={answersRef.current.firstName}
        onChange={(value) => handleChange("firstName", value)}
      />

      <TextField
        label="Last Name"
        controlledValue={answersRef.current.lastName}
        onChange={(value) => handleChange("lastName", value)}
      />

      <NextButton
        label="Continue"
        onClick={handleNext}
      />

      <BottomLink
        beforeText="Already have an account?"
        actionLabel="Sign in"
        onClick={() => navigate("/auth/login")}
      />
    </div>
  )
}

const StepThree = ({ answersRef, handleChange, confirmPassword, setConfirmPassword, setCurrentStep, onClose, supplierToken }: StepThreeProps) => {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string>("");

  async function handleCreateAccount() {
    if (!answersRef.current.email) {
      setErrorMessage("Missing email");
      return;
    }

    if (!answersRef.current.password) {
      setErrorMessage("Missing password");
      return;
    }

    if (answersRef.current.password.length < MIN_PASSWORD_LENGTH) {
      setErrorMessage(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }

    if (answersRef.current.password.length > MAX_FIELD_LENGTH) {
      setErrorMessage("Password is too long");
      return;
    }

    if (answersRef.current.password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    const companyField = answersRef.current.company ? { company: answersRef.current.company } : {};

    const emailResult = await validateSupplierEmail(supplierToken, answersRef.current.email);
    if (!emailResult) {
      setErrorMessage("Unauthorized email.");
      return;
    }

    const result: Result = await handleSignup({
      email: answersRef.current.email,
      password: answersRef.current.password,
      firstName: answersRef.current.firstName,
      lastName: answersRef.current.lastName,
      role: answersRef.current.role,
      ...companyField
    });
    if (result.success) {
      onClose();
      const projectResult = await getSupplierProjectNameByToken(supplierToken);
      if (projectResult.success) {
        navigate(`/dashboard/admin/projects/${projectResult.data}`);
      } else {
        console.error("Error fetching project name: ", projectResult.errorCode);
        setErrorMessage("Login successful, but failed to retrieve project information.");
      }
    } else {
      console.error("Error signing up: ", result.errorCode);
      setErrorMessage(toReadableError(result.errorCode));
    }
  }
  
  return (
    <div
      className="step-three-form-container"
      style={{gridTemplateRows: "0 7.5rem 6rem 6.5rem 6.5rem 5rem 2.7rem 4.8rem 8rem 1rem"}}
    >
      {errorMessage &&
          <ToastMessage
            message={errorMessage}
            isError={true}
          />}

      <BackButton onClick={() => setCurrentStep(2)} />

      <TitleHeader title="Create Your Account" />

      <TextField
        label="Email Address"
        controlledValue={answersRef.current.email}
        onChange={(value) => handleChange("email", value)}
      />

      <PasswordField
        label="Password"
        controlledValue={answersRef.current.password}
        onChange={(value) => handleChange("password", value)}
      />

      <PasswordField
        label="Confirm Password"
        controlledValue={confirmPassword}
        onChange={(value) => setConfirmPassword(value)}
      />

      <NextButton
        label="Create Account"
        onClick={handleCreateAccount}
      />

      <Divider label = "OR" />

      <OutlookButton label="Continue with Outlook" onClick={() => {}}/>

      <BottomLink
        beforeText="Already have an account?"
        actionLabel="Sign in"
        onClick={() => navigate("/auth/login")}
      />
    </div>
  )
}

export default SignupPopup;