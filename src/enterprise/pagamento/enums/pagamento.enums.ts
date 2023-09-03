export enum EstadoPagamento {
   PENDENTE = 0,
   CONFIRMADO = 1,
   REJEITADO = 2,
}

// Reverse mapping para permitir obter o enum a partir de seu valor
const estadoPagamentoReverseMapping: { [key: number]: EstadoPagamento } = {};
Object.keys(EstadoPagamento).forEach((key) => {
   const value = EstadoPagamento[key];
   if (typeof value === 'number') {
      estadoPagamentoReverseMapping[value] = EstadoPagamento[key];
   }
});

export function getEstadoPagamentoFromValue(value: number): EstadoPagamento | undefined {
   return estadoPagamentoReverseMapping[value];
}
