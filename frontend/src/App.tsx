import { useEffect, useState } from 'react'
import { getProjects, getProjectNamesContaining, getProjectsBetween, ProjectData } from './components/DashboardFunctions'

import './App.css'

function App() {
  
	const [projects, setProjects] = useState<ProjectData[]>([]);
	const [names, setNames] = useState<string[]>([]);

	useEffect(() => {
		const getData = async () => {
			setProjects(await getProjects("name", false, "geography", "USA"));
			//setProjects(await getProjectsBetween(new Date("2025-03-31"), new Date()))
			setNames(await getProjectNamesContaining("Ch"));
		};

		getData();
	}, []);

  return (
    <>
		<ul>
			{names.map((name) => <li>{name}</li>)}
		</ul>
	
      <table>
	  <tbody>
		{projects.map((project) => (
			
			<tr>
				<td>
					{project.name}
				</td>
				<td>
					{project.supplier}
				</td>
				<td>
					{project.startDate.toUTCString()}
				</td>
				<td>
					{project.creationDate.toUTCString()}
				</td>
				<td>
					{project.geography.map((country) => country + ";")}
				</td>
				<td>
					{project.overallStatus}
				</td>
				<td>
					{project.analysisStage}
				</td>
				<td>
					{project.spendingCategory1}
				</td>
			</tr>
		))}
		</tbody>
	  </table>
	  <button onClick={async () => setProjects(await getProjects("name", true))}>Refresh</button>
    </>
  )
}

export default App
