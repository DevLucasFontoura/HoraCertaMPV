"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';

import styles from './configLayout.module.css';

export default function ConfigLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const configMenuItems = [
    { path: '/configuracao', label: 'Geral', icon: '⚙️' },
    { path: '/configuracao/perfil', label: 'Perfil', icon: '👤' },
    { path: '/configuracao/jornada', label: 'Jornada', icon: '⏰' },
    { path: '/configuracao/notificacoes', label: 'Notificações', icon: '🔔' },
    { path: '/configuracao/feriados', label: 'Feriados', icon: '📅' },
    { path: '/configuracao/perguntas', label: 'Perguntas', icon: '❓' },
    { path: '/configuracao/tutorial', label: 'Tutorial', icon: '📚' },
    { path: '/configuracao/sobre', label: 'Sobre', icon: 'ℹ️' },
    { path: '/configuracao/suporte', label: 'Suporte', icon: '🆘' },
    { path: '/configuracao/politica', label: 'Política', icon: '📋' },
  ];

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Configurações</h2>
        </div>
        <nav className={styles.sidebarNav}>
          {configMenuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`${styles.sidebarItem} ${
                pathname === item.path ? styles.active : ''
              }`}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
} 