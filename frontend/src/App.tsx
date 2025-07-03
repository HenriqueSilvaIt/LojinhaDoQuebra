

import { Navigate, Route, Routes } from 'react-router-dom';
import Catalog from './routes/ClientHome/Catalog';
import ProductDetails from './routes/ProductDetails';
import ClientHome from './routes/ClientHome';
import Cart from './routes/ClientHome/Cart';
import { useEffect, useState } from 'react';
import { ContextCartCount } from './utils/context-cart';
import Login from './routes/ClientHome/Login';
import AdminHome from './routes/Admin/AdminHome';
import Admin from './routes/Admin';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { history } from './utils/history.ts';
import { PrivateRoute } from './components/PrivateRoute/index.tsx';
import { AccessTokenPayloadDTO } from './models/auth.ts';
import * as authService from './services/auth-service.ts';
import * as cartService from './services/cart-services.ts';
import { ContextToken } from './utils/context-token.ts';
import Confirmation from './routes/ClientHome/Confirmation/index.tsx';
import ProductListing from './routes/Admin/ProductListing/index.tsx';
import ProductForm from './routes/Admin/ProductForm/index.tsx';
import RegisterForm from './routes/ClientHome/RegisterForm/index.tsx';
import OrderHistory from './routes/Admin/OrderHistory/index.tsx';
import { ContextPaymentMethod } from './utils/context-payment.ts';

export default function App() { /*export default quer dizer que estamos exportando e o default quer dizer que desse
  documento só estamos exportando essa função */

  const [contextCartCount, setContextCartCount] = useState<number>(0); //useState começando com 0

  const [contextTokenPayload, setContextTokenPayload] = useState<AccessTokenPayloadDTO>(); /*
  com a informação do TOken*/

  const [contextPaymentMethod, setContextPaymentMethod] = useState<string>();


  /* useEffect para iniciar o token com algum valor */

  useEffect(() => {

    setContextCartCount(cartService.getCart().items.length); /* inicia o carrinho já com o valor
    da quantidade itens no carrinho que estpa no localStorage*/

    if (authService.isAuthenticated()) {
    const payload = authService.getAccessTokenPayload(); 
    setContextTokenPayload(payload); /*inciia o useS  useStat contextTokenPayload ja
    com valor armazenado no localStorage */
    }
    }, []);

    

  return ( /* esse <> </> é um fragment, sempre que tenho mais de 1 elemento html eu preciso colocar 
    dentro de um fragment, porque eu só posso ter 1 elemento java script de retorno que é um fragment */
    /* Por padrão tem que importar
    o BrowserRouter, Routes e  Route e por padrão temos que colocar
     a primeira rota como sendo o caminho "/"que é  a rota raiz e no element dela
     você passa a página que você quer colocar como inicial (normalmente colocamos
     o componente dessa página) */
<ContextPaymentMethod.Provider value={{ contextPaymentMethod, setContextPaymentMethod }}>
<ContextToken.Provider value={{ contextTokenPayload, setContextTokenPayload }}>
    <ContextCartCount.Provider value={{ contextCartCount, setContextCartCount }}>
      <HistoryRouter history={history}>
        <Routes>
          <Route path="/" element={<ClientHome />}>
            <Route index element={<Catalog />} />
            <Route path="catalog" element={<Catalog />} />
            <Route path="product-details/:productId" element={<ProductDetails />} />
            <Route path="cart" element={<Cart />} />
            <Route path="login" element={<Login />} />
            <Route path="/register" element={<RegisterForm/>} />
    
            <Route path="confirmation/:orderId" element={<PrivateRoute><Confirmation/></PrivateRoute>} />
          </Route>
          <Route path="/admin/" element={<PrivateRoute roles={['ROLE_ADMIN']}><Admin /></PrivateRoute>}>
            <Route index element={<Navigate to="/admin/home"/>} />
            <Route path="home" element={<AdminHome />} />
            <Route path="products" element={<ProductListing/>} />
            <Route path="products/:productId" element={<ProductForm/>} />
            <Route path="history" element={<OrderHistory/>} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />  
        </Routes>
      </HistoryRouter>
    </ContextCartCount.Provider>
    </ContextToken.Provider>
    </ContextPaymentMethod.Provider>
  ); /* cria uma rota irm para o admi
  /* o primeiro route é a rota principal
  vamos deixar o cabeçalho na rota mãe e os conteúdo da página vamos deixar
  como subrota da rota do cabeçalho */
}

/*Confirmation ta dentro do privateRoute, porém o private route n precisa de role, porque qualquer
usuário pode acessar essa página, mas precisa estar logado, por isso colocamos o private route*/


/* Tem como colegar um path home e usar o navigate para redirecionar a pasta inicial /admin para /admin/home*/  