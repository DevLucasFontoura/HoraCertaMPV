import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';

import {
  FlipButton as FlipButtonPrimitive,
  FlipButtonFront as FlipButtonFrontPrimitive,
  FlipButtonBack as FlipButtonBackPrimitive,
  type FlipButtonProps as FlipButtonPrimitiveProps,
  type FlipButtonFrontProps as FlipButtonFrontPrimitiveProps,
  type FlipButtonBackProps as FlipButtonBackPrimitiveProps,
} from './primitives/buttons/flip';
import { getStrictContext } from '@/lib/get-strict-context';
import { buttonVariants } from './button';
import { cn } from '@/lib/utils';

type FlipButtonContextType = VariantProps<typeof buttonVariants>;

const [FlipButtonProvider, useFlipButton] =
  getStrictContext<FlipButtonContextType>('FlipButtonContext');

type FlipButtonProps = FlipButtonPrimitiveProps &
  VariantProps<typeof buttonVariants>;

function FlipButton({ variant, size, ...props }: FlipButtonProps) {
  return (
    <FlipButtonProvider value={{ variant, size }}>
      <FlipButtonPrimitive {...props} />
    </FlipButtonProvider>
  );
}

type FlipButtonFrontProps = FlipButtonFrontPrimitiveProps &
  VariantProps<typeof buttonVariants>;

function FlipButtonFront({
  variant,
  size,
  className,
  ...props
}: FlipButtonFrontProps) {
  const { variant: buttonVariant, size: buttonSize } = useFlipButton();
  const resolvedVariant = variant ?? buttonVariant;
  const resolvedSize = size ?? buttonSize;
  const classes =
    resolvedVariant !== undefined || resolvedSize !== undefined
      ? buttonVariants({
          variant: resolvedVariant,
          size: resolvedSize,
          className,
        })
      : cn(className);
  return (
    <FlipButtonFrontPrimitive
      className={classes}
      {...props}
    />
  );
}

type FlipButtonBackProps = FlipButtonBackPrimitiveProps &
  VariantProps<typeof buttonVariants>;

function FlipButtonBack({
  variant,
  size,
  className,
  ...props
}: FlipButtonBackProps) {
  const { variant: buttonVariant, size: buttonSize } = useFlipButton();
  const resolvedVariant = variant ?? buttonVariant;
  const resolvedSize = size ?? buttonSize;
  const classes =
    resolvedVariant !== undefined || resolvedSize !== undefined
      ? buttonVariants({
          variant: resolvedVariant,
          size: resolvedSize,
          className,
        })
      : cn(className);
  return (
    <FlipButtonBackPrimitive
      className={classes}
      {...props}
    />
  );
}

export {
  FlipButton,
  FlipButtonFront,
  FlipButtonBack,
  type FlipButtonProps,
  type FlipButtonFrontProps,
  type FlipButtonBackProps,
};
