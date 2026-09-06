import { initialData } from "../data/mock-data.js?v=catalog-v6";
import { PaymentService } from "./payment.js";
import { DeliveryService } from "./delivery.js";

const STORAGE_KEY = "pub_records_beats_data_v6_catalog";
const CART_KEY = "pub_records_beats_cart_v6_catalog";
const SESSION_KEY = "pub_records_beats_session_v6_catalog";

const clone = function (value) { return JSON.parse(JSON.stringify(value)); };

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "beat-pub";
}

function nowIso() {
  return new Date().toISOString();
}

function statusIsBuyable(status) {
  return ["disponivel", "destaque", "exclusivo"].includes(status);
}

let data = readJson(STORAGE_KEY, clone(initialData));
let cart = readJson(CART_KEY, []);
let session = readJson(SESSION_KEY, { role: "cliente", email: "lia@example.com" });
const listeners = new Set();

function persist() {
  writeJson(STORAGE_KEY, data);
  writeJson(CART_KEY, cart);
  writeJson(SESSION_KEY, session);
}

function emit() {
  persist();
  listeners.forEach(function (listener) { listener(); });
}

function getProducer(id) {
  return data.producers.find(function (producer) { return producer.id === id; });
}

function getGenre(id) {
  return data.genres.find(function (genre) { return genre.id === id; });
}

function getLicense(id) {
  return data.licenseTypes.find(function (license) { return license.id === id; });
}

function getLicensePrice(beat, licenseId) {
  return Number((beat.license_prices && beat.license_prices[licenseId]) || getLicense(licenseId).base_price || 0);
}

function enrichBeat(beat) {
  const prices = data.licenseTypes
    .map(function (license) { return getLicensePrice(beat, license.id); })
    .filter(function (price) { return price > 0; });
  return Object.assign({}, beat, {
    producer: getProducer(beat.producer_id),
    genre: getGenre(beat.genre_id),
    price_from: prices.length ? Math.min.apply(null, prices) : 0,
    is_buyable: statusIsBuyable(beat.status)
  });
}

function findCustomerByEmail(email) {
  return data.customers.find(function (customer) {
    return customer.email.toLowerCase() === String(email || "").toLowerCase();
  });
}

function ensureCustomer(customerInput) {
  const existing = findCustomerByEmail(customerInput.email);
  if (existing) {
    Object.assign(existing, {
      name: customerInput.name,
      artist_name: customerInput.artist_name || existing.artist_name || "",
      document: customerInput.document || existing.document || ""
    });
    return existing;
  }
  const customer = {
    id: "cust-" + Date.now().toString(36),
    name: customerInput.name,
    artist_name: customerInput.artist_name || "",
    email: customerInput.email,
    document: customerInput.document || ""
  };
  data.customers.push(customer);
  return customer;
}

function buildDownloadsForOrder(order) {
  const items = data.orderItems.filter(function (item) { return item.order_id === order.id; });
  items.forEach(function (item) {
    const license = getLicense(item.license_type_id);
    const eligibleTypes = DeliveryService.getEligibleFileTypes(license);
    eligibleTypes.forEach(function (type) {
      let file = data.beatFiles.find(function (candidate) {
        return (candidate.beat_id === item.beat_id || candidate.beat_id === null) && candidate.type === type;
      });
      if (!file) {
        file = {
          id: "virtual-" + item.beat_id + "-" + type,
          beat_id: item.beat_id,
          type: type,
          storage_path: "secure/generated/" + item.beat_id + "/" + type,
          is_public: false
        };
        data.beatFiles.push(file);
      }
      const exists = data.downloads.some(function (download) {
        return download.order_item_id === item.id && download.file_id === file.id;
      });
      if (!exists) data.downloads.push(DeliveryService.buildDownloadRecord(item, order.customer_id, file.id));
    });
  });
}

