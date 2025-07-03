
import { Navigate } from "react-router-dom";
import * as authService from '../../services/auth-service';
import { JSX } from "react";
import { RoleEnum } from "../../models/auth";


type Props = {
    children: JSX.Element;
    roles?: RoleEnum[]; /* tem que importa o role Enum*/

}

/*  Componente PrivateRoute (Faz o direcionamento em nível de rota, sem precisar passar pelo backend) */

export function PrivateRoute({ children, roles = [] }: Props) { /* roles = [] quer dizer que se n 
    for informado o ROLE (CLIENT/ADMIN) ele vai retornar lista vazia
     o children é a mesma coisa que  
    as rota filh */
    if (!authService.isAuthenticated()) { /* se não tiver autenticado retorna para o login, se tiver retorna a rota ou componente que está dentro do private
        route */
        return <Navigate to="/login" />;

    }
    if (!authService.hasAnyRoles(roles)) { /*se tiver logado e n tem permissão para acessar 
        a rota específica ai redirecionamos para o catálogo*/
        return <Navigate to="/catalog" />;
    }
    return children; /*caso o contrário muda na rota*/
}