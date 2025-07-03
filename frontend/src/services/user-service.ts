import { AxiosRequestConfig } from "axios";
import { requestBackend } from "../utils/requests";
import { UserDTO } from "../models/user";

/*Busc usuário logado*/

export function findLoggedUser() {

    const config: AxiosRequestConfig = {
        url: '/users/me',
        withCredentials: true
    }

 

        return requestBackend(config);

/* o preparamos o cabeçalho acima, e vamos passar o cabeçalho já com o token na requisição na url abaixo*/


}



export function insertNewUser(obj: UserDTO) {

    const config: AxiosRequestConfig = {
        method: "POST",
        url: "/users",
        withCredentials: false,
        data: obj
    }

    return requestBackend(config);

}