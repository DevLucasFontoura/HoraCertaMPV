import { AiOutlineClockCircle, AiOutlineArrowLeft } from 'react-icons/ai';
import { useNavigate, Link } from 'react-router-dom';
import { CONSTANTES } from '../common/constantes';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';
import styles from './login.module.css';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Tenta fazer login com Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Se chegou aqui, login foi bem sucedido
      const token = await userCredential.user.getIdToken();
      
      // Salva o token no localStorage
      localStorage.setItem('token', token);
      
      // Salva o email do usuário
      localStorage.setItem('userEmail', email);
      
      // Redireciona para BemVindo ao invés de Home
      navigate(CONSTANTES.ROUTE_BEM_VINDO);
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      
      // Tratamento de erros específicos do Firebase
      switch (error.code) {
        case 'auth/user-not-found':
          setError('Usuário não encontrado');
          break;
        case 'auth/wrong-password':
          setError('Senha incorreta');
          break;
        case 'auth/invalid-email':
          setError('Email inválido');
          break;
        case 'auth/user-disabled':
          setError('Usuário desativado');
          break;
        case 'auth/too-many-requests':
          setError('Muitas tentativas. Tente novamente mais tarde');
          break;
        default:
          setError('Erro ao fazer login. Tente novamente');
      }
      
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Link to={CONSTANTES.HOME} className={styles.backButton}>
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
          <Link to={CONSTANTES.REGISTRO} className={styles.link}>
            {CONSTANTES.TEXT_CRIAR_CONTA_GRATUITA}
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;