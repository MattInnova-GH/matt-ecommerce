export function useMobileNavigation(): () => void {
    const cleanup = () => {
        // Close any open mobile navigation drawers/sheets
        document.body.style.overflow = '';
    };

    return cleanup;
}
