export const paymentProviders = [
  {
    id: "mock-card",
    name: "Cartao de credito",
    gateway: "Cartao",
    status: "paid",
    delivery: "entregue",
    description: "Confirma pagamento imediatamente para liberar a entrega digital."
  },
  {
    id: "pix-manual",
    name: "Pix",
    gateway: "Pix",
    status: "pending",
    delivery: "aguardando_pagamento",
    description: "Cria um pedido pendente ate a confirmacao do pagamento."
  }
];

export const PaymentService = {
  getProvider(providerId) {
    return paymentProviders.find(function (provider) { return provider.id === providerId; }) || paymentProviders[0];
  },

  createPaymentIntent(order, providerId) {
    const provider = this.getProvider(providerId);
    const now = Date.now().toString(36).toUpperCase();
    return {
      id: "pay-" + now,
      order_id: order.id,
      provider: provider.id,
      amount: order.total_amount,
      status: provider.status,
      provider_reference: provider.gateway.toUpperCase().replace(/\s+/g, "-") + "-" + now,
      created_at: new Date().toISOString(),
      next_action: provider.status === "pending" ? "Aguardando confirmacao do pagamento." : "Pagamento aprovado."
    };
  }
};
