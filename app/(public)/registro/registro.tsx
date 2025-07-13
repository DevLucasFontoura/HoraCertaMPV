"use client";

import { AiOutlineClockCircle, AiOutlineArrowLeft } from 'react-icons/ai';
import styles from './registro.module.css';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { CONSTANTES } from '../../common/constantes';
import Link from 'next/link';
import { AuthService, UserData } from '../../services/authService';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (name && email && password) {
        // Cria objeto com dados completos do usuário
        const userData: UserData = {
          createdAt: new Date().toISOString(),
          email: email,
          name: name,
          workHours: 8,
          lunchHours: 1,
          plan: 'free'
        };
        
        // Registrar usuário no Firebase
        const userCredential = await AuthService.registerUser(email, password, userData);
        
        // Salva dados do usuário no localStorage para compatibilidade
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', name);
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('userUid', userCredential.user.uid);
        
        // Redireciona para BemVindo
        window.location.href = CONSTANTES.ROUTE_BEM_VINDO;
      }
    } catch (error: unknown) {
      console.error('Erro no registro:', error);
      
      // Tratamento de erros específicos do Firebase
      if (error instanceof Error) {
        if (error.message.includes('auth/email-already-in-use')) {
          setError('Este email já está cadastrado. Tente fazer login.');
        } else if (error.message.includes('auth/weak-password')) {
          setError('A senha deve ter pelo menos 6 caracteres.');
        } else if (error.message.includes('auth/invalid-email')) {
          setError('Email inválido. Verifique o formato.');
        } else {
          setError('Erro ao criar conta. Tente novamente.');
        }
      } else {
        setError('Erro inesperado. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backButton}>
        <AiOutlineArrowLeft size={20} />
        <span>{CONSTANTES.TEXT_VOLTAR}</span>
      </Link>
      
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

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

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
              minLength={6}
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
          <Link href="/login" className={styles.link}>
            {CONSTANTES.TXT_REGISTRO_JA_TENHO_UMA_CONTA}
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;