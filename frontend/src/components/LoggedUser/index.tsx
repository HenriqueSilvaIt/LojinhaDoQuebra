import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../../services/auth-service';
import { useContext } from 'react';
import { ContextToken } from '../../utils/context-token';



export default function LoggedUser() {


   
    const { contextTokenPayload, setContextTokenPayload } = useContext(ContextToken);

    const navigate = useNavigate();

    /*Função para quandi clicar no logout */

    function handleLogoutClick() {
        authService.logout(); /* desloga*/
        setContextTokenPayload(undefined); /* e como deslogou some o token do local storage, e essa
        variavel set undefined para o context global ser atualizado  e tendner que n tem ais token*/
        navigate("/catalog");
    }

    return (
        contextTokenPayload && authService.isAuthenticated() /*se existir o token e se tiver autenticado vai retornar o usuário logado*/
            ? (
                
            <div className="dsc-logged-user">
              
            
                <p>{contextTokenPayload.user_name}</p>
                <span  onClick={handleLogoutClick}>Sair</span>
            </div>
            )
            :(
            <Link to="/login">
                Entrar
            </Link>
            )
    );
    
}