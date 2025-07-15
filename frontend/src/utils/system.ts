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
export const CLIENT_ID = import.meta.env.VITE_CLIENT_ID ?? "myclientid";
export const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET ?? "myclientsecret";

export const ACCESS_TOKEN_M = import.meta.env.VITE_ACCESS_TOKEN_MERCADO ?? "APP_USR-227308504402034-040212-16e7bfeb51ef4698d52250027fb5065b-333058261";

export const CLIENT_MERCADO = import.meta.env.VITE_CLIENT_MERCADO ?? "227308504402034";
export const SECRET_MERCADO = import.meta.env.VITE_SECRET_MERCADO ?? "sQk5vli1Cqmxey3Lqv8BxeXyffCSFwwx";
export const MERCADO_URL = import.meta.env.VITE_MERCADO_URL ?? "https://api.mercadopago.com/oauth/token"; 

export const DEVICE_ID = import.meta.env.VITE_DEVICE_ID ?? "NEWLAND_N950__N950NCB901528800"; 
