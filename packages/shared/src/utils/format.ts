export const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return 'S/ 0.00';
  
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatPhoneNumber = (phone: string) => {
  // Formato Perú: 999 999 999
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }
  return phone;
};