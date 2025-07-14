"use client"

import { useState, useEffect } from 'react'
import { CircularProgress, Alert } from '@mui/material'
import { HistoricoTable, HistoricoRecord } from '../../../../components/Table/historicoTable'
import { registroService, DayRecord } from '../../../../services/registroService'
import { TimeCalculationService } from '../../../../services/timeCalculationService'
import { useAuth } from '../../../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import BottomNav from '../../../../components/Menu/menu'
import { CONSTANTES } from '../../../../common/constantes'
import { FaHistory, FaArrowLeft } from 'react-icons/fa'
import { motion } from 'framer-motion'
import styles from './historico.module.css'

export default function Historico() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [historicoData, setHistoricoData] = useState<HistoricoRecord[]>([])
  const { userData } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const carregarHistorico = async () => {
      try {
        setLoading(true)
        setError('')
        
        // Buscar todos os registros
        const registros: DayRecord[] = await registroService.getAllRegistros()
        
        // Converter para o formato da tabela
        const dadosFormatados: HistoricoRecord[] = registros.map((registro, index) => {
          const entrada = registro.records.find(r => r.type === 'entry')?.time
          const saidaAlmoco = registro.records.find(r => r.type === 'lunchOut')?.time
          const retornoAlmoco = registro.records.find(r => r.type === 'lunchReturn')?.time
          const saida = registro.records.find(r => r.type === 'exit')?.time
          
          // Usar o serviço de cálculo de tempo para calcular horas trabalhadas
          const config = TimeCalculationService.getWorkTimeConfig(userData)
          const workTime = TimeCalculationService.calculateWorkTime(registro.records, config)
          
          return {
            id: `${registro.userId}_${registro.date}`,
            data: registro.date,
            entrada,
            saidaAlmoco,
            retornoAlmoco,
            saida,
            totalHoras: workTime.isComplete ? workTime.workedHours : undefined
          }
        })
        
        setHistoricoData(dadosFormatados)
      } catch (error) {
        console.error('Erro ao carregar histórico:', error)
        setError('Erro ao carregar histórico de registros')
      } finally {
        setLoading(false)
      }
    }

    carregarHistorico()
  }, [userData])

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.backgroundIcon}>
        <FaHistory size={200} color="rgba(0,0,0,0.10)" />
      </div>
      
      <motion.div 
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.header}>
          <button 
            className={styles.backButton}
            onClick={() => router.push(CONSTANTES.ROUTE_CONFIGURACAO)}
          >
            <FaArrowLeft size={20} />
          </button>
          <div>
            <h1 className={styles.title}>{CONSTANTES.TITULO_CONFIGURACAO_HISTORICO}</h1>
            <p className={styles.subtitle}>{CONSTANTES.SUBTITULO_CONFIGURACAO_HISTORICO}</p>
          </div>
        </div>

        <section className={styles.section}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <CircularProgress />
            </div>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : (
            <div className={styles.tableContainer}>
              <HistoricoTable 
                data={historicoData}
                showHeaderControls={true}
                pageSize={10}
              />
            </div>
          )}
        </section>
      </motion.div>
      
      <BottomNav />
    </div>
  )
}
