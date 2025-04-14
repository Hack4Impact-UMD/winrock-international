import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Result from "../../types/Result";
import { type Role, handleSignup } from "../authService";

import AuthLogoHeader from "../components/AuthLogoHeader";
import AuthForm from "../components/AuthForm";
import AuthDropdownField from "../components/AuthDropdownField";
import AuthTextField from "../components/AuthTextField";
import AuthPasswordField from "../components/AuthPasswordField";
import AuthBottomLink from "../components/AuthBottomLink";

interface StepOneProps {
  role: Role | "";
  setRole: React.Dispatch<React.SetStateAction<Role | "">>;
  setCompany: React.Dispatch<React.SetStateAction<string>>;
}

interface StepTwoProps {
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
}

interface StepThreeProps {
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
}

function SignupPage() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [role, setRole] = useState<Role | "">("");
  const [company, setCompany] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleCreateAccount() {
    if (!email || !password || !firstName || !lastName || !role
        || password !== confirmPassword) return;

    const result: Result = await handleSignup({ email, password, firstName, lastName, role, company});
    if (result.success) {
      navigate("/dashboard");
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
          nextLabel={currentStep < 3 ? "Continue" : "Create Account"}
          onNext={() => {
            if (currentStep === 1) {
              setCurrentStep(currentStep + 1);
            } else if (currentStep === 2) {
              setCurrentStep(currentStep + 1);
            } else {
              handleCreateAccount();
            }
          }}
          afterChild={currentStep > 1 ?
            <AuthBottomLink
              beforeText="Already have an account?"
              linkLabel="Sign in"
              link="/login"
            />
          : undefined}
          remSpacing={[10, 10, 10]}
        >
        <>
          {currentStep === 1 &&
            <StepOne
              role={role}
              setRole={setRole}
              setCompany={setCompany}
            />}

          {currentStep === 2 &&
            <StepTwo
              setFirstName={setFirstName}
              setLastName={setLastName}
            />}

          {currentStep === 3 &&
            <StepThree
              setEmail={setEmail}
              setPassword={setPassword}
              setConfirmPassword={setConfirmPassword}
            />}
        </>
      </AuthForm>
    </>
  )
}

const StepOne = ({ role, setRole, setCompany }: StepOneProps) => {
  return (
    <>
      <AuthDropdownField
        label="What is your role?"
        blankOption="I am a..."
        options={["Client", "Supplier", "Winrock Employee"]}
        values={["client", "supplier", "admin"]}
        onSelect={(value) => setRole(value as Role)}
      />

      {(role === "client" || role === "supplier") &&
        <AuthTextField
          label="Company name"
          onChange={(value) => setCompany(value)}
        />}
    </>
  )
}

const StepTwo = ({ setFirstName, setLastName }: StepTwoProps) => {
  return (
    <>
      <AuthTextField
        label="First Name"
        onChange={(value) => setFirstName(value)}
      />

      <AuthTextField
        label="Last Name"
        onChange={(value) => setLastName(value)}
      />
    </>
  )
}

const StepThree = ({ setEmail, setPassword, setConfirmPassword }: StepThreeProps) => {
  return (
    <>
      <AuthTextField
        label="Email Address"
        onChange={(value) => setEmail(value)}
      />

      <AuthPasswordField
        label="Password"
        onChange={(value) => setPassword(value)}
      />

      <AuthPasswordField
        label="Confirm Password"
        onChange={(value) => setConfirmPassword(value)}
      />
    </>
  )
}

export default SignupPage;