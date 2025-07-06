"use client";

import { AiOutlineClockCircle, AiOutlineArrowLeft } from 'react-icons/ai';
import { CONSTANTES } from '../common/constantes';
import styles from './login.module.css';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { AuthService } from '../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (email && password) {
        // Fazer login no Firebase
        const userCredential = await AuthService.loginUser(email, password);
        
        // Buscar dados do usuário no Firestore
        const userData = await AuthService.getUserData(userCredential.user.uid);
        
        if (userData) {
          // Salva dados do usuário no localStorage para compatibilidade
          localStorage.setItem('userEmail', userData.email);
          localStorage.setItem('userName', userData.name);
          localStorage.setItem('userData', JSON.stringify(userData));
          localStorage.setItem('userUid', userCredential.user.uid);
          
          // Redireciona para BemVindo
          window.location.href = '/bemvindo';
        } else {
          setError('Dados do usuário não encontrados. Tente novamente.');
        }
      } else {
        setError('Preencha todos os campos');
      }
    } catch (error: unknown) {
      console.error('Erro ao fazer login:', error);
      
      // Tratamento de erros específicos do Firebase
      if (error instanceof Error) {
        if (error.message.includes('auth/user-not-found')) {
          setError('Usuário não encontrado. Verifique seu email.');
        } else if (error.message.includes('auth/wrong-password')) {
          setError('Senha incorreta. Tente novamente.');
        } else if (error.message.includes('auth/invalid-email')) {
          setError('Email inválido. Verifique o formato.');
        } else if (error.message.includes('auth/too-many-requests')) {
          setError('Muitas tentativas. Tente novamente em alguns minutos.');
        } else {
          setError('Erro ao fazer login. Tente novamente.');
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
        
        <h1 className={styles.title}>{CONSTANTES.TITULO_LOGIN}</h1>
        <p className={styles.subtitle}>{CONSTANTES.SUBTITULO_LOGIN}</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <div className={styles.formGroup}>
            <label className={styles.label}>{CONSTANTES.TEXT_EMAIL_LOGIN}</label>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={CONSTANTES.PLACEHOLDER_EMAIL_LOGIN}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>{CONSTANTES.TEXT_SENHA_LOGIN}</label>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={CONSTANTES.PLACEHOLDER_SENHA_LOGIN}
              required
            />
          </div>

          <a href="#" className={styles.forgotPassword}>{CONSTANTES.TEXT_ESQUECEU_SUA_SENHA}</a>

          <button 
            className={styles.submitButton} 
            type="submit" 
            disabled={loading}
          >
            {loading ? CONSTANTES.TEXT_ENTRANDO : CONSTANTES.TEXT_BOTAO_LOGIN_DISABLED}
          </button>
        </form>

        <p className={styles.footer}>
          {CONSTANTES.TEXT_AINDA_NAO_TEM_CONTA}
          <Link href="/registro" className={styles.link}>
            {CONSTANTES.TEXT_CRIAR_CONTA_GRATUITA}
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;