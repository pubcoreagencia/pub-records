function addDays(date, days) {
  const clone = new Date(date);
  clone.setDate(clone.getDate() + days);
  return clone.toISOString();
}

export const DeliveryService = {
  buildDownloadRecord(orderItem, customerId, fileId) {
    const now = new Date().toISOString();
    return {
      id: "down-" + orderItem.id + "-" + fileId,
      order_item_id: orderItem.id,
      customer_id: customerId,
      file_id: fileId,
      download_count: 0,
      last_downloaded_at: null,
      expires_at: addDays(now, 60),
      created_at: now
    };
  },

  getEligibleFileTypes(licenseType) {
    const types = ["mp3_final", "license_pdf"];
    if (licenseType.includes_wav) types.push("wav_final");
    if (licenseType.includes_stems) types.push("stems");
    return types;
  },

  secureToken(orderId, itemId, fileType) {
    return btoa(orderId + ":" + itemId + ":" + fileType + ":PUB-SECURE").replace(/=+$/g, "");
  },

  createLicenseText(order, item, beat, licenseType, customer) {
    return [
      "PUB RECORDS - comprovante de licenca",
      "Pedido: " + order.id,
      "Cliente: " + customer.name + (customer.artist_name ? " (" + customer.artist_name + ")" : ""),
      "Beat: " + beat.title,
      "Licenca: " + licenseType.name,
      "Valor: R$ " + item.price.toFixed(2).replace(".", ","),
      "Status de pagamento: " + order.payment_status,
      "Entrega: " + order.delivery_status,
      "Uso permitido: " + licenseType.usage_limit,
      "Monetizacao: " + (licenseType.allows_monetization ? "sim" : "nao"),
      "Distribuicao digital: " + (licenseType.allows_distribution ? "sim" : "nao"),
      "WAV incluso: " + (licenseType.includes_wav ? "sim" : "nao"),
      "Stems inclusos: " + (licenseType.includes_stems ? "sim" : "nao"),
      "Observacao: guarde este comprovante junto aos arquivos recebidos.",
      "A compra concede licenca de uso, nao transferencia automatica de autoria."
    ].join("\n");
  }
};
