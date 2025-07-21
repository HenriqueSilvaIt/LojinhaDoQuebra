

export class OrderDTO {

    id?: number; /* id ? opcional, colocamos assim
    porque antes do pedido ser um pedido, ele é um carrinho apena */
    items: OrderItemDTO[] = []; /* é uma lista da classe order item abaixo*/

    moment?: Date;

    get total(): number{
        let sum = 0;
        this.items.forEach(item => { /*items aqui é cada objeto do OrderItemDTO
            e o calculo embaixo estamos somando somente o subtotal de cada item
             e esse total vai retornar a soma dos subtotal é só colocar le depois no visua*/
            sum += item.subTotal;
        })
        return sum;
    }

    get troco(): number{
        let sum = 0;
        this.items.forEach(item => {
            sum -= item.subTotal;
        })
        return sum;
    }

}


/* Item do pedido */
export class OrderItemDTO {
    /* construtor criado para exigir que você informe esses dados quando for instanciar o objeto OrderItemDTO*/
    constructor(
        public productId: number,
        public quantity: number,
        public name: string,
        public price: number,
        public imgUrl: string,
        public barCode: string
    ) {}

        /* colocamos tudo como classe porque tem dado calculado */
    get subTotal(): number {
        return this.price * this.quantity;
    }
}