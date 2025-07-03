import * as paymentRepository from '../localstorage/payment-repository';

export function savePayment(payment: string) {
    paymentRepository.save(payment);
}


/*função para retorna um objeto */
export function getPayment() : string{
    return paymentRepository.get();
}
