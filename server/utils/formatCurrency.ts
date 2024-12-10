export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount / 100);
}

export function parseCurrency(value: string): number {
  const numericValue = value.replace(/[^0-9.-]+/g, '');
  return Math.round(parseFloat(numericValue) * 100);
}
