"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { CONSTANTES } from '../../common/constantes';
import styles from './popUpConfirmacao.module.css';
import { useState, useEffect } from 'react';


interface TimeConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (adjustedTime: Date) => void;
  currentTime: Date;
}

export default function TimeConfirmationModal({ 
  open, 
  onClose, 
  onConfirm, 
  currentTime 
}: TimeConfirmationModalProps) {
  const [timeValue, setTimeValue] = useState(
    currentTime.toLocaleTimeString(CONSTANTES.IDIOMA_PT_BR, { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    })
  );

  const handleConfirm = () => {
    const [hours, minutes] = timeValue.split(':').map(Number);
    const newDate = new Date(currentTime);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    newDate.setSeconds(0);
    onConfirm(newDate);
    onClose();
  };

  useEffect(() => {
    setTimeValue(currentTime.toLocaleTimeString(CONSTANTES.IDIOMA_PT_BR, { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    }));
  }, [currentTime]);

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
      <DialogTitle className={styles.dialogTitle}><strong>{CONSTANTES.TXT_POPUP_CONFIRMACAO_TITULO}</strong></DialogTitle>
      <DialogContent className={styles.dialogContent}>
        <p className={styles.modalText}>{CONSTANTES.TXT_POPUP_CONFIRMACAO_DESCRICAO}</p>
        
        <TextField
          type="time"
          value={timeValue}
          onChange={(e) => setTimeValue(e.target.value)}
          className={styles.timePicker}
          fullWidth
          variant="outlined"
          InputProps={{
            className: styles.timeInput,
            inputProps: {
              className: styles.timeInputField
            }
          }}
        />
      </DialogContent>
      <DialogActions className={styles.dialogActions}>
        <Button onClick={onClose} className={styles.cancelButton}>{CONSTANTES.TXT_POPUP_CONFIRMACAO_BOTAO_CANCELAR}</Button>
        <Button onClick={handleConfirm} variant="contained" className={styles.confirmButton}>{CONSTANTES.TXT_POPUP_CONFIRMACAO_BOTAO_CONFIRMAR}</Button>
      </DialogActions>
    </Dialog>
  );
}