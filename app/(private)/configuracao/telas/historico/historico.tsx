"use client"

import { useState, useEffect } from 'react'
import { CircularProgress, Alert } from '@mui/material'
import { HistoricoTable, historicoSchema } from '../../../../components/Table/historicoTable'
import { z } from 'zod'
import { registroService, DayRecord } from '../../../../services/registroService'
import { TimeCalculationService } from '../../../../services/timeCalculationService'
import { useAuth } from '../../../../hooks/useAuth'
import { useIsMobile } from '../../../../hooks/use-mobile'
import { useRouter } from 'next/navigation'
import BottomNav from '../../../../components/Menu/menu'
import { CONSTANTES } from '../../../../common/constantes'
import { FaHistory, FaArrowLeft } from 'react-icons/fa'
import { motion } from 'framer-motion'
import styles from './historico.module.css'
import mobileStyles from './historicoMobile.module.css'

export default function Historico() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [historicoData, setHistoricoData] = useState<z.infer<typeof historicoSchema>[]>([])
  const { userData } = useAuth()
  const router = useRouter()
  const isMobile = useIsMobile()

  useEffect(() => {
    const carregarHistorico = async () => {
      try {
        setLoading(true)
        setError('')
        
        // Buscar todos os registros
        const registros: DayRecord[] = await registroService.getAllRegistros()
        console.log('Registros carregados do Firebase:', registros.length)
        
        // Converter para o formato da tabela
        const dadosFormatados: z.infer<typeof historicoSchema>[] = registros.map((registro) => {
          const entrada = registro.records.find(r => r.type === 'entry')?.time
          const saidaAlmoco = registro.records.find(r => r.type === 'lunchOut')?.time
          const retornoAlmoco = registro.records.find(r => r.type === 'lunchReturn')?.time
          const saida = registro.records.find(r => r.type === 'exit')?.time
          
          // Usar o serviço de cálculo de tempo para calcular horas trabalhadas
          const config = TimeCalculationService.getWorkTimeConfig(userData)
          const workTime = TimeCalculationService.calculateWorkTime(registro.records, config)
          
          // Converter data do formato YYYY-MM-DD para DD/MM/YYYY
          const [year, month, day] = registro.date.split('-')
          const dataFormatada = `${day}/${month}/${year}`
          
          return {
            id: `${registro.userId}_${registro.date}`,
            data: dataFormatada,
            entrada,
            saidaAlmoco,
            retornoAlmoco,
            saida,
            totalHoras: workTime.isComplete ? workTime.workedHours : undefined
          }
        })
        
        console.log('Dados formatados para a tabela:', dadosFormatados.length)
        console.log('Primeiro registro:', dadosFormatados[0])
        setHistoricoData(dadosFormatados)
      } catch (error) {
        console.error('Erro ao carregar histórico:', error)
        setError('Erro ao carregar histórico de registros')
      } finally {
        setLoading(false)
      }
    }

    carregarHistorico()
  }, [])

  return (
    <div
      className={`${styles.containerWrapper} ${isMobile ? mobileStyles.containerWrapper : ''}`}
      style={isMobile ? { paddingLeft: 16, paddingRight: 16 } : {}}
    >
      <div className={`${styles.backgroundIcon} ${isMobile ? mobileStyles.backgroundIcon : ''}`}>
        <FaHistory size={200} color="rgba(0,0,0,0.10)" />
      </div>
      
      <motion.div 
        className={`${styles.container} ${isMobile ? mobileStyles.container : ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={`${styles.header} ${isMobile ? mobileStyles.header : ''}`}>
          <button 
            className={`${styles.backButton} ${isMobile ? mobileStyles.backButton : ''}`}
            onClick={() => router.push(CONSTANTES.ROUTE_CONFIGURACAO)}
          >
            <FaArrowLeft size={20} />
          </button>
          <div>
            <h1 className={`${styles.title} ${isMobile ? mobileStyles.title : ''}`}>{CONSTANTES.TITULO_CONFIGURACAO_HISTORICO}</h1>
            <p className={`${styles.subtitle} ${isMobile ? mobileStyles.subtitle : ''}`}>{CONSTANTES.SUBTITULO_CONFIGURACAO_HISTORICO}</p>
          </div>
        </div>

        <section className={`${styles.section} ${isMobile ? mobileStyles.section : ''}`}>
          {loading ? (
            <div className={`${styles.loadingContainer} ${isMobile ? mobileStyles.loadingContainer : ''}`}>
              <CircularProgress />
            </div>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : (
            <div 
              className={`${styles.tableContainer} ${isMobile ? mobileStyles.tableContainer : ''}`}
              style={{
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch'
              }}
            >
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
