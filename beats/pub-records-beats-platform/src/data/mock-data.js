export const producers = [
  {
    "id": "prod-paesnobeat",
    "name": "paesnobeat",
    "role": "Produtor musical",
    "bio": "Produtor do catálogo autoral da loja."
  },
  {
    "id": "prod-matheus-paes",
    "name": "Matheus Paes",
    "role": "Produtor / compositor",
    "bio": "Produtor e compositor com faixas instrumentais no catálogo."
  },
  {
    "id": "prod-pub-curadoria",
    "name": "PUB RECORDS Curadoria",
    "role": "Curadoria musical",
    "bio": "Curadoria comercial do catálogo de beats e instrumentais."
  }
];

export const genres = [
  {
    "id": "lofi-chill",
    "name": "Lo-fi / Chill"
  },
  {
    "id": "latin",
    "name": "Latin"
  },
  {
    "id": "ambient",
    "name": "Ambient"
  },
  {
    "id": "jazz-fusion",
    "name": "Jazz Fusion"
  },
  {
    "id": "instrumental-rock",
    "name": "Instrumental Rock"
  },
  {
    "id": "instrumental",
    "name": "Instrumental"
  }
];

export const licenseTypes = [
  {
    "id": "basic",
    "name": "Licença Básica",
    "description": "Para demos, conteúdo social e primeiros lançamentos independentes.",
    "base_price": 89,
    "allows_monetization": false,
    "allows_distribution": true,
    "allows_performances": false,
    "includes_wav": false,
    "includes_stems": false,
    "is_exclusive": false,
    "usage_limit": "Até 10.000 streams ou 1 videoclipe independente",
    "keeps_available": true
  },
  {
    "id": "premium",
    "name": "Licença Premium",
    "description": "Uso comercial com WAV, monetização e distribuição digital.",
    "base_price": 179,
    "allows_monetization": true,
    "allows_distribution": true,
    "allows_performances": true,
    "includes_wav": true,
    "includes_stems": false,
    "is_exclusive": false,
    "usage_limit": "Até 100.000 streams e shows independentes",
    "keeps_available": true
  },
  {
    "id": "unlimited",
    "name": "Licença Ilimitada",
    "description": "Para lançamentos maiores com WAV, stems e uso ampliado.",
    "base_price": 349,
    "allows_monetization": true,
    "allows_distribution": true,
    "allows_performances": true,
    "includes_wav": true,
    "includes_stems": true,
    "is_exclusive": false,
    "usage_limit": "Streams ilimitados em contrato não exclusivo",
    "keeps_available": true
  },
  {
    "id": "exclusive",
    "name": "Licença Exclusiva",
    "description": "Remove a faixa da loja após confirmação e entrega pacote completo.",
    "base_price": 1200,
    "allows_monetization": true,
    "allows_distribution": true,
    "allows_performances": true,
    "includes_wav": true,
    "includes_stems": true,
    "is_exclusive": true,
    "usage_limit": "Uso exclusivo conforme contrato individual",
    "keeps_available": false
  }
];

