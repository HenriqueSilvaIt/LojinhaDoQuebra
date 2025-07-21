import { AxiosRequestConfig } from "axios";
import { requestBackend } from "../utils/requests";
import { OrderDTO } from "../models/order";
//import moment from 'moment'; // Importe moment.js

/*
export type OrderSearchParams = {
    sortBy?: string;
    direction?: 'asc' | 'desc';
    page: number;
    size: number;
    // Adicione outros parâmetros de pesquisa que sua API possa aceitar
};*/

export function findByIdRequest(id: number) {
    
    const config : AxiosRequestConfig = {
        url: `/orders/${id}`,
        withCredentials: true /*precisa de autorização token para acesasr essa página ur
        isso é configurado no backend*/
    }

    return requestBackend(config);
}

/*Função para salvar um pedido que contem um ou mais produto*/

export function placeOrderRequest(cart: OrderDTO) {

        /* vamos salvar lá no backend por isso usamos o axio*/
    const config : AxiosRequestConfig = {
        url: "/orders",
        method: "POST",
        withCredentials: true, /*precisa estar logado*/
        data: cart,
     /* o corpo se chamada data no axio da pra ver é o body lá no postman, e oque tem dentro 
        do corpo do pedido é o carrinho, porque o carrinho  que estamos passando como argumento
         dessa função, porque no cart(carrinmh) tm o produtos do pedido*/
    }

    return requestBackend(config);
}

export function findAllCart(page: number, minDate: string, maxDate: string) {
    const config: AxiosRequestConfig = {
        url: `/orders/cart`,
        method: "GET",
        withCredentials: true,
        params: { 
            minDate,
            maxDate,
            page
         

        } 
       // Adiciona os parâmetros à configuração da requisição
    };
    return requestBackend(config);
}


export function findAll(page: number, minDate: string, maxDate: string) {
    const config: AxiosRequestConfig = {
        url: `/orders`,
        method: "GET",
        withCredentials: true,
        params: { 
            minDate,
            maxDate,
            page
         

        } 
       // Adiciona os parâmetros à configuração da requisição
    };
    return requestBackend(config);
}

export function findTotalAmount(minDate: string, maxDate: string) {
    const config: AxiosRequestConfig = {
        url: `/orders/total`,
        method: "GET",
        withCredentials: true,
        params: {
            minDate,
            maxDate
        }
    };
    return requestBackend(config);
}

export function deleteById(orderItemId: number, productId: number) {
    const config : AxiosRequestConfig = { 
        method: "DELETE",
        url: `/orders/${orderItemId}/items/${productId}`,
        withCredentials: true /* só posso deletar se tiver logado com admin */ 

    }

    return requestBackend(config);
}
