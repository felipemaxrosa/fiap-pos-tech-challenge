using BrainstormEntidadesTechChallenge;
using System.Text;

namespace BrainstormEntidadesTechChallenge;

public enum NomeTipoProduto { Lanche, Acompanhamento, Bebida, Sobremesa };

public enum NomeProduto { Hamburger, XBurger, XSalada, XBancon, BatataFrita, NuggetsFrango, CebolaFrita, CocaCola, Guarana, Sprite, SucoUva, Sunday, Milkshake, Torta };

public class TipoProduto
{
    public NomeTipoProduto Nome;
}

public class Produto
{
    public TipoProduto TipoProduto;
    public NomeProduto Nome;
    public double Preco;
}

public class Item
{
    public Produto Produto;
    public int Quantidade;
}

public class Cliente
{
    public string CPF;
    public string Nome;
    public string EMail;
}

public enum StatusPedido { Recebido, EmPreparo, Pronto, Finalizado }

public class Pedido
{
    public DateTime DataInicio;
    public StatusPedido StatusPedido;
    public Cliente Cliente;
    public Item[] Itens;
    public string QRCodePagamento;
}

public class DB
{
    public List<TipoProduto> TiposProduto = new List<TipoProduto>();

    public List<Produto> Produtos = new List<Produto>();

    public List<Cliente> Clientes = new List<Cliente>();

    public List<Pedido> Pedidos = new List<Pedido>();

    public DB()
    {
        TiposProduto.Add(new TipoProduto { Nome = NomeTipoProduto.Lanche });
        TiposProduto.Add(new TipoProduto { Nome = NomeTipoProduto.Acompanhamento });
        TiposProduto.Add(new TipoProduto { Nome = NomeTipoProduto.Bebida });
        TiposProduto.Add(new TipoProduto { Nome = NomeTipoProduto.Sobremesa });

        CadastrarProduto(BuscarTipoProdutoPorNome(NomeTipoProduto.Lanche), NomeProduto.Hamburger, 20);
        CadastrarProduto(BuscarTipoProdutoPorNome(NomeTipoProduto.Lanche), NomeProduto.XBurger, 25);
        CadastrarProduto(BuscarTipoProdutoPorNome(NomeTipoProduto.Lanche), NomeProduto.XSalada, 26);
        CadastrarProduto(BuscarTipoProdutoPorNome(NomeTipoProduto.Lanche), NomeProduto.XBancon, 30);
        CadastrarProduto(BuscarTipoProdutoPorNome(NomeTipoProduto.Acompanhamento), NomeProduto.BatataFrita, 10);
        CadastrarProduto(BuscarTipoProdutoPorNome(NomeTipoProduto.Acompanhamento), NomeProduto.NuggetsFrango, 15);
        CadastrarProduto(BuscarTipoProdutoPorNome(NomeTipoProduto.Acompanhamento), NomeProduto.CebolaFrita, 12);
        CadastrarProduto(BuscarTipoProdutoPorNome(NomeTipoProduto.Bebida), NomeProduto.CocaCola, 8);
        CadastrarProduto(BuscarTipoProdutoPorNome(NomeTipoProduto.Bebida), NomeProduto.Guarana, 8);
        CadastrarProduto(BuscarTipoProdutoPorNome(NomeTipoProduto.Bebida), NomeProduto.Sprite, 8);
        CadastrarProduto(BuscarTipoProdutoPorNome(NomeTipoProduto.Bebida), NomeProduto.SucoUva, 10);
        CadastrarProduto(BuscarTipoProdutoPorNome(NomeTipoProduto.Sobremesa), NomeProduto.Sunday, 12);
        CadastrarProduto(BuscarTipoProdutoPorNome(NomeTipoProduto.Sobremesa), NomeProduto.Milkshake, 15);
        CadastrarProduto(BuscarTipoProdutoPorNome(NomeTipoProduto.Sobremesa), NomeProduto.Torta, 9);
    }

    public TipoProduto BuscarTipoProdutoPorNome(NomeTipoProduto nomeTipoProduto) => TiposProduto.FirstOrDefault(t => t.Nome.Equals(nomeTipoProduto));

    public Produto[] ListarProdutosPorTipo(TipoProduto tipoProduto ) => Produtos.Where(p => p.TipoProduto == tipoProduto).ToArray();

    public Produto CadastrarProduto(TipoProduto tipoProduto, NomeProduto nomeTipoProduto, float Preco)
    {
        Produto produto = new Produto() { TipoProduto = tipoProduto, Nome = nomeTipoProduto, Preco = Preco };
        Produtos.Add(produto);
        return produto;
    }

    public Pedido CriaPedidoCliente(Cliente cliente, Item[] itens)
    {
        Pedido pedido = new Pedido() { DataInicio = DateTime.Now, Cliente = cliente, Itens = itens, StatusPedido = StatusPedido.Recebido };
        Pedidos.Add(pedido);
        return pedido;
    }
}

public class ServicoMercadoPago
{
    public string CriaNotaPagamento(double valor)
    {
        return Guid.NewGuid().ToString();
    }

    public bool ConfirmaNotaPagamento(string notaPagamento) => true;
}

public class API
{
    public DB DB;
    public ServicoMercadoPago ServicoMercadoPago;

    public API()
    {
        // Conecta na "base de dados"
        DB = new DB();

        ServicoMercadoPago = new ServicoMercadoPago();
    }

    public Pedido CriarPedidoCliente(Cliente cliente, Item[] itens)
    {
        // Descarta itens com quantidade igual ou menor que zero
        itens = itens?.Where(i => i.Quantidade >= 0).ToArray() ?? new Item[0];

        // Verifica se existe algum item no pedido
        if (itens.Length == 0)
            throw new Exception("Nenhum item especificado para o pedido");

        Pedido pedido = DB.CriaPedidoCliente(cliente, itens);

        // Calcula total do pedido
        double totalPedido = pedido.Itens.Sum(i => i.Produto.Preco * i.Quantidade);        

        // Cria nota de pagamento
        pedido.QRCodePagamento = ServicoMercadoPago.CriaNotaPagamento(totalPedido);

        return pedido;
    }
}