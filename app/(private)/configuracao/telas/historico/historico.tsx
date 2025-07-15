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
import { FaHistory, FaArrowLeft, FaPlus, FaTimes } from 'react-icons/fa'
import { motion } from 'framer-motion'
import styles from './historico.module.css'
import mobileStyles from './historicoMobile.module.css'

export default function Historico() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [registros, setRegistros] = useState<DayRecord[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    data: '',
    entrada: '',
    saidaAlmoco: '',
    retornoAlmoco: '',
    saida: ''
  })
  const [saving, setSaving] = useState(false)
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
    
    const resultado = {
      id: `${registro.userId}_${registro.date}`,
      data: dataFormatada,
      entrada,
      saidaAlmoco,
      retornoAlmoco,
      saida,
      totalHoras
    }
    
    return resultado
  }, [workConfig])

  // Memoizar os dados formatados
  const historicoData = useMemo(() => {
    const dadosProcessados = registros.map(processarRegistro)
    return dadosProcessados
  }, [registros, processarRegistro])

  // Verificar se já existe registro para a data selecionada
  const registroExistente = useMemo(() => {
    if (!formData.data) return null
    
    const [day, month, year] = formData.data.split('/')
    const dateString = `${year}-${month}-${day}`
    
    return registros.find(registro => registro.date === dateString)
  }, [formData.data, registros])

  // Função para recarregar os dados
  const recarregarDados = useCallback(async () => {
    try {
      const registrosData: DayRecord[] = await registroService.getAllRegistros()
      setRegistros(registrosData)
    } catch (error) {
      console.error('Erro ao recarregar dados:', error)
    }
  }, [])

  // Função para abrir formulário
  const abrirFormulario = () => {
    // Definir data atual como padrão
    const hoje = new Date()
    const dia = hoje.getDate().toString().padStart(2, '0')
    const mes = (hoje.getMonth() + 1).toString().padStart(2, '0')
    const ano = hoje.getFullYear().toString()
    
    setFormData({
      data: `${dia}/${mes}/${ano}`,
      entrada: '',
      saidaAlmoco: '',
      retornoAlmoco: '',
      saida: ''
    })
    setShowForm(true)
  }

  // Função para fechar formulário
  const fecharFormulario = () => {
    setShowForm(false)
    setFormData({
      data: '',
      entrada: '',
      saidaAlmoco: '',
      retornoAlmoco: '',
      saida: ''
    })
  }

  // Função para verificar se o formulário é válido
  const isFormValid = () => {
    return formData.data && (formData.entrada || formData.saidaAlmoco || formData.retornoAlmoco || formData.saida)
  }

  // Função para salvar registro
  const salvarRegistro = async () => {
    if (!isFormValid()) {
      return
    }

    try {
      setSaving(true)
      
      // Converter data do formato DD/MM/YYYY para YYYY-MM-DD
      const [day, month, year] = formData.data.split('/')
      const dateString = `${year}-${month}-${day}`
      
      await registroService.atualizarRegistroManual(
        dateString,
        formData.entrada || undefined,
        formData.saidaAlmoco || undefined,
        formData.retornoAlmoco || undefined,
        formData.saida || undefined
      )
      
      fecharFormulario()
      await recarregarDados()
    } catch (error: any) {
      console.error('Erro ao salvar registro:', error)
      
      // Exibir erro amigável para o usuário
      let errorMessage = 'Erro ao salvar registro.'
      
      if (error.message?.includes('Firebase não está configurado')) {
        errorMessage = 'Sistema não configurado. Entre em contato com o suporte técnico.'
      } else if (error.message?.includes('Sem conexão')) {
        errorMessage = 'Sem conexão com a internet. Verifique sua conexão e tente novamente.'
      } else if (error.message?.includes('permissão')) {
        errorMessage = 'Erro de permissão. Entre em contato com o suporte técnico.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      // Aqui você pode adicionar um toast ou alert para mostrar o erro
      alert(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  // Função para preencher formulário com dados de uma linha selecionada
  const preencherFormularioComLinha = (linha: z.infer<typeof historicoSchema>) => {
    const [day, month, year] = linha.data.split('/')
    setFormData({
      data: linha.data,
      entrada: linha.entrada || '',
      saidaAlmoco: linha.saidaAlmoco || '',
      retornoAlmoco: linha.retornoAlmoco || '',
      saida: linha.saida || ''
    })
    setShowForm(true)
  }

  useEffect(() => {
    const carregarHistorico = async () => {
      try {
        setLoading(true)
        setError('')
        
        // Buscar todos os registros
        const registrosData: DayRecord[] = await registroService.getAllRegistros()
        
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
    <>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
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
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '24px',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px',
                  cursor: 'pointer',
                  color: '#666',
                  transition: 'color 0.2s'
                }}
                onClick={() => router.push(CONSTANTES.ROUTE_CONFIGURACAO)}
              >
                <FaArrowLeft size={20} />
              </button>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#333', margin: 0 }}>
                  {CONSTANTES.TITULO_CONFIGURACAO_HISTORICO}
                </h1>
                <p style={{ fontSize: '0.875rem', color: '#666', margin: '4px 0 0 0' }}>
                  {CONSTANTES.SUBTITULO_CONFIGURACAO_HISTORICO}
                </p>
              </div>
            </div>
            <button 
              onClick={abrirFormulario}
              style={{
                backgroundColor: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                minWidth: 'fit-content'
              }}
            >
              <FaPlus size={16} />
              Adicionar Ponto
            </button>
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
                  pageSize={31}
                  onRowClick={preencherFormularioComLinha}
                />
              </div>
            )}

            {/* Modal do Formulário */}
            {showForm && (
              <div 
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                  padding: '20px'
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    padding: '24px',
                    width: '100%',
                    maxWidth: '500px',
                    maxHeight: '90vh',
                    overflowY: 'auto'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>Registrar Ponto Manual</h2>
                    <button
                      onClick={fecharFormulario}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '4px',
                        color: '#666'
                      }}
                    >
                      <FaTimes size={20} />
                    </button>
                  </div>
                  
                  <p style={{ 
                    margin: '0 0 20px 0', 
                    fontSize: '14px', 
                    color: '#666',
                    lineHeight: '1.5'
                  }}>
                    Preencha os horários que deseja registrar para a data selecionada. 
                    Se já existir um registro para esta data, ele será atualizado.
                  </p>
                  
                  {registroExistente && (
                    <div style={{
                      backgroundColor: '#f0f9ff',
                      border: '1px solid #0ea5e9',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      marginBottom: '16px',
                      fontSize: '12px',
                      color: '#0369a1'
                    }}>
                      ℹ️ Já existe um registro para {formData.data}. Os dados serão atualizados.
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Data */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                        Data do Registro *
                      </label>
                      <input
                        type="date"
                        value={formData.data ? (() => {
                          const [day, month, year] = formData.data.split('/')
                          return `${year}-${month}-${day}`
                        })() : ''}
                        onChange={(e) => {
                          const date = new Date(e.target.value)
                          const day = date.getDate().toString().padStart(2, '0')
                          const month = (date.getMonth() + 1).toString().padStart(2, '0')
                          const year = date.getFullYear().toString()
                          setFormData(prev => ({ ...prev, data: `${day}/${month}/${year}` }))
                        }}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          fontSize: '14px',
                          backgroundColor: '#fff'
                        }}
                        required
                      />
                      <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                        Selecione a data para a qual deseja adicionar o registro de ponto
                      </small>
                    </div>

                    {/* Entrada */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                        Horário de Entrada
                      </label>
                      <input
                        type="time"
                        value={formData.entrada}
                        onChange={(e) => setFormData(prev => ({ ...prev, entrada: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                        placeholder="Ex: 08:00"
                      />
                    </div>

                    {/* Saída Almoço */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                        Horário de Saída para Almoço
                      </label>
                      <input
                        type="time"
                        value={formData.saidaAlmoco}
                        onChange={(e) => setFormData(prev => ({ ...prev, saidaAlmoco: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                        placeholder="Ex: 12:00"
                      />
                    </div>

                    {/* Retorno Almoço */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                        Horário de Retorno do Almoço
                      </label>
                      <input
                        type="time"
                        value={formData.retornoAlmoco}
                        onChange={(e) => setFormData(prev => ({ ...prev, retornoAlmoco: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                        placeholder="Ex: 13:00"
                      />
                    </div>

                    {/* Saída */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                        Horário de Saída
                      </label>
                      <input
                        type="time"
                        value={formData.saida}
                        onChange={(e) => setFormData(prev => ({ ...prev, saida: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                        placeholder="Ex: 18:00"
                      />
                    </div>

                    {/* Botões */}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                      <button
                        onClick={fecharFormulario}
                        disabled={saving}
                        style={{
                          flex: 1,
                          padding: '12px',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          backgroundColor: '#fff',
                          color: saving ? '#ccc' : '#333',
                          cursor: saving ? 'not-allowed' : 'pointer',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={salvarRegistro}
                        disabled={saving || !isFormValid()}
                        style={{
                          flex: 1,
                          padding: '12px',
                          border: 'none',
                          borderRadius: '8px',
                          backgroundColor: saving ? '#ccc' : (isFormValid() ? '#000' : '#e5e5e5'),
                          color: '#fff',
                          cursor: (saving || !isFormValid()) ? 'not-allowed' : 'pointer',
                          fontSize: '14px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        {saving ? (
                          <>
                            <div style={{
                              width: '16px',
                              height: '16px',
                              border: '2px solid #fff',
                              borderTop: '2px solid transparent',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite'
                            }} />
                            Salvando...
                          </>
                        ) : (
                          'Salvar Registro'
                        )}
                      </button>
                    </div>
                    
                    {!isFormValid() && (
                      <div style={{
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        marginTop: '12px',
                        fontSize: '12px',
                        color: '#dc2626'
                      }}>
                        ⚠️ Preencha a data e pelo menos um horário para salvar o registro.
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </section>
        </motion.div>
        
        <BottomNav />
      </div>
    </>
  )
}
