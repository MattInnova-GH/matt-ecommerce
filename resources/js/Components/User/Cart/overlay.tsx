interface OverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Overlay({ isOpen, onClose }: OverlayProps) {
    return (
        <div
            onClick={onClose}
            aria-hidden="true"
            className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ease-in-out ${
                isOpen
                    ? 'pointer-events-auto opacity-50'
                    : 'pointer-events-none opacity-0'
            }`}
        />
    );
}