export const beats = [
  {
    "id": "beat-catalogo-01",
    "slug": "acalmasse-matheus-paes",
    "title": "Acalmasse - Matheus Paes",
    "description": "Faixa autoral do catálogo PUB RECORDS, selecionada para licenciamento, preview e negociação comercial.",
    "producer_id": "prod-paesnobeat",
    "genre_id": "ambient",
    "bpm": null,
    "musical_key": "N/D",
    "mood": "Chill",
    "tags": [
      "lofi",
      "chill",
      "ambient",
      "instrumental"
    ],
    "cover_url": "https://i1.sndcdn.com/artworks-3dB8GUgzIDMSZTBy-8F3WBQ-large.png",
    "preview_audio_url": null,
    "source_path": "/pubrecords/lo-fi-chill-paesnobeat",
    "duration_ms": 312046,
    "source_license": "all-rights-reserved",
    "source_downloadable": false,
    "playback_count": 396,
    "likes_count": 4,
    "status": "disponivel",
    "is_featured": true,
    "publish_date": "2025-08-08",
    "sales_count": 396,
    "license_prices": {
      "basic": 89,
      "premium": 179,
      "unlimited": 349,
      "exclusive": 1200
    }
  },
  {
    "id": "beat-catalogo-02",
    "slug": "machu-picchu-paesnobeat",
    "title": "Machu Picchu  - @paesnobeat",
    "description": "Faixa autoral do catálogo PUB RECORDS, selecionada para licenciamento, preview e negociação comercial.",
    "producer_id": "prod-paesnobeat",
    "genre_id": "latin",
    "bpm": null,
    "musical_key": "N/D",
    "mood": "Latino",
    "tags": [
      "latin"
    ],
    "cover_url": "https://i1.sndcdn.com/artworks-Zl338bYV20SPREeG-yV8GCQ-large.png",
    "preview_audio_url": null,
    "source_path": "/pubrecords/machu-picchu-afrorap",
    "duration_ms": 216046,
    "source_license": "all-rights-reserved",
    "source_downloadable": false,
    "playback_count": 149,
    "likes_count": 1,
    "status": "disponivel",
    "is_featured": true,
    "publish_date": "2026-05-12",
    "sales_count": 149,
    "license_prices": {
      "basic": 99,
      "premium": 189,
      "unlimited": 359,
      "exclusive": 1275
    }
  },
  {
    "id": "beat-catalogo-03",
    "slug": "ratombo",
    "title": "ratombo",
    "description": "Faixa autoral do catálogo PUB RECORDS, selecionada para licenciamento, preview e negociação comercial.",
    "producer_id": "prod-paesnobeat",
    "genre_id": "instrumental",
    "bpm": null,
    "musical_key": "N/D",
    "mood": "Instrumental",
    "tags": [],
    "cover_url": "https://i1.sndcdn.com/artworks-5KRuwXxgegyPP8oS-zl85wg-large.png",
    "preview_audio_url": null,
    "source_path": "/pubrecords/ratombo",
    "duration_ms": 341379,
    "source_license": "all-rights-reserved",
    "source_downloadable": false,
    "playback_count": 14,
    "likes_count": 0,
    "status": "disponivel",
    "is_featured": true,
    "publish_date": "2026-04-22",
    "sales_count": 14,
    "license_prices": {
      "basic": 109,
      "premium": 199,
      "unlimited": 369,
      "exclusive": 1350
    }
  },
  {
    "id": "beat-catalogo-04",
    "slug": "numero-1",
    "title": "#1",
    "description": "Faixa autoral do catálogo PUB RECORDS, selecionada para licenciamento, preview e negociação comercial.",
    "producer_id": "prod-paesnobeat",
    "genre_id": "ambient",
    "bpm": null,
    "musical_key": "N/D",
    "mood": "Ambient",
    "tags": [
      "ambient",
      "jazz",
      "jazz & blues",
      "instrumental"
    ],
    "cover_url": "https://i1.sndcdn.com/avatars-yEuGz9F4uSiAy40t-FIQ8EA-large.jpg",
    "preview_audio_url": null,
    "source_path": "/pubrecords/1a",
    "duration_ms": 195738,
    "source_license": "all-rights-reserved",
    "source_downloadable": false,
    "playback_count": 133,
    "likes_count": 0,
    "status": "disponivel",
    "is_featured": true,
    "publish_date": "2025-08-10",
    "sales_count": 133,
    "license_prices": {
      "basic": 119,
      "premium": 209,
      "unlimited": 379,
      "exclusive": 1425
    }
  },
  {
    "id": "beat-catalogo-05",
    "slug": "pincher-pipica",
    "title": "PINCHER - PIPICA",
    "description": "Faixa autoral do catálogo PUB RECORDS, selecionada para licenciamento, preview e negociação comercial.",
    "producer_id": "prod-paesnobeat",
    "genre_id": "jazz-fusion",
    "bpm": null,
    "musical_key": "N/D",
    "mood": "Jazz Fusion",
    "tags": [
      "jazz & blues",
      "jazz fusion",
      "instrumental"
    ],
    "cover_url": "https://i1.sndcdn.com/avatars-yEuGz9F4uSiAy40t-FIQ8EA-large.jpg",
    "preview_audio_url": null,
    "source_path": "/pubrecords/minibonsai-samanbaia",
    "duration_ms": 212617,
    "source_license": "all-rights-reserved",
    "source_downloadable": false,
    "playback_count": 478,
    "likes_count": 5,
    "status": "disponivel",
    "is_featured": false,
    "publish_date": "2025-08-10",
    "sales_count": 478,
    "license_prices": {
      "basic": 89,
      "premium": 179,
      "unlimited": 349,
      "exclusive": 1500
    }
  },
  {
    "id": "beat-catalogo-06",
    "slug": "relaxasse-matheus-paes",
    "title": "RELAXASSE - MATHEUS PAES",
    "description": "Faixa autoral do catálogo PUB RECORDS, selecionada para licenciamento, preview e negociação comercial.",
    "producer_id": "prod-paesnobeat",
    "genre_id": "ambient",
    "bpm": null,
    "musical_key": "N/D",
    "mood": "Chill",
    "tags": [
      "chill",
      "relax",
      "ambient",
      "instrumental",
      "jazz",
      "blues"
    ],
    "cover_url": "https://i1.sndcdn.com/artworks-au5bV7otgzmIbrxg-xJM4RA-large.png",
    "preview_audio_url": null,
    "source_path": "/pubrecords/3a1",
    "duration_ms": 428046,
    "source_license": "all-rights-reserved",
    "source_downloadable": false,
    "playback_count": 268,
    "likes_count": 2,
    "status": "disponivel",
    "is_featured": false,
    "publish_date": "2025-08-10",
    "sales_count": 268,
    "license_prices": {
      "basic": 99,
      "premium": 189,
      "unlimited": 359,
      "exclusive": 1575
    }
  },
  {
    "id": "beat-catalogo-07",
    "slug": "tamanco-lunar",
    "title": "TAMANCO LUNAR",
    "description": "Faixa autoral do catálogo PUB RECORDS, selecionada para licenciamento, preview e negociação comercial.",
    "producer_id": "prod-matheus-paes",
    "genre_id": "instrumental",
    "bpm": null,
    "musical_key": "N/D",
    "mood": "Instrumental",
    "tags": [],
    "cover_url": "https://i1.sndcdn.com/avatars-000731981692-2f9hdi-large.jpg",
    "preview_audio_url": null,
    "source_path": "/paesmat/tamanco-lunar",
    "duration_ms": 109140,
    "source_license": "all-rights-reserved",
    "source_downloadable": false,
    "playback_count": 14,
    "likes_count": 0,
    "status": "disponivel",
    "is_featured": false,
    "publish_date": "2022-01-29",
    "sales_count": 14,
    "license_prices": {
      "basic": 109,
      "premium": 199,
      "unlimited": 369,
      "exclusive": 1650
    }
  },
  {
    "id": "beat-catalogo-08",
    "slug": "joshua-moderno-paesmatmusic-instagram",
    "title": "JOSHUA MODERNO - @PAESMATMUSIC INSTAGRAM",
    "description": "Faixa autoral do catálogo PUB RECORDS, selecionada para licenciamento, preview e negociação comercial.",
    "producer_id": "prod-matheus-paes",
    "genre_id": "ambient",
    "bpm": null,
    "musical_key": "N/D",
    "mood": "Chill",
    "tags": [
      "lofi",
      "ambient",
      "instrumental",
      "instrumental rock",
      "alternative",
      "rock"
    ],
    "cover_url": "https://i1.sndcdn.com/avatars-000731981692-2f9hdi-large.jpg",
    "preview_audio_url": null,
    "source_path": "/paesmat/joshua-moderno-2",
    "duration_ms": 115043,
    "source_license": "all-rights-reserved",
    "source_downloadable": false,
    "playback_count": 17,
    "likes_count": 0,
    "status": "disponivel",
    "is_featured": false,
    "publish_date": "2023-08-18",
    "sales_count": 17,
    "license_prices": {
      "basic": 119,
      "premium": 209,
      "unlimited": 379,
      "exclusive": 1725
    }
  },
  {
    "id": "beat-catalogo-09",
    "slug": "guaxinim-de-londres-paesmatmusic-instagram",
    "title": "GUAXINIM DE LONDRES - @PAESMATMUSIC INSTAGRAM",
    "description": "Faixa autoral do catálogo PUB RECORDS, selecionada para licenciamento, preview e negociação comercial.",
    "producer_id": "prod-matheus-paes",
    "genre_id": "ambient",
    "bpm": null,
    "musical_key": "N/D",
    "mood": "Ambient",
    "tags": [
      "ambient",
      "instrumental"
    ],
    "cover_url": "https://i1.sndcdn.com/avatars-000731981692-2f9hdi-large.jpg",
    "preview_audio_url": null,
    "source_path": "/paesmat/guaxinim-de-londres-final",
    "duration_ms": 125257,
    "source_license": "all-rights-reserved",
    "source_downloadable": true,
    "playback_count": 21,
    "likes_count": 0,
    "status": "disponivel",
    "is_featured": false,
    "publish_date": "2023-08-03",
    "sales_count": 21,
    "license_prices": {
      "basic": 89,
      "premium": 179,
      "unlimited": 349,
      "exclusive": 1800
    }
  },
  {
    "id": "beat-catalogo-10",
    "slug": "a-fuga-dos-camelos",
    "title": "A FUGA DOS CAMELOS",
    "description": "Faixa autoral do catálogo PUB RECORDS, selecionada para licenciamento, preview e negociação comercial.",
    "producer_id": "prod-matheus-paes",
    "genre_id": "instrumental",
    "bpm": null,
    "musical_key": "N/D",
    "mood": "Instrumental",
    "tags": [],
    "cover_url": "https://i1.sndcdn.com/avatars-000731981692-2f9hdi-large.jpg",
    "preview_audio_url": null,
    "source_path": "/paesmat/a-fuga-dos-camelos",
    "duration_ms": 135732,
    "source_license": "all-rights-reserved",
    "source_downloadable": false,
    "playback_count": 16,
    "likes_count": 1,
    "status": "disponivel",
    "is_featured": false,
    "publish_date": "2023-04-01",
    "sales_count": 16,
    "license_prices": {
      "basic": 99,
      "premium": 189,
      "unlimited": 359,
      "exclusive": 1875
    }
  },
  {
    "id": "beat-catalogo-11",
    "slug": "zulu-da-mesopotamia-001",
    "title": "ZULU DA MESOPOTAMIA - 001",
    "description": "Faixa autoral do catálogo PUB RECORDS, selecionada para licenciamento, preview e negociação comercial.",
    "producer_id": "prod-matheus-paes",
    "genre_id": "instrumental",
    "bpm": null,
    "musical_key": "N/D",
    "mood": "Instrumental",
    "tags": [],
    "cover_url": "https://i1.sndcdn.com/avatars-000731981692-2f9hdi-large.jpg",
    "preview_audio_url": null,
    "source_path": "/paesmat/zulu-da-mesopotamia-001",
    "duration_ms": 110446,
    "source_license": "all-rights-reserved",
    "source_downloadable": false,
    "playback_count": 8,
    "likes_count": 0,
    "status": "disponivel",
    "is_featured": false,
    "publish_date": "2021-07-01",
    "sales_count": 8,
    "license_prices": {
      "basic": 109,
      "premium": 199,
      "unlimited": 369,
      "exclusive": 1950
    }
  },
  {
    "id": "beat-catalogo-12",
    "slug": "a-fuga-dos-camelos-1",
    "title": "A FUGA DOS CAMELOS 1",
    "description": "Faixa autoral do catálogo PUB RECORDS, selecionada para licenciamento, preview e negociação comercial.",
    "producer_id": "prod-matheus-paes",
    "genre_id": "instrumental",
    "bpm": null,
    "musical_key": "N/D",
    "mood": "Instrumental",
    "tags": [],
    "cover_url": "https://i1.sndcdn.com/avatars-000731981692-2f9hdi-large.jpg",
    "preview_audio_url": null,
    "source_path": "/paesmat/a-fuga-dos-camelos-1",
    "duration_ms": 267176,
    "source_license": "all-rights-reserved",
    "source_downloadable": false,
    "playback_count": 12,
    "likes_count": 1,
    "status": "disponivel",
    "is_featured": false,
    "publish_date": "2021-10-20",
    "sales_count": 12,
    "license_prices": {
      "basic": 119,
      "premium": 209,
      "unlimited": 379,
      "exclusive": 2025
    }
  },
  {
    "id": "beat-catalogo-13",
    "slug": "zulu-da-mesopotamia-pt-2",
    "title": "ZULU DA MESOPOTAMIA PT.2",
    "description": "Faixa autoral do catálogo PUB RECORDS, selecionada para licenciamento, preview e negociação comercial.",
    "producer_id": "prod-matheus-paes",
    "genre_id": "instrumental",
    "bpm": null,
    "musical_key": "N/D",
    "mood": "Instrumental",
    "tags": [],
    "cover_url": "https://i1.sndcdn.com/avatars-000731981692-2f9hdi-large.jpg",
    "preview_audio_url": null,
    "source_path": "/paesmat/zulu-da-mesopotamia-pt2",
    "duration_ms": 86446,
    "source_license": "all-rights-reserved",
    "source_downloadable": false,
    "playback_count": 8,
    "likes_count": 0,
    "status": "disponivel",
    "is_featured": false,
    "publish_date": "2021-09-11",
    "sales_count": 8,
    "license_prices": {
      "basic": 89,
      "premium": 179,
      "unlimited": 349,
      "exclusive": 2100
    }
  }
];

