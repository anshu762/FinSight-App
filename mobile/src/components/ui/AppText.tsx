import React from 'react';
import { Text, type TextProps } from 'react-native';

export type TextVariant = 'title' | 'h2' | 'h3' | 'body' | 'caption';

export interface AppTextProps extends TextProps {
  variant?: TextVariant;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<TextVariant, string> = {
  title: 'text-[28px] leading-[34px] font-bold text-text',
  h2: 'text-[22px] leading-[28px] font-bold text-text',
  h3: 'text-[18px] leading-[24px] font-semibold text-text',
  body: 'text-[16px] leading-[22px] font-normal text-text',
  caption: 'text-[13px] leading-[18px] font-medium text-muted',
};

export const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  className = '',
  children,
  style,
  ...rest
}) => {
  return (
    <Text
      className={`${variantStyles[variant]} ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </Text>
  );
};
