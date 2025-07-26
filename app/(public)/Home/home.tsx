"use client";

import { useState } from 'react';
import { AiOutlineClockCircle, AiOutlineEdit, AiOutlineFileText, AiOutlineMobile, AiOutlineSafety, AiOutlineTeam, AiOutlineMenu, AiOutlineClose, AiOutlineArrowRight, AiOutlineStar, AiOutlineCheck } from 'react-icons/ai';
import AnimatedClock from '../../components/AnimatedClock/AnimatedClock';
import { motion, AnimatePresence } from 'framer-motion';
import { CONSTANTES } from '../../common/constantes';
import DesktopMenu from '../../components/PublicMenu/DesktopMenu';
import BetaBadge from '../../components/BetaBadge';
import styles from './home.module.css';
import Link from 'next/link';

const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const features = [
    {
      icon: <AiOutlineClockCircle size={24} />,
      title: CONSTANTES.CARD_RECURSOS_01_TITULO,
      description: CONSTANTES.CARD_RECURSOS_01_SUBTITULO
    },
    {
      icon: <AiOutlineEdit size={24} />,
      title: CONSTANTES.CARD_RECURSOS_02_TITULO,
      description: CONSTANTES.CARD_RECURSOS_02_SUBTITULO
    },
    {
      icon: <AiOutlineFileText size={24} />,
      title: CONSTANTES.CARD_RECURSOS_03_TITULO,
      description: CONSTANTES.CARD_RECURSOS_03_SUBTITULO
    },
    {
      icon: <AiOutlineMobile size={24} />,
      title: CONSTANTES.CARD_RECURSOS_04_TITULO,
      description: CONSTANTES.CARD_RECURSOS_04_SUBTITULO
    },
    {
      icon: <AiOutlineSafety size={24} />,
      title: CONSTANTES.CARD_RECURSOS_05_TITULO,
      description: CONSTANTES.CARD_RECURSOS_05_SUBTITULO
    },
    {
      icon: <AiOutlineTeam size={24} />,
      title: CONSTANTES.CARD_RECURSOS_06_TITULO,
      description: CONSTANTES.CARD_RECURSOS_06_SUBTITULO
    }
  ];

  const benefits = [
    "Registro automático de ponto",
    "Relatórios detalhados",
    "Acesso em tempo real",
    "Interface intuitiva",
    "Suporte 24/7",
    "Conformidade legal"
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      role: "Desenvolvedora",
      company: "Freelancer",
      text: "O Hora Certa me ajudou a organizar melhor meus horários de trabalho. Agora tenho controle total do meu tempo.",
      rating: 5
    },
    {
      name: "João Santos",
      role: "Consultor",
      company: "Autônomo",
      text: "Simples, eficiente e confiável. Perfeito para quem trabalha por conta própria e precisa registrar suas horas.",
      rating: 5
    },
    {
      name: "Ana Costa",
      role: "Designer",
      company: "Remoto",
      text: "A melhor ferramenta que encontrei para controlar meu ponto. Interface limpa e fácil de usar.",
      rating: 5
    }
  ];

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <DesktopMenu />

        {/* Menu Mobile Button */}
        <motion.button 
          className={styles.mobileMenuButton}
          onClick={toggleMenu}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <AiOutlineClose size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <AiOutlineMenu size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </nav>

      {/* Badge Versão Beta */}
      <BetaBadge />

      {/* Menu Mobile - Movido para fora do navbar */}
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
              initial={{ x: '100vw' }}
              animate={{ x: 0 }}
              exit={{ x: '100vw' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            >
              {/* Header do menu */}
              <div className={styles.mobileMenuHeader}>
                <div className={styles.mobileMenuLogo}>
                  <AiOutlineClockCircle size={24} />
                  <span>Versão Beta</span>
                </div>
                <button
                  className={styles.mobileMenuCloseButton}
                  onClick={toggleMenu}
                >
                  <AiOutlineClose size={20} />
                </button>
              </div>
              
              <motion.div
                className={styles.mobileMenuContent}
                initial="closed"
                animate="open"
                variants={{
                  open: {
                    transition: { staggerChildren: 0.05 }
                  },
                  closed: {}
                }}
              >
                <motion.div variants={{
                  closed: { opacity: 0, y: 20 },
                  open: { opacity: 1, y: 0 }
                }}>
                  <Link className={styles.mobileNavLink} href="/recursos" onClick={toggleMenu}>
                    {CONSTANTES.TITULO_MENU_RECURSOS}
                  </Link>
                </motion.div>
                <motion.div variants={{
                  closed: { opacity: 0, y: 20 },
                  open: { opacity: 1, y: 0 }
                }}>
                  <Link className={styles.mobileNavLink} href="/precos" onClick={toggleMenu}>
                    {CONSTANTES.TITULO_MENU_PRECOS}
                  </Link>
                </motion.div>
                <motion.div variants={{
                  closed: { opacity: 0, y: 20 },
                  open: { opacity: 1, y: 0 }
                }}>
                  <Link className={styles.mobileNavLink} href="/como-funciona" onClick={toggleMenu}>
                    {CONSTANTES.TITULO_MENU_COMO_FUNCIONA}
                  </Link>
                </motion.div>
                <motion.div variants={{
                  closed: { opacity: 0, y: 20 },
                  open: { opacity: 1, y: 0 }
                }}>
                  <Link className={styles.mobilePrimaryButton} href="/login" onClick={toggleMenu}>
                    {CONSTANTES.TEXT_BOTAO_LOGIN}
                  </Link>
                </motion.div>
              </motion.div>
                
                {/* Footer do menu */}
                <div className={styles.mobileMenuFooter}>
                  <div className={styles.mobileMenuFooterText}>
                    <p>
                      <AiOutlineClockCircle size={16} />
                      Hora Certa
                    </p>
                    <span>Controle de ponto simplificado</span>
                  </div>
                </div>
              </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className={styles.hero}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AnimatedClock />
          </motion.div>
          <div className={styles.gradient} />
          <motion.h1 
            className={`${styles.heroTitle} courgette-regular`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {CONSTANTES.TITULO_PRINCIPAL}
          </motion.h1>
          
          <motion.p 
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {CONSTANTES.SUBTITULO_PRINCIPAL}
          </motion.p>
          <motion.div 
            className={styles.buttonGroup}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link className={styles.primaryButton} href="/registro">
                {CONSTANTES.BOTAO_COMECAR}
                <AiOutlineArrowRight size={16} style={{ marginLeft: '8px' }} />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <section className={styles.features} id="recursos">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className={styles.sectionTitle}>{CONSTANTES.TITULO_RECURSOS}</h2>
          <p className={styles.sectionSubtitle}>{CONSTANTES.SUBTITULO_RECURSOS}</p>
        </motion.div>
        
        <div className={styles.featureGrid}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={styles.featureCard}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -4 }}
            >
              <div className={styles.featureIcon}>
                {feature.icon}
              </div>
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorks}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className={styles.sectionTitle}>Como Funciona</h2>
          <p className={styles.sectionSubtitle}>Em apenas 3 passos simples, você estará registrando ponto de forma eficiente</p>
        </motion.div>

        <div className={styles.stepsContainer}>
          <motion.div
            className={styles.step}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className={styles.stepNumber}>1</div>
            <h3>Cadastre-se</h3>
            <p>Crie sua conta gratuitamente em menos de 2 minutos</p>
          </motion.div>

          <motion.div
            className={styles.step}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className={styles.stepNumber}>2</div>
            <h3>Configure</h3>
            <p>Personalize seus horários de trabalho e preferências</p>
          </motion.div>

          <motion.div
            className={styles.step}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className={styles.stepNumber}>3</div>
            <h3>Use</h3>
            <p>Comece a registrar seu ponto e acompanhar suas horas trabalhadas</p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefits}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className={styles.sectionTitle}>Por que escolher o Hora Certa?</h2>
          <p className={styles.sectionSubtitle}>Descubra os benefícios que fazem a diferença no seu dia a dia</p>
        </motion.div>

        <div className={styles.benefitsGrid}>
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className={styles.benefitItem}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <AiOutlineCheck size={20} className={styles.checkIcon} />
              <span>{benefit}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className={styles.sectionTitle}>O que nossos usuários dizem</h2>
          <p className={styles.sectionSubtitle}>Depoimentos de quem já transformou sua gestão de tempo</p>
        </motion.div>

        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className={styles.testimonialCard}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className={styles.stars}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <AiOutlineStar key={i} size={16} className={styles.star} />
                ))}
              </div>
              <p className={styles.testimonialText}>&ldquo;{testimonial.text}&rdquo;</p>
              <div className={styles.testimonialAuthor}>
                <strong>{testimonial.name}</strong>
                <span>{testimonial.role} • {testimonial.company}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className={styles.ctaContent}
        >
          <h2>Pronto para organizar seu tempo?</h2>
          <p>Junte-se a outros profissionais que já confiam no Hora Certa</p>
          <div className={styles.ctaButtons}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link className={styles.primaryButton} href="/registro">
                Começar Agora
                <AiOutlineArrowRight size={16} style={{ marginLeft: '8px' }} />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;