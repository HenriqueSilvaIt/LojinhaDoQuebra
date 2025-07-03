import './styles.css';
import { ProductDTO } from '../../models/product';
import { Link } from 'react-router-dom';
import { formatDate } from '../../services/product-services';
import { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { ContextToken } from '../../utils/context-token';
import * as authService from '../../services/auth-service';


type Props = {
    product: ProductDTO;
}

export default function CatalogCards({ product }: Props) {

    const [dirty, setDirty] = useState<boolean>(false);
    const [warning, setWarning] = useState<boolean>(false);
    const { contextTokenPayload } = useContext(ContextToken);

    useEffect(() => {
        console.log("Product:", product);

        if (!product.dueDate) {
            console.error("dueDate is undefined for product:", product);
            return;
        }

        const now = moment().startOf('day');
        const dueDate = moment(product.dueDate).startOf('day');
        const diffDays = now.diff(dueDate, 'days'); // Usando apenas esta variável

        if (diffDays > 0) {
            setDirty(true); // Vencido
            setWarning(false);
        } else if (diffDays >= -5 && diffDays <= 0) {
            setWarning(true); // Próximo do vencimento (2 dias ou menos)
            setDirty(false);
        } else {
            setDirty(false);
            setWarning(false);
        }
    }, [product.dueDate, product]);

    return ( /* tem que importa o link abaixo */
        <Link to={`/product-details/${product.id}`}>
            <div className="dsc-card">
                <div className="dsc-catalog-card-top dsc-line-bottom">
                    <img src={product.imgUrl} alt={product.name} />
                </div>
                <div className="dsc-catalog-card-bottom">
                    <h3>R$ {product.price.toFixed(2)}</h3>
                    <h4>{product.name}</h4>
                    {contextTokenPayload && authService.isAuthenticated() ?

                        <div className="dsc-catalog-card-date">
                            <p className="dsc-catalog-product-quantity"> {product.quantity}</p>
                            Data de Compra
                            <p>{formatDate(product.dateBuy)}</p>
                            Data de vencimento
                            <p className={dirty ? "dsc-dueDate-invalid" : warning ? "dsc-dueDate-warning" : ""}> {formatDate(product.dueDate)}</p>

                        </div>
                        :
                        ""
                    }
                </div>
            </div>
        </Link>
    );
}