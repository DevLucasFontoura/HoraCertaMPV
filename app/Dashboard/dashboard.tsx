import HabitTracker from '../components/HabitTracker/HabitTracker';
import BarChart from '../components/Graficos/graficoDeBarras';
import LineChart from '../components/Graficos/graficoDeLinha';
import { CONSTANTES } from '../common/constantes';
import BottomNav from '../components/Menu/menu';
import { useState, useEffect } from 'react';
import styles from './dashboard.module.css';
import { motion } from 'framer-motion';

interface DashboardData {
  weeklyHours: { data: number[]; labels: string[] } | null;
  monthlyComparison: { data: number[]; labels: string[] } | null;
  punchHistory: boolean[] | null;
  overtimeBank: { data: number[]; labels: string[] } | null;
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData] = useState<DashboardData>({
    weeklyHours: null,
    monthlyComparison: null,
    punchHistory: null,
    overtimeBank: null
  });

  useEffect(() => {
    // Função para buscar dados do dashboard (a ser implementada)
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Aqui virá a chamada real à API
        // const response = await api.getDashboardData();
        // setDashboardData(response);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const renderEmptyState = () => (
    <div className={styles.emptyState}>
      <p className={styles.emptyText}>Nenhum dado disponível</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <motion.h1 
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {CONSTANTES.TITULO_DASHBOARD}
          </motion.h1>
          <motion.p 
            className={styles.subtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
          >
            {CONSTANTES.SUBTITULO_DASHBOARD}
          </motion.p>
        </div>
      </header>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Carregando...</div>
        ) : (
          <div className={styles.grid}>
            <div className={styles.row}>
              <motion.section 
                className={styles.section}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className={styles.sectionTitle}>Horas Semanais</h2>
                <div className={styles.chartContainer}>
                  {dashboardData.weeklyHours ? (
                    <LineChart 
                      data={dashboardData.weeklyHours.data}
                      labels={dashboardData.weeklyHours.labels}
                      title="Horas Trabalhadas"
                    />
                  ) : renderEmptyState()}
                </div>
              </motion.section>

              <motion.section 
                className={styles.section}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className={styles.sectionTitle}>Comparativo Mensal</h2>
                <div className={styles.chartContainer}>
                  {dashboardData.monthlyComparison ? (
                    <BarChart 
                      data={dashboardData.monthlyComparison.data}
                      labels={dashboardData.monthlyComparison.labels}
                      title="Horas por Semana"
                    />
                  ) : renderEmptyState()}
                </div>
              </motion.section>
            </div>

            <div className={styles.row}>
              <motion.section 
                className={styles.section}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className={styles.sectionTitle}>Pontos Registrados</h2>
                <div className={styles.chartContainer}>
                  {dashboardData.punchHistory ? (
                    <HabitTracker 
                      data={dashboardData.punchHistory}
                      title="Pontos Registrados"
                    />
                  ) : renderEmptyState()}
                </div>
              </motion.section>

              <motion.section 
                className={styles.section}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className={styles.sectionTitle}>Banco de Horas</h2>
                <div className={styles.chartContainer}>
                  {dashboardData.overtimeBank ? (
                    <BarChart 
                      data={dashboardData.overtimeBank.data}
                      labels={dashboardData.overtimeBank.labels}
                      title="Banco de Horas"
                    />
                  ) : renderEmptyState()}
                </div>
              </motion.section>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Dashboard;