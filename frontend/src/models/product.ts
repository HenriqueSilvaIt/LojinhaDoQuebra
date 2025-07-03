 /* type é uma especificação do type  script
DTO (data transf object) é chamado DTO para representar um objeto que trafega dados */

import { CategoryDTO } from "./category";


/* função construtora de objeto (como fosse classe no jav)*/ 
 export type ProductDTO = {
    id: number;
    name: string;
    description: string;
    price: number; /* Number é um tipo genérico no javascript e type, para representar números
    tanto número inteiros como números decimais */
    imgUrl: string;
    /* como é um array dentro do JSON do backend fazemos a chamada
    do outro arquivo dessa forma */
    barCode: string;
    dateBuy: string | Date;
    dueDate: string | Date;
    quantity: number;
    categories: CategoryDTO[]; /* CTRL + espaço para
    importa o objeto do outro arquivo, Tem que colocar o [] porque é um array */

 } 