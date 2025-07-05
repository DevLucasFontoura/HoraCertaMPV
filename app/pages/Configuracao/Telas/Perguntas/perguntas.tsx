
import { FaArrowLeft, FaChevronDown } from 'react-icons/fa';
import { CONSTANTES } from '../../../../common/constantes';
import BottomNav from '../../../../components/Menu/menu';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from './perguntas.module.css';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {question: CONSTANTES.PERGUNTA_01, answer: CONSTANTES.PERGUNTA_01_RESPOSTA},
  {question: CONSTANTES.PERGUNTA_02, answer: CONSTANTES.PERGUNTA_02_RESPOSTA},
  {question: CONSTANTES.PERGUNTA_03, answer: CONSTANTES.PERGUNTA_03_RESPOSTA},
  {question: CONSTANTES.PERGUNTA_04, answer: CONSTANTES.PERGUNTA_04_RESPOSTA},
  {question: CONSTANTES.PERGUNTA_05, answer: CONSTANTES.PERGUNTA_05_RESPOSTA},
  {question: CONSTANTES.PERGUNTA_06, answer: CONSTANTES.PERGUNTA_06_RESPOSTA},
  {question: CONSTANTES.PERGUNTA_07, answer: CONSTANTES.PERGUNTA_07_RESPOSTA},
];

interface AccordionItemProps {
  item: FAQItem;
  isOpen: boolean;
  onPress: () => void;
}

const AccordionItem = ({ item, isOpen, onPress }: AccordionItemProps) => {
  return (
    <div className={styles.accordionItem}>
      <button 
        className={styles.questionContainer} 
        onClick={onPress}
      >
        <span className={styles.question}>{item.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown size={16} />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.answerContainer}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className={styles.answer}>{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FAQScreen() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.backgroundIcon}>
        <FaChevronDown size={200} color="rgba(0,0,0,0.03)" />
      </div>
      
      <motion.div 
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.header}>
          <button 
            className={styles.backButton}
            onClick={() => navigate(CONSTANTES.ROUTE_CONFIGURACAO)}
          >
            <FaArrowLeft size={20} />
          </button>
          <div>
            <h1 className={styles.title}>{CONSTANTES.TITULO_PERGUNTAS_FREQUENTES}</h1>
            <p className={styles.subtitle}>{CONSTANTES.SUBTITULO_PERGUNTAS_FREQUENTES}</p>
          </div>
        </div>

        <div className={styles.faqContainer}>
          {faqData.map((item, index) => (
            <AccordionItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onPress={() => toggleAccordion(index)}
            />
          ))}
        </div>
      </motion.div>
      
      <BottomNav />
    </div>
  );
}