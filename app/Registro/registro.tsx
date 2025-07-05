"use client";

import { AiOutlineClockCircle, AiOutlineArrowLeft } from 'react-icons/ai';
import styles from './registro.module.css';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { CONSTANTES } from '../common/constantes';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulação de registro (sem backend por enquanto)
      if (name && email && password) {
        // Simula delay de registro
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simula registro bem-sucedido
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', name);
        
        // Redireciona para BemVindo
        window.location.href = '/bemvindo';
      }
    } catch (error: any) {
      console.error('Erro no registro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <a href="/" className={styles.backButton}>
        <AiOutlineArrowLeft size={20} />
        <span>{CONSTANTES.TEXT_VOLTAR}</span>
      </a>
      
      <div className={styles.gradient} />
      <motion.div
        className={styles.formContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.logoContainer}>
          <AiOutlineClockCircle size={32} />
          <span className={styles.logoText}>{CONSTANTES.TITULO_SITE}</span>
        </div>
        
        <h1 className={styles.title}>{CONSTANTES.TITULO_REGISTRO}</h1>
        <p className={styles.subtitle}>{CONSTANTES.SUBTITULO_REGISTRO}</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>{CONSTANTES.TXT_REGISTRO_NOME_COMPLETO}</label>
            <input
              className={styles.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={CONSTANTES.TXT_REGISTRO_PLACEHOLDER_NOME}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>{CONSTANTES.TXT_REGISTRO_EMAIL}</label>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={CONSTANTES.TXT_REGISTRO_PLACEHOLDER_EMAIL}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>{CONSTANTES.TXT_REGISTRO_SENHA}</label>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={CONSTANTES.TXT_REGISTRO_PLACEHOLDER_SENHA}
              required
            />
          </div>

          <button 
            className={styles.submitButton} 
            type="submit" 
            disabled={loading}
          >
            {loading ? CONSTANTES.TXT_REGISTRO_CRIANDO_CONTA : CONSTANTES.TXT_REGISTRO_CRIAR_CONTA}
          </button>
        </form>

        <p className={styles.footer}>
          {CONSTANTES.TXT_REGISTRO_FOOTER}
          <a href="/login" className={styles.link}>
            {CONSTANTES.TXT_REGISTRO_JA_TENHO_UMA_CONTA}
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;