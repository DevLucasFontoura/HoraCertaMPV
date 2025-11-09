"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import styles from "./comentarios.module.css";

interface Testimonial {
  name: string;
  handle: string;
  review: string;
  avatar: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
  cardClassName?: string;
  avatarClassName?: string;
}

interface KineticTestimonialProps {
  testimonials?: Testimonial[];
  className?: string;
  cardClassName?: string;
  avatarClassName?: string;
  desktopColumns?: number;
  tabletColumns?: number;
  mobileColumns?: number;
  speed?: number;
  title?: string;
  subtitle?: string;
}

interface TestimonialWithId extends Testimonial {
  uniqueId: string;
}

const gradients = [
  "linear-gradient(180deg, rgba(236,72,153,0) 0%, rgba(236,72,153,0.25) 45%, rgba(168,85,247,0.65) 100%)",
  "linear-gradient(180deg, rgba(56,189,248,0) 0%, rgba(56,189,248,0.25) 45%, rgba(34,197,94,0.65) 100%)",
  "linear-gradient(180deg, rgba(147,51,234,0) 0%, rgba(236,72,153,0.25) 45%, rgba(239,68,68,0.7) 100%)",
  "linear-gradient(180deg, rgba(99,102,241,0) 0%, rgba(56,189,248,0.25) 45%, rgba(6,182,212,0.7) 100%)",
  "linear-gradient(180deg, rgba(249,115,22,0) 0%, rgba(249,115,22,0.25) 45%, rgba(244,63,94,0.7) 100%)",
  "linear-gradient(180deg, rgba(16,185,129,0) 0%, rgba(59,130,246,0.25) 45%, rgba(139,92,246,0.7) 100%)",
  "linear-gradient(180deg, rgba(244,114,182,0) 0%, rgba(217,70,239,0.25) 45%, rgba(99,102,241,0.7) 100%)",
  "linear-gradient(180deg, rgba(251,191,36,0) 0%, rgba(251,191,36,0.25) 45%, rgba(248,113,113,0.7) 100%)",
];

