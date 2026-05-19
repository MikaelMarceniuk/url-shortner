# MongoDB — Modelos do Projeto

> Não inclui tabelas gerenciadas pelo better-auth (`user`, `session`, `account`, `verification`).  
> O better-auth adiciona `tenant_id` no usuário via plugin `organization`.

---

## Tenant

Representa uma empresa cliente da plataforma. É o centro do isolamento multi-tenant — toda query do sistema deve ser filtrada por `tenant_id`.

```ts
interface Tenant {
  _id: ObjectId

  name: string
  // Nome da empresa. Exibido no dashboard e no branding.
  // Ex: "CodeUI", "Higher Up"

  instance_host: string
  // Domínio onde o dashboard do shortner está hospedado para esse tenant.
  // É o endereço que os funcionários da empresa acessam.
  // Ex: "shortner.codeui.com"
  // Único no sistema — índice unique.

  link_domains: Array<{
    _id: ObjectId
    // ID do subdocumento. Necessário para updates cirúrgicos via
    // Tenant.updateOne({ 'link_domains._id': id }, { $set: { ... } })

    host: string
    // Domínio base dos links encurtados gerados para esse tenant.
    // Ex: "link.codeui.com", "acesse.codeui.com"
    // O link final será: host + "/" + slug → "link.codeui.com/abc123"

    verified: boolean
    // false → cliente ainda não configurou o DNS.
    // true  → job de verificação confirmou o registro TXT no DNS.
    // Links só funcionam em domínios verificados.

    verification_token: string
    // Token gerado pelo sistema na criação do domínio.
    // Ex: "urlsh-a3f8c2d1e4b5a6c7d8e9f0a1b2c3d4e5"
    // O cliente deve criar um registro TXT no DNS com esse valor.
    // O job de verificação faz DNS lookup e compara com esse campo.

    ssl_enabled: boolean
    // false → certificado SSL ainda não emitido pelo Caddy.
    // true  → Caddy emitiu o certificado via Let's Encrypt.
    // Atualizado pelo mesmo job que verifica o DNS.

    created_at: Date
  }>

  settings: {
    default_redirect_type: '301' | '302'
    // Tipo de redirect padrão para todos os links do tenant.
    // Pode ser sobrescrito por link individual.
    // 301 → permanente, browser cacheia, bom para SEO.
    // 302 → temporário, browser não cacheia, bom para campanhas.

    default_utm: {
      utm_source?: string
      // Origem do tráfego. Ex: "instagram", "newsletter", "google"

      utm_medium?: string
      // Canal. Ex: "social", "email", "cpc", "organic"

      utm_campaign?: string
      // Nome da campanha. Ex: "black-friday-2025", "lancamento-v2"

      utm_term?: string
      // Termo de busca paga. Ex: "tenis+corrida"

      utm_content?: string
      // Identificador de criativo para A/B. Ex: "banner-topo", "cta-verde"
    }
    // UTMs aplicados em todos os links do tenant por padrão.
    // Podem ser sobrescritos por link individual.
    // Anexados na URL de destino antes do redirect para o Umami rastrear.

    branding: {
      logo_url?: string
      // URL absoluta do logo. Exibido no dashboard e na página de senha de link.

      primary_color?: string
      // Hex color. Ex: "#6366f1"
      // Aplicado no dashboard e nas páginas públicas do tenant.

      favicon_url?: string
      // URL absoluta do favicon.
    }
  }

  plan: 'free' | 'pro' | 'enterprise'
  // Controla limites do tenant:
  // free       → até 100 links, 0 domínios customizados, 30 dias de histórico
  // pro        → até 10.000 links, 3 domínios customizados, 1 ano de histórico
  // enterprise → ilimitado

  created_at: Date
  updated_at: Date
  // updated_at é usado para invalidar cache do tenant no middleware.
}
```

**Índices:**

