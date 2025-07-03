import './styles.css' /* importando css */
import homeIm from '../../assets/home.svg';
import productsIcon from '../../assets/products.svg'
import LoggedUser from '../LoggedUser';
import { NavLink } from 'react-router-dom';
import history from '../../assets/history-svgrepo-com (1).svg'
import product from '../../assets/cart-shopping-regular.svg'



export default function HeaderAdmin() { /* por organização a função java script aqui
    tem que ter o mesmo nome da pasta que colocamos dentro do componente HeaderClient */


  return (
    <header className="dsc-header-admin">
      <nav className="dsc-container">

        <h1 className="dsc-tb768">Administração</h1>
        <div className="dsc-nav-bar-right">
          <div className="dsc-menu-itens-container">
            <NavLink 
            to="/admin/home"
            className={({isActive}) => isActive ? "dsc-menu-item-active" : ""}>
              <div className="dsc-menu-item">
                <img src={homeIm} alt="home" />
                <p>Início</p>
              </div>
            </NavLink>
            <NavLink 
            to="/admin/history"
             className={({isActive}) => isActive ? "dsc-menu-item-active" : ""}>
              <div className="dsc-menu-item">
                <img src={history} alt="cadastro de produtos" />
                <p >Histórico de vendas</p>
              </div>
              </NavLink>
            <NavLink 
            to="/admin/products"
             className={({isActive}) => isActive ? "dsc-menu-item-active" : ""}>
              <div className="dsc-menu-item">
                <img src={productsIcon} alt="cadastro de produtos" />
                <p >Cadastro de produto</p>
              </div>
              </NavLink>
              <NavLink
                to="/home "
                className={({isActive}) => isActive ? "dsc-menu-item-active" : ""}>
              <div className="dsc-menu-item">
                <img src={product} alt="cadastro de produtos" />
                <p >Estoque</p>
              </div>
              </NavLink>
         
          </div>

          <LoggedUser />
        </div>
      </nav>
    </header>
  );

}