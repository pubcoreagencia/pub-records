# PUB RECORDS Beats Platform

MVP independente para venda de beats, instrumentais e producoes autorais da PUB RECORDS.

## O que foi implementado

- Landing page propria com hero, beats em destaque, explicacao de compra, licencas, sobre e contato.
- Catalogo com busca, filtros por genero, BPM, tom, mood, preco, destaque e licenca.
- Player de preview com play/pause e regra de um preview por vez.
- Pagina individual do beat em /beats/nome-do-beat.
- Sistema de licencas Basica, Premium, Ilimitada e Exclusiva.
- Carrinho com alteracao de licenca, subtotal e total.
- Checkout simulado com dados do comprador e camada de pagamento abstrata.
- Area Minhas Compras com downloads protegidos simulados, tokens e registro de download.
- Painel administrativo com cadastro de beat, uploads simulados, status, destaque, pedidos, licencas, compradores, downloads e metricas.
- Catalogo atualizado com 13 musicas reais no lugar dos placeholders anteriores.
- Schema Supabase/Postgres em database/schema.sql.

## Como rodar

Opcao recomendada:

    npm start

Depois abra:

    http://localhost:4173

Tambem e possivel abrir index.html, mas as URLs amigaveis como /beats/acalmasse-matheus-paes funcionam melhor pelo servidor local.

## Como testar

- Catalogo publico: acesse /catalogo, use busca e filtros.
- Player: clique em Play em qualquer card ou pagina individual.
- Pagina do beat: abra uma musica pelo botao Detalhes no catalogo.
- Carrinho: clique em Comprar, altere a licenca em /carrinho.
- Checkout simulado: finalize em /checkout; Cartao teste aprova na hora, Pix manual fica pendente.
- Minhas compras: acesse /minhas-compras e baixe arquivos quando o pedido estiver pago.
- Admin: clique em Modo admin no topo e abra /admin.
- Cadastrar beats: no admin, preencha o formulario de novo beat. Uploads sao capturados como nomes de arquivo nesta fase.
- Pedidos: no admin, confirme pagamento para liberar entrega digital.

## Partes simuladas

- Autenticacao e permissoes de admin/cliente.
- Gateway de pagamento.
- Upload real para storage.
- Entrega de masters, WAV e stems.
- Geracao de contrato/licenca em PDF.
- Notificacoes por e-mail, CRM e WhatsApp.

## Pronto para expansao futura

- Supabase Auth, banco, storage e RLS.
- Mercado Pago, Stripe, PagSeguro, Pix manual e Pix automatico.
- PUB CORE, CRM interno, automacao de marketing e area de produtores.
- Signed URLs para downloads pagos.
- Contratos/licencas em PDF apos compra confirmada.

## Referencia visual

O site oficial da PUB RECORDS foi acessado com sucesso. Os padroes aplicados estao documentados em docs/visual-reference.md.
