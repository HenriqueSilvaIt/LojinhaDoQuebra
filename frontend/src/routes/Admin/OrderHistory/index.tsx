import './style.css';
import { useEffect, useState } from 'react';
import * as orderService from '../../../services/order-service'
import moment from 'moment'; // Importe moment.js
import deleteImg from '../../../assets/delete.svg';
import DialogConfirmation from '../../../components/DialogConfirmation';
import DialogInfo from '../../../components/DialogInfo';
import loadingi from '../../../assets/loadi.gif';
import ButtonNextPage from '../../../components/ButtonNextPage';
import { HistoryDTO } from '../../../models/history';



type QueryParams = {

    page: number;
    minDate: string;
    maxDate: string;

}

export default function OrderHistory() {



    const [queryParams, setQueryParams] = useState<QueryParams>({
        page: 0,
        minDate: '',
        maxDate: ''
    });
    const [isLastPage, setIsLastPage] = useState<boolean>(false);
    const [allOrders, setAllOrders] = useState<HistoryDTO[]>([]);
    const [totalPeriodAmount, setTotalPeriodAmount] = useState<number>(0);

    const [filterDate, setFilterDate] = useState<string>('');
    const [filterMonth, setFilterMonth] = useState<string>('');
    const [filterWeek, setFilterWeek] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false); // Novo estado para controlar o loading
    // const [queryParams] = useState<QueryParams>({page: 0})

    const [dialogInfoData, setDialogInfoData] = useState<{
        visable: boolean;
        message: string;
    }>({
        visable: false,
        message: 'Sucesso'
    });

    const [dialogConfirmationData, setDialogConfirmationData] = useState<{
        visable: boolean;
        orderId: number | null;
        productId: number | null;
        message: string;
    }>({
        visable: false,
        orderId: null,
        productId: null,
        message: 'Tem certeza?'
    });


    // Hook para filtrar a data de hoje caso não seja passado parâmetro de data
    useEffect(() => {
        const today = moment().format('YYYY-MM-DD');
        setFilterDate(today);
        setQueryParams(prev => ({ ...prev, minDate: today, maxDate: today, page: 0 }));
    }, []);

    //Hook para atualizar filtro de data com base no input

    useEffect(() => {
        let newMinDate: string = '';
        let newMaxDate: string = '';

        if (filterDate) {
            newMinDate = filterDate;
            newMaxDate = filterDate;
            console.log(`Filtro Diário: minDate=${newMinDate}, maxDate=${newMaxDate}`);
        } else if (filterMonth) {
            //Filttro do primeiro dia do mÊs até o último dia do mês
            const startOfMonth = moment(filterMonth).startOf('month').format('YYYY-MM-DD'); // 1º dia do mÊs
            const endOfMonth = moment(filterMonth).endOf('month').format('YYYY-MM-DD');

            newMinDate = startOfMonth;
            newMaxDate = endOfMonth;

            console.log(`Filtro Mensal: minDate=${newMinDate}, maxDate=${newMaxDate}`);

        } else if (filterWeek) {
            // Weekly filter: This is tricky. HTML type="week" gives "YYYY-W##" (e.g., "2025-W26")
            // We need to parse this to get the start and end of the week.
            // Moment.js can parse 'YYYY-WW' format.

            const year = filterWeek.substring(0, 4);
            const weekNumber = filterWeek.substring(6);

            const startOfWeek = moment().year(parseInt(year)).week(parseInt(weekNumber)).startOf('week')
                .format('YYYY-MM-DD');
            const endOfWeek = moment().year(parseInt(year)).week(parseInt(weekNumber)).endOf('week')
                .format('YYYY-MM-DD');

            newMinDate = startOfWeek;
            newMaxDate = endOfWeek;
            console.log(`Filtro Semanal: minDate=${newMinDate}, maxDate=${newMaxDate}`);

        } else {
            console.log(`Nenhum filtro ativo: minDate=${newMinDate}, maxDate=${newMaxDate}`);
            newMinDate = '1900-01-01'; // Very old date
            newMaxDate = '2100-12-31'; // Very far date

        }

        if (newMinDate !== queryParams.minDate || newMaxDate !== queryParams.maxDate) {
            setQueryParams(prev => ({
                ...prev,
                page: 0, // Reset page to 0 whenever filters change
                minDate: newMinDate,
                maxDate: newMaxDate,
            }));
        }
    }, [filterDate, filterMonth, filterWeek, queryParams.minDate, queryParams.maxDate]);



    //Método que busca os items de venda do backend
    useEffect(() => {
        // setFilterDate(moment().format('YYYY-MM-DD'));

        if (queryParams.minDate && queryParams.maxDate) {
            setLoading(true); // Inicia o loading
            orderService.findAll(queryParams.page, queryParams.minDate, queryParams.maxDate)
                .then((response: any) => {
                    // Acesse a propriedade 'content' para obter o array de pedidos
                    const newOrders = response.data.historyPage.content;
           
                    if (queryParams.page === 0) {
                        // Se é a primeira página (ou um novo filtro), substitui os pedidos
                        setAllOrders(newOrders);
                    } else {
                        // Se é uma página subsequente, concatena os novos pedidos
                        setAllOrders(prevOrders => prevOrders.concat(newOrders));
                    }
                    // Acesse a propriedade 'historyPage.last' para verificar se é a última página
                    setIsLastPage(response.data.historyPage.last);
                    setTotalPeriodAmount(response.data.totalAmountForPeriod || 0);
                }).catch(() => {
                    setDialogInfoData({ visable: true, message: "Erro ao carregar os pedidos." });
                }).finally(() => {
                    setLoading(false)
                });
        }

    }, [queryParams]);


    function handleFilterDateChange(event: any) {
        event.preventDefault();
        setFilterDate(event.target.value);
        setFilterMonth('');
        setFilterWeek('');

    };

    function handleFilterMonthChange(event: any) {
        event.preventDefault();
        setFilterMonth(event.target.value);
        setFilterDate('');
        setFilterWeek('');
    }

    function handleFilterWeekChange(event: any) {
        event.preventDefault();
        const weekInputValue = event.target.value;
        if (weekInputValue) {
            setFilterWeek(weekInputValue);
        } else {
            setFilterWeek('');
        }
        setFilterDate('');
        setFilterMonth('');
        console.log(event.target.value)
    }

    function handleCleanFilter(event: any) {
        event.preventDefault();
        setFilterDate('');
        setFilterMonth('');
        setFilterWeek('');
    }



    function handleDeleteClick(orderId: number, productId: number) {
        setDialogConfirmationData({
            ...dialogConfirmationData,
            orderId: orderId,
            productId: productId,
            visable: true
        });
    }

    function handleNextPageClick() {
        setQueryParams({ ...queryParams, page: queryParams.page + 1 }); /*
            ao clicar no botão, ele ta dizendo que vai receber os produtos que já tinha na página
            ...queryParams + page: queryParama.page + 1, e mais o produto da página seguinte */
    }

    function handleDialogConfirmationAnswer(answer: boolean, orderId: number | null, productId: number | null) {
        if (answer === true && orderId !== null && productId !== null) {
            orderService.deleteById(orderId, productId)
                .then(() => {
                    //setAllOrders(allOrders.filter((order: HistoryDTO) => order.id !== orderId));
                    setDialogInfoData({ visable: true, message: "Item excluido com sucesso" });
                })
                .catch(error => {
                    setDialogInfoData({
                        visable: true,
                        message: error.response.data.error
                    });
                });
        }
        setDialogConfirmationData({ ...dialogConfirmationData, visable: false });
    }

    return (
        <main>
            <section id="product-listing-section" className="dsc-container">

                <h2 className="dsc-section-title dsc-mb20">Histórico de vendas</h2>
                <div className="dsc-btn-page-container dsc-mb20">
                    <div className="dsc-filter-container">
                        <div>
                            <h4> Dário: </h4>
                            <input
                                className="dsc-filter-date"
                                type="date"
                                value={filterDate}
                                onChange={handleFilterDateChange}
                            />
                        </div>
                        <div>
                            <h4> Mensal:</h4>
                            <input
                                className="dsc-filter-date"
                                type="month"
                                value={filterMonth}
                                onChange={handleFilterMonthChange}
                            />
                        </div>
                        <div>
                            <h4> Semanal: </h4>
                            <input
                                className="dsc-filter-date"
                                type="week"
                                name="week"
                                id="camp-week"
                                value={filterWeek}
                                onChange={handleFilterWeekChange} />
                        </div>

                        <button className="dsc-btn-clean" onClick={handleCleanFilter}>Limpar Filtro</button>
                    </div>
                </div>
                <div className="dsc-total-sales">
                    <h3>Total de vendas: </h3>
                    <h4> R$ {totalPeriodAmount.toFixed(2)}</h4>
                </div>
                {

                }
             

                    <table className="dsc-table dsc-mb20 dsc-mt20">
                        <thead>
                            <tr>
                                <th className="dsc-tb576">Número da venda</th>
                                <th className="dsc-product-name">Nome da Produto</th>
                                <th className="dsc-tb768">Data</th>
                                <th className="dsc-tb768">Quantidade de produtos</th>
                                <th>Valor</th>
                                <th>Deletar pedido</th>
                            </tr>
                        </thead>


                        <tbody>
                            {allOrders?.map(order =>
                            // Adicionamos uma verificação para garantir que 'item' não seja undefined
                            (
                                <tr key={`${order.orderId}-${order.productId}`}>
                                    <td className="dsc-tb576">{order.orderId}</td>
                                    <td>{order.productName}</td>
                                    <td className="dsc-tb768">{moment(order.orderMoment).format('DD/MM/YYYY HH:mm')}</td>
                                    <td className="dsc-tb768">{order.quantity}</td>
                                    <td>R$ {order.subTotal.toFixed(2)}</td>
                                    <td>
                                        <img
                                            onClick={() => {
                                                if (order.orderId !== undefined && order.productId !== undefined) {
                                                    handleDeleteClick(order.orderId, order.productId);
                                                } else {
                                                    console.error("IDs de pedido ou produto indefinidos.");
                                                }
                                            }}
                                            className="dsc-product-listing-btn"
                                            src={deleteImg}
                                            alt="delet"
                                        />


                                    </td>
                                </tr>
                            )

                            )}

                
              
                        </tbody>
                  

                    </table>
                
                 
            </section>

                 {loading ? (
                    <div className="dsc-loading-container">
                        <img src={loadingi} alt="Carregando..." />
                        <p>Carregando os dados...</p>
                    </div>): !isLastPage &&
                            <div className='dsc-button-next-page'>
                                <ButtonNextPage onNextPage={() => handleNextPageClick()} />
                            </div>
                
            }


            {dialogConfirmationData.visable && dialogConfirmationData.orderId !== null && dialogConfirmationData.productId !== null && (
                <DialogConfirmation
                    orderId={dialogConfirmationData.orderId}
                    productId={dialogConfirmationData.productId}
                    message={dialogConfirmationData.message}
                    onDialogAnswer={handleDialogConfirmationAnswer}
                />
            )}
            {dialogInfoData.visable && (
                <DialogInfo message={dialogInfoData.message} onDialogClose={() => setDialogInfoData({ ...dialogInfoData, visable: false })} />
            )}


        </main>
    );
} 
