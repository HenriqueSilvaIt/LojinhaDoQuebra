import { createContext } from "react";


export type ContextCartCountType = {
    contextCartCount: number; /*dado*/
    setContextCartCount: (contextCartCount: number) => void; /*função que altera o dado */

    /*  setContextCartCount: Function;  */
}

/*criando context - tem que importa o creteContex */

export const ContextCartCount = createContext<ContextCartCountType>({
    contextCartCount: 0, 
    setContextCartCount: () => {}  

})

