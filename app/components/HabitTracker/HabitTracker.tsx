"use client";

import styles from './HabitTracker.module.css';
import { motion } from 'framer-motion';

interface HabitTrackerProps {
  data: boolean[];
  title: string;
}

const HabitTracker = ({ data }: HabitTrackerProps) => {
  const totalDays = 31;
  const daysPerRow = 10;
  const totalRows = Math.ceil(totalDays / daysPerRow);

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {Array.from({ length: totalRows }).map((_, rowIndex) => (
          <div key={rowIndex} className={styles.week}>
            {Array.from({ length: daysPerRow }).map((_, dayIndex) => {
              const dayNumber = rowIndex * daysPerRow + dayIndex;
              const isValidDay = dayNumber < totalDays;
              const isActive = isValidDay ? data[dayNumber] : false;
              
              return isValidDay ? (
                <motion.div
                  key={dayIndex}
                  className={`${styles.day} ${styles.validDay} ${isActive ? styles.active : ''}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: dayNumber * 0.02 }}
                />
              ) : null;
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitTracker; 