export const beatFiles = [
  {
    "id": "file-catalogo-01-preview",
    "beat_id": "beat-catalogo-01",
    "type": "preview",
    "storage_path": "/pubrecords/lo-fi-chill-paesnobeat",
    "is_public": true
  },
  {
    "id": "file-catalogo-02-preview",
    "beat_id": "beat-catalogo-02",
    "type": "preview",
    "storage_path": "/pubrecords/machu-picchu-afrorap",
    "is_public": true
  },
  {
    "id": "file-catalogo-03-preview",
    "beat_id": "beat-catalogo-03",
    "type": "preview",
    "storage_path": "/pubrecords/ratombo",
    "is_public": true
  },
  {
    "id": "file-catalogo-04-preview",
    "beat_id": "beat-catalogo-04",
    "type": "preview",
    "storage_path": "/pubrecords/1a",
    "is_public": true
  },
  {
    "id": "file-catalogo-05-preview",
    "beat_id": "beat-catalogo-05",
    "type": "preview",
    "storage_path": "/pubrecords/minibonsai-samanbaia",
    "is_public": true
  },
  {
    "id": "file-catalogo-06-preview",
    "beat_id": "beat-catalogo-06",
    "type": "preview",
    "storage_path": "/pubrecords/3a1",
    "is_public": true
  },
  {
    "id": "file-catalogo-07-preview",
    "beat_id": "beat-catalogo-07",
    "type": "preview",
    "storage_path": "/paesmat/tamanco-lunar",
    "is_public": true
  },
  {
    "id": "file-catalogo-08-preview",
    "beat_id": "beat-catalogo-08",
    "type": "preview",
    "storage_path": "/paesmat/joshua-moderno-2",
    "is_public": true
  },
  {
    "id": "file-catalogo-09-preview",
    "beat_id": "beat-catalogo-09",
    "type": "preview",
    "storage_path": "/paesmat/guaxinim-de-londres-final",
    "is_public": true
  },
  {
    "id": "file-catalogo-10-preview",
    "beat_id": "beat-catalogo-10",
    "type": "preview",
    "storage_path": "/paesmat/a-fuga-dos-camelos",
    "is_public": true
  },
  {
    "id": "file-catalogo-11-preview",
    "beat_id": "beat-catalogo-11",
    "type": "preview",
    "storage_path": "/paesmat/zulu-da-mesopotamia-001",
    "is_public": true
  },
  {
    "id": "file-catalogo-12-preview",
    "beat_id": "beat-catalogo-12",
    "type": "preview",
    "storage_path": "/paesmat/a-fuga-dos-camelos-1",
    "is_public": true
  },
  {
    "id": "file-catalogo-13-preview",
    "beat_id": "beat-catalogo-13",
    "type": "preview",
    "storage_path": "/paesmat/zulu-da-mesopotamia-pt2",
    "is_public": true
  },
  {
    "id": "file-generic-contract",
    "beat_id": null,
    "type": "license_pdf",
    "storage_path": "secure/contracts/generated",
    "is_public": false
  }
];

