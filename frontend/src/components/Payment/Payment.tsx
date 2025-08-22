import { useEffect, useState } from "react";
import * as mercadoPagoService from '../../services/mercado-pago-service';
import ButtonSecondy from "../ButtonSecondy";
import * as cartService from '../../services/cart-services'
import { OrderDTO, OrderItemPixDTO, OrderItemPixRequestDTO } from "../../models/order";
import './style.css';
import loadingGif from '../../assets/loadi.gif';
import * as paymentService from '../../services/payment-service';
import QrCodePix from "../QrCodePix";

interface PaymentProps {
    totalCartValue: number;
    order: OrderDTO
}

export default function Payment({ totalCartValue, order }: PaymentProps) {

    const [instalmmentValue, setInstamentValue] = useState<any>();
    const [paymentMethod, setPaymentMethod] = useState<string>('');
    const [paymentStatus, setPaymentStatus] = useState<any>(); // Estado do pagamento
    const [paymentIntentId, setPaymentIntentId] = useState('');
    const [formattedTotalValue, setFormattedTotalValue] = useState<any>();
    const [cart, setCart] = useState<OrderDTO>(cartService.getCart());
    const [qrCodePix, setQrCodePix] = useState<string>();

    const [dialogInfoData, setDialogInfoData] = useState<{
        visable: boolean;
        message: string;
        'data-payment-status'?: any;
    }>({
        visable: false,
        message: 'Sucesso'
    });

    useEffect(() => {
        if (totalCartValue !== undefined) {
            setFormattedTotalValue(formatTotalValue(totalCartValue));
        }
    }, [totalCartValue]); // Executa quando totalCartValue muda

    useEffect(() => {
        if (paymentIntentId) {
            const interval = setInterval(() => {
                mercadoPagoService.obterStatusIntencaoPagamento(paymentIntentId)
                    .then(response => {
                        const status = response.data.state;
                        setPaymentStatus(status);
                        setDialogInfoData(prev => ({
                            ...prev,
                            'data-payment-status': status,
                        }));
                    })
                    .catch(error => {
                        console.error('Erro ao obter status do pagamento:', error);
                        setPaymentStatus('ERROR');
                        setDialogInfoData(prev => ({
                            ...prev,
                            'data-payment-status': 'ERROR',
                            message: 'Erro ao obter status do pagamento.',
                        }));
                    });
            }, 3000); // Reduzi o intervalo para 3 segundos (ajuste conforme necessário)

            return () => clearInterval(interval);
        }
    }, [paymentIntentId]);

    function updateCart() {

        const newCart = cartService.getCart();
        setCart(newCart);
    }



    function formatTotalValue(totalValue: number): number {
        const valueInCents = totalValue * 100;
        const roundedValue = Math.round(valueInCents);
        return Math.abs(roundedValue);
    }

    const handlePagamento = () => {
        updateCart();
        if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
            if (typeof cart.total !== 'number' || isNaN(cart.total)) {
                console.error('Valor total do carrinho inválido:', cart.total);
                return;
            }
            const name = cart.items.map(x => x.name).join(', ');

            setFormattedTotalValue(formatTotalValue(Number(totalCartValue)));
            setDialogInfoData({ visable: true, message: 'Iniciando' }); // Define a mensagem correta
            mercadoPagoService.criarIntencaoPagamento({
                amount: formattedTotalValue,
                description: name,
                payment: {
                    type: paymentMethod,
                    ...(paymentMethod === 'credit_card' && { installments: instalmmentValue, installments_cost: "seller" }),
                },
                additional_info: {
                    external_reference: "12321hadas-12321jasd-12321jasda-123j213asd",
                    print_on_terminal: true
                }
            }).then(response => {
                setPaymentStatus('Aguardando pagamento');
                setPaymentIntentId(response.data.id);

            });
        } else if (paymentMethod === 'Dinheiro' || paymentMethod === 'Pix') {
            console.log('Pagamento com', paymentMethod, '. Intenção de pagamento não enviada.');
            setDialogInfoData({ visable: true, message: 'Pagamento em ' + paymentMethod + '. Processamento manual.' });

        } else if (paymentMethod) {
            console.error('Selecione uma forma de pagamento.');
            setDialogInfoData({ visable: true, message: 'Selecione uma forma de pagamento.' });

        }
    }


    useEffect(() => {


        if (paymentMethod !== "pix") return; // só roda se for PIX
        if (!order || order.items.length === 0) return; // precisa ter itens

        const orderPixDTO: OrderItemPixRequestDTO = {
            orderId: String(order.id),
            title: "Pedido PIX",
            description: "Compra via PIX",
            orders: order.items.map(
                item => new OrderItemPixDTO(item.name, item.price, item.quantity, item.subTotal)
            )
        };

        mercadoPagoService.createQrCode(orderPixDTO)
            .then(response => {
                console.log("Resposta QR Pix:", response.data);
                setQrCodePix(response.data.qr_code_string);
                console.log(qrCodePix);
            })
            .catch(error => {
                console.error("Erro ao gerar QR PIX:", error);
            });

    }, [order, paymentMethod]);



    function handlePaymentMethod(event: any) {
        setPaymentMethod(event.target.value);

        const newPaymentMethod = event.target.value;
        paymentService.savePayment(newPaymentMethod);


    }

    function handleInstalment(event: any) {

        setInstamentValue(parseInt(event.target.value, 10));
    }

    const handleDialogPayment = (confirm: boolean) => {
        setDialogInfoData({ ...dialogInfoData, visable: false });
        
        console.log(confirm);
    };

    return (

        <div className="dsc-payment-form">
            <h3>Forma da pagamento</h3>
            <div>
                <select className="dsc-btn dsc-btn-primary dsc-payment-method" onChange={handlePaymentMethod}>
                    <option value="">Selecione a forma de pagamento</option>
                    <option value="debit_card">Cartão de débito</option>
                    <option value="credit_card">Cartão de crédito</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="pix">Pix</option>

                </select>
            </div>
            {paymentMethod === "credit_card" ?
                <div className="dsc-installments">
                    <p>Nº de Parcelas: </p>
                    <select className="dsc-btn dsc-btn-primary dsc-installments " onChange={handleInstalment}>
                        <option value="1">1x</option>
                        <option value="2">2x</option>
                        <option value="3">3x</option>
                        <option value="4">4x</option>
                        <option value="5">5x</option>
                        <option value="6">6x</option>
                        <option value="7">7x</option>
                        <option value="8">8x</option>
                        <option value="9">9x</option>
                        <option value="10">10x</option>
                        <option value="11">11x</option>
                        <option value="12">12x</option>
                    </select>
                </div> : ""

            }

            {paymentMethod === "pix" && qrCodePix && 
                <QrCodePix qrCode={qrCodePix} onDialogClose={() => setQrCodePix(undefined)} />
            }

            <button className="dsc-btn dsc-btn-blue" onClick={handlePagamento}>Realizar Cobrança</button>
            {dialogInfoData.visable && (
                <div className="dsc-dialog-background">
                    <div className="dsc-dialog-box" data-payment-status={paymentStatus}>
                        {paymentStatus === 'OPEN' && <p>Iniciando máquinha  ou Aperte cobrar</p>}
                        {paymentStatus === 'ON_TERMINAL' && <p>Aguardando pagamento</p>}
                        {paymentStatus === 'PROCESSING' && (
                            <div className="loading-container">
                                <p>Processando pagamento...</p>
                                <img src={loadingGif} alt="Processando pagamento..." />
                            </div>
                        )}
                        {paymentStatus === 'PROCESSED' && <p>Pagamento aprovado</p>}
                        {paymentStatus === 'CONFIRMATION_REQUIRED' && <p>Confirmação necessária no dispositivo</p>}
                        {paymentStatus === 'FINISHED' && <p>Pagamento finalizado</p>} {/* Usa a mensagem do estado */}
                        {paymentStatus === 'CANCELED' && <p>Venda cancelada</p>} {/* Usa a mensagem do estado */}
                        {paymentStatus === 'ERROR' && <p>Erro no cartão</p>} {/* Usa a mensagem do estado */}
                        {paymentStatus === 'ABANDONED' && <p>Tempo limte excedido</p>}
                        {paymentStatus === undefined && null && <p>Iniciando</p>}
                        {!paymentStatus && <p>Inicie novamente...</p>} {/* Usa a mensagem do estado */}

                        <div className="dsc-dialog-btn-container">
                            <div onClick={() => handleDialogPayment(false)}>
                                <ButtonSecondy text="Fechar" />
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </div>



    );


}
