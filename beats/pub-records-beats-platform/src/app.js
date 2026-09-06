import { Store } from "./services/store.js?v=catalog-v6";
import { paymentProviders } from "./services/payment.js?v=public-v1";
import { DeliveryService } from "./services/delivery.js";

const app = document.getElementById("app");
const toast = document.getElementById("toast");
const audio = new Audio();
let currentBeat = null;
let isRendering = false;

function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function bpmLabel(beat) {
  return beat && beat.bpm ? beat.bpm + " BPM" : "BPM N/D";
}

function durationLabel(ms) {
  if (!ms) return "Duração N/D";
  const total = Math.round(ms / 1000);
  const mins = Math.floor(total / 60);
  const secs = String(total % 60).padStart(2, "0");
  return mins + ":" + secs;
}

function mediaEmbedUrl(beat, autoPlay) {
  const trackUrl = ["https://sound", "cloud.com"].join("") + beat.source_path;
  return ["https://w.sound", "cloud.com/player/?url="].join("") + encodeURIComponent(trackUrl) + "&auto_play=" + (autoPlay ? "true" : "false") + "&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=false";
}

function esc(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function compactDate(value) {
  return new Date(value).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function notify(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  setTimeout(function () { toast.classList.remove("is-visible"); }, 2600);
}

function navigate(path) {
  history.pushState({}, "", path);
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function route() {
  return location.pathname === "/index.html" ? "/" : location.pathname;
}

function setMeta(title, description, image) {
  document.title = title;
  const descriptionTag = document.querySelector('meta[name="description"]');
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (descriptionTag) descriptionTag.setAttribute("content", description);
  if (ogTitle) ogTitle.setAttribute("content", title);
  if (ogDescription) ogDescription.setAttribute("content", description);
  if (ogImage && image) ogImage.setAttribute("content", image);
}

function navLink(path, label) {
  const active = route() === path || (path !== "/" && route().startsWith(path));
  return '<a href="' + path + '" data-link class="nav-link ' + (active ? 'active' : '') + '">' + esc(label) + '</a>';
}

function brandMark() {
  return '<a href="/" data-link class="brand" aria-label="PUB RECORDS Beats"><span class="brand-disc"><span></span></span><strong>PUB</strong><em>RECORDS BEATS</em></a>';
}

function header() {
  const count = Store.cartItems().length;
  return '<header class="site-header"><div class="nav-shell"><nav class="nav-left" aria-label="Principal">'
    + navLink("/catalogo", "Catálogo")
    + navLink("/licencas", "Licenças")
    + navLink("/minhas-compras", "Minhas compras")
    + '</nav>' + brandMark()
    + '<nav class="nav-right" aria-label="Conta e compra">'
    + '<a href="/carrinho" data-link class="cart-pill" aria-label="Abrir carrinho">Carrinho <span>' + count + '</span></a>'
    + '</nav></div></header>';
}

function footer() {
  return '<footer class="site-footer"><div><strong>PUB RECORDS Beats</strong><p>Loja independente para beats autorais, licenças musicais e entrega digital.</p></div><div class="footer-links"><a href="/catalogo" data-link>Catálogo</a><a href="/licencas" data-link>Licenças</a><a href="/minhas-compras" data-link>Minhas compras</a></div></footer>';
}

function shell(content) {
  return header() + '<main>' + content + '</main>' + footer() + playerBar();
}

function cta(path, label, variant) {
  return '<a href="' + path + '" data-link class="btn ' + (variant || 'primary') + '">' + esc(label) + '</a>';
}

function sectionTitle(kicker, title, copy) {
  return '<div class="section-title"><p>' + esc(kicker) + '</p><h2>' + esc(title) + '</h2>' + (copy ? '<span>' + esc(copy) + '</span>' : '') + '</div>';
}

function statusBadge(status) {
  const label = {
    disponivel: "Disponível",
    destaque: "Destaque",
    vendido: "Vendido",
    exclusivo: "Exclusivo",
    indisponivel: "Indisponível"
  }[status] || status;
  return '<span class="status ' + esc(status) + '">' + esc(label) + '</span>';
}

function beatCard(beat, compact) {
  const license = Store.licenses().find(function (item) { return item.id === "premium"; }) || Store.licenses()[0];
  const isPlaying = currentBeat && currentBeat.id === beat.id;
  return '<article class="beat-card ' + (compact ? 'compact' : '') + '">'
    + '<div class="cover-wrap"><img src="' + esc(beat.cover_url) + '" alt="Capa do beat ' + esc(beat.title) + '" loading="lazy" />'
    + '<button class="play-floating" data-action="play" data-beat="' + esc(beat.id) + '" aria-label="Tocar preview de ' + esc(beat.title) + '">' + (isPlaying ? 'Pausar' : 'Ouvir') + '</button></div>'
    + '<div class="beat-body"><div class="beat-row"><p class="eyebrow">' + esc(beat.genre.name) + ' · ' + bpmLabel(beat) + '</p>' + statusBadge(beat.status) + '</div>'
    + '<h3>' + esc(beat.title) + '</h3><p class="muted">' + esc(beat.producer.name) + '</p>'
    + '<div class="beat-specs"><span>' + esc(beat.musical_key) + '</span><span>' + esc(beat.mood) + '</span>' + (beat.duration_ms ? '<span>' + durationLabel(beat.duration_ms) + '</span>' : '') + '</div>'
    + '<div class="tag-row">' + beat.tags.slice(0, 3).map(function (tag) { return '<span>' + esc(tag) + '</span>'; }).join("") + '</div>'
    + '<div class="card-actions"><strong>A partir de ' + money(beat.price_from) + '</strong><div><a href="/beats/' + esc(beat.slug) + '" data-link class="btn ghost small">Detalhes</a>'
    + '<button class="btn primary small" data-action="add" data-beat="' + esc(beat.id) + '" data-license="' + esc(license.id) + '" ' + (!beat.is_buyable ? 'disabled' : '') + '>Comprar</button></div></div></div></article>';
}

function licenseMiniCards() {
  return '<div class="license-grid">' + Store.licenses().map(function (license) {
    return '<article class="license-card"><p class="eyebrow">' + (license.is_exclusive ? 'Contrato exclusivo' : 'Uso comercial') + '</p><h3>' + esc(license.name) + '</h3><strong>' + money(license.base_price) + '</strong><p>' + esc(license.description) + '</p><ul><li>' + esc(license.usage_limit) + '</li><li>Monetização: ' + (license.allows_monetization ? 'sim' : 'não') + '</li><li>WAV: ' + (license.includes_wav ? 'sim' : 'não') + ' · Stems: ' + (license.includes_stems ? 'sim' : 'não') + '</li></ul></article>';
  }).join("") + '</div>';
}

function homePage() {
  setMeta("PUB RECORDS Beats | Beats autorais", "Beats autorais para artistas, criadores e projetos musicais com licencas, player e entrega digital.", "/assets/hero-studio.png");
  const featured = Store.beats({ featured: true }).slice(0, 4);
  const totalBeats = Store.beats({}).length;
  return '<section class="hero refined-hero"><div class="hero-bg" aria-hidden="true"></div><div class="hero-content"><p class="hero-kicker">SELO INDEPENDENTE · CATÁLOGO AUTORAL · BEATS</p><h1>PUB RECORDS Beats</h1><p>Escolha beats autorais com preview rápido, licença clara e entrega digital organizada para tirar o lançamento do rascunho.</p><div class="hero-actions">' + cta("/catalogo", "Explorar catálogo", "primary") + cta("/licencas", "Comparar licenças", "outline") + cta("/#contato", "Negociar exclusivo", "ghost") + '</div><div class="hero-stats"><span><strong>' + totalBeats + '</strong> faixas no catálogo</span><span><strong>4</strong> tipos de licença</span><span><strong>24h</strong> para iniciar um projeto</span></div></div><aside class="hero-panel"><p>Curadoria PUB</p><strong>' + featured.length + ' destaques prontos</strong><span>Ouça, compare direitos e avance para o carrinho sem perder o contexto da faixa.</span><a href="/catalogo?featured=1" data-link class="panel-link">Ver destaques</a></aside></section>'
    + '<section class="trust-strip"><span>Preview antes da compra</span><span>Licenças objetivas</span><span>Checkout direto</span><span>Entrega digital</span></section>'
    + '<section class="band">' + sectionTitle("DESTAQUES", "Beats em rotação", "Uma vitrine enxuta para ouvir, comparar e comprar sem fricção.") + '<div class="beat-grid">' + featured.map(function (beat) { return beatCard(beat); }).join("") + '</div></section>'
    + '<section class="split-band"><div>' + sectionTitle("COMO FUNCIONA", "Do preview à entrega", "Um fluxo simples para escolher a faixa certa e entender exatamente o que está comprando.") + '<div class="steps"><article><span>01</span><h3>Ouça o preview</h3><p>Escute a prévia, confira mood, BPM, duração e tags antes de entrar nos detalhes.</p></article><article><span>02</span><h3>Escolha a licença</h3><p>Básica, Premium, Ilimitada ou Exclusiva, cada uma com preço e direitos claros.</p></article><article><span>03</span><h3>Finalize o pedido</h3><p>Revise sua seleção, confirme os dados e acompanhe a liberação dos arquivos.</p></article></div></div><div class="ops-panel"><h3>Compra simples e direta</h3><p>Comece pelo catálogo, salve a faixa no carrinho e escolha a licença no momento da decisão.</p><a href="/catalogo" data-link class="btn outline">Abrir catálogo</a></div></section>'
    + '<section class="band dark">' + sectionTitle("LICENÇAS", "Direitos claros antes da compra", "Cada opção explica uso, monetização, distribuição e arquivos inclusos.") + licenseMiniCards() + '</section>'
    + '<section class="about-band" id="contato"><div>' + sectionTitle("PUB RECORDS", "Catálogo autoral com direção comercial", "Uma loja própria para artistas que precisam de beats com estética, preço e direitos bem definidos.") + '<p>O catálogo reúne faixas autorais, informações comerciais objetivas, preview de áudio, carrinho, checkout e entrega digital para quem quer avançar com segurança no lançamento.</p></div><form class="contact-form"><input placeholder="Nome artístico" aria-label="Nome artístico" /><input placeholder="E-mail" aria-label="E-mail" /><textarea placeholder="Conte sobre o projeto ou negociação exclusiva" aria-label="Mensagem"></textarea><button type="button" class="btn primary" data-action="contact">Solicitar negociação</button></form></section>';
}

function catalogFilters(params) {
  const moods = Array.from(new Set(Store.beats({}).map(function (beat) { return beat.mood; })));
  const keys = Array.from(new Set(Store.beats({}).map(function (beat) { return beat.musical_key; })));
  return '<aside class="filter-panel"><div class="filter-top"><div><p class="eyebrow">Busca avançada</p><h2>Filtros</h2></div><button class="btn ghost small filter-toggle" type="button" data-action="filters">Mostrar filtros</button></div><form id="catalog-filter"><label>Busca<input name="query" value="' + esc(params.get("query") || "") + '" placeholder="Nome, tag, produtor ou estilo" /></label><label>Gênero<select name="genre"><option value="">Todos</option>' + Store.genres().map(function (genre) { return '<option value="' + esc(genre.id) + '" ' + (params.get("genre") === genre.id ? 'selected' : '') + '>' + esc(genre.name) + '</option>'; }).join("") + '</select></label><label>Mood<select name="mood"><option value="">Todos</option>' + moods.map(function (mood) { return '<option value="' + esc(mood) + '" ' + (params.get("mood") === mood ? 'selected' : '') + '>' + esc(mood) + '</option>'; }).join("") + '</select></label><label>Tom<select name="key"><option value="">Todos</option>' + keys.map(function (key) { return '<option value="' + esc(key) + '" ' + (params.get("key") === key ? 'selected' : '') + '>' + esc(key) + '</option>'; }).join("") + '</select></label><label>Licença<select name="license"><option value="">Todas</option>' + Store.licenses().map(function (license) { return '<option value="' + esc(license.id) + '" ' + (params.get("license") === license.id ? 'selected' : '') + '>' + esc(license.name) + '</option>'; }).join("") + '</select></label><div class="filter-grid"><label>BPM mínimo<input name="bpmMin" type="number" min="40" max="220" value="' + esc(params.get("bpmMin") || "") + '" /></label><label>BPM máximo<input name="bpmMax" type="number" min="40" max="220" value="' + esc(params.get("bpmMax") || "") + '" /></label></div><label>Preço até<input name="maxPrice" type="number" min="0" value="' + esc(params.get("maxPrice") || "") + '" /></label><label>Ordenar<select name="sort"><option value="featured">Destaques</option><option value="recent" ' + (params.get("sort") === 'recent' ? 'selected' : '') + '>Mais recentes</option><option value="sold" ' + (params.get("sort") === 'sold' ? 'selected' : '') + '>Mais vendidos</option><option value="price" ' + (params.get("sort") === 'price' ? 'selected' : '') + '>Menor preço</option></select></label><label class="check"><input type="checkbox" name="featured" value="1" ' + (params.get("featured") ? 'checked' : '') + ' /> Somente destaque</label><div class="filter-actions"><button class="btn primary" type="submit">Aplicar filtros</button><a href="/catalogo" data-link class="btn ghost">Limpar</a></div></form></aside>';
}

function activeFilterCount(params) {
  return Array.from(params.entries()).filter(function (pair) { return Boolean(pair[1]); }).length;
}

function catalogPage() {
  setMeta("Catálogo | PUB RECORDS Beats", "Busque beats por gênero, mood, preço, produtor, tags e licença.", "/assets/hero-studio.png");
  const params = new URLSearchParams(location.search);
  const filters = Object.fromEntries(params.entries());
  filters.featured = params.get("featured") === "1";
  const beats = Store.beats(filters);
  const filterCount = activeFilterCount(params);
  return '<section class="page-hero compact-hero catalog-hero"><p>CATÁLOGO</p><h1>Beats prontos para licenciar</h1><span>Encontre a faixa pelo clima, preço, licença e energia certa para o lançamento.</span><div class="quick-actions"><a href="/catalogo?featured=1" data-link>Destaques</a><a href="/catalogo?sort=recent" data-link>Mais recentes</a><a href="/catalogo?license=premium" data-link>Premium</a></div></section><section class="catalog-layout">' + catalogFilters(params) + '<div><div class="catalog-head"><div><strong>' + beats.length + ' beats encontrados</strong><span>' + (filterCount ? filterCount + ' filtro(s) ativo(s)' : 'Explore por mood, BPM, licença e preço') + '</span></div><span>Um preview por vez para manter a escuta limpa.</span></div><div class="beat-grid catalog-grid">' + (beats.length ? beats.map(function (beat) { return beatCard(beat); }).join("") : '<div class="empty"><strong>Nenhum beat encontrado.</strong><span>Ajuste os filtros ou limpe a busca para ver todo o catálogo.</span></div>') + '</div></div></section>';
}

function licensesPage() {
  setMeta("Licenças | PUB RECORDS Beats", "Tipos de licenca configuraveis para beats autorais da PUB RECORDS.", "/assets/hero-studio.png");
  return '<section class="page-hero compact-hero"><p>LICENÇAS</p><h1>Direitos claros antes da compra</h1><span>A compra concede licença de uso, não transferência automática de autoria.</span></section><section class="band">' + licenseMiniCards() + '<div class="rights-note"><h3>Aviso autoral</h3><p>Os beats e produções são autorais da PUB RECORDS ou de seus produtores vinculados. O uso deve respeitar os termos da licença adquirida. Compras exclusivas podem exigir contrato personalizado e remoção do beat da loja após pagamento confirmado.</p></div></section>';
}

function beatDetailPage(slug) {
  const beat = Store.beatBySlug(slug);
  if (!beat) return notFoundPage();
  setMeta(beat.title + " | PUB RECORDS Beats", beat.description, beat.cover_url);
  const related = Store.beats({ genre: beat.genre_id }).filter(function (item) { return item.id !== beat.id; }).slice(0, 3);
  return '<section class="beat-detail"><div class="detail-cover"><img src="' + esc(beat.cover_url) + '" alt="Capa do beat ' + esc(beat.title) + '" /><button class="btn primary" data-action="play" data-beat="' + esc(beat.id) + '">Tocar preview</button></div><div class="detail-info"><p class="eyebrow">' + esc(beat.genre.name) + ' · ' + bpmLabel(beat) + ' · ' + esc(beat.musical_key) + '</p><h1>' + esc(beat.title) + '</h1><p>' + esc(beat.description) + '</p><div class="spec-grid"><span>Produtor<strong>' + esc(beat.producer.name) + '</strong></span><span>Mood<strong>' + esc(beat.mood) + '</strong></span><span>Publicado<strong>' + compactDate(beat.publish_date) + '</strong></span><span>Duração<strong>' + durationLabel(beat.duration_ms) + '</strong></span><span>Reproduções<strong>' + esc(String(beat.playback_count || 0)) + '</strong></span></div><div class="tag-row large">' + beat.tags.map(function (tag) { return '<span>' + esc(tag) + '</span>'; }).join("") + '</div></div></section><section class="band">' + sectionTitle("PREÇOS", "Escolha a licença", "Confirmação clara do tipo de licença antes de comprar.") + '<div class="pricing-table">' + Store.licenses().map(function (license) { const price = Store.getPrice(beat.id, license.id); return '<article><div><p class="eyebrow">' + esc(license.name) + '</p><h3>' + money(price) + '</h3><p>' + esc(license.description) + '</p></div><ul><li>' + esc(license.usage_limit) + '</li><li>Monetização: ' + (license.allows_monetization ? 'sim' : 'não') + '</li><li>Distribuição: ' + (license.allows_distribution ? 'sim' : 'não') + '</li><li>WAV: ' + (license.includes_wav ? 'sim' : 'não') + ' · Stems: ' + (license.includes_stems ? 'sim' : 'não') + '</li><li>' + (license.keeps_available ? 'Beat continua disponível para outras pessoas' : 'Beat sai da loja após compra exclusiva') + '</li></ul><button class="btn primary" data-action="add" data-beat="' + esc(beat.id) + '" data-license="' + esc(license.id) + '" ' + (!beat.is_buyable || !price ? 'disabled' : '') + '>Adicionar ao carrinho</button></article>'; }).join("") + '</div><div class="rights-note"><h3>Direitos autorais e arquivos</h3><p>O preview público é demonstrativo. Arquivos completos ficam em storage protegido e só são liberados após confirmação de pagamento, conforme a licença adquirida.</p></div></section><section class="band dark">' + sectionTitle("RELACIONADOS", "Mais beats do mesmo universo", "Sugestões por gênero e mood.") + '<div class="beat-grid">' + related.map(function (item) { return beatCard(item, true); }).join("") + '</div></section>';
}

function cartPage() {
  setMeta("Carrinho | PUB RECORDS Beats", "Revise beats, licencas e total antes do checkout.", "/assets/hero-studio.png");
  const items = Store.cartItems();
  if (!items.length) return '<section class="page-hero compact-hero"><p>CARRINHO</p><h1>Seu carrinho está vazio</h1><span>Escolha um beat no catálogo para iniciar uma compra.</span><div class="hero-actions">' + cta("/catalogo", "Explorar catálogo", "primary") + '</div></section>';
  return '<section class="page-hero compact-hero"><p>CARRINHO</p><h1>Revise sua seleção</h1><span>Você pode alterar o tipo de licença antes de finalizar.</span></section><section class="cart-layout"><div class="cart-list">' + items.map(function (item) { return '<article class="cart-item"><img src="' + esc(item.beat.cover_url) + '" alt="Capa de ' + esc(item.beat.title) + '" /><div><h3>' + esc(item.beat.title) + '</h3><p>' + esc(item.beat.producer.name) + ' · ' + esc(item.beat.genre.name) + '</p><label>Licença<select data-action="cart-license" data-item="' + esc(item.id) + '">' + Store.licenses().map(function (license) { return '<option value="' + esc(license.id) + '" ' + (license.id === item.license.id ? 'selected' : '') + '>' + esc(license.name) + ' - ' + money(Store.getPrice(item.beat.id, license.id)) + '</option>'; }).join("") + '</select></label></div><strong>' + money(item.price) + '</strong><button class="icon-btn" data-action="remove-cart" data-item="' + esc(item.id) + '" aria-label="Remover item">×</button></article>'; }).join("") + '</div><aside class="summary"><p>Subtotal</p><strong>' + money(Store.cartTotal()) + '</strong><span>Entrega digital liberada após pagamento confirmado.</span>' + cta("/checkout", "Ir para checkout", "primary") + '<button class="btn ghost" data-action="clear-cart">Limpar carrinho</button></aside></section>';
}

function checkoutPage() {
  setMeta("Checkout | PUB RECORDS Beats", "Revise sua compra, informe seus dados e escolha a forma de pagamento.", "/assets/hero-studio.png");
  const items = Store.cartItems();
  if (!items.length) return cartPage();
  return '<section class="page-hero compact-hero checkout-hero"><p>CHECKOUT</p><h1>Finalizar compra</h1><span>Revise sua seleção, escolha a forma de pagamento e acompanhe a liberação da entrega digital.</span><div class="checkout-steps"><span>1. Dados</span><span>2. Pagamento</span><span>3. Entrega</span></div></section><section class="checkout-layout"><form id="checkout-form" class="checkout-form"><label>Nome<input name="name" required placeholder="Seu nome" /></label><label>Nome artístico<input name="artist_name" placeholder="Opcional" /></label><label>E-mail<input name="email" type="email" required value="' + esc(Store.getState().session.email || "") + '" /></label><label>CPF/CNPJ<input name="document" placeholder="Opcional nesta fase" /></label><label>Pagamento<select name="payment_method">' + paymentProviders.map(function (provider) { return '<option value="' + esc(provider.id) + '">' + esc(provider.name) + '</option>'; }).join("") + '</select></label><label>Observações<textarea name="notes" placeholder="Prazo, projeto, negociação exclusiva..."></textarea></label><button class="btn primary" type="submit">Criar pedido</button></form><aside class="summary order-summary"><p>Total</p><strong>' + money(Store.cartTotal()) + '</strong><ul>' + items.map(function (item) { return '<li><span>' + esc(item.beat.title) + ' · ' + esc(item.license.name) + '</span><strong>' + money(item.price) + '</strong></li>'; }).join("") + '</ul><div class="gateway-note">Cartão confirma na hora. Pix fica pendente até confirmação do pagamento.</div></aside></section>';
}

function purchasesPage() {
  setMeta("Minhas compras | PUB RECORDS Beats", "Area do comprador com downloads seguros e licencas adquiridas.", "/assets/hero-studio.png");
  const orders = Store.customerOrders();
  return '<section class="page-hero compact-hero"><p>MINHAS COMPRAS</p><h1>Entregas digitais</h1><span>Downloads protegidos, expiração opcional de links e registro de acessos.</span></section><section class="band"><div class="purchase-tools"><label>E-mail do comprador<input id="purchase-email" value="' + esc(Store.getState().session.email || "") + '" /></label><button class="btn outline" data-action="set-email">Consultar</button></div>' + (orders.length ? orders.map(function (order) { const details = Store.orderDetails(order.id); const downloads = Store.availableDownloadsForOrder(order.id); return '<article class="order-card"><div><p class="eyebrow">Pedido ' + esc(order.id) + '</p><h3>' + money(order.total_amount) + '</h3><p>Status: ' + esc(order.payment_status) + ' · Entrega: ' + esc(order.delivery_status) + '</p></div><div class="order-items">' + details.items.map(function (item) { return '<span>' + esc(item.beat.title) + ' · ' + esc(item.license.name) + '</span>'; }).join("") + '</div><div class="download-list">' + (downloads.length ? downloads.map(function (download) { return '<button class="btn ghost small" data-action="download" data-download="' + esc(download.id) + '">' + esc(download.beat.title) + ' · ' + esc(download.file.type) + '</button>'; }).join("") : '<span class="muted">Arquivos liberados após confirmação de pagamento.</span>') + '</div></article>'; }).join("") : '<div class="empty">Nenhuma compra encontrada para este e-mail.</div>') + '</section>';
}

function adminGuard(content) {
  if (Store.getState().session.role !== "admin") {
    return '<section class="page-hero compact-hero"><p>ÁREA INTERNA</p><h1>Acesso restrito</h1><span>Área de gestão da equipe PUB RECORDS.</span><div class="hero-actions"><button class="btn primary" data-action="role" data-role="admin">Entrar</button></div></section>';
  }
  return content;
}

function adminPage() {
  setMeta("Gestão | PUB RECORDS Beats", "Área interna para catalogo, licencas, pedidos e metricas.", "/assets/hero-studio.png");
  const metrics = Store.metrics();
  return adminGuard('<section class="page-hero compact-hero"><p>GESTÃO</p><h1>Painel interno</h1><span>Gerencie catálogo, pedidos, licenças, compradores, downloads e métricas.</span></section><section class="admin-metrics"><article><span>Total de beats</span><strong>' + metrics.totalBeats + '</strong></article><article><span>Disponíveis</span><strong>' + metrics.availableBeats + '</strong></article><article><span>Vendidos</span><strong>' + metrics.soldBeats + '</strong></article><article><span>Receita total</span><strong>' + money(metrics.revenue) + '</strong></article><article><span>Pedidos pendentes</span><strong>' + metrics.pendingOrders + '</strong></article><article><span>Pedidos pagos</span><strong>' + metrics.paidOrders + '</strong></article></section><section class="admin-layout"><div class="admin-column">' + adminBeatForm() + adminBeatList() + '</div><div class="admin-column">' + adminOrders() + adminLicenses() + adminDownloads() + '</div></section>');
}

function adminBeatForm() {
  return '<article class="admin-panel"><h2>Cadastrar novo beat</h2><form id="beat-form" class="admin-form"><label>Título<input name="title" required placeholder="Nome do beat" /></label><label>Produtor<select name="producer_id">' + Store.producers().map(function (producer) { return '<option value="' + esc(producer.id) + '">' + esc(producer.name) + '</option>'; }).join("") + '</select></label><label>Gênero<select name="genre_id">' + Store.genres().map(function (genre) { return '<option value="' + esc(genre.id) + '">' + esc(genre.name) + '</option>'; }).join("") + '</select></label><div class="form-grid"><label>BPM<input name="bpm" type="number" value="92" /></label><label>Tom<input name="musical_key" value="A minor" /></label></div><label>Mood<input name="mood" value="Autoral" /></label><label>Tags<input name="tags" value="pub, autoral, beat" /></label><label>Descrição<textarea name="description"></textarea></label><label>Status<select name="status"><option value="disponivel">Disponível</option><option value="destaque">Destaque</option><option value="exclusivo">Exclusivo</option><option value="indisponivel">Indisponível</option></select></label><label class="check"><input type="checkbox" name="is_featured" /> Marcar como destaque</label><div class="upload-grid"><label>Upload capa<input type="file" name="cover_file" accept="image/*" /></label><label>Upload preview<input type="file" name="preview_file" accept="audio/*" /></label><label>Upload arquivos finais<input type="file" name="final_files" multiple /></label></div><div class="form-grid">' + Store.licenses().map(function (license) { return '<label>' + esc(license.name) + '<input name="price_' + esc(license.id) + '" type="number" value="' + license.base_price + '" /></label>'; }).join("") + '</div><button class="btn primary" type="submit">Cadastrar beat</button></form></article>';
}

function adminBeatList() {
  return '<article class="admin-panel"><h2>Catálogo</h2><div class="admin-list">' + Store.beats({}).map(function (beat) { return '<div class="admin-row"><img src="' + esc(beat.cover_url) + '" alt="" /><div><strong>' + esc(beat.title) + '</strong><span>' + esc(beat.genre.name) + ' · ' + esc(beat.producer.name) + '</span></div><select data-action="beat-status" data-beat="' + esc(beat.id) + '"><option value="disponivel" ' + (beat.status === 'disponivel' ? 'selected' : '') + '>Disponível</option><option value="destaque" ' + (beat.status === 'destaque' ? 'selected' : '') + '>Destaque</option><option value="exclusivo" ' + (beat.status === 'exclusivo' ? 'selected' : '') + '>Exclusivo</option><option value="vendido" ' + (beat.status === 'vendido' ? 'selected' : '') + '>Vendido</option><option value="indisponivel" ' + (beat.status === 'indisponivel' ? 'selected' : '') + '>Indisponível</option></select><button class="btn ghost small" data-action="toggle-featured" data-beat="' + esc(beat.id) + '">' + (beat.is_featured ? 'Remover destaque' : 'Destacar') + '</button></div>'; }).join("") + '</div></article>';
}

function adminOrders() {
  return '<article class="admin-panel"><h2>Pedidos</h2><div class="admin-list">' + Store.orders().map(function (order) { const details = Store.orderDetails(order.id); return '<div class="order-admin-row"><div><strong>' + esc(order.id) + '</strong><span>' + esc(details.customer.name) + ' · ' + money(order.total_amount) + '</span><small>' + esc(order.payment_method) + ' · ' + esc(order.payment_status) + ' · ' + esc(order.delivery_status) + '</small></div><select data-action="order-payment" data-order="' + esc(order.id) + '"><option value="pendente" ' + (order.payment_status === 'pendente' ? 'selected' : '') + '>Pendente</option><option value="pago" ' + (order.payment_status === 'pago' ? 'selected' : '') + '>Pago</option><option value="cancelado" ' + (order.payment_status === 'cancelado' ? 'selected' : '') + '>Cancelado</option><option value="reembolsado" ' + (order.payment_status === 'reembolsado' ? 'selected' : '') + '>Reembolsado</option></select><button class="btn primary small" data-action="confirm-payment" data-order="' + esc(order.id) + '">Confirmar</button></div>'; }).join("") + '</div></article>';
}

function adminLicenses() {
  return '<article class="admin-panel"><h2>Tipos de licença</h2><div class="license-admin">' + Store.licenses().map(function (license) { return '<div><strong>' + esc(license.name) + '</strong><label>Preço base<input data-action="license-price" data-license="' + esc(license.id) + '" type="number" value="' + license.base_price + '" /></label><span>' + esc(license.description) + '</span></div>'; }).join("") + '</div></article>';
}

function adminDownloads() {
  return '<article class="admin-panel"><h2>Downloads e compradores</h2><div class="mini-table"><strong>Compradores</strong>' + Store.customers().map(function (customer) { return '<span>' + esc(customer.name) + ' · ' + esc(customer.email) + '</span>'; }).join("") + '</div><div class="mini-table"><strong>Registros de download</strong>' + Store.downloads().map(function (download) { return '<span>' + esc(download.id) + ' · ' + download.download_count + ' downloads</span>'; }).join("") + '</div></article>';
}

function notFoundPage() {
  setMeta("Página não encontrada | PUB RECORDS Beats", "Rota nao encontrada.", "/assets/hero-studio.png");
  return '<section class="page-hero compact-hero"><p>404</p><h1>Página não encontrada</h1><span>Volte para o catálogo e continue ouvindo.</span><div class="hero-actions">' + cta("/catalogo", "Abrir catálogo", "primary") + '</div></section>';
}

function currentContent() {
  const path = route();
  if (path === "/") return homePage();
  if (path === "/catalogo") return catalogPage();
  if (path === "/licencas") return licensesPage();
  if (path.startsWith("/beats/")) return beatDetailPage(decodeURIComponent(path.split("/").pop()));
  if (path === "/carrinho") return cartPage();
  if (path === "/checkout") return checkoutPage();
  if (path === "/minhas-compras") return purchasesPage();
  if (path === "/admin") return adminPage();
  return notFoundPage();
}

function playerBar() {
  if (!currentBeat) return "";
  const beatTitle = currentBeat.title;
  const beatMeta = currentBeat.genre.name + " · " + bpmLabel(currentBeat);
  if (currentBeat.source_path) {
    return '<aside class="audio-player embedded-player" aria-label="Player de preview"><div class="player-head"><button class="player-main" data-action="player-close" aria-label="Fechar player">Fechar</button><div><strong>' + esc(beatTitle) + '</strong><span>' + esc(beatMeta) + ' · ' + durationLabel(currentBeat.duration_ms) + '</span></div></div><iframe title="Player de preview - ' + esc(beatTitle) + '" scrolling="no" frameborder="no" allow="autoplay" src="' + esc(mediaEmbedUrl(currentBeat, true)) + '"></iframe></aside>';
  }
  return '<aside class="audio-player" aria-label="Player de preview"><div class="player-head"><button class="player-main" data-action="player-toggle" aria-label="Tocar ou pausar">' + (currentBeat && !audio.paused ? 'Pausar' : 'Play') + '</button><div><strong>' + esc(beatTitle) + '</strong><span>' + esc(beatMeta) + '</span></div></div><input id="progress" type="range" min="0" max="100" value="0" aria-label="Progresso" /><span id="time-readout">0:00 / 0:00</span><label class="volume-label">Vol<input id="volume" type="range" min="0" max="1" step="0.01" value="' + audio.volume + '" /></label></aside>';
}

function render() {
  if (isRendering) return;
  isRendering = true;
  app.innerHTML = shell(currentContent());
  bindForms();
  updatePlayerUi();
  isRendering = false;
}

function bindForms() {
  const filter = document.getElementById("catalog-filter");
  if (filter) {
    filter.addEventListener("submit", function (event) {
      event.preventDefault();
      const formData = new FormData(filter);
      const params = new URLSearchParams();
      for (const pair of formData.entries()) {
        if (pair[1]) params.set(pair[0], pair[1]);
      }
      navigate("/catalogo" + (params.toString() ? "?" + params.toString() : ""));
    });
  }
  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const payload = Object.fromEntries(new FormData(checkoutForm).entries());
      if (!payload.name || !payload.email) {
        notify("Informe nome e e-mail para continuar.");
        return;
      }
      const result = Store.createOrder(payload, payload.payment_method);
      if (result.ok) {
        notify("Pedido criado: " + result.order.id);
        navigate("/minhas-compras");
      } else notify(result.message);
    });
  }
  const beatForm = document.getElementById("beat-form");
  if (beatForm) {
    beatForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const formData = new FormData(beatForm);
      const payload = Object.fromEntries(formData.entries());
      payload.is_featured = formData.get("is_featured") === "on";
      const cover = beatForm.querySelector('input[name="cover_file"]');
      const preview = beatForm.querySelector('input[name="preview_file"]');
      const finals = beatForm.querySelector('input[name="final_files"]');
      payload.cover_file_name = cover && cover.files[0] ? cover.files[0].name : "sem-upload-real";
      payload.preview_file_name = preview && preview.files[0] ? preview.files[0].name : "sem-upload-real";
      payload.final_files_name = finals && finals.files.length ? Array.from(finals.files).map(function (file) { return file.name; }).join(", ") : "sem-upload-real";
      Store.createBeat(payload);
      notify("Beat cadastrado no catálogo.");
      render();
    });
  }
}

