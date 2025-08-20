
    import deleteImg from '../../../assets/delete.svg';
    import editIm from '../../../assets/edit.svg';
    import './style.css';
    import * as productService from '../../../services/product-services';
    import { useEffect, useState } from 'react';
    import { ProductDTO } from '../../../models/product';
    import SerachBar from '../../../components/SearchBar';
    import ButtonNextPage from '../../../components/ButtonNextPage';
    import DialogInfo from '../../../components/DialogInfo';
    import DialogConfirmation from '../../../components/DialogConfirmation';
    import ButtonSecondy from '../../../components/ButtonSecondy';
    import { useNavigate } from 'react-router-dom';

    type QueryParams = {
        page: number,
        name: string;
    }

    export default function ProductListing() {

        const [isLastPage, setIsLastPage] = useState(false);

        const navigate = useNavigate();

        const [dialogInfoData, setDialogInfoData] = useState({
            visable: false,
            message: 'Sucesso'
        })

        const [dialogConfirmationData, setDialogConfirmationData] = useState({
            visable: false,
            id: 0,
            message: 'Tem certeza?'
        })

        const [products, setProducts] = useState<ProductDTO[]>([]);

        const [queryParams, setQueryParams] = useState<QueryParams>({
            page: 0,
            name: ""
        })

        useEffect(() => {

            productService.findAll(queryParams.page, queryParams.name) /*MÉTODO do service que vai chamar a requisição com axios */
                /* axios.get("http://localhost:8090/products/?size=12") size é a quantidade
                de objetos que quero que retorna dessa requisição http */
                .then(response => { /*retorno acima é uma promisse, então vamos usar o then para dizer
                    oque vai fazer se essa resposta retornar com sucesso */
                    const nextPage = response.data.content;
                    setProducts(products.concat(nextPage)); /*para aparecer os produtos
                    na mesma página, estamos pegando o resultado do products + resultado próxima tela /* set Product vai pegar o retorno da Http que é os objetos
                    e colocar no objeto Product
                    response.data pega só a informação do objeto
                    mas como no Json da api os objetos estão dentro de um vetor/list nós colocamos o .content no final
                    (content é o nome do vetor/lista que criamos  no json) */
                    setIsLastPage(response.data.last); /* dentro do http tem um atributo last
                    que ele mostra quando é a ultima pagina da pesquisa */
                })
        }, [queryParams]); /*sempre que mudar productName tem que refazer a consulta do useEffect*/


        function handleNextPageClick() {
            setQueryParams({ ...queryParams, page: queryParams.page + 1 }); /*
            ao clicar no botão, ele ta dizendo que vai receber os produtos que já tinha na página
            ...queryParams + page: queryParama.page + 1, e mais o produto da página seguinte */
        }
        /*como estamos chamando o componente      <HeaderClient /> temos o html todo mais esse compoenente
        como é dois tem que colocar dentro do fragment <>  </*/



        function handleDialogInfoClose() {
            setDialogInfoData({ ...dialogInfoData, visable: false });

        }

        function handleDeleteClick(productId: number) {
            setDialogConfirmationData({ ...dialogConfirmationData, id: productId, visable: true });
        }
    



        /* Funação que responde a resposta se quer deletar o item ou não*/
        function handleDialogConfirmationAnswer(answer: boolean, orderId: number | null, productId: number | null) {
            if (answer === true && productId !== null) {
                productService.deleteById(productId)
                
                    .then(() => {
                        setProducts([]);
                        setQueryParams({ ...queryParams, page: 0 });
                        console.log(orderId);
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

        function handleNewProductClick() {
            navigate("/admin/products/create");
        }

        function handleUpdateClick(productId: number) {
            navigate(`/admin/products/${productId}`)
        }

        function handleSearch(searchText: string) {
            setProducts([]);/* eu vou zerar a lista , para quando eu digitar ele 
            começar denovo na primeria página*/
            setQueryParams({ ...queryParams, page: 0, name: searchText }) /* o queryParams vai receber oque tinha nele
            ... , page = 0 para quando ele for pequisar zerar a página o nome dele vai receber oque for atualizado na variavel searchText(que puxa do que está sendo
            escrito no input) quando for realizdo uma busca no SearchBar com
            a função onSearch, automaticamente ele vai chamar essa função handleSearch que vai atualizar o
            estado do productName (utilizando o setProductName e atualizar na request do useEffect) com o valor que estiver digitado lá no SearchBar
            que é o argumento (searchText) dessa função handleSearch */

        }

   

        return (
            <main>
                <section id="product-listing-section" className="dsc-container">
                    <h2 className="dsc-section-title dsc-mb20">Cadastro de produtos</h2>
                    <div className="dsc-btn-page-container dsc-mb20">
                        <div >
                            <div onClick={handleNewProductClick}>
                                <ButtonSecondy text="Novo" />
                            </div>
                        </div>
                    </div>
                    <SerachBar onSearch={handleSearch} placeholder="Nome do produto" />

                    <table className="dsc-table dsc-mb20 dsc-mt20">
                        <thead>
                            <tr>
                                <th className="dsc-tb576">Id</th>
                                <th className="dsc-tb576">Código de barra</th>
                                <th ></th>
                                <th className="dsc-text-left">Nome</th>
                                <th className="dsc-tb768" >Preço</th>                         
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                products.map(product => (
                                    <tr key={product.id}>
                                        <td className="dsc-tb576">{product.id}</td>
                                        <td className="dsc-tb576">{product.barCode}</td>
                                        <td>
                                        {product.imgUrl && (   <img
                                                className="dsc-product-listing-image"
                                                src={product.imgUrl}
                                                alt={product.name}
                                            /> )}
                                        </td>
                                        <td className="dsc-text-left">{product.name}</td>
                                        <td className="dsc-tb768">R$ {product.price.toFixed(2)}</td> 
                                        <td>
                                            <img
                                                className="dsc-product-listing-btn"
                                                onClick={(() => handleUpdateClick(product.id))}
                                                src={editIm}
                                                alt="edi"
                                            />
                                        </td>
                                        <td>
                                            <img onClick={() => handleDeleteClick(product.id)}
                                                className="dsc-product-listing-btn"
                                                src={deleteImg}
                                                alt="delet"
                                            />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {!isLastPage &&
                        <ButtonNextPage onNextPage={handleNextPageClick} />

                    }
                </section>
                {dialogInfoData.visable &&
                    <DialogInfo message={dialogInfoData.message} onDialogClose={handleDialogInfoClose} />}

    {dialogConfirmationData.visable && (
    <DialogConfirmation
        productId={dialogConfirmationData.id}
        message={dialogConfirmationData.message}
        orderId={null}
        onDialogAnswer={(answer: boolean, orderId: number | null, productId: number | null) => handleDialogConfirmationAnswer(answer, orderId, productId)}
    />
)}
        
            </main>
        );
    } 