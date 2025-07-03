import './styles.css' /* importando css */
import { Link } from 'react-router-dom';
import CartIcon from '../CartIcon/indext';
import iconAdmin from '../../assets/admin.svg';
import * as authService from '../../services/auth-service';
import { ContextToken } from '../../utils/context-token';
import { useContext, useEffect, useState } from 'react';
import LoggedUser from '../LoggedUser';
import { UserDTO } from '../../models/user';
import * as userService from '../../services/user-service';
import logo  from '../../assets/l-removebg-previe.png'

export default function HeaderClient() { /* por organização a função java script aqui
    tem que ter o mesmo nome da pasta que colocamos dentro do componente HeaderClient */


     const [user, setUser] = useState<UserDTO>();
     const { contextTokenPayload } = useContext(ContextToken);
    
        useEffect(() => {
            userService.findLoggedUser()
            .then(response =>{
           
                setUser(response.data);
              
            });
           
        }, [contextTokenPayload])
    


 
  return (
    <header className="dsc-header-client">
      <nav className="dsc-container">
        <div className="dsc-logo"> 
        <Link to="/">
          <img src={logo} alt="" /> 
        </Link>
        </div>
        <div className="dsc-nav-bar-right">
          <div className="dsc-menu-itens-container">
            <div className="dsc-menu-item">
              {
                contextTokenPayload && /* Aqui o icone da igrenagem
                ta usando essa variavel global para ver se o token foi atualizado
                com uma ROLE que tem acesso ao role admin ou se está em uma rola só de client
                que n tem acesso a engranagem, então essa engranagem só vai aparecer se for um token
                que tem o payload com a autorization Role_Adim */
                authService.hasAnyRoles(['ROLE_ADMIN']) &&
                <Link to="/admin">
                  <div className="dsc-menu-item">
                    <img src={iconAdmin} alt="Admin" />
                  </div>
                </Link>
              }

              <Link to="/cart">
              { contextTokenPayload && authService.isAuthenticated() &&/*se existir o token e se tiver autenticado vai retornar o usuário logado*/

                <CartIcon />
              }
              </Link>
            </div>
          { contextTokenPayload && authService.isAuthenticated() /*se existir o token e se tiver autenticado vai retornar o usuário logado*/
                       &&   <div className="dsc-operator-name">
              <p > Operador de caixa: {user?.name}</p>
        </div>}
            
                           
          </div>
          <LoggedUser />
        </div>
      </nav>
    </header>
  );

}