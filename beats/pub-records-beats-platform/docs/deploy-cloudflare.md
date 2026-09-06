# Deploy no Cloudflare Pages via GitHub

Este projeto e um site estatico. Em producao, nao precisa rodar o servidor local `server.mjs`; o Cloudflare Pages entrega `index.html`, `styles.css`, `src/` e `assets/` diretamente.

## Fluxo recomendado

1. Crie um repositorio no GitHub.
2. Envie o conteudo da pasta `pub-records-beats-platform` para esse repositorio.
3. No Cloudflare, abra Workers & Pages.
4. Clique em Create application > Pages.
5. Escolha Connect to Git.
6. Selecione o repositorio do GitHub.
7. Use esta configuracao:

- Framework preset: None
- Build command: deixe vazio
- Build output directory: `/`
- Root directory: `/`

## Arquivos importantes

- `_redirects`: faz rotas como `/catalogo` e `/beats/nome` carregarem corretamente.
- `_headers`: adiciona cabecalhos basicos e regras de cache.

## Se usar upload direto

Tambem funciona, desde que envie a pasta sem `wrangler.toml`. O projeto nao precisa de build.

## Depois de publicar

Teste estas rotas no dominio do Cloudflare:

- `/`
- `/catalogo`
- `/licencas`
- `/beats/acalmasse-matheus-paes`
- `/carrinho`
