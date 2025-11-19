export const PAYMENT_METHODS = {
  YAPE: 'yape',
  PLIN: 'plin',
  BCP: 'bcp',
  INTERBANK: 'interbank',
  BBVA: 'bbva'
} as const;

export const ORDER_STATUS = {
  PENDING: 'pending',       // Recién creada, stock reservado
  PROCESSING: 'processing', // Pago subido, esperando revisión
  VERIFIED: 'verified',     // Pago aprobado, venta confirmada
  REJECTED: 'rejected',     // Pago rechazado, stock liberado
  SHIPPED: 'shipped',       // En camino (Agencia o Motorizado)
  COMPLETED: 'completed',   // Entregado
  CANCELLED: 'cancelled'    // Cancelado por usuario o timeout
} as const;

export const SHIPPING_MODES = {
  ACARREO_AGENCIA: 'acarreo_agencia', // Provincia (Shalom/Marvisur)
  ENVIO_DIRECTO: 'envio_directo',     // Lima (Indrive/Taxi)
  PICKUP: 'pickup'                    // Recojo en almacén
} as const;

export const SHIPPING_SCOPES = {
  LIMA_CALLAO: 'lima_callao',
  PROVINCIA: 'provincia'
} as const;

export const CUSTOMER_TYPES = {
  PERSONA: 'persona_natural',
  EMPRESA: 'empresa'
} as const;