function playBeat(beatId) {
  const beat = Store.beatById(beatId);
  if (!beat) return;
  if (beat.source_path) {
    audio.pause();
    if (currentBeat && currentBeat.id === beat.id) {
      currentBeat = null;
      render();
      return;
    }
    currentBeat = beat;
    render();
    return;
  }
  if (currentBeat && currentBeat.id === beat.id && !audio.paused) {
    audio.pause();
    updatePlayerUi();
    return;
  }
  if (!beat.preview_audio_url) {
    notify("Preview indisponível para esta faixa.");
    return;
  }
  currentBeat = beat;
  if (audio.src !== new URL(beat.preview_audio_url, location.origin).href) audio.src = beat.preview_audio_url;
  audio.play().catch(function () { notify("Clique novamente para liberar o áudio no navegador."); });
  updatePlayerUi();
}

function updatePlayerUi() {
  const progress = document.getElementById("progress");
  const readout = document.getElementById("time-readout");
  const volume = document.getElementById("volume");
  if (progress && audio.duration) progress.value = String((audio.currentTime / audio.duration) * 100);
  if (readout) readout.textContent = formatTime(audio.currentTime) + " / " + formatTime(audio.duration || 0);
  if (volume) volume.value = String(audio.volume);
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return mins + ":" + secs;
}

