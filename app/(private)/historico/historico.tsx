"use client"

import { useState, useEffect, useMemo, useCallback } from 'react'
import { CircularProgress, Alert } from '@mui/material'
import { HistoricoTable, historicoSchema } from '../../components/Table/historicoTable'
import { z } from 'zod'
import { registroService, DayRecord } from '../../services/registroService'
import { TimeCalculationService } from '../../services/timeCalculationService'
import { useAuth } from '../../hooks/useAuth'
import { useIsMobile } from '../../hooks/use-mobile'
import BottomNav from '../../components/Menu/menu'
import { FaHistory, FaTimes } from 'react-icons/fa'
import { motion } from 'framer-motion'
import styles from './historico.module.css';
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
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [linhaParaDeletar, setLinhaParaDeletar] = useState<string | null>(null);
  const [showFullTable, setShowFullTable] = useState(false);
  const { userData } = useAuth()
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
    } catch (e) {
      console.error('Erro ao recarregar dados:', e)
    }
  }, [])

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
    } catch (error: unknown) {
      console.error('Erro ao salvar registro:', error)
      
      // Exibir erro amigável para o usuário
      let errorMessage = 'Erro ao salvar registro.'
      
      if (error instanceof Error) {
        if (error.message?.includes('Firebase não está configurado')) {
          errorMessage = 'Sistema não configurado. Entre em contato com o suporte técnico.'
        } else if (error.message?.includes('Sem conexão')) {
          errorMessage = 'Sem conexão com a internet. Verifique sua conexão e tente novamente.'
        } else if (error.message?.includes('permissão')) {
          errorMessage = 'Erro de permissão. Entre em contato com o suporte técnico.'
        } else {
          errorMessage = error.message
        }
      }
      
      // Aqui você pode adicionar um toast ou alert para mostrar o erro
      alert(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  // Função para preencher formulário com dados de uma linha selecionada
  const preencherFormularioComLinha = (linha: z.infer<typeof historicoSchema>) => {
    setFormData({
      data: linha.data,
      entrada: linha.entrada || '',
      saidaAlmoco: linha.saidaAlmoco || '',
      retornoAlmoco: linha.retornoAlmoco || '',
      saida: linha.saida || ''
    })
    setShowForm(true)
  }

  // Função para limpar registros de uma data
  const limparRegistrosDaData = async () => {
    if (!formData.data) return;
    try {
      setSaving(true);
      // Converter data do formato DD/MM/YYYY para YYYY-MM-DD
      const [day, month, year] = formData.data.split('/');
      const dateString = `${year}-${month}-${day}`;
      await registroService.deletarRegistrosDaData(dateString);
      setShowConfirmDelete(false);
      fecharFormulario();
      await recarregarDados();
    } catch {
      alert('Erro ao limpar registros.');
    } finally {
      setSaving(false);
    }
  };

  // Função para deletar registro de uma linha
  const handleDeleteRow = (data: string) => {
    setLinhaParaDeletar(data);
  };

  // Cleanup effect para limpar modais quando componente for desmontado
  useEffect(() => {
    return () => {
      setShowForm(false);
      setShowConfirmDelete(false);
      setLinhaParaDeletar(null);
      setSaving(false);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const carregarHistorico = async () => {
      try {
        if (!isMounted) return;
        setLoading(true)
        setError('')
        
        // Buscar todos os registros
        const registrosData: DayRecord[] = await registroService.getAllRegistros()
        
        if (isMounted) {
          setRegistros(registrosData)
        }
      } catch (error) {
        if (isMounted) {
          console.error('Erro ao carregar histórico:', error)
          setError('Erro ao carregar histórico de registros')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    carregarHistorico()
    
    // Cleanup function para evitar vazamentos de memória
    return () => {
      isMounted = false;
    }
  }, [])

  return (
    <>
      <div className={styles.containerWrapper}>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <header className={styles.header}>
          <div>
            <motion.h1 
              className={styles.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Histórico
            </motion.h1>
            <motion.p 
              className={styles.subtitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
            >
              Acompanhe seus registros de ponto
            </motion.p>
          </div>
        </header>
        
        {/* Toggle de modo de visualização - apenas mobile */}
        {isMobile && (
          <motion.div 
            className={styles.viewModeToggle}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={styles.toggleContainer}>
              <span className={styles.toggleLabel}>
                {showFullTable ? 'Tabela Completa' : 'Versão Compacta'}
              </span>
              <button
                className={`${styles.toggleButton} ${showFullTable ? styles.toggleActive : ''}`}
                onClick={() => setShowFullTable(!showFullTable)}
                type="button"
              >
                <div className={styles.toggleSlider} />
              </button>
            </div>
          </motion.div>
        )}
        <div className={`${styles.backgroundIcon} ${isMobile ? mobileStyles.backgroundIcon : ''}`}>
          <FaHistory size={200} color="rgba(0,0,0,0.10)" />
        </div>
        <motion.div 
          className={`${styles.container} ${isMobile ? mobileStyles.container : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
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
                  className={`${styles.tableContainer} ${isMobile && !showFullTable ? mobileStyles.tableContainer : ''}`}
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
                    workConfig={workConfig}
                    onDeleteRow={handleDeleteRow}
                    forceTableMode={!isMobile || showFullTable}
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
                      {!formData.data && ' Selecione uma data para começar.'}
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
                            border: formData.data ? '1px solid #ddd' : '1px solid #dc2626',
                            borderRadius: '8px',
                            fontSize: '14px',
                            backgroundColor: '#fff'
                          }}
                          required
                        />
                        <small style={{ 
                          color: formData.data ? '#666' : '#dc2626', 
                          fontSize: '12px', 
                          marginTop: '4px', 
                          display: 'block' 
                        }}>
                          {formData.data 
                            ? 'Data selecionada para o registro de ponto'
                            : '⚠️ Selecione uma data para continuar'
                          }
                        </small>
                      </div>

                      {/* Entrada */}
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                          Horário de Entrada
                        </label>
                        <input
                          type="time"
                          value={formData.entrada || ''}
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
                          value={formData.saida || ''}
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
                          ⚠️ {!formData.data 
                            ? 'Selecione uma data para continuar.' 
                            : 'Preencha pelo menos um horário para salvar o registro.'
                          }
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
        {/* Modal de confirmação para limpar linha */}
        {linhaParaDeletar && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100
          }}>
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '400px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}>
              <p style={{ fontSize: '16px', marginBottom: '24px' }}>
                Tem certeza que deseja <b>limpar este registro</b>?<br />Esta ação não pode ser desfeita.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={() => setLinhaParaDeletar(null)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    color: '#333',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={async () => {
                    if (linhaParaDeletar) {
                      // Converter data do formato DD/MM/YYYY para YYYY-MM-DD
                      const [day, month, year] = linhaParaDeletar.split('/');
                      const dateString = `${year}-${month}-${day}`;
                      await registroService.deletarRegistrosDaData(dateString);
                      setLinhaParaDeletar(null);
                      await recarregarDados();
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: '#dc2626',
                    color: '#fff',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Limpar
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Modal de confirmação para limpar registros */}
        {showConfirmDelete && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100
          }}>
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '400px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}>
              <p style={{ fontSize: '16px', marginBottom: '24px' }}>
                Tem certeza que deseja <b>limpar todos os registros</b> deste dia?<br />Esta ação não pode ser desfeita.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    color: '#333',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={limparRegistrosDaData}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: '#dc2626',
                    color: '#fff',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Limpar
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }
