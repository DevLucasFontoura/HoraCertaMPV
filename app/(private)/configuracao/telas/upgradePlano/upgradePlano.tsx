"use client";

import { FaCrown, FaCheck, FaExternalLinkAlt, FaArrowLeft, FaStar, FaCreditCard } from 'react-icons/fa';
import { CONSTANTES } from '../../../../common/constantes';
import BottomNav from '../../../../components/Menu/menu';
import { useRouter } from 'next/navigation';
import styles from './upgradePlano.module.css';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import { AuthService, UserData } from '../../../../services/authService';

interface PlanInfo {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
  current?: boolean;
}

export default function UpgradePlanoScreen() {
  const router = useRouter();
  const { user, userData: authUserData, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);

  // Carregar dados do usuário quando o hook de autenticação estiver pronto
  useEffect(() => {
    if (authUserData) {
      setUserData(authUserData);
    }
  }, [authUserData]);

  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case 'free':
        return CONSTANTES.TEXT_PLANO_GRATUITO;
      case 'pro':
        return CONSTANTES.TEXT_PLANO_PRO;
      case 'enterprise':
        return CONSTANTES.TEXT_PLANO_EMPRESARIAL;
      default:
        return CONSTANTES.TEXT_PLANO_GRATUITO;
    }
  };

  const currentPlan = userData?.plan || 'free';
  
  const plans: PlanInfo[] = [
    {
      id: 'free',
      name: CONSTANTES.TEXT_PLANO_GRATUITO,
      price: 'R$ 0',
      period: '/mês',
      features: [
        'Registro de ponto básico',
        'Edição de horários (entrada/saída)',
        'Exportação em PDF',
        'Histórico básico'
      ],
      current: currentPlan === 'free'
    },
    {
      id: 'pro',
      name: CONSTANTES.TEXT_PLANO_PRO,
      price: 'R$ 10,90',
      period: '/mês',
      features: [
        'Tudo do plano Gratuito',
        'Edição completa de registros',
        'Histórico de alterações',
        'Exportação Excel/PDF',
        'Justificativas e anexos',
        'Validação por gestor'
      ],
      popular: true,
      current: currentPlan === 'pro'
    },
    {
      id: 'enterprise',
      name: CONSTANTES.TEXT_PLANO_EMPRESARIAL,
      price: 'Personalizado',
      period: '',
      features: [
        'Tudo do plano Pro',
        'Multi-empresas',
        'Edição e validação customizada',
        'Integrações personalizadas',
        'API completa',
        'Suporte dedicado'
      ],
      current: currentPlan === 'enterprise'
    }
  ];

  const handleUpgradeClick = (planId: string) => {
    if (planId === 'enterprise') {
      // Para plano empresarial, abrir email
      window.open(`mailto:${CONSTANTES.EMAIL_FALE_CONOSCO}?subject=Interesse no Plano Empresarial&body=Olá! Tenho interesse no plano empresarial do HoraCerta.`);
    } else {
      router.push(CONSTANTES.ROUTE_PRECOS);
    }
  };

  const handleBackClick = () => {
    router.push(CONSTANTES.ROUTE_CONFIGURACAO);
  };

  // Mostrar loading enquanto carrega dados de autenticação
  if (authLoading) {
    return (
      <div className={styles.containerWrapper}>
        <div className={styles.loadingState}>Carregando...</div>
        <BottomNav />
      </div>
    );
  }

  // Se não há dados do usuário, mostrar loading
  if (!userData) {
    return (
      <div className={styles.containerWrapper}>
        <div className={styles.loadingState}>Carregando dados do usuário...</div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.backgroundIcon}>
        <FaCreditCard size={200} color="rgba(0,0,0,0.03)" />
      </div>
      
      <motion.div 
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.header}>
          <button 
            className={styles.backButton}
            onClick={handleBackClick}
          >
            <FaArrowLeft size={20} />
          </button>
          <div>
            <h1 className={styles.title}>Gerenciar Plano</h1>
            <p className={styles.subtitle}>Escolha o plano ideal para suas necessidades</p>
          </div>
        </div>

        {/* Seção do Plano Atual */}
        <section className={styles.currentPlanSection}>
          <div className={styles.currentPlanHeader}>
            <FaCrown className={styles.currentPlanIcon} />
            <h2 className={styles.currentPlanTitle}>Seu plano atual:</h2>
            <p className={styles.currentPlanName}>
              {getPlanDisplayName(currentPlan)}
            </p>
          </div>
        </section>

        {/* Seção de Planos */}
        <section className={styles.plansSection}>
          <h2 className={styles.plansTitle}>Escolha seu plano</h2>
          <div className={styles.plansGrid}>
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                className={`${styles.planCard} ${plan.current ? styles.currentPlan : ''} ${plan.popular ? styles.popularPlan : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {plan.popular && (
                  <div className={styles.popularBadge}>
                    <FaStar size={12} />
                    Mais Popular
                  </div>
                )}
                
                {plan.current && (
                  <div className={styles.currentBadge}>
                    Plano Atual
                  </div>
                )}

                <div className={styles.planHeader}>
                  <h3 className={styles.planName}>{plan.name}</h3>
                  <div className={styles.planPrice}>
                    <span className={styles.price}>{plan.price}</span>
                    <span className={styles.period}>{plan.period}</span>
                  </div>
                </div>

                <div className={styles.planFeatures}>
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className={styles.planFeature}>
                      <FaCheck className={styles.checkIcon} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  className={`${styles.planButton} ${plan.current ? styles.currentPlanButton : ''}`}
                  onClick={() => handleUpgradeClick(plan.id)}
                  disabled={plan.current}
                >
                  {plan.current ? 'Plano Atual' : plan.id === 'enterprise' ? 'Falar com Vendas' : 'Escolher Plano'}
                  {!plan.current && <FaExternalLinkAlt size={14} />}
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Seção de Informações */}
        <section className={styles.infoSection}>
          <h3 className={styles.infoTitle}>Dúvidas sobre os planos?</h3>
          <p className={styles.infoDescription}>
            Entre em contato conosco para tirar suas dúvidas ou solicitar um orçamento personalizado.
          </p>
          <button 
            className={styles.contactButton}
            onClick={() => router.push(CONSTANTES.ROUTE_CONFIGURACAO_SUPORTE)}
          >
            Falar com Suporte
          </button>
        </section>
      </motion.div>
      
      <BottomNav />
    </div>
  );
}
