import QueryString from "qs";
import { AccessTokenPayloadDTO, CredentialsDTO, RoleEnum } from "../models/auth";
import { CLIENT_ID, CLIENT_SECRET} from "../utils/system";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "../utils/requests";
import * as acessTokenRepository from '../localstorage/acess-token-repository'
import jwtDecode from "jwt-decode";

export function loginRequest(loginData: CredentialsDTO) {

    /*Cabelaçhos da requisição, tem que ficar igual no postman que testamo no backend */
    const headers  = {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + window.btoa(CLIENT_ID + ":" + CLIENT_SECRET)

        /* O algoritmo Base64.encode  do java script é o window.btoa mós colocamos depois do basic */
    }

    const requestBody = QueryString.stringify({...loginData, grant_type: "password"}); /*stringfy converte para texto
    tem que importa o QueryString*/

    /* Requisição oque parametros */
    const config : AxiosRequestConfig = {
    method: "POST",
    url: "/oauth/token",
    data: requestBody, /*corpo no Axios é o data */
    headers /*cabeçalho da requisição, quando o valor tem o mesmo nome do atributo só colocar
     uma vez o nome n precisa colocar 2 */
    }

   return requestBackend(config);
}

/* função para realizar logout, ou seja limpa o token do local storage */
export function logout() {
    acessTokenRepository.remove(); /* n passamos o local storage aqui direto
    para remover, porque na pdronização que estamos fazendo o localstorage repository é a camada
    que chamada os dados do localstorage e aqui  chamamos o serviço do repository */
}

export function saveAcessToken(token: string) {

    acessTokenRepository.save(token);

}

export function getAcessToken() {
   return  acessTokenRepository.get(); /* tem que ter o return porque ele  vai retorna o token*/
}


/* função utilizada para pegar as informações do Payload(dados do usuário no token decodificado)*/
export function getAccessTokenPayload(): AccessTokenPayloadDTO | undefined {
    try {
      const token = acessTokenRepository.get(); // pegar o token do localStorage
      return token == null ? undefined : (jwtDecode(token) as  AccessTokenPayloadDTO); /* se token for nulo
      n exist, é undefined, caso existir vamos usar o jwtDecode do token ele vai retornar todos o campos
      do payload( das informações do usuário decodificad) e as AcessTokenPayloadDTO vai retornar só os 3 
      campos que quermos */
    } catch (error) {
  
      return undefined;
    }
}

export function isAuthenticated(): boolean {
    let tokenPayload = getAccessTokenPayload();
    if ( tokenPayload && tokenPayload.exp * 1000 > Date.now()) // o vezes mil é para deixar em segundo também no java Scriptt
        return true
    else {
        return false;
    } 

    }
 


    
export function hasAnyRoles(roles: RoleEnum[]): boolean { /* tem que importa o ROleEnum que é um tipo
     enumerado que criamos */
    if (roles.length === 0 ) { /* se a lista  f 0 é verdadeiro*/
      return true;
    }

const tokenPayload = getAccessTokenPayload(); /*essa variavel tem as informações do token 
exp, usário e authorizaty*/

  if (tokenPayload !== undefined) { /* se esse tokenPayload existe, vamos fazer um for para percorrer
    a lista desses token(informação do usuário no token) porém pegando
    só o autorities que é ROLE_ADMIN ou CLIENT ou os 2, se tiver retornando
    esses roles ele vai retorna verdadeiro
    
    então vamos passar como argumento um usuário*/
    for (var i = 0; i < roles.length; i++) {
      if (tokenPayload.authorities.includes(roles[i])) {
        return true;
      }
    }
    // return roles.some(role => tokenData.authorities.includes(roles));, toda função do for
    // pode ser feita com esse some, o some verifica se algum elemento atende esse predicado
  }

  return false;
}