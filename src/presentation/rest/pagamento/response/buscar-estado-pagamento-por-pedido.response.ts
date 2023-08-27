import { ApiProperty } from '@nestjs/swagger';
import { EstadoPagamento } from 'src/enterprise/pagamento/enums/pagamento.enums';
import { Pagamento } from 'src/enterprise/pagamento/model/pagamento.model';

export class BuscarEstadoPagamentoPedidoResponse {
   @ApiProperty({ required: false, nullable: true, description: 'Estado do pagamento' })
   public estadoPagamento: EstadoPagamento;

   constructor(pagamento: Partial<Pagamento>) {
      this.estadoPagamento = pagamento.estadoPagamento;
   }
}
