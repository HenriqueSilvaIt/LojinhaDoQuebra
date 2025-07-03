
import * as cartRepository from '../localstorage/cart-repository';
import { OrderDTO, OrderItemDTO } from '../models/order';
import { ProductDTO } from '../models/product';
import * as productService from '../services/product-services';

export function saveCart(cart: OrderDTO) {
    cartRepository.save(cart);
}


/*função para retorna um objeto */
export function getCart() : OrderDTO{
    return cartRepository.get();
}

/* Adionar produto ao carrinho */

export function addProduct(product: ProductDTO) {
    const cart = cartRepository.get();
    /* buscando dentro dos itens do carrinho se já existe um item do carrinho que to colocando*/
    const item = cart.items.find(x => x.productId === product.id);
    /* caso o item não existir vamos adicionar ele */
    if ( !item) {
        /*istanciando order item dto*/
        const newItem = new OrderItemDTO(product.id, 1, product.name, product.price, product.imgUrl, product.barCode);
        /* colocando  item no objeto product*/
        cart.items.push(newItem);
        /*salvando no local storage */
        cartRepository.save(cart);
    } else if (item) {
        item.quantity ++
        cartRepository.save(cart);
    }
}


export function addProductByBarCode(barCode: string) {
    productService.findByBarCode(barCode)
        .then(response => {
            const products = response.data;
            if (products && products.length > 0) {
                const product = products[0];
                if (product && product.id) { // Verifique se o produto tem dados
                    const cart = cartRepository.get();
                    const item = cart.items.find(x => x.barCode === product.barCode);
                    if (!item) {
                        const newItem = new OrderItemDTO(product.id, 1, product.name, product.price, product.imgUrl, product.barCode);
                        cart.items.push(newItem);
                        cartRepository.save(cart);
                    }
                } else {
                    console.error("Produto encontrado, mas sem dados:", barCode);
                    alert("Produto encontrado, mas sem dados.");
                }
            } else {
                console.error("Produto não encontrado com o código de barras:", barCode);
                alert("Produto não encontrado.");
            }
        })
        .catch(error => {
            console.error("Erro ao buscar produto por código de barras:", error);
            alert("Erro ao buscar produto.");
        });
}

export function clearCart() {
    cartRepository.clear(); /*pega a função do repository de limpar o carrinho*/
}

export function increaseItem(productId: number) {
    const cart = cartRepository.get(); // PEGANDO o cart do localStorage;
    const item = cart.items.find(x => x.productId === productId); //ele vai tentar encontrar o item
    if (item) {// se encontrar o item
        item.quantity ++; // incrementar o item que tem mais 1  pode user também o ++
        /* SALVA no local storage*/
        cartRepository.save(cart);  
    }
}

export function increaseItemBarCode(barCode: string) {
    const cart = cartRepository.get(); // PEGANDO o cart do localStorage;
    const item = cart.items.find(x => x.barCode === barCode); //ele vai tentar encontrar o item
    if (item) {// se encontrar o item
        item.quantity ++; // incrementar o item que tem mais 1  pode user também o ++
        /* SALVA no local storage*/
        cartRepository.save(cart);  
    }
}

export function decreaseItem(productId: number) {
    const cart = cartRepository.get(); // PEGANDO o cart do localStorage;
    const item = cart.items.find(x => x.productId === productId); //ele vai tentar encontrar o item
    if (item) {// se encontrar o item
        item.quantity --; // remove um item que tem mais 1  pode user também o ++
    
        if (item.quantity < 1) {// exclui item do carrinho se a quantidade for menor que 1
            
            cart.items = cart.items.filter(x => x.productId !== productId); /*filtra
            os itens do carrinho que seja diferente do item que passamos o id */
        }

        cartRepository.save(cart);  
    }
}