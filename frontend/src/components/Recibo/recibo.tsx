import moment from "moment";
import './style.css';
import { OrderDTO } from "../../models/order";



export function handlePrint(order: OrderDTO, paymentMethod: string) {




    if (!order || !order.items) {
        console.error("Dados do pedido incompletos para impressão.");
        return;
    }


    let textoRecibo = "";

    // Cabeçalho
    textoRecibo += "Lojinha Do Quebra\n";
    textoRecibo += "------------------------\n";
    textoRecibo += "Rua Bougival, 159\n";
    textoRecibo += "Jd. Ipanema, Santo andré\n";
    textoRecibo += "------------------------\n";
    textoRecibo += "Cupom Eletrônico\n";
    textoRecibo += `Número do Pedido: ${order.id}\n`;
    textoRecibo += moment(order.moment).format("DD/MM/YYYY HH:mm") + "\n";
    textoRecibo += "-------------------------\n";

    textoRecibo += `Produto(s):\n`;
    // Itens
    order.items.forEach(item => {
        const nomeProduto = item.name.padEnd(1, ' ');
        const quantidade = String(item.quantity).padStart(1, ' ');
       const valorUnitario = `R$ ${item.price.toFixed(2)}`.padStart(1, ' '); 
        const subtotal = `R$ ${item.subTotal?.toFixed(2)}`.padStart(1, ' ');
        textoRecibo += `${nomeProduto}\n`;
        textoRecibo += `Qtd: V.Uni: Subtotal:\n`;
        textoRecibo += `${quantidade} ${valorUnitario} ${subtotal}\n`;
        textoRecibo += "\n";
    });
    textoRecibo += "-------------------------\n";
    textoRecibo += `Total: R$ ${order.total?.toFixed(2)}\n`;
        textoRecibo += "-------------------------\n";
        textoRecibo += `Forma de Pagamento: \n${paymentMethod}\n`;

    textoRecibo += "-------------------------\n";
    textoRecibo += "Obrigado pela sua compra!\n";
    textoRecibo += "-------------------------\n";


    document.writeln(`<pre>${textoRecibo}</pre>`);

    window.print();
    window.location.reload(); // Recarrega a página
}
