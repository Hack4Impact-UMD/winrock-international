import { createProject, updateProjectField, deleteProject } from "./dashboards/dashboardService";

function App() {
  return (
    <>
      <button onClick={async () => {
        const result = await createProject("Project1", "apple", "Acids & Alkalis", "United States");
        console.log(result);
      }}>
        CREATE
      </button>

      <button onClick={async () => {
        const result = await updateProjectField("Project1", "kiwi", "spendCategory", "Animal Products");
        console.log(result);
      }}>
        UPDATE
      </button>

      <button onClick={async () => {
        const result = await deleteProject("Project1", "kiwi");
        console.log(result);
      }}>
        DELETE
      </button>
    </>
  )
}

export default App;