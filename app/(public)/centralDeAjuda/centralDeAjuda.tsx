"use client";

import MenuPublic from '../../components/PublicMenu/DesktopMenu';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { motion, AnimatePresence } from 'framer-motion';
import { CONSTANTES } from '../../common/constantes';
import Link from 'next/link';
import styles from './centralDeAjuda.module.css';
import { useState } from 'react';
import { FaLightbulb, FaClock, FaBell, FaHistory, FaCog, FaFileExport } from 'react-icons/fa';

const CentralDeAjuda = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const tips = [
    {
      icon: <FaClock size={30} />,
      title: CONSTANTES.DICA_01_TITULO,
      description: CONSTANTES.DICA_01_DESCRICAO
    },
    {
      icon: <FaBell size={30} />,
      title: CONSTANTES.DICA_02_TITULO,
      description: CONSTANTES.DICA_02_DESCRICAO
    },
    {
      icon: <FaHistory size={30} />,
      title: CONSTANTES.DICA_03_TITULO,
      description: CONSTANTES.DICA_03_DESCRICAO
    },
    {
      icon: <FaCog size={30} />,
      title: CONSTANTES.DICA_04_TITULO,
      description: CONSTANTES.DICA_04_DESCRICAO
    },
    {
      icon: <FaHistory size={30} />,
      title: CONSTANTES.DICA_05_TITULO,
      description: CONSTANTES.DICA_05_DESCRICAO
    },
    {
      icon: <FaFileExport size={30} />,
      title: CONSTANTES.DICA_06_TITULO,
      description: CONSTANTES.DICA_06_DESCRICAO
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const mailtoLink = `mailto:${CONSTANTES.EMAIL_SUPORTE}?subject=${encodeURIComponent(formData.assunto)}&body=${encodeURIComponent(
        `Nome: ${formData.nome}\nEmail: ${formData.email}\n\nMensagem:\n${formData.mensagem}`
      )}`;
      
      window.open(mailtoLink);
      setSubmitStatus('success');
      setFormData({ nome: '', email: '', assunto: '', mensagem: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <nav className={styles.navbar}>
        <MenuPublic />
        <motion.button 
          className={styles.mobileMenuButton}
          onClick={toggleMenu}
          animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isMobileMenuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
        </motion.button>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                className={styles.mobileMenuOverlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={toggleMenu}
              />
              <motion.div
                className={styles.mobileMenu}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
              >
                <motion.div
                  initial="closed"
                  animate="open"
                  variants={{
                    open: {
                      transition: { staggerChildren: 0.05 }
                    },
                    closed: {}
                  }}
                >
                  <Link className={styles.mobileNavLink} href={CONSTANTES.RECURSOS} onClick={toggleMenu}>{CONSTANTES.TITULO_MENU_RECURSOS}</Link>
                  <Link className={styles.mobileNavLink} href={CONSTANTES.PRECOS} onClick={toggleMenu}>{CONSTANTES.TITULO_MENU_PRECOS}</Link>
                  <Link className={styles.mobileNavLink} href={CONSTANTES.COMO_FUNCIONA} onClick={toggleMenu}>{CONSTANTES.TITULO_MENU_COMO_FUNCIONA}</Link>
                  <Link className={styles.mobilePrimaryButton} href={CONSTANTES.REGISTRO} onClick={toggleMenu}>{CONSTANTES.BOTAO_COMECAR}</Link>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>{CONSTANTES.TITULO_CENTRAL_DE_AJUDA}</h1>
            <p className={styles.subtitle}>{CONSTANTES.SUBTITULO_CENTRAL_DE_AJUDA}</p>
          </div>
        </section>

        <hr className={styles.sectionDivider} />

        <section className={styles.tipsSection}>
          <h2 className={styles.sectionTitle}>{CONSTANTES.DICAS_TITULO}</h2>
          <div className={styles.tipsGrid}>
            {tips.map((tip, index) => (
              <motion.div
                key={index}
                className={styles.tipCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={styles.tipIcon}>
                  {tip.icon}
                </div>
                <h3 className={styles.tipTitle}>{tip.title}</h3>
                <p className={styles.tipDescription}>{tip.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <hr className={styles.sectionDivider} />

        <section className={styles.contactSection}>
          <div className={styles.contactContent}>
            <h2 className={styles.sectionTitle}>{CONSTANTES.FORMULARIO_TITULO}</h2>
            <p className={styles.contactSubtitle}>{CONSTANTES.FORMULARIO_SUBTITULO}</p>
            
            <form className={styles.contactForm} onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="nome" className={styles.formLabel}>{CONSTANTES.FORM_NOME}</label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder={CONSTANTES.FORM_PLACEHOLDER_NOME}
                    className={styles.formInput}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.formLabel}>{CONSTANTES.FORM_EMAIL}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={CONSTANTES.FORM_PLACEHOLDER_EMAIL}
                    className={styles.formInput}
                    required
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="assunto" className={styles.formLabel}>{CONSTANTES.FORM_ASSUNTO}</label>
                <input
                  type="text"
                  id="assunto"
                  name="assunto"
                  value={formData.assunto}
                  onChange={handleInputChange}
                  placeholder={CONSTANTES.FORM_PLACEHOLDER_ASSUNTO}
                  className={styles.formInput}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="mensagem" className={styles.formLabel}>{CONSTANTES.FORM_MENSAGEM}</label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleInputChange}
                  placeholder={CONSTANTES.FORM_PLACEHOLDER_MENSAGEM}
                  className={styles.formTextarea}
                  rows={5}
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? CONSTANTES.FORM_ENVIANDO : CONSTANTES.FORM_BOTAO_ENVIAR}
              </button>
              
              {submitStatus === 'success' && (
                <div className={styles.successMessage}>
                  {CONSTANTES.FORM_SUCESSO}
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className={styles.errorMessage}>
                  {CONSTANTES.FORM_ERRO}
                </div>
              )}
            </form>
          </div>
        </section>
      </div>
    </>
  );
};

export default CentralDeAjuda; 