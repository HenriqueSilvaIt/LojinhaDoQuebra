import { TOKEN_KEy } from "../utils/system";


/*função que vai salvar no loca storage somente o token da requisição */
export function save(token: string) {
        localStorage.setItem(TOKEN_KEy, token)
}

/* obter token do localStorage */

export function get() : string | null{ /*getItem do local storage retorna string ou| nul
    porque a chave token key pode n existir no local storage */
 return localStorage.getItem(TOKEN_KEy);
}


/*remover token do local storage */
export function remove() {
    localStorage.removeItem(TOKEN_KEy);
}