```ts
// Lookup do middleware do dashboard — resolve tenant pelo instance_host
TenantSchema.index({ instance_host: 1 }, { unique: true })

// Lookup do redirect — Elysia resolve tenant pelo link_domain recebido no header
TenantSchema.index({ 'link_domains.host': 1 }, { unique: true, sparse: true })

// Verificação de domínio — job busca pelo token durante o polling DNS
TenantSchema.index({ 'link_domains.verification_token': 1 }, { sparse: true })
```

---

## Link

Representa um link encurtado criado por um usuário dentro de um tenant.

```ts
interface Link {
  _id: ObjectId

  // --- Isolamento ---

  tenant_id: ObjectId
  // FK → Tenant._id
  // SEMPRE presente em toda query. Nunca buscar links sem esse filtro.

  domain_id: ObjectId
  // FK → Tenant.link_domains._id
  // Define qual domínio base usar para esse link.
  // Ex: domain "link.codeui.com" + slug "abc123" = "link.codeui.com/abc123"

  // --- Identificação ---

  slug: string
  // Parte final do link encurtado. Gerado automaticamente (nanoid)
  // ou definido manualmente pelo usuário.
  // Ex: "abc123", "campanha-natal", "produto-x"
  // Único por domínio — índice composto (domain_id + slug).

  destination: string
  // URL completa para onde o visitante será redirecionado.
  // Os UTMs são anexados aqui em runtime, não ficam salvos nesse campo.
  // Ex: "https://codeui.com/produto"

  title?: string
  // Label interno para organização no dashboard.
  // Não é exibido para o visitante final.

  // --- Comportamento do redirect ---

  params: {
    redirect_type?: '301' | '302'
    // Sobrescreve Tenant.settings.default_redirect_type para esse link.
    // Se ausente, usa o padrão do tenant.

    utm?: {
      utm_source?: string
      utm_medium?: string
      utm_campaign?: string
      utm_term?: string
      utm_content?: string
    }
    // Sobrescreve Tenant.settings.default_utm para esse link.
    // Anexados na destination em runtime antes do redirect.
    // O Umami no site de destino rastreia via esses parâmetros.

    expires_at?: Date
    // Data de expiração. Após essa data o redirect retorna 410 Gone.

    max_clicks?: number
    // Limite de cliques. Quando click_count atingir esse valor,
    // o redirect retorna 410 Gone.

    password_hash?: string
    // Bcrypt hash de uma senha.
    // Se presente, o visitante é redirecionado para uma página de senha
    // antes de chegar na destination.

    geo_rules?: Array<{
      country: string
      // ISO 3166-1 alpha-2. Ex: "BR", "US", "PT"
      destination: string
      // URL alternativa para visitantes desse país.
    }>
    // Avaliadas em ordem — primeira regra que bater vence.
    // Se nenhuma bater, usa a destination principal.

    device_rules?: Array<{
      device: 'mobile' | 'desktop' | 'tablet'
      destination: string
      // Ex: deep link para app mobile "myapp://produto/123"
    }>
    // Avaliadas em ordem — primeira regra que bater vence.
    // Se nenhuma bater, usa a destination principal.

    og_title?: string
    og_description?: string
    og_image?: string
    // URL absoluta, idealmente 1200x630px.
    // Controlam o preview ao compartilhar no WhatsApp, Slack, Twitter etc.
    // Se ausentes, o Elysia faz fetch dos og: tags da destination original.
  }

  // --- Contadores ---

  click_count: number
  // Incrementado via $inc a cada redirect válido (atomic, sem race condition).
  // Usado apenas para: checar max_clicks e exibir contagem rápida no dashboard.
  // Analytics detalhado (sessões, geo, device) fica no Umami.

  // --- Auditoria ---

  created_by: ObjectId
  // FK → User._id (gerenciado pelo better-auth)

  created_at: Date
  updated_at: Date
}
```

**Índices:**

```ts
// O mais crítico — lookup do redirect, deve ser < 5ms
LinkSchema.index({ domain_id: 1, slug: 1 }, { unique: true })

// Listagem no dashboard filtrada por tenant, ordenada por criação
LinkSchema.index({ tenant_id: 1, created_at: -1 })

// Job de limpeza de links expirados
LinkSchema.index({ 'params.expires_at': 1 }, { sparse: true })
```
