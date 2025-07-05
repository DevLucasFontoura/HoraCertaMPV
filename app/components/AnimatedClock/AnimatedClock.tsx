"use client";

import styles from './AnimatedClock.module.css';
import { motion } from 'framer-motion';

interface AnimatedClockProps {
  width?: number;
  height?: number;
  className?: string;
}

const AnimatedClock = ({ width = 400, height = 400, className }: AnimatedClockProps) => {
  return (
    <motion.svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      className={`${styles.clockAnimation} ${className}`}
    >
      {/* Círculo externo do relógio */}
      <circle
        cx="50"
        cy="50"
        r="45"
        stroke="#f0f0f0"
        strokeWidth="2"
        fill="none"
      />
      
      {/* Ponteiro das horas */}
      <motion.line
        x1="50"
        y1="50"
        x2="50"
        y2="25"
        stroke="#ddd"
        strokeWidth="3"
        strokeLinecap="round"
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          originX: "50%",
          originY: "50%"
        }}
      />
      
      {/* Ponteiro dos minutos */}
      <motion.line
        x1="50"
        y1="50"
        x2="50"
        y2="20"
        stroke="#ddd"
        strokeWidth="2"
        strokeLinecap="round"
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          originX: "50%",
          originY: "50%"
        }}
      />
      
      {/* Ponteiro dos segundos */}
      <motion.line
        x1="50"
        y1="50"
        x2="50"
        y2="15"
        stroke="#ddd"
        strokeWidth="1"
        strokeLinecap="round"
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          originX: "50%",
          originY: "50%"
        }}
      />
    </motion.svg>
  );
};

export default AnimatedClock;