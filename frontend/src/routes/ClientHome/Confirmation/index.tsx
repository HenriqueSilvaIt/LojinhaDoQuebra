import {  useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as orderService from '../../../services/order-service';
import { OrderDTO } from "../../../models/order";
import { Link } from "react-router-dom";
import './style.css';
import { handlePrint } from '../../../components/Recibo/recibo';
import * as paymentService from '../../../services/payment-service';

export default function Confirmation() {
    const [paymentMethod, setPaymentMethod] = useState<string>('');

    useEffect(() => {
        const savedPaymentMethod = paymentService.getPayment();
        setPaymentMethod(savedPaymentMethod);
        if (savedPaymentMethod === '"credit_card"') {
            setPaymentMethod('Cartão de crédito');
        }else if (savedPaymentMethod === '"debit_card"') {
            setPaymentMethod('Cartão de débito');
        } else if ( savedPaymentMethod === '"Dinheiro"')
            setPaymentMethod('Dinheiro');
        else if ( savedPaymentMethod === '"pi"')
                setPaymentMethod('Pix');
    }, []);


    const params = useParams();

    const [order, setOrder] = useState<OrderDTO | null>(null); // Inicializa como null

    useEffect(() => {
           orderService.findByIdRequest(Number(params.orderId))
        .then(response => {
            setOrder(response.data);
            // Imprimir automaticamente após o carregamento (se desejado)
            // handlePrint(response.data, paymentMethod);
        });
}, []);


    function handleButtonClick() {
        console.log("Dados do pedido para impressão:", order);
        if (order) {
            handlePrint(order, paymentMethod);
        } else {
            console.error("Objeto de pedido não disponível para impressão.");
        }
    }


    console.log(order?.total);

    return (

        <main>
            <section id="confirmantion-section" className="dsc-container dsc-mt20">

                <div className="dsc-card dsc-mb20">

                   {order?.items?.map(item => ( // Adiciona verificação extra para order?.items

                        <div key={item.productId} className="dsc-cart-item-container dsc-line-bottom">
                            <div className="dsc-cart-item-left">
                                <img src={item.imgUrl} alt={item.name} />
                                <div className="dsc-cart-item-description">
                                    <h3>{item.name}</h3>
                                    <div className="dsc-cart-item-quantity-container">
                                        <p>{item.quantity}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="dsc-cart-item-right">R$ {(item.subTotal.toFixed(2))}</div>
                        </div>
                    ))
                    }

                                   {order && ( // Renderiza o total somente se o pedido existir
                        <div className="dsc-cart-total-container">
                            <h4>Total:</h4>
                            <h3>R$ {order.total?.toFixed(2)}</h3>
                            
                        </div>
                    )}
                </div>

                {order && ( // Renderiza a mensagem de confirmação somente se o pedido existir
                    <div className="dsc-confirmation-message dsc-mb20">
                        Venda número {order.id} realizada!
                    </div>
                )}

                <div className="dsc-btn-page-container">
        
                        <button onClick={handleButtonClick} className="dsc-btn dsc-btn-white dsc-bx">
                           Imprimir comprovante
                        </button>
                </div>
                <div className="dsc-btn-page-container">

                    <Link to="/cart" >
                        <div className="dsc-btn dsc-btn-blue dsc-bx">
                            Voltar ao caixa
                        </div>
                    </Link>
                </div>
            </section>
        </main>



    );
}    