const TestimonialCard: React.FC<TestimonialCardProps> = React.memo(
  ({ testimonial, index, cardClassName = "", avatarClassName = "" }) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const gradient = gradients[index % gradients.length];

    return (
      <div
        className={styles.cardWrapper}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card
          className={cn(
            styles.card,
            isHovered && styles.cardHovered,
            cardClassName
          )}
        >
          <CardContent className={styles.cardContent}>
            <p className={styles.review}>"{testimonial.review}"</p>

            <div className={styles.authorRow}>
              <Avatar className={cn(styles.avatar, avatarClassName)}>
                <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                <AvatarFallback>
                  {testimonial.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className={styles.authorMeta}>
                <p
                  className={cn(
                    styles.authorName,
                    isHovered && styles.authorNameHovered
                  )}
                >
                  {testimonial.name}
                </p>
                <p
                  className={cn(
                    styles.authorHandle,
                    isHovered && styles.authorHandleHovered
                  )}
                >
                  {testimonial.handle}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
);

TestimonialCard.displayName = "TestimonialCard";

const KineticTestimonial: React.FC<KineticTestimonialProps> = ({
  testimonials = [],
  className = "",
  cardClassName = "",
  avatarClassName = "",
  desktopColumns = 6,
  tabletColumns = 3,
  mobileColumns = 2,
  speed = 1,
  title = "What developers are saying",
  subtitle = "Hear from the developer community about their experience with ScrollX-UI",
}) => {
  const [actualMobileColumns, setActualMobileColumns] = useState(mobileColumns);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 400) {
        setActualMobileColumns(1);
      } else {
        setActualMobileColumns(mobileColumns);
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, [mobileColumns]);

  const createColumns = useCallback(
    (numColumns: number) => {
      if (!testimonials || testimonials.length === 0) {
        return [];
      }

      const columns: TestimonialWithId[][] = [];
      const testimonialsPerColumn = 10;

      for (let i = 0; i < numColumns; i++) {
        const columnTestimonials: TestimonialWithId[] = [];

        for (let j = 0; j < testimonialsPerColumn; j++) {
          const testimonialIndex = (i * 11 + j * 3) % testimonials.length;
          columnTestimonials.push({
            ...testimonials[testimonialIndex],
            uniqueId: `${i}-${j}-${testimonialIndex}`,
          });
        }

        columns.push([...columnTestimonials, ...columnTestimonials]);
      }

      return columns;
    },
    [testimonials]
  );

  const desktopColumnsData = useMemo(
    () => createColumns(desktopColumns),
    [createColumns, desktopColumns]
  );
  const fiveColumnsData = useMemo(() => createColumns(5), [createColumns]);
  const fourColumnsData = useMemo(() => createColumns(4), [createColumns]);
  const tabletColumnsData = useMemo(
    () => createColumns(tabletColumns),
    [createColumns, tabletColumns]
  );
  const mobileColumnsData = useMemo(
    () => createColumns(actualMobileColumns),
    [createColumns, actualMobileColumns]
  );

  const renderColumn = useCallback(
    (
      columnTestimonials: TestimonialWithId[],
      colIndex: number,
      prefix: string,
      containerHeight: number
    ) => {
      const moveUp = colIndex % 2 === 0;
      const animationDuration = (40 + colIndex * 3) / speed;

      return (
        <div
          key={`${prefix}-${colIndex}`}
          className={styles.column}
          style={{ height: `${containerHeight}px` }}
        >
          <div
            className={cn(
              styles.columnInner,
              moveUp ? styles.scrollUp : styles.scrollDown
            )}
            style={{ animationDuration: `${animationDuration}s` }}
          >
            {columnTestimonials.map((testimonial, index) => (
              <TestimonialCard
                key={`${prefix}-${colIndex}-${testimonial.uniqueId}-${index}`}
                testimonial={testimonial}
                index={colIndex * 3 + index}
                cardClassName={cardClassName}
                avatarClassName={avatarClassName}
              />
            ))}
          </div>
        </div>
      );
    },
    [speed, cardClassName, avatarClassName]
  );

  return (
    <section className={cn(styles.section, className)}>
      <div className={styles.inner}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>

        {testimonials && testimonials.length > 0 && (
          <>
            <div className={cn(styles.columnsWrapper, styles.columnsDesktop)}>
              <div className={styles.fadeTop} />
              <div className={styles.fadeBottom} />
              {desktopColumnsData.map((columnTestimonials, colIndex) =>
                renderColumn(columnTestimonials, colIndex, "desktop", 780)
              )}
            </div>

            <div className={cn(styles.columnsWrapper, styles.columnsFive)}>
              <div className={styles.fadeTop} />
              <div className={styles.fadeBottom} />
              {fiveColumnsData.map((columnTestimonials, colIndex) =>
                renderColumn(columnTestimonials, colIndex, "five", 760)
              )}
            </div>

            <div className={cn(styles.columnsWrapper, styles.columnsFour)}>
              <div className={styles.fadeTop} />
              <div className={styles.fadeBottom} />
              {fourColumnsData.map((columnTestimonials, colIndex) =>
                renderColumn(columnTestimonials, colIndex, "four", 740)
              )}
            </div>

            <div className={cn(styles.columnsWrapper, styles.columnsTablet)}>
              <div className={styles.fadeTop} />
              <div className={styles.fadeBottom} />
              {tabletColumnsData.map((columnTestimonials, colIndex) =>
                renderColumn(columnTestimonials, colIndex, "tablet", 720)
              )}
            </div>

            <div className={cn(styles.columnsWrapper, styles.columnsMobile)}>
              <div className={styles.fadeTop} />
              <div className={styles.fadeBottom} />
              {mobileColumnsData.map((columnTestimonials, colIndex) =>
                renderColumn(columnTestimonials, colIndex, "mobile", 560)
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default KineticTestimonial;
