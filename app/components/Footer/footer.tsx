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
        { text: 'Sobre', href: '/sobre' },
        { text: 'Status', href: '/status' },
      ],
    },
    legal: {
      title: 'Legal',
      links: [
        { text: 'Termos de Uso', href: '/termos' },
        { text: 'Privacidade', href: '/privacidade' },
        { text: 'Segurança', href: '/seguranca' },
      ],
    },
    suporte: {
      title: 'Suporte',
      links: [
        { text: 'Central de Ajuda', href: '/ajuda' },
        { text: 'Comunidade', href: '/comunidade' },
        { text: 'Blog', href: '/blog' },
      ],
    },
    produto: {
      title: 'Produto',
      links: [
        { text: 'Preços', href: '/precos' },
        { text: 'Integrações', href: '/integracoes' },
        { text: 'Download App', href: '/mobile' },
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
            <a href="/privacidade">Não vender minhas informações</a>
            <a href="/cookies">Configurações de cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 