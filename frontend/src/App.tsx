import LogoHeader from "./components/LogoHeader";
import SectionHeader from "./components/SectionHeader";
import TitleHeader from "./components/TitleHeader";

function App() {
  return (
    // Example usage of header components
    <>
      <LogoHeader />
      <TitleHeader
        title="Risk and Co-Benefit Form"
        description="Some spiel about what this form is about and just to provide some further information about what’s happening?"
      />

      <SectionHeader label="Risk Assessment" />
    </>
  )
}

export default App;