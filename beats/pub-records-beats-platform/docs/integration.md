# Integracao futura

A plataforma foi criada como MVP independente. Ela nao depende de paginas, rotas ou componentes do site oficial da PUB RECORDS.

Camadas preparadas:

- Frontend: SPA modular em src, com rotas publicas e administrativas.
- Dados: src/data/mock-data.js centraliza dados substituiveis.
- Servicos: src/services separa loja/carrinho/pedidos, pagamento e entrega digital.
- Banco: database/schema.sql prepara tabelas, relacionamentos, enums, indices e RLS para Supabase.
- Storage: previews/capas publicos; arquivos finais privados com signed URLs.
- Pagamentos: PaymentService abstrai Mercado Pago, Stripe, PagSeguro, Pix manual e Pix automatico.
- Entrega: DeliveryService prepara tokens, expiracao e registro de downloads.
- Autenticacao: MVP usa papel admin/cliente simulado; schema prepara auth.users + customers.role.

Proximos pontos de integracao:

1. Criar projeto Supabase e aplicar o schema.
2. Migrar mock-data para seed SQL ou painel administrativo real.
3. Trocar localStorage por chamadas a Supabase client/API interna.
4. Implementar login real e proteger admin com claims/RLS.
5. Configurar buckets: capas/previews publicos e masters/stems privados.
6. Adicionar gateway real com webhooks idempotentes.
7. Gerar contrato/licenca em PDF apos pedido pago.
8. Integrar CRM, e-mail, WhatsApp e PUB CORE.
9. Criar area de produtores/artistas e relatorios por periodo.
