

export type PaymentDTO = {
    installments: number;
    type: "credit_card" | "debit_card" | "cash";
    installments_cost: "seller" | "buyer";
}

export type AdditionalInfoDTO = {
    external_reference: string;
    print_on_terminal: boolean;
  };

export type PaymentDataDTO = {

    amount: number;
    description: string;
    payment: PaymentDTO;
    additional_info: AdditionalInfoDTO;
  
}

export type PaymentMethod = {
    paymentMethod: string;
}