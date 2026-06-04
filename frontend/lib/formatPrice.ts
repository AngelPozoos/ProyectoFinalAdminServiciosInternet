/**
 * Formatea un número como precio con comas cada tres cifras
 * @param price - El precio a formatear (puede ser string o number)
 * @returns String formateado como $X,XXX.XX
 */
export function formatPrice(price: string | number): string {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;

    if (isNaN(numPrice)) {
        return '$0.00';
    }

    return '$' + numPrice.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}
