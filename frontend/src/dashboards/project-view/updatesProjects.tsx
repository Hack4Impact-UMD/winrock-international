interface Project {
    id: string;
    project: string;
    clientName: string;
    supplierName: string;
    overallStatus: 'On Track' | 'At Risk' | 'Paused' | 'Completed' | 'Completed (except for risk)';
    analysisStage: 'Risk & Co-benefit Assessment' | 'GHG Assessment Analysis' | 'Confirming Final Requirements' | 'Clarifying Initial Project Information' | 'Complete, and Excluded' | 'Clarifying Technical Details';
    spendCategory: string;
    geography: string;
    lastUpdated: string;
    startDate: string;
    activityType: 'Renewable Energy and Energy Efficiency' | 'Agriculture' | 'Agroforestry' | 'Animal Agriculture and Manure Management';
    isActive: boolean;
  }

  const sampleProjects: Project[] = [
    {
      id: "Project1",
      project: 'Nestlé',
      clientName: 'Philipp Navratil',
      supplierName: 'Cargill',
      overallStatus: 'On Track',
      analysisStage: 'Clarifying Technical Details',
      spendCategory: 'Cereals & Grains',
      geography: 'United States of America',
      lastUpdated: '6 days',
      startDate: '03/15/2023',
      activityType: 'Renewable Energy and Energy Efficiency',
      isActive: true
    },
    {
      id: "Project2",
      project: 'McCormick',
      clientName: 'Brendan Foley',
      supplierName: 'Orange',
      overallStatus: 'At Risk',
      analysisStage: 'Clarifying Initial Project Information',
      spendCategory: 'Commodities',
      geography: 'Sweden',
      lastUpdated: '30 days',
      startDate: '03/15/2025',
      activityType: 'Agriculture',
      isActive: true
    },
    {
        id: "Pixel",
        project: 'Pixel',
        clientName: 'Sundar Pichai',
        supplierName: 'Alphabet',
        overallStatus: 'At Risk',
        analysisStage: 'GHG Assessment Analysis',
        spendCategory: 'Acids & Alkali',
        geography: 'United States',
        lastUpdated: '9 days',
        startDate: '03/19/2025',
        activityType: 'Renewable Energy and Energy Efficiency',
        isActive: true
    },
    {
        id: "Microsoft",
        project: 'Copilot',
        clientName: 'Mustafa Suleyman',
        supplierName: 'Microsoft',
        overallStatus: 'Completed',
        analysisStage: 'GHG Assessment Analysis',
        spendCategory: 'Acids & Alkali',
        geography: 'United States',
        lastUpdated: '1 day',
        startDate: '04/23/2025',
        activityType: 'Renewable Energy and Energy Efficiency',
        isActive: true
    },
    {
        id: "CloudForce",
        project: 'Cloudforce',
        clientName: 'Husein Sharaf',
        supplierName: 'Microsoft',
        overallStatus: 'On Track',
        analysisStage: 'GHG Assessment Analysis',
        spendCategory: 'Acids & Alkali',
        geography: 'Singapore',
        lastUpdated: '9 days',
        startDate: '04/14/2025',
        activityType: 'Agriculture',
        isActive: true
    },
    {
        id: "Nike",
        project: 'Air Force 1',
        clientName: 'Elliott Hill',
        supplierName: 'Nike',
        overallStatus: 'Completed',
        analysisStage: 'Confirming Final Requirements',
        spendCategory: 'Acids & Alkali',
        geography: 'United States',
        lastUpdated: '7 days',
        startDate: '04/24/2025',
        activityType: 'Agriculture',
        isActive: true
    },
    {
      id: "Project3",
      project: 'Microsoft',
      clientName: 'Satya Nadella',
      supplierName: 'Kiwi',
      overallStatus: 'Paused',
      analysisStage: 'Confirming Final Requirements',
      spendCategory: 'Fruits & Berries',
      geography: 'Sweden',
      lastUpdated: '2 days',
      startDate: '03/15/2021',
      activityType: 'Agroforestry',
      isActive: true
    },
    {
      id: "Project4",
      project: 'WebMD',
      clientName: 'Robert Brisco',
      supplierName: 'Apple',
      overallStatus: 'Completed',
      analysisStage: 'Clarifying Initial Project Information',
      spendCategory: 'Commodities',
      geography: 'China',
      lastUpdated: '12 days',
      startDate: '03/15/2023',
      activityType: 'Animal Agriculture and Manure Management',
      isActive: true
    },
    {
      id: "Project5",
      project: 'Kellogg',
      clientName: 'Gary Pilnick',
      supplierName: 'Grape',
      overallStatus: 'Completed (except for risk)',
      analysisStage: 'Complete, and Excluded',
      spendCategory: 'Commodities',
      geography: 'Sweden',
      lastUpdated: '6 days',
      startDate: '03/15/2023',
      activityType: 'Renewable Energy and Energy Efficiency',
      isActive: true
    },
    {
      id: "Project6",
      project: 'Lululemon',
      clientName: 'Calvin McDonald',
      supplierName: 'Orange',
      overallStatus: 'On Track',
      analysisStage: 'Clarifying Initial Project Information',
      spendCategory: 'Coco',
      geography: 'Indonesia',
      lastUpdated: '42 days',
      startDate: '03/15/2019',
      activityType: 'Agriculture',
      isActive: true
    },
    {
      id: "Project7",
      project: 'Cheetos',
      clientName: 'Richard Montañez',
      supplierName: 'Orange',
      overallStatus: 'On Track',
      analysisStage: 'Risk & Co-benefit Assessment',
      spendCategory: 'Commodities',
      geography: 'South Africa',
      lastUpdated: '6 days',
      startDate: '03/15/2022',
      activityType: 'Agroforestry',
      isActive: true
    },
    {
      id: "Project8",
      project: 'Cheezits',
      clientName: 'Steve Cahillane',
      supplierName: 'Orange',
      overallStatus: 'Paused',
      analysisStage: 'Confirming Final Requirements',
      spendCategory: 'Spices',
      geography: 'Bangladesh',
      lastUpdated: '1 day',
      startDate: '03/15/2015',
      activityType: 'Animal Agriculture and Manure Management',
      isActive: true
    },
    {
      id: "Project9",
      project: 'Cheerios',
      clientName: 'Jeff Harmening',
      supplierName: 'Orange',
      overallStatus: 'Paused',
      analysisStage: 'Clarifying Initial Project Information',
      spendCategory: 'Electricity',
      geography: 'Sweden',
      lastUpdated: '6 days',
      startDate: '03/15/2022',
      activityType: 'Renewable Energy and Energy Efficiency',
      isActive: true
    },
    {
      id: "Project10",
      project: 'McCormick',
      clientName: 'Brendan Foley',
      supplierName: 'Orange',
      overallStatus: 'Paused',
      analysisStage: 'Risk & Co-benefit Assessment',
      spendCategory: 'Commodities',
      geography: 'Norway',
      lastUpdated: '6 days',
      startDate: '03/15/2023',
      activityType: 'Agriculture',
      isActive: true
    },
    {
      id: "Project11",
      project: 'Tesla',
      clientName: 'Elon Musk',
      supplierName: 'Lithium Corp',
      overallStatus: 'At Risk',
      analysisStage: 'GHG Assessment Analysis',
      spendCategory: 'Electricity',
      geography: 'Australia',
      lastUpdated: '15 days',
      startDate: '04/01/2023',
      activityType: 'Agroforestry',
      isActive: true
    },
    {
      id: "Project12",
      project: 'Starbucks',
      clientName: 'Brian Niccol',
      supplierName: 'Coffee Beans Co',
      overallStatus: 'On Track',
      analysisStage: 'Confirming Final Requirements',
      spendCategory: 'Commodities',
      geography: 'Brazil',
      lastUpdated: '3 days',
      startDate: '02/28/2024',
      activityType: 'Animal Agriculture and Manure Management',
      isActive: true
    },
    {
      id: "Project13",
      project: 'Nike',
      clientName: 'Elliott Hill',
      supplierName: 'Cotton Express',
      overallStatus: 'Completed',
      analysisStage: 'Complete, and Excluded',
      spendCategory: 'Textiles',
      geography: 'India',
      lastUpdated: '20 days',
      startDate: '01/15/2023',
      activityType: 'Renewable Energy and Energy Efficiency',
      isActive: true
    },
    {
      id: "Project14",
      project: 'Samsung',
      clientName: 'Jun Young-hyun',
      supplierName: 'Green Energy Ltd',
      overallStatus: 'Completed (except for risk)',
      analysisStage: 'Risk & Co-benefit Assessment',
      spendCategory: 'Electronics',
      geography: 'South Korea',
      lastUpdated: '8 days',
      startDate: '03/10/2024',
      activityType: 'Agriculture',
      isActive: true
    },
    {
      id: "Project15",
      project: 'Unilever',
      clientName: 'Fernando Fernández',
      supplierName: 'Palm Oil Inc',
      overallStatus: 'At Risk',
      analysisStage: 'Clarifying Initial Project Information',
      spendCategory: 'Oils & Fats',
      geography: 'Malaysia',
      lastUpdated: '4 days',
      startDate: '03/20/2024',
      activityType: 'Agroforestry',
      isActive: true
    }
  ];
  
export default sampleProjects;