function downloadLicense(downloadId) {
  const allOrders = Store.orders();
  let found = null;
  allOrders.some(function (order) {
    const downloads = Store.availableDownloadsForOrder(order.id);
    found = downloads.find(function (download) { return download.id === downloadId; });
    return Boolean(found);
  });
  if (!found) return;
  Store.registerDownload(downloadId);
  const sourceItem = Store.orderItems().find(function (candidate) { return candidate.id === found.order_item_id; });
  const details = sourceItem ? Store.orderDetails(sourceItem.order_id) : null;
  if (!details) { notify("Pedido nao encontrado para este download."); return; }
  const item = details.items.find(function (candidate) { return candidate.id === found.order_item_id; });
  const text = DeliveryService.createLicenseText(details.order, item, found.beat, found.license, details.customer) + "\nToken seguro: " + found.token;
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "pub-records-" + found.beat.slug + "-" + found.file.type + ".txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  notify("Download seguro registrado.");
}

document.addEventListener("click", function (event) {
  const link = event.target.closest("a[data-link]");
  if (link) {
    event.preventDefault();
    navigate(link.getAttribute("href"));
    return;
  }
  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) return;
  const action = actionTarget.dataset.action;
  if (action === "play") playBeat(actionTarget.dataset.beat);
  if (action === "filters") {
    const panel = actionTarget.closest(".filter-panel");
    if (panel) panel.classList.toggle("is-open");
  }
  if (action === "add") {
    const result = Store.addToCart(actionTarget.dataset.beat, actionTarget.dataset.license);
    notify(result.message);
  }
  if (action === "remove-cart") Store.removeCartItem(actionTarget.dataset.item);
  if (action === "clear-cart") Store.clearCart();
  if (action === "role") {
    Store.setRole(actionTarget.dataset.role);
    notify(actionTarget.dataset.role === "admin" ? "Acesso interno ativado." : "Acesso público ativado.");
  }
  if (action === "contact") notify("Solicitação recebida. A equipe PUB RECORDS entrará em contato.");
  if (action === "set-email") {
    const input = document.getElementById("purchase-email");
    Store.setSessionEmail(input ? input.value : "");
    render();
  }
  if (action === "download") downloadLicense(actionTarget.dataset.download);
  if (action === "confirm-payment") {
    Store.confirmOrderPayment(actionTarget.dataset.order);
    notify("Pagamento confirmado e entrega liberada.");
  }
  if (action === "toggle-featured") {
    const beat = Store.beatById(actionTarget.dataset.beat);
    Store.updateBeat(beat.id, { is_featured: !beat.is_featured });
  }
  if (action === "player-close") {
    audio.pause();
    currentBeat = null;
    render();
  }
  if (action === "player-toggle") {
    if (!currentBeat) {
      const first = Store.beats({ featured: true })[0];
      if (first) playBeat(first.id);
      return;
    }
    if (audio.paused) audio.play(); else audio.pause();
    updatePlayerUi();
    render();
  }
});

document.addEventListener("change", function (event) {
  const target = event.target;
  if (target.dataset.action === "cart-license") Store.updateCartItem(target.dataset.item, target.value);
  if (target.dataset.action === "beat-status") Store.updateBeat(target.dataset.beat, { status: target.value });
  if (target.dataset.action === "order-payment") Store.updateOrder(target.dataset.order, { payment_status: target.value, delivery_status: target.value === "pago" ? "entregue" : "aguardando_pagamento" });
  if (target.dataset.action === "license-price") Store.updateLicense(target.dataset.license, { base_price: Number(target.value) });
  if (target.id === "volume") audio.volume = Number(target.value);
  if (target.id === "progress" && audio.duration) audio.currentTime = (Number(target.value) / 100) * audio.duration;
});

audio.addEventListener("timeupdate", updatePlayerUi);
audio.addEventListener("loadedmetadata", updatePlayerUi);
audio.addEventListener("ended", updatePlayerUi);
audio.addEventListener("play", updatePlayerUi);
audio.addEventListener("pause", updatePlayerUi);
window.addEventListener("popstate", render);
Store.subscribe(function () { if (!isRendering) render(); });
render();
