interface UpdateItem {
    id: string;
    projectId: string;
    title: string;
    description?: string;
    timestamp: string;
    status: "received" | "sent" | "completed";
    canRequestInfo?: boolean;
    messages?: string[];
  }

const sampleUpdates: UpdateItem[] = [
    // Project 1 (Nestlé - Risk & Co-benefit Assessment)
    {
      id: "101",
      projectId: "Project1",
      title: "Risk assessment received from supplier",
      description: "Pending review from Cargill",
      timestamp: "2 days ago",
      status: "received",
      canRequestInfo: true
    },
    {
      id: "102",
      projectId: "Project1",
      title: "Co-benefit analysis submitted",
      timestamp: "4 days ago",
      status: "completed"
    },
  
    // Project 2 (McCormick - GHG Assessment Analysis)
    {
      id: "201",
      projectId: "Project2",
      title: "GHG data collection incomplete",
      description: "Missing Scope 3 emissions data",
      timestamp: "5 days ago",
      status: "received",
      canRequestInfo: true
    },
    {
      id: "202",
      projectId: "Project2",
      title: "Initial GHG report submitted",
      timestamp: "12 days ago",
      status: "sent"
    },
    // pixel
    {
        id: "201",
        projectId: "Pixel",
        title: "GHG data collection incomplete",
        description: "Missing Scope 3 emissions data",
        timestamp: "5 days ago",
        status: "received",
        canRequestInfo: true
      },
      {
        id: "202",
        projectId: "Pixel",
        title: "Initial GHG report submitted",
        timestamp: "12 days ago",
        status: "sent"
      },
      {
        id: "401",
        projectId: "Pixel",
        title: "Initial project scope clarified",
        timestamp: "19 days ago",
        status: "completed"
      },
      {
        id: "402",
        projectId: "Pixel",
        title: "Project kickoff meeting completed",
        timestamp: "21 days ago",
        status: "completed"
      },
  
    // Project 3 (Microsoft - Confirming Final Requirements)
    {
      id: "301",
      projectId: "Microsoft",
      title: "Final requirements document sent",
      description: "Awaiting Microsoft sign-off",
      timestamp: "1 day ago",
      status: "sent"
    },
    {
      id: "302",
      projectId: "Microsoft",
      title: "Technical specifications approved",
      timestamp: "3 days ago",
      status: "completed"
    },
  
    // Project 4 (WebMD - Clarifying Initial Project Information)
    {
      id: "401",
      projectId: "CloudForce",
      title: "Initial project scope clarified",
      timestamp: "2 days ago",
      status: "completed"
    },
    {
      id: "402",
      projectId: "CloudForce",
      title: "Project kickoff meeting completed",
      timestamp: "5 days ago",
      status: "completed"
    },
  
    // Project 5 (Kellogg - Complete, and Excluded)
    {
      id: "501",
      projectId: "Nike",
      title: "Final project audit completed",
      timestamp: "1 day ago",
      status: "completed"
    },
    {
      id: "502",
      projectId: "Nike",
      title: "Project excluded from active monitoring",
      timestamp: "3 days ago",
      status: "completed"
    },
  
    // Project 14 (Samsung - Risk & Co-benefit Assessment)
    {
      id: "1401",
      projectId: "Project14",
      title: "Supply chain risk assessment requested",
      description: "Due by 04/15/2024",
      timestamp: "2 days ago",
      status: "sent"
    },
    {
      id: "1402",
      projectId: "Project14",
      title: "Initial risk matrix submitted",
      timestamp: "5 days ago",
      status: "completed"
    }
  ];
  
export default sampleUpdates;