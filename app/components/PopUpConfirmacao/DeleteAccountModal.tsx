"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { FaExclamationTriangle } from 'react-icons/fa';
import styles from './popUpConfirmacao.module.css';
import { useState } from 'react';

interface DeleteAccountModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  isDeleting: boolean;
  error?: string | null;
}

export default function DeleteAccountModal({ 
  open, 
  onClose, 
  onConfirm, 
  isDeleting,
  error
}: DeleteAccountModalProps) {
  const [password, setPassword] = useState('');

  const handleConfirm = () => {
    onConfirm(password);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        className: styles.dialog
      }}
    >
      <DialogTitle className={styles.dialogTitle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
          <FaExclamationTriangle 
            size={28} 
            color="#dc3545" 
            className={styles.dangerIcon}
          />
          <span style={{ fontWeight: 700, fontSize: '1.4rem' }}>Excluir Conta</span>
        </div>
      </DialogTitle>
      
      <DialogContent className={styles.dialogContent}>
        <div style={{ textAlign: 'center', margin: '0 0 18px 0' }}>
          <span style={{ fontWeight: 600, color: '#dc3545', fontSize: '1.08rem' }}>Atenção! </span>
          <span style={{ color: '#444', fontWeight: 500 }}>Esta ação não pode ser desfeita.</span>
        </div>
        <div style={{ textAlign: 'center', color: '#666', fontSize: '1rem', marginBottom: 18 }}>
          Ao excluir sua conta, todos os seus dados serão perdidos permanentemente, incluindo:
        </div>
        <ul className={styles.dangerList} style={{ marginBottom: 18, marginTop: 0 }}>
          <li>Histórico de pontos registrados</li>
          <li>Configurações de jornada de trabalho</li>
          <li>Relatórios e estatísticas</li>
          <li>Dados do perfil</li>
        </ul>
        <div className={styles.dangerText} style={{ margin: '18px 0 0 0', fontSize: '1.08rem' }}>
          Tem certeza que deseja continuar?
        </div>
        <TextField
          type="password"
          label="Digite sua senha para confirmar"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          disabled={isDeleting}
        />
        {error && (
          <div style={{ color: '#dc3545', textAlign: 'center', marginTop: 8, fontWeight: 500 }}>
            {error}
          </div>
        )}
      </DialogContent>
      
      <DialogActions className={styles.dialogActions} style={{ justifyContent: 'center', paddingBottom: 24, paddingTop: 0 }}>
        <Button 
          onClick={onClose} 
          className={styles.cancelButton}
          disabled={isDeleting}
          style={{ minWidth: 120 }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          className={`${styles.confirmButton} ${styles.dangerConfirmButton}`}
          disabled={isDeleting || !password}
          style={{ minWidth: 180 }}
        >
          {isDeleting ? 'Excluindo...' : 'Sim, excluir conta'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 