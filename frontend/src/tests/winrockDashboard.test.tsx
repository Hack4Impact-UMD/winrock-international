import '@testing-library/jest-dom';

jest.mock('../dashboards/winrock-dashboard/projects/winrockDashboardService', () => ({
  getAllProjects: jest.fn(),
  updateProjectField: jest.fn(),
}));