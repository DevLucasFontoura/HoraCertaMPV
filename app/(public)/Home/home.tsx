"use client";

import { AiOutlineArrowRight, AiOutlineCheck } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { CONSTANTES } from '../../common/constantes';
import DeskTopMenu from '../../components/Menus/PublicMenu/DeskTopMenu/deskTopMenu';
import MobileMenu from '../../components/Menus/PublicMenu/MobileMenu/mobileMenu';
import Hero from '../../components/Hero/hero';
import Recursos from '../../components/Recursos/recursos';
import ComoFunciona from '../../components/ComoFunciona/comoFunciona';
import BetaBadge from '../../components/BetaBadge';
import DotGrid from '../../components/DotGrid/dotGrid';
import Comentarios from '../../components/Comentarios/comentarios';
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
      handle: "Desenvolvedora • Freelancer",
      review: "O Hora Certa me ajudou a organizar melhor meus horários de trabalho. Agora tenho controle total do meu tempo.",
      avatar: ""
    },
    {
      name: "João Santos",
      handle: "Consultor • Autônomo",
      review: "Simples, eficiente e confiável. Perfeito para quem trabalha por conta própria e precisa registrar suas horas.",
      avatar: ""
    },
    {
      name: "Ana Costa",
      handle: "Designer • Remoto",
      review: "A melhor ferramenta que encontrei para controlar meu ponto. Interface limpa e fácil de usar.",
      avatar: ""
    },
    {
      name: "Fernanda Lopes",
      handle: "Analista Financeira • PME",
      review: "Os relatórios automáticos economizam horas do meu dia. Consigo acompanhar a equipe com muito mais clareza.",
      avatar: ""
    },
    {
      name: "Ricardo Pereira",
      handle: "Coordenador de Projetos • Startup",
      review: "Integração rápida, interface intuitiva e suporte sempre disponível. O Hora Certa virou parte essencial da nossa operação.",
      avatar: ""
    },
    {
      name: "Camila Rocha",
      handle: "Product Designer • Remoto",
      review: "Adoro como o sistema se adapta ao meu fluxo de trabalho e me lembra dos intervalos. A experiência é impecável.",
      avatar: ""
    }
  ];

  return (
    <div className={styles.container}>
      <DotGrid
        className={styles.dotGrid}
        dotSize={5}
        gap={15}
        baseColor="#d9d9d9"
        activeColor="#000000"
        proximity={120}
        shockRadius={250}
        shockStrength={5}
        resistance={750}
        returnDuration={1.5}
      />

      <div className={styles.content}>
        <nav className={styles.navbar}>
          <DeskTopMenu />
          <MobileMenu />
        </nav>

        {/* <BetaBadge /> */}
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

      <Comentarios
        testimonials={testimonials}
        title="O que nossos usuários dizem"
        subtitle="Depoimentos de quem já transformou sua gestão de tempo com o Hora Certa."
        desktopColumns={5}
        tabletColumns={3}
        mobileColumns={2}
        speed={1.2}
      />

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
    </div>
  );
};

export default LandingPage;