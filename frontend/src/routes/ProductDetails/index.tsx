import ButtonPrimary from "../../components/ButtonPrimary";
import ButtonSecondy from "../../components/ButtonSecondy";
import ProductDetailsCard from "../../components/ProductDetailsCard";
import './styeles.css'
import * as productSerivce from '../../services/product-services';
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ProductDTO } from "../../models/product";
import * as cartService from '../../services/cart-services';
import { ContextCartCount } from "../../utils/context-cart";
import * as authService from '../../services/auth-service';
import { ContextToken } from "../../utils/context-token";

export default function ProductDetails() {


    const { contextTokenPayload } = useContext(ContextToken);

    /*fazendo o reactRouter dom pegar o Id que colocarmos na rota(url) */

    const params = useParams(); /* vamos utilizar esse objeto padrão
use params para ler o parâmetro que está sendo passado na rota(url)
como colocamos o nome do parâmetro no app.tsx de productid para rota do product-details
vamos colocar esse mesmo nome dentro do findbyId, passando params.productId
com isso estamos dizendo que o parâmetro da rota é o que tiver digitado lá */


    /* variavel navigate para direcionar para outra tela caso
    n seja encontrado o id do produto */
    const navigate = useNavigate(); /* tem que importar o useNavigate do react router dom */

    /* pegando useState contexto global */

    const { setContextCartCount } = useContext(ContextCartCount); /*dentro do useContext
colocamos  a função do util */

    /* para buscar objeto por id do backend tem que ser assíncrono, por isso temos que usar o react
    hook useState e userEffect */

    const [product, setProduct] = useState<ProductDTO>(); /* esse atributo product do useState
ele vai começar com undefined recebendo o productDto */

    /* useEffect para quando o componente for montado ele faça a requisiçãop pegando informação do backend */

    useEffect(() => {

        /*Fazendo requisição na API do backend com axios */

        /* tem que importa o objeto axios */
        /* para associar o objeto ao catalogo card, vamos pegar a variavel do useParams que é params
        que pega o id que colocamos lá na rota no app.tsx caso cliquemos em alguma produto
        
        Então em resumo a rota do ProductDetail que é pagina do site de lista do produtos, tem uma
        rota no app.tsx que o nome é productId, estamos associadando esse productId ao objeto product
        através do useState e useEffect, o useState pega o objeto product e o  useEffect
        troca a informação no objeto pelo id*/

        productSerivce.findById(Number(params.productId)) /*dentro do ("") no axios você chama url, ele faz tanto get tanto post e etc */
            /* o axios retorna uma promisse por isso vamos usar o then e dentro do then que pega a resposta
            da requisição e faz alguma coisa */
            .then(response => {
                console.log(response.data); /*response é a variavel que retorna o produto 2 do banco de dados
            que estamos pegando na url, response.data imprimi só os dados da resposta que é os dados
            do objeto da api*/
                setProduct(response.data); /*estamos pegando objeto que veio do backend e atribuindo apara
            o objeto product aqui front end*/
            }).catch(() => {
                /*navigate redireciona para outra página caso der error */
                /*console.log(error)*/

                navigate("/");  /*response.data imprimi só os dados da resposta que é os dados
            do objeto da api, normal aparecer na console o erro 404 é padrão do http para n encontrado*/
            });
        /* o strict mode vai fazer imprimir o objeto na console 2 vezes, ele faz isso para fazermos teste no ambiente
        de dev mas podemos tirar */

        /*const prod = productSerivce.findById(Number(params.productId)); /* quando o componente
        for montado, essa variavel, busca produto por id (com a função findbyId) lá no ProductService
        o productService pega do productDTo o id do objeto específico, e esse id vai retornar 
        nessa variavel prod
        use params para ler o parâmetro que está sendo passado na rota(url)
        setProduct(prod);*/
    }, []);





    /*const product = productSerivce.findById(Number(params.productId)); /* ele ta 
    reclamando, porque o findById nós colocamos lá nos services que ele espera um number,
    mais importe é saber que TUDo no protcolo HTTP é tudo string( então o params do useParams
    por padrão é string), com isso vamos mudar de 
    (params.productId) para (Number(params.productId) para converter para número */


    function handleBuyClick() {
        product && cartService.addProduct(product);
        /*número de itens do carrinho vai ser onúmero após o cartService.addProduct acima*/
        setContextCartCount(cartService.getCart().items.length);
        navigate("/cart");

    }
    return (

        <main>
            <section id="product-details-section" className="dsc-container">
                {
                    /*Renderização condicional do product
                    para o compilador n achar que ele pode ser undefined
            fazend product && 
            , se n for undefinied ai sim o compilador pode
            redenderizar(mostrar na tela) ele já verifica
            se existe algo no product Estamos testando se o product exist
             */
                    product &&/* se product n for undefinied faça:*/
                    <ProductDetailsCard product={product} />

                    /* usando página de n encontrado 
                            product ? /* se product n for undefinied faça:
                                    <ProductDetailsCard product={product} />
                                    : /* caso for undefnied faça: 
                                   <>
                                   <h1>Não encontrado</h1>
                                    <img src="https://www.casasbahia-imagens.com.br/App_Themes/CasasBahia/img/error/cb.png?imwidth=500" alt="i" />
                                    </> */
                }
               < div className="dsc-btn-page-container"> 
                {contextTokenPayload && authService.isAuthenticated() &&
                    
                <div onClick={handleBuyClick}>
                    <ButtonPrimary text="Comprar" />
                </div> 
                }
                
                <Link to="/">
                    <ButtonSecondy text="Início" />
                </Link>
            </div>
        </section>
        </main >
    );

}