export const customers = [
  {
    "id": "cust-lia",
    "name": "Lia Nova",
    "artist_name": "Lia Nova",
    "email": "lia@example.com",
    "document": "000.000.000-00"
  },
  {
    "id": "cust-mc-zen",
    "name": "Rafael Costa",
    "artist_name": "MC Zen",
    "email": "rafael@example.com",
    "document": "00.000.000/0001-00"
  }
];

export const orders = [
  {
    "id": "ord-1001",
    "customer_id": "cust-lia",
    "total_amount": 179,
    "payment_status": "pago",
    "delivery_status": "entregue",
    "payment_method": "mock-card",
    "notes": "Pedido simulado com faixa do catálogo.",
    "created_at": "2026-06-21T12:20:00.000Z",
    "updated_at": "2026-06-21T12:24:00.000Z"
  },
  {
    "id": "ord-1002",
    "customer_id": "cust-mc-zen",
    "total_amount": 359,
    "payment_status": "pendente",
    "delivery_status": "aguardando_pagamento",
    "payment_method": "pix-manual",
    "notes": "Negociação via WhatsApp.",
    "created_at": "2026-06-26T15:40:00.000Z",
    "updated_at": "2026-06-26T15:40:00.000Z"
  }
];

export const orderItems = [
  {
    "id": "item-1001-1",
    "order_id": "ord-1001",
    "beat_id": "beat-catalogo-01",
    "license_type_id": "premium",
    "price": 179,
    "created_at": "2026-06-21T12:20:00.000Z"
  },
  {
    "id": "item-1002-1",
    "order_id": "ord-1002",
    "beat_id": "beat-catalogo-02",
    "license_type_id": "unlimited",
    "price": 359,
    "created_at": "2026-06-26T15:40:00.000Z"
  }
];

export const downloads = [
  {
    "id": "down-1001-1",
    "order_item_id": "item-1001-1",
    "customer_id": "cust-lia",
    "file_id": "file-generic-contract",
    "download_count": 1,
    "last_downloaded_at": "2026-06-22T09:10:00.000Z",
    "expires_at": "2026-08-21T12:20:00.000Z",
    "created_at": "2026-06-21T12:24:00.000Z"
  }
];

export const payments = [
  {
    "id": "pay-1001",
    "order_id": "ord-1001",
    "provider": "mock-card",
    "amount": 179,
    "status": "paid",
    "provider_reference": "SIM-1001",
    "created_at": "2026-06-21T12:22:00.000Z"
  },
  {
    "id": "pay-1002",
    "order_id": "ord-1002",
    "provider": "pix-manual",
    "amount": 359,
    "status": "pending",
    "provider_reference": "PIX-1002",
    "created_at": "2026-06-26T15:40:00.000Z"
  }
];

export const initialData = {
  producers,
  genres,
  licenseTypes,
  beats,
  beatFiles,
  customers,
  orders,
  orderItems,
  downloads,
  payments
};
