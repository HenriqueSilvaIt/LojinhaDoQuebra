import { createContext } from "react";

export type ContextPaymentType = {
    contextPaymentMethod: string | undefined; /*dado*/
    setContextPaymentMethod: (ContextPaymentType: string) => void; /*função que altera o dado */

    /*  setContextCartCount: Function;  */
}

/*criando context - tem que importa o creteContex */

export const ContextPaymentMethod = createContext<ContextPaymentType>({
    contextPaymentMethod: '', 
    setContextPaymentMethod: () => {}  

})

