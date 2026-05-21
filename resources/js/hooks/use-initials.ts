export function useInitials() {
    return (name: string): string => {
        return name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((word) => word.charAt(0).toUpperCase())
            .join('');
    };
}
