import './styles.css'
import ProductCategory from '../ProductCategory';
import { ProductDTO } from '../../models/product';
import {formatDate} from '../../services/product-services';
import * as authService from '../../services/auth-service';
import { ContextToken } from "../../utils/context-token";
import { useContext } from 'react';


type Props = {
    product: ProductDTO;
}



export default function ProductDetailsCard({ product }: Props) {


    const {contextTokenPayload} = useContext(ContextToken);

    return (
        <div className="dsc-card dsc-mb20">
            <div className="dsc-product-details-top dsc-line-bottom">
                <img src={product.imgUrl} alt={product.name} />
            </div>
            <div className="dsc-product-details-bottom">
                <h3>R$ {product.price.toFixed(2)}</h3>
                <h4>{product.name}</h4>
                <p>
                    {product.description}
                </p>
               
     { contextTokenPayload && authService.isAuthenticated() &&
              <div>
                   <p>Quantitidade:</p>
                {product.quantity}
                <p>
                    Código de barras: 
                    <br/>
                    {product.barCode}
                </p>
                <p>
                    Data de compra:  
                    <br/>
                    {formatDate(product.dateBuy)}

                </p>
                <p>
                    Data de vencimento:  
                    <br/>
                    {formatDate(product.dueDate)}
                </p> 
                </div>
                }
                <div className="dsc-category-container">
                    {
                        product.categories.map(x => {
                            return <ProductCategory key={x.id} name={x.name} /> /* todo componente react
                           pode ter a propriedade key (ele é necessário para o react
                           ele precisa que cada item da coleção que ele renderiza
                           tenha uma chave única), mesmo que você n tenha uma prop, e dentro do key
                           você vai ter que colocar um valor único para cada elemento
                           que estiver renderizando dentro da sua prop, no nosso caso
                           como temos o atributo id que é único vamos utilizar ele */
                            /* o map, com predicado
                    x vai retorna como argumento para productcategory
                    x que é o objeto product .name que é o atributo name dos objeto dentro do array categories*/
                        }) /* é possível tirar o return e trocar as chaves pelo
                   parentese que também funciona */
                    }
                </div>
            </div>
        </div>
    );
}