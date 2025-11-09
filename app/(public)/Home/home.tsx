"use client";

import { AiOutlineArrowRight, AiOutlineStar, AiOutlineCheck } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { CONSTANTES } from '../../common/constantes';
import DeskTopMenu from '../../components/Menus/PublicMenu/DeskTopMenu/deskTopMenu';
import MobileMenu from '../../components/Menus/PublicMenu/MobileMenu/mobileMenu';
import Hero from '../../components/Hero/hero';
import Recursos from '../../components/Recursos/recursos';
import ComoFunciona from '../../components/ComoFunciona/comoFunciona';
import BetaBadge from '../../components/BetaBadge';
import styles from './home.module.css';
import Link from 'next/link';

const LandingPage = () => {
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
        <DeskTopMenu />
        <MobileMenu />
      </nav>

      <BetaBadge />
      <Hero/>
      <Recursos />
      <ComoFunciona />

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