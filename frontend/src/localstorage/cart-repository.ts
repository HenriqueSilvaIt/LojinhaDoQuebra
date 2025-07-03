import { OrderDTO, OrderItemDTO } from "../models/order";

    import { CART_KEY } from "../utils/system";

/* não vai ser default porque vamos exportar mais de uma função */
export function save(cart: OrderDTO) { /* tem que importa o objeto OrderDt*/
    const obj = JSON.stringify(cart);
    localStorage.setItem(CART_KEY, obj);/*padrão do nome da class emp,projeto, nome do objeto*/
}

/*método utilziado para buscar do local storage */

export function get(): OrderDTO {
    const str = localStorage.getItem(CART_KEY) || '{"items":[]}';
    const obj = JSON.parse(str) as OrderDTO;

    /* criando objeto e percorrendo item dto para o proto type reconhecer o objet 
    OrderItem */
    const cart = new OrderDTO();
    obj.items.forEach(x   => { 
        cart.items.push(new OrderItemDTO(x.productId, x.quantity, x.name, x.price, x.imgUrl, x.barCode))
    });

    return cart;
}

export function clear() {
    /* colocando vazio para variavel CART_KEY, isso zera tudo que está no localStorage
    do carrinho */
    localStorage.setItem(CART_KEY, '{"items":[]}')
}