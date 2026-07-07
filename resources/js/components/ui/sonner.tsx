import { useFlashToast } from '@/hooks/use-flash-toast';
import { useAppearance } from '@/hooks/use-appearance';
import { Toaster as Sonner  } from 'sonner';
import type {ToasterProps} from 'sonner';

function Toaster({ ...props }: ToasterProps) {
    const { appearance } = useAppearance();

    useFlashToast();

    return (
        <Sonner
            theme={appearance}
            className="toaster group"
            position="top-right"
            // El offset por defecto de sonner queda debajo del navbar fijo
            // (h-16 en movil/tablet, h-20 desde lg), por eso se separa el
            // toast para que no tape los iconos del navbar.
            offset={{ top: '6rem' }}
            mobileOffset={{ top: '5rem' }}
            style={
                {
                    '--normal-bg': 'var(--popover)',
                    '--normal-text': 'var(--popover-foreground)',
                    '--normal-border': 'var(--border)',
                } as React.CSSProperties
            }
            {...props}
        />
    );
}

export { Toaster };
