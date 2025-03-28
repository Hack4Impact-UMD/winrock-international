import LogoHeader from "./components/LogoHeader";
import TitleHeader from "./components/TitleHeader";

function App() {
  return (
    <>
      <LogoHeader />
      <TitleHeader
        title="Risk and Co-Benefit Form"
        description="Some spiel about what this form is about and just to provide some further information about what’s happening?"
      />
    </>
  )
}

export default App;