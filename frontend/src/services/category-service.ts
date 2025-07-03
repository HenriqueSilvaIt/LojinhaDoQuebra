
// Aqui vai ser um código que terá funcionalidades de négocio relacionadas ao produto

import { AxiosRequestConfig } from "axios";
import { BASE_URL } from "../utils/system";
import { requestBackend } from "../utils/requests";

/* retorna todos os produtos */

export function findAllRequest() { /* 1º argumento número da página, 2º nome
    do produto, 3º qtd de produto na página        */
    const config : AxiosRequestConfig = { 
        method: "GET",
        baseURL: BASE_URL, 
        url: "/categories"
    }
    /*return axios.get(`${BASE_URL}/products/?size=12`); /*tem que importa o axios */

return requestBackend(config);/* config do AxiosRequestConfi vai receber ele mesmo
mais o baseURL, ai no caso lá no serviço do product chamado findPageRequest, não precisa mais
colocar a varavel do BASE_URL porque já está configurada no config, é só chamar o requestBackend dentro
do product-service.t*/

}