export const Store = {
  subscribe(listener) {
    listeners.add(listener);
    return function () { listeners.delete(listener); };
  },

  resetDemo() {
    data = clone(initialData);
    cart = [];
    session = { role: "cliente", email: "lia@example.com" };
    emit();
  },

  getState() {
    return { data: data, cart: cart, session: session };
  },

  setRole(role) {
    session.role = role;
    emit();
  },

  setSessionEmail(email) {
    session.email = email;
    emit();
  },

  producers() { return data.producers; },
  genres() { return data.genres; },
  licenses() { return data.licenseTypes; },
  customers() { return data.customers; },
  orders() { return data.orders; },
  downloads() { return data.downloads; },
  orderItems() { return data.orderItems; },
  payments() { return data.payments; },

  producerName(id) { return (getProducer(id) || {}).name || "PUB RECORDS"; },
  genreName(id) { return (getGenre(id) || {}).name || "Catalogo"; },
  licenseName(id) { return (getLicense(id) || {}).name || "Licenca"; },

  beatById(id) {
    const beat = data.beats.find(function (candidate) { return candidate.id === id; });
    return beat ? enrichBeat(beat) : null;
  },

  beatBySlug(slug) {
    const beat = data.beats.find(function (candidate) { return candidate.slug === slug; });
    return beat ? enrichBeat(beat) : null;
  },

  beats(filters) {
    const safeFilters = filters || {};
    let list = data.beats.map(enrichBeat);
    if (safeFilters.query) {
      const query = safeFilters.query.toLowerCase();
      list = list.filter(function (beat) {
        return [beat.title, beat.producer.name, beat.genre.name, beat.mood, beat.musical_key, beat.tags.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(query);
      });
    }
    if (safeFilters.genre) list = list.filter(function (beat) { return beat.genre_id === safeFilters.genre; });
    if (safeFilters.mood) list = list.filter(function (beat) { return beat.mood === safeFilters.mood; });
    if (safeFilters.key) list = list.filter(function (beat) { return beat.musical_key === safeFilters.key; });
    if (safeFilters.license) list = list.filter(function (beat) { return getLicensePrice(beat, safeFilters.license) > 0; });
    if (safeFilters.featured) list = list.filter(function (beat) { return beat.is_featured; });
    if (safeFilters.maxPrice) list = list.filter(function (beat) { return beat.price_from <= Number(safeFilters.maxPrice); });
    if (safeFilters.bpmMin) list = list.filter(function (beat) { return beat.bpm >= Number(safeFilters.bpmMin); });
    if (safeFilters.bpmMax) list = list.filter(function (beat) { return beat.bpm <= Number(safeFilters.bpmMax); });

    const sort = safeFilters.sort || "featured";
    if (sort === "recent") list.sort(function (a, b) { return new Date(b.publish_date) - new Date(a.publish_date); });
    if (sort === "sold") list.sort(function (a, b) { return b.sales_count - a.sales_count; });
    if (sort === "price") list.sort(function (a, b) { return a.price_from - b.price_from; });
    if (sort === "featured") list.sort(function (a, b) { return Number(b.is_featured) - Number(a.is_featured) || b.sales_count - a.sales_count; });
    return list;
  },

  getPrice(beatId, licenseId) {
    const beat = data.beats.find(function (candidate) { return candidate.id === beatId; });
    return beat ? getLicensePrice(beat, licenseId) : 0;
  },

  cartItems() {
    return cart.map(function (item) {
      const beat = Store.beatById(item.beat_id);
      const license = getLicense(item.license_type_id);
      return Object.assign({}, item, { beat: beat, license: license, price: beat ? getLicensePrice(beat, license.id) : 0 });
    }).filter(function (item) { return Boolean(item.beat && item.license); });
  },

  cartTotal() {
    return Store.cartItems().reduce(function (sum, item) { return sum + item.price; }, 0);
  },

  addToCart(beatId, licenseId) {
    const beat = Store.beatById(beatId);
    if (!beat || !beat.is_buyable) return { ok: false, message: "Beat indisponivel para compra." };
    const selectedLicense = licenseId || "premium";
    const price = getLicensePrice(beat, selectedLicense);
    if (!price) return { ok: false, message: "Licenca indisponivel para este beat." };
    const existing = cart.find(function (item) { return item.beat_id === beatId; });
    if (existing) existing.license_type_id = selectedLicense;
    else cart.push({ id: "cart-" + Date.now().toString(36), beat_id: beatId, license_type_id: selectedLicense, added_at: nowIso() });
    emit();
    return { ok: true, message: "Beat adicionado ao carrinho." };
  },

  updateCartItem(itemId, licenseId) {
    const item = cart.find(function (candidate) { return candidate.id === itemId; });
    if (item) item.license_type_id = licenseId;
    emit();
  },

  removeCartItem(itemId) {
    cart = cart.filter(function (item) { return item.id !== itemId; });
    emit();
  },

  clearCart() {
    cart = [];
    emit();
  },

  createOrder(customerInput, paymentMethod) {
    if (!cart.length) return { ok: false, message: "Carrinho vazio." };
    const customer = ensureCustomer(customerInput);
    session.email = customer.email;
    const provider = PaymentService.getProvider(paymentMethod);
    const order = {
      id: "ord-" + Date.now().toString(36).toUpperCase(),
      customer_id: customer.id,
      total_amount: Store.cartTotal(),
      payment_status: provider.status === "paid" ? "pago" : "pendente",
      delivery_status: provider.delivery,
      payment_method: provider.id,
      notes: customerInput.notes || "",
      created_at: nowIso(),
      updated_at: nowIso()
    };
    data.orders.push(order);
    Store.cartItems().forEach(function (cartItem, index) {
      const item = {
        id: order.id + "-item-" + (index + 1),
        order_id: order.id,
        beat_id: cartItem.beat.id,
        license_type_id: cartItem.license.id,
        price: cartItem.price,
        created_at: nowIso()
      };
      data.orderItems.push(item);
      if (cartItem.license.is_exclusive && order.payment_status === "pago") {
        const sourceBeat = data.beats.find(function (beat) { return beat.id === cartItem.beat.id; });
        if (sourceBeat) sourceBeat.status = "vendido";
      }
    });
    const payment = PaymentService.createPaymentIntent(order, provider.id);
    data.payments.push(payment);
    if (order.payment_status === "pago") buildDownloadsForOrder(order);
    cart = [];
    emit();
    return { ok: true, order: order, payment: payment };
  },

  customerOrders(email) {
    const customer = findCustomerByEmail(email || session.email);
    if (!customer) return [];
    return data.orders
      .filter(function (order) { return order.customer_id === customer.id; })
      .sort(function (a, b) { return new Date(b.created_at) - new Date(a.created_at); });
  },

  orderDetails(orderId) {
    const order = data.orders.find(function (candidate) { return candidate.id === orderId; });
    if (!order) return null;
    const customer = data.customers.find(function (candidate) { return candidate.id === order.customer_id; });
    const items = data.orderItems.filter(function (item) { return item.order_id === orderId; }).map(function (item) {
      return Object.assign({}, item, { beat: Store.beatById(item.beat_id), license: getLicense(item.license_type_id) });
    });
    return { order: order, customer: customer, items: items };
  },

  confirmOrderPayment(orderId) {
    const order = data.orders.find(function (candidate) { return candidate.id === orderId; });
    if (!order) return;
    order.payment_status = "pago";
    order.delivery_status = "entregue";
    order.updated_at = nowIso();
    buildDownloadsForOrder(order);
    data.orderItems.filter(function (item) { return item.order_id === orderId; }).forEach(function (item) {
      const license = getLicense(item.license_type_id);
      if (license && license.is_exclusive) {
        const beat = data.beats.find(function (candidate) { return candidate.id === item.beat_id; });
        if (beat) beat.status = "vendido";
      }
    });
    emit();
  },

  updateOrder(orderId, patch) {
    const order = data.orders.find(function (candidate) { return candidate.id === orderId; });
    if (!order) return;
    Object.assign(order, patch, { updated_at: nowIso() });
    if (order.payment_status === "pago") buildDownloadsForOrder(order);
    emit();
  },

  registerDownload(downloadId) {
    const download = data.downloads.find(function (candidate) { return candidate.id === downloadId; });
    if (!download) return null;
    download.download_count += 1;
    download.last_downloaded_at = nowIso();
    emit();
    return download;
  },

  availableDownloadsForOrder(orderId) {
    const details = Store.orderDetails(orderId);
    if (!details || details.order.payment_status !== "pago") return [];
    return details.items.flatMap(function (item) {
      return data.downloads
        .filter(function (download) { return download.order_item_id === item.id; })
        .map(function (download) {
          const file = data.beatFiles.find(function (candidate) { return candidate.id === download.file_id; }) || { type: "arquivo_final", storage_path: "secure/generated" };
          return Object.assign({}, download, {
            beat: item.beat,
            license: item.license,
            file: file,
            token: DeliveryService.secureToken(details.order.id, item.id, file.type)
          });
        });
    });
  },

  createBeat(draft) {
    const slug = slugify(draft.title);
    const id = "beat-" + slug + "-" + Date.now().toString(36);
    const prices = {};
    data.licenseTypes.forEach(function (license) {
      prices[license.id] = Number(draft["price_" + license.id] || license.base_price);
    });
    const beat = {
      id: id,
      slug: slug,
      title: draft.title,
      description: draft.description || "Beat autoral cadastrado no painel administrativo da PUB RECORDS Beats.",
      producer_id: draft.producer_id,
      genre_id: draft.genre_id,
      bpm: draft.bpm ? Number(draft.bpm) : null,
      musical_key: draft.musical_key || "A minor",
      mood: draft.mood || "Autoral",
      tags: String(draft.tags || "pub, beats").split(",").map(function (tag) { return tag.trim(); }).filter(Boolean),
      cover_url: draft.cover_url || "/assets/covers/neon-rua.svg",
      preview_audio_url: draft.preview_audio_url || "/assets/audio/neon-rua-preview.wav",
      status: draft.status || "disponivel",
      is_featured: Boolean(draft.is_featured),
      publish_date: new Date().toISOString().slice(0, 10),
      sales_count: 0,
      license_prices: prices,
      admin_uploads: {
        cover_file_name: draft.cover_file_name || "upload-simulado",
        preview_file_name: draft.preview_file_name || "preview-simulado",
        final_files_name: draft.final_files_name || "arquivos-finais-simulados"
      }
    };
    data.beats.unshift(beat);
    emit();
    return beat;
  },

  updateBeat(beatId, patch) {
    const beat = data.beats.find(function (candidate) { return candidate.id === beatId; });
    if (!beat) return;
    Object.assign(beat, patch, { updated_at: nowIso() });
    emit();
  },

  updateLicense(licenseId, patch) {
    const license = data.licenseTypes.find(function (candidate) { return candidate.id === licenseId; });
    if (!license) return;
    Object.assign(license, patch, { updated_at: nowIso() });
    emit();
  },

  metrics() {
    const paidOrders = data.orders.filter(function (order) { return order.payment_status === "pago"; });
    const revenue = paidOrders.reduce(function (sum, order) { return sum + Number(order.total_amount || 0); }, 0);
    const soldGenreMap = {};
    paidOrders.forEach(function (order) {
      data.orderItems.filter(function (item) { return item.order_id === order.id; }).forEach(function (item) {
        const beat = Store.beatById(item.beat_id);
        if (!beat) return;
        soldGenreMap[beat.genre.name] = (soldGenreMap[beat.genre.name] || 0) + 1;
      });
    });
    return {
      totalBeats: data.beats.length,
      availableBeats: data.beats.filter(function (beat) { return statusIsBuyable(beat.status); }).length,
      soldBeats: data.beats.filter(function (beat) { return beat.status === "vendido"; }).length,
      revenue: revenue,
      pendingOrders: data.orders.filter(function (order) { return order.payment_status === "pendente"; }).length,
      paidOrders: paidOrders.length,
      topBeats: data.beats.slice().sort(function (a, b) { return b.sales_count - a.sales_count; }).slice(0, 4).map(enrichBeat),
      topGenres: Object.entries(soldGenreMap).sort(function (a, b) { return b[1] - a[1]; })
    };
  }
};
