# Roadmap de Features

> Cada feature é independente e entregável. O modelo MongoDB cresce incrementalmente —
> só adicione os campos quando a feature for implementada.

---

## F1 — Auth + Tenant básico

**Objetivo:** autenticação funcionando com isolamento por tenant.

**Better-auth cuida de:** `User`, `Session`, `Account`. Use o plugin `organization` para ligar `tenant_id` no usuário.

**Você implementa:**

```ts
// Modelo mínimo do Tenant
interface Tenant {
  _id: ObjectId
  name: string
  instance_host: string // "shortner.codeui.com"
  plan: 'free' | 'pro' | 'enterprise'
  created_at: Date
  updated_at: Date
}
```

**Índice:**

```ts
TenantSchema.index({ instance_host: 1 }, { unique: true })
```

**Entregável:** login, registro, sessão ativa, middleware do Next.js resolvendo tenant pelo `instance_host`.

---

## F2 — Link domains

**Objetivo:** tenant consegue cadastrar domínios base para os links. Verificação DNS mockada por enquanto — `verified: true` fixo.

**Adiciona no Tenant:**

```ts
link_domains: Array<{
  _id: ObjectId
  host: string // "link.codeui.com"
  verified: boolean // true fixo nessa feature
  verification_token: string // gerado mas ainda não validado
  ssl_enabled: boolean // false fixo nessa feature
  created_at: Date
}>
```

**Índice:**

```ts
TenantSchema.index({ 'link_domains.host': 1 }, { unique: true, sparse: true })
```

**Entregável:** CRUD de domínios no dashboard. Usuário cadastra `link.codeui.com` e o sistema salva.

---

## F3 — Criar e listar links

**Objetivo:** usuário consegue encurtar uma URL escolhendo um domínio cadastrado.

**Modelo Link mínimo:**

```ts
interface Link {
  _id: ObjectId
  tenant_id: ObjectId
  domain_id: ObjectId
  slug: string // nanoid gerado automaticamente
  destination: string
  title?: string
  click_count: number // inicia em 0
  created_by: ObjectId
  created_at: Date
  updated_at: Date
}
```

**Índices:**

```ts
LinkSchema.index({ domain_id: 1, slug: 1 }, { unique: true })
LinkSchema.index({ tenant_id: 1, created_at: -1 })
```

**Entregável:** formulário de criação, listagem paginada, copiar link gerado.

---

## F4 — Redirect

**Objetivo:** visitante acessa `link.codeui.com/abc123` e é redirecionado.

**Adiciona no Link.params:**

```ts
params: {
  redirect_type?: '301' | '302'
  // Se ausente → usa '302' como padrão até a F6 existir
}
```

**Rota Elysia:**

```
GET /:slug
  1. Lê header host
  2. Busca tenant por link_domains.host
  3. Busca link por { domain_id, slug }
  4. Incrementa click_count via $inc
  5. Redirect com status 301 ou 302
```

**Entregável:** redirect funcionando de ponta a ponta.

---

## F5 — Settings e branding

**Objetivo:** tenant personaliza comportamento padrão e aparência.

**Adiciona no Tenant.settings:**

```ts
settings: {
  default_redirect_type: '301' | '302'
  branding: {
    logo_url?: string
    primary_color?: string
    favicon_url?: string
  }
}
```

**Impacto no redirect (F4):** a rota passa a herdar `default_redirect_type` do tenant quando o link não tiver `params.redirect_type` definido.

**Entregável:** página de settings no dashboard, redirect respeitando o padrão do tenant.

---

## F6 — UTMs

**Objetivo:** parâmetros UTM são anexados automaticamente na URL de destino antes do redirect.

**Adiciona no Tenant.settings:**

```ts
settings: {
  // ...
  default_utm: {
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_term?: string
    utm_content?: string
  }
}
```

**Adiciona no Link.params:**

```ts
params: {
  // ...
  utm?: {
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_term?: string
    utm_content?: string
  }
}
```

**Lógica de merge no redirect:**

```ts
// Precedência: link.params.utm > tenant.settings.default_utm
const utm = { ...tenant.settings.default_utm, ...link.params.utm }

// Anexa na destination antes do redirect
const url = new URL(link.destination)
Object.entries(utm).forEach(([k, v]) => v && url.searchParams.set(k, v))
set.headers['Location'] = url.toString()
```

**Entregável:** UTMs configuráveis por tenant e por link, Umami rastreando via parâmetros na URL de destino.

---

## F7 — Verificação de domínio

**Objetivo:** ativar o fluxo real de DNS que estava mockado na F2.

**Nenhum campo novo** — usa o que já existe em `link_domains`.

**Implementar:**

- Job que roda a cada 10min fazendo DNS TXT lookup
- Se encontrar o `verification_token` → `verified: true`
- Após verificado, checar SSL via `fetch https://host` → `ssl_enabled: true`
- Dashboard exibe status: pendente / verificado / SSL ativo

**Entregável:** fluxo completo de adicionar domínio customizado real com instrução de DNS para o cliente.

---

## F8 — Params avançados

**Objetivo:** features avançadas de controle de link. Pode ser fatiada em sub-features.

**Adiciona no Link.params:**

```ts
params: {
  // ...
  expires_at?: Date           // sub-feature: expiração por data
  max_clicks?: number         // sub-feature: expiração por cliques
  password_hash?: string      // sub-feature: proteção por senha
  geo_rules?: Array<{         // sub-feature: redirect por país
    country: string
    destination: string
  }>
  device_rules?: Array<{      // sub-feature: redirect por dispositivo
    device: 'mobile' | 'desktop' | 'tablet'
    destination: string
  }>
  og_title?: string           // sub-feature: open graph customizado
  og_description?: string
  og_image?: string
}
```

**Índice adicional:**

```ts
// Job de limpeza de links expirados
LinkSchema.index({ 'params.expires_at': 1 }, { sparse: true })
```

---

## Visão geral

```
F1  Auth + Tenant básico
 └─ F2  Link domains
     └─ F3  Criar e listar links
         └─ F4  Redirect
             ├─ F5  Settings e branding
             │   └─ F6  UTMs
             ├─ F7  Verificação de domínio
             └─ F8  Params avançados
```

Cada feature só depende das anteriores na mesma linha. F7 e F8 podem ser desenvolvidas em paralelo após a F4 estar pronta.
