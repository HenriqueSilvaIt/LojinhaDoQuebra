export const CART_KEY= "com.devsuperior.ecommerce/Cart";
export const PAYMENT_Key= "com.devsuperior.ecommerce/Payment";
export const TOKEN_KEy = "com.devsuperior.ecommerce/art";
export const TOKEN_MERCADO= "mercado.api.livre";

/* coloca variavel de ambiente e caso n esteja configura ??(operador de coalesencia nula, se n existir
 variavel da esquerda pega por padrão o valo da direita) colcoa um valor padrão no lugar */
//export const BASE_URL = import.meta.env.VITE_BACKEND_URL ?? "https://lojinhadoquebrabackend-production.up.railway.app/";  /* se 
export const BASE_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8091";  /* se 

// tiver configurado na ferramenta na nuvem a variavel, por padrão tem que ser pega
// diretóreto de lá,  mas com oestamos rodando na máquina vamos coloc aq
*/
export const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
export const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

export const CLIENT_MERCADO = import.meta.env.VITE_CLIENT_MERCADO;
export const SECRET_MERCADO = import.meta.env.VITE_SECRET_MERCADO;
export const MERCADO_URL = import.meta.env.VITE_MERCADO_URL; 

export const DEVICE_ID = import.meta.env.VITE_DEVICE_ID; 
