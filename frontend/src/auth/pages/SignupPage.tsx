import {
  useMemo,
  useRef,
  useState
} from "react";
import { useNavigate } from "react-router-dom";
import Result from "../../types/Result";
import Role from "../../types/Role.js";
import {
  type SignupInfo,
  fetchCompanySuggestions,
  handleSignup
} from "../authService";

import AuthLogoHeader from "../components/AuthLogoHeader";
import AuthForm from "../components/AuthForm";
import AuthDropdownField from "../components/AuthDropdownField";
import AuthTextField from "../components/AuthTextField";
import AuthPasswordField from "../components/AuthPasswordField";
import AuthBottomLink from "../components/AuthBottomLink";

interface StepOneProps {
  answersRef: React.RefObject<SignupInfo>;
  handleChange: (field: keyof SignupInfo, value: string) => void;
  role: Role | "";
  setRole: React.Dispatch<React.SetStateAction<Role | "">>;
}

interface StepTwoProps {
  answersRef: React.RefObject<SignupInfo>;
  handleChange: (field: keyof SignupInfo, value: string) => void;
}

interface StepThreeProps {
  answersRef: React.RefObject<SignupInfo>;
  handleChange: (field: keyof SignupInfo, value: string) => void;
  confirmPassword: string;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
}

function SignupPage() {
  const navigate = useNavigate();

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

  const currentRemSpacing = useMemo((): number[] => {
    if (currentStep === 1) {
      if (role === "client" || role === "supplier") {
        return [7.5, 10, 5.5, 7, 0, 0];
      }
      return [7.5, 10, 12.5, 0, 0];
    } else if (currentStep === 2) {
      return [7.5, 10, 5.5, 3.5, 2, 0];
    } else { // currentStep === 3
      return [6, 8, 6, 6, 2.5, 2, 1];
    }
  }, [currentStep, role])

  async function handleNext() {
    if (currentStep === 1) {
      if (!answersRef.current.role) {
        console.error("Error going to next step: Missing role");
        return;
      }

      if ((answersRef.current.role === "client" || answersRef.current.role === "supplier") && !answersRef.current.company) {
        console.error("Error going to next step: Missing company (required for this role)");
        return;
      }

      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!answersRef.current.firstName) {
        console.error("Error going to next step: Missing first name");
        return;
      }

      if (!answersRef.current.lastName) {
        console.error("Error going to next step: Missing last name");
        return;
      }

      setCurrentStep(3);
    } else {
      await handleCreateAccount();
    }
  }

  async function handleCreateAccount() {
    if (!answersRef.current.email) {
      console.error("Error signing up: Missing email");
      return;
    }

    if (!answersRef.current.password) {
      console.error("Error signing up: Missing password")
      return;
    }

    if (!answersRef.current.firstName) {
      console.error("Error signing up: Missing first name")
      return;
    }

    if (!answersRef.current.lastName) {
      console.error("Error signing up: Missing last name")
      return;
    }

    if (!answersRef.current.role) {
      console.error("Error signing up: Missing role")
      return;
    }

    if ((answersRef.current.role === "client" || answersRef.current.role === "supplier") && !answersRef.current.company) {
      console.error("Error signing up: Missing company (required for selected role)")
      return;
    }

    if (answersRef.current.password !== confirmPassword) {
      console.error("Error signing up: Passwords do not match")
      return;
    }

    const companyField = answersRef.current.company ? { company: answersRef.current.company } : {};

    const result: Result = await handleSignup({
      email: answersRef.current.email,
      password: answersRef.current.password,
      firstName: answersRef.current.firstName,
      lastName: answersRef.current.lastName,
      role: answersRef.current.role,
      ...companyField
    })

    if (result.success) {
      navigate("/dashboard/admin/projects");
    } else {
      console.error("Error signing up: ", result.errorCode);
    }
  }

  return (
    <>
      <AuthLogoHeader />

      <AuthForm
        title="Create Your Account"
        subtitle={currentStep < 3 ? "Please enter your details to sign up." : undefined}
        onBack={currentStep > 1 ? () => setCurrentStep(currentStep - 1) : undefined}
        nextLabel={currentStep < 3 ? "Continue" : "Create Account"}
        onNext={handleNext}
        afterChild={currentStep > 1 ?
          <AuthBottomLink
            beforeText="Already have an account?"
            actionLabel="Sign in"
            onClick={() => navigate("/auth/login")}
          />
          : undefined}
        remSpacing={currentRemSpacing}
      >
        <>
          {currentStep === 1 &&
            <StepOne
              answersRef={answersRef}
              handleChange={handleChange}
              role={role}
              setRole={setRole}
            />}

          {currentStep === 2 &&
            <StepTwo
              answersRef={answersRef}
              handleChange={handleChange}
            />}

          {currentStep === 3 &&
            <StepThree
              answersRef={answersRef}
              handleChange={handleChange}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
            />}
        </>
      </AuthForm>
    </>
  )
}

const StepOne = ({ answersRef, handleChange, role, setRole }: StepOneProps) => {
  const [companySuggestions, setCompanySuggestions] = useState<string[]>([]);
  
  const handleCompanySuggestions = async (input: string) => {
    const result = await fetchCompanySuggestions(input);
    if (result.success) {
      setCompanySuggestions(result.data as string[]);
    } else {
      console.error("Error fetching company suggestions, ", result.errorCode);
    }
  }

  return (
    <>
      <AuthDropdownField
        label="What is your role?"
        blankOption="I am a..."
        options={["Client", "Supplier", "Winrock Employee"]}
        values={["client", "supplier", "admin"]}
        controlledValue={answersRef.current.role}
        onSelect={(value) => {
          setRole(value as Role);
          handleChange("role", value as Role);
        }}
      />

      {(role === "client" || role === "supplier") &&
        <AuthTextField
          label="Company name"
          controlledValue={answersRef.current.company!}
          onChange={(value) => {
            handleChange("company", value);
            handleCompanySuggestions(value);
          }}
          suggestions={companySuggestions}
          onSuggestionClick={(value) => {
            handleChange("company", value);
          }}
        />}
    </>
  )
}

const StepTwo = ({ answersRef, handleChange }: StepTwoProps) => {
  return (
    <>
      <AuthTextField
        label="First Name"
        controlledValue={answersRef.current.firstName}
        onChange={(value) => handleChange("firstName", value)}
      />

      <AuthTextField
        label="Last Name"
        controlledValue={answersRef.current.lastName}
        onChange={(value) => handleChange("lastName", value)}
      />
    </>
  )
}

const StepThree = ({ answersRef, handleChange, confirmPassword, setConfirmPassword }: StepThreeProps) => {
  return (
    <>
      <AuthTextField
        label="Email Address"
        controlledValue={answersRef.current.email}
        onChange={(value) => handleChange("email", value)}
      />

      <AuthPasswordField
        label="Password"
        controlledValue={answersRef.current.password}
        onChange={(value) => handleChange("password", value)}
      />

      <AuthPasswordField
        label="Confirm Password"
        controlledValue={confirmPassword}
        onChange={(value) => setConfirmPassword(value)}
      />
    </>
  )
}

export default SignupPage;