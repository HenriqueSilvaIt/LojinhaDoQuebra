import cartIcon from '../../assets/cart.svg';
import './style.css';
import { useContext } from 'react';
import { ContextCartCount } from '../../utils/context-cart';


export default function CartIcon() {
    

   /* const [cart, setCart] = useState(cartService.getCart());  esse useState tem vai conter o número do
    itens de carrinho, vamos pegar com o service getCart, colocando direto dentro do useState
    a variavel do useState já começa com esse valor, precisa de um contextAPi para ele atualizar realmente o número
    na variavel cart, se n ele vai atualizar só se recarregar a página*/

     const { contextCartCount } = useContext(ContextCartCount);


    return(
       <> 
       <div className="dsc-menu-cart"> 
        <img src={cartIcon} alt="car" />
        {
            contextCartCount > 0 && <div className="dsc-cart-count">{contextCartCount}</div>
     
        }
        </div>
    
        </>
        /*se for maior do que 0 aparece a quantidade itens no carrinho */
  /* cart.items.length pega quandidade de itens do carrinho */
    )
}