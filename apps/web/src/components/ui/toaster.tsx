'use client';

import { Toaster as SonnerToaster } from 'sonner';
import { useTheme } from 'next-themes';

export function Toaster() {
  const { theme } = useTheme();

  return (
    <SonnerToaster
      theme={theme as 'light' | 'dark' | 'system'}
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            'group toast glass-card border-border/50 text-foreground',
          description: 'text-muted-foreground',
          actionButton: 'bg-primary text-primary-foreground',
          cancelButton: 'bg-muted text-muted-foreground',
          success: 'border-health-500/50 bg-health-500/10',
          error: 'border-critical-500/50 bg-critical-500/10',
          warning: 'border-warning/50 bg-warning/10',
          info: 'border-ibmp-500/50 bg-ibmp-500/10',
        },
      }}
    />
  );
}

