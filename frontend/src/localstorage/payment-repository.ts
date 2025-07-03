import {PAYMENT_Key} from '../utils/system'

export function save(payment: string) {
    const obj = JSON.stringify(payment)
localStorage.setItem(PAYMENT_Key, obj);

}

/*método utilziado para buscar do local storage */

export function get(): string {
    const str = localStorage.getItem(PAYMENT_Key) || '';
    
    /* criando objeto e percorrendo item dto para o proto type reconhecer o objet 
    OrderItem */
  

    return str;
}