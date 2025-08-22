import axios, {  AxiosRequestConfig } from "axios";
import QueryString from "qs";
import { CLIENT_MERCADO, SECRET_MERCADO } from "../utils/system";
import * as mercadoPagoRepository from '../localstorage/mercadopago-repostory';
import { requestMercadoPago} from '../utils/requests';
import {  OrderItemPixRequestDTO } from "../models/order";


const API_URL = '/mercado-pago';


export  function obterTokenMercadoPago() {


    const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
    };

    const requestBody = QueryString.stringify({
        grant_type: "client_credentials",
        client_id: CLIENT_MERCADO,
        client_secret: SECRET_MERCADO,
    });

    const config: AxiosRequestConfig = {
        method: "POST",
        url: "https://api.mercadopago.com/oauth/token",
        data: requestBody,
        headers,
    };
 
        return  axios(config);
  
}

export function criarIntencaoPagamento(pagamentoData: any) {

    /*Cabelaçhos da requisição, tem que ficar igual no postman que testamo no backend */
    const headers  = {
        "Content-Type": "application/json"

        /* O algoritmo Base64.encode  do java script é o window.btoa mós colocamos depois do basic */
    }

    /* Requisição oque parametros */
    const config : AxiosRequestConfig = {
    method: "POST",
    url: "/mercado-pago-payment",
    data: pagamentoData, /*corpo no Axios é o data */
    headers /*cabeçalho da requisição, quando o valor tem o mesmo nome do atributo só colocar
     uma vez o nome n precisa colocar 2 */
    }

   return requestMercadoPago(config);
}


export const obterStatusIntencaoPagamento = (paymentIntentId: any) => {


    const config : AxiosRequestConfig = {
        method: "GET",
        url: `/mercado-pago-payment-status/${paymentIntentId}`,
        

      }

    return requestMercadoPago(config);
};


export const obterDispositivos = (storeId: any , posId :any)  => {
    return axios.get(`${API_URL}/dispositivos`, { params: { storeId, posId } });
};

/*
export const criarIntencaoPagamento = ( pagamentoData : any) => {

    const accessToken = getAcessToken();
    const headers = {
        
       "Content-Type": "application/json",
       'Authorization': 'Bearer ' + accessToken, 
    };

    const config: AxiosRequestConfig = {
        method: "POST",
        url:`https://api.mercadopago.com/point/integration-api/devices/${DEVICE_ID}/payment-intents`,
        data: pagamentoData,
        headers,
    };

    return  axios(config);
};*/


export const cancelarIntencaoPagamento = (deviceId: any, paymentIntentId: any) => {
    return axios.delete(`${API_URL}/pagamentos/${deviceId}/${paymentIntentId}`);
};


/* função para realizar logout, ou seja limpa o token do local storage */
export function removeToken() {
    mercadoPagoRepository.remove(); /* n passamos o local storage aqui direto
    para remover, porque na pdronização que estamos fazendo o localstorage repository é a camada
    que chamada os dados do localstorage e aqui  chamamos o serviço do repository */
}

export function saveAcessToken(token: string) {

    mercadoPagoRepository.save(token);

}

export function getAcessToken() {
   return  mercadoPagoRepository.get(); /* tem que ter o return porque ele  vai retorna o token*/
}


export function createQrCode(dto: OrderItemPixRequestDTO){

    const config : AxiosRequestConfig = {

        method: "POST",
        url: `/mercadopago-qrcode`,
        data: dto
    
    }

    return requestMercadoPago(config);

}