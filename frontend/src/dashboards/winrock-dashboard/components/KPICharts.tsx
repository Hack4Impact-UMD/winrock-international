import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import styles from '../css-modules/KPICharts.module.css';
import ColorText from './ColorText';

type StatusType =
  | 'On Track'
  | 'At Risk'
  | 'Paused'
  | 'Completed'
  | 'Completed (except for risk)';

type AnalysisStageType =
  | 'Risk & Co-benefit Assessment'
  | 'GHG Assessment Analysis'
  | 'Confirming Final Requirements'
  | 'Clarifying Initial Project Information'
  | 'Complete, and Excluded'
  | 'Clarifying Technical Details';

interface KPIChartsProps {
  projects: {
    id: string;
    overallStatus: string;
    analysisStage: string;
  }[];
}

interface ChartData {
  name: string;
  value: number;
}

interface ChartSectionProps {
  title: string;
  data: ChartData[];
  colors: { [key: string]: string };
  variant: 'status' | 'analysis';
}
const STATUS_COLORS: { [key: string]: string } = {
  'On Track': '#E1EEFC',
  'At Risk': '#FAF0F3',
  'Paused': '#FCF4E1',
  'Completed': '#E1FCEF',
  'Completed (except for risk)': '#EDFCE1'
};

const ANALYSIS_COLORS: { [key: string]: string } = {
  'Risk & Co-benefit Assessment': '#F1DFFE',
  'GHG Assessment Analysis': '#FEDFF5',
  'Confirming Final Requirements': '#DFE9FE',
  'Clarifying Initial Project Information': '#DFF8FE',
  'Complete, and Excluded': '#DFFEE5',
  'Clarifying Technical Details': '#FBFFC7'
};

const KPICharts: React.FC<KPIChartsProps> = ({ projects }) => {
  //need to keep track of each for now (may change later based on how data is stored??)
  const countData = (data: KPIChartsProps['projects'], key: keyof KPIChartsProps['projects'][0]): ChartData[] => {
    const counts = data.reduce((acc, item) => {
      acc[item[key]] = (acc[item[key]] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const statusData = useMemo(() => countData(projects, 'overallStatus'), [projects]);
  const analysisData = useMemo(() => countData(projects, 'analysisStage'), [projects]);

  //using the rechart library to render the pie chart
  const renderPieChart = (data: ChartData[], colors: { [key: string]: string }) => (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={45}
          outerRadius={70}
          dataKey="value"
          stroke="none"
          isAnimationActive={false}
          label={false}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={colors[entry.name] || '#9CA3AF'} />
          ))}
        </Pie>
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#333">
          Total
        </text>
      </PieChart>
    </ResponsiveContainer>
  );



  const renderLegend = (data: ChartData[], variant: 'status' | 'analysis', colors: { [key: string]: string }) => (
    <div className={styles.legendContainer}>
      {data.map((entry, index) => (
        <div key={index} className={styles.legendItem}>
          <span className={styles.colorBox} style={{ backgroundColor: colors[entry.name] }} />
          <ColorText
            text={entry.name}
            category={entry.name as StatusType | AnalysisStageType}
            variant={variant}
          />        </div>
      ))}
    </div>
  );

  // chart layout
  const ChartSection = ({ title, data, colors, variant }: ChartSectionProps) => (
    <div className={styles.chartWrapper}>
      <h3 className={styles.chartTitle}>{title}</h3>
      <div className={styles.chartContent}>
        <div className={styles.pieChartSection}>
          {renderPieChart(data, colors)}
        </div>
        <div className={styles.legendSection}>
          {renderLegend(data, variant, colors)}
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.chartsContainer}>
      <ChartSection
        title="Overall Status"
        data={statusData}
        colors={STATUS_COLORS}
        variant="status"
      />
      <ChartSection
        title="Analysis stage"
        data={analysisData}
        colors={ANALYSIS_COLORS}
        variant="analysis"
      />
    </div>
  );
};

export default KPICharts;