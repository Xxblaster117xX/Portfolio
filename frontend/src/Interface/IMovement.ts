export interface Movement {
  movementId: number;
  reagentId: number; // <- más coherente con 'reagents'
  movementType: 'entrada' | 'salida'; // restringe a valores esperados
  movementQuantity: number;
  unit: string; // <- útil si manejas distintas unidades
  quantityBefore: number; // <- stock antes del movimiento
  quantityAfter: number;  // <- stock después del movimiento
  movementDate: string; // ISO 8601 como '2024-05-24T14:20:00Z'
  userId: number; // <- más limpio
  description?: string; // <- opcional, para comentarios
}
