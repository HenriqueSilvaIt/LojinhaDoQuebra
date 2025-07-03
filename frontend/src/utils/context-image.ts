import { createContext } from "react";


export type ImageContextType  = {
    imageUrl: string | null;/*dado*/
    setImageUrl: (ImageContextType: string) => void; /*função que altera o dado */

    /*  setContextCartCount: Function;  */
}

/*criando context - tem que importa o creteContex */

export const ImageContext = createContext<ImageContextType>({
    imageUrl: '', 
    setImageUrl: () => {}  

})

