"use client"

import { useState, useEffect, useMemo, useCallback } from 'react'
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
  const [registros, setRegistros] = useState<DayRecord[]>([])
  const { userData } = useAuth()
  const router = useRouter()
  const isMobile = useIsMobile()

  // Memoizar a configuração de trabalho
  const workConfig = useMemo(() => {
    return TimeCalculationService.getWorkTimeConfig(userData)
  }, [userData])

  // Função otimizada para processar um registro
  const processarRegistro = useCallback((registro: DayRecord) => {
    // Criar um mapa para evitar múltiplas operações find()
    const recordsMap = new Map()
    registro.records.forEach(record => {
      recordsMap.set(record.type, record.time)
    })
    
    const entrada = recordsMap.get('entry')
    const saidaAlmoco = recordsMap.get('lunchOut')
    const retornoAlmoco = recordsMap.get('lunchReturn')
    const saida = recordsMap.get('exit')
    
    // Calcular horas trabalhadas apenas se houver registros
    let totalHoras: number | undefined
    if (registro.records.length > 0) {
      const workTime = TimeCalculationService.calculateWorkTime(registro.records, workConfig)
      totalHoras = workTime.isComplete ? workTime.workedHours : undefined
    }
    
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
      totalHoras
    }
  }, [workConfig])

  // Memoizar os dados formatados
  const historicoData = useMemo(() => {
    return registros.map(processarRegistro)
  }, [registros, processarRegistro])

  useEffect(() => {
    const carregarHistorico = async () => {
      try {
        setLoading(true)
        setError('')
        
        // Buscar todos os registros
        const registrosData: DayRecord[] = await registroService.getAllRegistros()
        console.log('Registros carregados do Firebase:', registrosData.length)
        
        setRegistros(registrosData)
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
              {historicoData.length > 0 && (
                <HistoricoTable 
                  data={historicoData}
                  showHeaderControls={true}
                  pageSize={31}
                />
              )}
            </div>
          )}
        </section>
      </motion.div>
      
      <BottomNav />
    </div>
  )
}
