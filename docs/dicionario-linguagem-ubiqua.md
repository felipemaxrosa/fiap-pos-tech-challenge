# Dicionário Linguagem Ubíqua


#### Fast-n-Foodius
##### Sinônimo: Sistema de Autoatendimento
##### Sinônimo: Sistema
##### Sinônimo: Sistema de Controle de Pedidos
Sistema informatizado que desempenhará diversas funções com o intuito de automatizar completamente o processo de venda de produtos: 
* permitir aos *Clientes* da *Lanchonete* realizarem *Pedidos* sem necessidade de interação com atendentes
* disponibilizar um formulário opcional para os *Clientes* fornecerem seus dados cadastrais 
* realizar *Pagamentos* de forma automatizada através de parceria com o *MercadoPago*
* fornecer instruções precisas à *Cozinha* a respeito dos *Pedidos* que devem ser feitos
* garantir que nenhum *Pedido* seja perdido ou entregue diferente do solicitado
* prover um mecanismo de monitoração da *Etapa* dos *Pedidos* de modo que os *Clientes* possam acompanhá-los e eventualmente retirá-los quando estiverem prontos
* capturar informações cadastrais dos *Clientes* 
* gerenciar dados cadastrais dos *Clientes* para fins de publicidade
* gerenciar *Produtos*
* gerenciar *Categorias* de *Produtos*


#### Lanchonete
A empresa para a qual o *Sistema* está sendo construído. Também pode representar o nicho de mercado ao qual o sistema atenderá.

#### Cozinha
Setor da *Lanchonete* responsável pelo preparo e entrega dos *Pedidos* e da atualização de suas respectivas *Etapas*.

#### Cliente
A pessoa que realiza *Pedidos* na *Lanchonete*.

#### Cadastro de Cliente
##### Sinônimo: Gestão de Cliente
Cadastro de informações pessoais de um *Cliente* no *Sistema*. O *Cadastro de Cliente* é opcional e pode ser realizado pelo *Cliente* através de um formulário disponibilizado pelo *Sistema*. Conterá as seguintes informações: CPF, nome, e-mail, e uma opção para participar de campanhas de marketing.

#### Pedido
##### Sinônimo: Combo
De forma simples, é o conjunto de *Produtos* comprados por *Clientes*. De forma detalhada, cada produto escolhido pelo cliente é tratado internamente como um item, que possui a informação de quantidade além das características do produto em si. E o conjunto desses itens compõe o pedido, também chamado de combo.

#### Etapa
##### Sinônimo: Etapa de Pedido
##### Sinônimo: Status de Pedido
Estado de um *Pedido* que indica em qual *Etapa* ele se encontra dentro do *Sistema*. As *Etapas* são: recebido, em preparação, pronto e finalizado.

#### Acompanhamento de Etapa de Pedido
Monitoramento das diversas *Etapas* em que um *Pedido* pode se encontrar dentro do *Sistema*. 

#### Entrega
##### Sinônimo: Entrega de Pedido
O ato do *Cliente* de retirar o *Pedido* que comprou junto à *Cozinha*.

#### Categoria de Produto
Conjunto de *Produtos* que possuem características em comum. O cadastro de um *Produto* deve obrigatoriamente estar associado a uma *Categoria de Produto*. 

#### Produto
Produto comercializado pela *Lanchonete*, cujo conjunto compõe um pedido. As seguintes informações são necessárias: nome, categoria, descrição, preço e imagens.

#### Item
##### Sinônimo: Item de Pedido
Representação de um *Produto* dentro de um pedido, descrevendo também sua quantidade.

#### Lanche
*Categoria de Produto* fixa que agrupa os *Produtos* do tipo *Lanche*.

#### Acompanhamento
*Categoria de Produto* fixa que agrupa os *Produtos* do tipo *Acompanhamento*.

#### Bebida
*Categoria de Produto* fixa que agrupa os *Produtos* do tipo *Bebida*.

#### Sobremesa
*Categoria de Produto* fixa que agrupa os *Produtos* do tipo *Sobremesa*.

#### Painel Administrativo
##### Sinônimo: Painel
Interface que permite à *Lanchonete* gerenciar o *Sistema*.

#### Painel de Acompanhamento de Etapa de Pedido
Disposito aonde são exibidos os dados dos *Pedidos* aos *Clientes*.

#### MercadoPago
Empresa que fornece um serviço de pagamento online. O *Sistema* utilizará o *MercadoPago* para realizar *Pagamentos* através de *QR Code*. 

#### Pagamento
Transação financeira realizada entre um *Cliente* para pagar *Pedido*. 

#### QR Code
Código de barras bidimensional utilizado para realização do *Pagamento* do *Pedido*.
