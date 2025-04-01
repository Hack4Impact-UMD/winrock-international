import { useState } from 'react';
import AgricultureProposalForm from './forms/project-proposal-forms/AgricultureProposalForm';
import RenewableProposalForm from './forms/project-proposal-forms/RenewableProposalForm';
import ForestryRisksForm from './forms/risks-and-co-benefit-forms/ForestryRisksForm';
import TechEnergyRisksForm from './forms/risks-and-co-benefit-forms/TechEnergyRisksForm';

// For testing purposes only
// Remove changes later
function App() {
  const [displayed, setDisplayed] = useState(formPortals);

  function formPortals() {
    return (
      <>
        <button onClick={() => setDisplayed(<AgricultureProposalForm />)}>
          AgricultureProposalForm
        </button>
        <button onClick={() => setDisplayed(<RenewableProposalForm />)}>
          RenewableProposalForm
        </button>
        <button onClick={() => setDisplayed(<ForestryRisksForm />)}>
          ForestryRisksForm
        </button>
      </>
    );
  }

  return (
    <>
      {displayed}
    </>
  );
}

export default App;