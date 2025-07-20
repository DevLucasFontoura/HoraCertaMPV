"use client";

import { FaInstagram, FaTwitter, FaLinkedin, FaFacebook, FaYoutube } from 'react-icons/fa';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { CONSTANTES } from '../../common/constantes';
import styles from './footer.module.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState('');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  const footerSections = {
    empresa: {
      title: 'Empresa',
      links: [
        { text: 'Sobre', href: CONSTANTES.ROUTE_SOBRE },
        { text: 'Como Funciona', href: CONSTANTES.ROUTE_COMO_FUNCIONA },
        { text: 'Recursos', href: CONSTANTES.ROUTE_RECURSOS },
      ],
    },
    legal: {
      title: 'Legal',
      links: [
        { text: 'Termos de Uso', href: CONSTANTES.ROUTE_TERMOS_DE_USO },
        { text: 'Política de Privacidade', href: CONSTANTES.ROUTE_CONFIGURACAO_POLITICA },
        { text: 'Segurança', href: CONSTANTES.ROUTE_SEGURANCA },
      ],
    },
    suporte: {
      title: 'Suporte',
      links: [
        { text: 'Central de Ajuda', href: CONSTANTES.ROUTE_CENTRAL_DE_AJUDA },
        { text: 'Perguntas Frequentes', href: CONSTANTES.ROUTE_CONFIGURACAO_PERGUNTAS },
        { text: 'Blog', href: '/blog' },
      ],
    },
    produto: {
      title: 'Produto',
      links: [
        { text: 'Preços', href: CONSTANTES.ROUTE_PRECOS },
        { text: 'Tutorial', href: CONSTANTES.ROUTE_CONFIGURACAO_TUTORIAL },
        { text: 'Sobre o App', href: CONSTANTES.ROUTE_CONFIGURACAO_SOBRE },
      ],
    },
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerBrand}>
          <Link className={styles.logo} href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '1.25rem' }}>
            <AiOutlineClockCircle size={24} />
            {CONSTANTES.TITULO_SITE}
          </Link>
        </div>

        <div className={styles.footerLinks}>
          {Object.entries(footerSections).map(([key, section]) => (
            <div key={key} className={styles.footerSection}>
              <h3>{section.title}</h3>
              <ul>
                {section.links.map((link, index) => (
                  <li key={index}>
                    <a href={link.href}>{link.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.socialLinks}>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.footerBottomContent}>
          <div className={styles.copyright}>
            © {currentYear} Hora Certa
          </div>
          <div className={styles.bottomLinks}>
            <button className={styles.languageButton}>
              🌐 Português
            </button>
            <a href={CONSTANTES.ROUTE_CONFIGURACAO_POLITICA}>Política de Privacidade</a>
            <a href={CONSTANTES.ROUTE_TERMOS_DE_USO}>Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 