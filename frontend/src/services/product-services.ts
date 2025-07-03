
// Aqui vai ser um código que terá funcionalidades de négocio relacionadas ao produto

import  { AxiosRequestConfig } from "axios";
import { BASE_URL } from "../utils/system";
import { requestBackend } from "../utils/requests";
import { ProductDTO } from "../models/product";
import moment from "moment";
/* retorna todos os produtos */

export function findPageRequest(page: number, name: string, size = 12, sort = "name") { /* 1º argumento número da página, 2º nome
    do produto, 3º qtd de produto na página        */
    const config : AxiosRequestConfig = { 
        method: "GET",
        baseURL: BASE_URL, 
        url: "/products",
        params: {
            page: page,
            name: name,
            size: size,
            sort: sort

        }
    }
    /*return axios.get(`${BASE_URL}/products/?size=12`); /*tem que importa o axios */

return requestBackend(config);/* config do AxiosRequestConfi vai receber ele mesmo
mais o baseURL, ai no caso lá no serviço do product chamado findPageRequest, não precisa mais
colocar a varavel do BASE_URL porque já está configurada no config, é só chamar o requestBackend dentro
do product-service.t*/

}

/* retorna o produto pelo id usando método find do java script */

export function findById(id: number) {
    return requestBackend({url: `/products/${id}`});
    /*  axios.get(`${BASE_URL}/products/${id}`); 
    // agora aqui o product service pega o id do produto do backend
    // então o número que eu setar quando clicar no produto específco que tem seu id, ele vai
    // buscar no backend e exibir na tela 
    // tem que converter o id para number */

}

export function findByBarCode(code:string) {
    return requestBackend({url: `/products/?size=1?barCode&barCode=${code}`});
}


export function deleteById(id: number) {
    const config : AxiosRequestConfig = { 
        method: "DELETE",
        url: `/products/${id}`,
        withCredentials: true /* só posso deletar se tiver logado com admin */ 

    }

    return requestBackend(config);
}

/* editando produto no estoque */

export function updateRequest(obj: ProductDTO) {

    const config: AxiosRequestConfig = {
        method: "PUT", /* para update na tabela*/
        url: `/products/${obj.id}`,
        withCredentials: true,
        data: obj /*corpo da requisição*, que é o objeto*/
    }

    return requestBackend(config);

}

/* salvar novo produto no estoque */

export function insertRequest(obj: ProductDTO) {

    const config: AxiosRequestConfig = {
        method: "POST", /* para salvar novo produto na tabela*/
        url: "/products/",
        withCredentials: true,
        data: obj /*corpo da requisição*, que é o objeto*/
    }

    return requestBackend(config);

}

// função que converte  data no formato DD/MM/AAAA

export function formatDate(dateString: string | Date | undefined): string {
    if (!dateString) return 'Data não disponível';

    const date = moment(dateString);
    if (!date.isValid()) return 'Data inválida';

    return date.format('DD/MM/YYYY');
}

export function formatDateToFilter(dateString: string | Date | undefined): string {
    if (!dateString) return '';

    const date = moment(dateString);
    if (!date.isValid()) return '';

    return date.format('YYYY-MM-DD');
}

export function decreaseQuantity(productId: ProductDTO) {


    if (productId === productId) { 

        productId.quantity --;
     }

}