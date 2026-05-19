# URL Shortener Multi-Tenant

Produto de encurtamento de links vendido como white-label para empresas. Cada empresa cliente recebe sua própria instância visual do produto rodando em um subdomínio dela, mas toda a infraestrutura é compartilhada.

---

## O que é

Uma empresa contrata o produto e passa a ter:

- Um dashboard próprio em `shortner.empresa.com` para gerenciar os links
- Domínios customizados para os links gerados, ex: `link.empresa.com/abc123`
- Branding próprio (logo, cor, favicon)
- Configurações de UTM e redirect aplicadas automaticamente nos links

O visitante final que clica num link nunca sabe que está usando esse produto — ele só vê o domínio da empresa.

---

## Como o multi-tenant funciona

Cada empresa é um **Tenant**. O sistema identifica de qual tenant veio a requisição pelo domínio do host:

- Acesso em `shortner.codeui.com` → tenant CodeUI → carrega o dashboard da CodeUI
- Acesso em `link.codeui.com/abc123` → tenant CodeUI → resolve o link e redireciona

Todo dado no banco (links, domínios, configurações) está amarrado a um `tenant_id`. Nunca existe uma query sem esse filtro — é o que garante que uma empresa nunca vê os dados de outra.

Veja os modelos em [mongo-models.md](./mongo-models.md).

---

## O que cada empresa pode fazer

**Domínios:** cadastrar domínios customizados para os links gerados. O sistema valida que a empresa é dona do domínio via registro TXT no DNS antes de ativar.

**Links:** encurtar qualquer URL escolhendo qual domínio usar. O slug pode ser gerado automaticamente ou definido manualmente.

**UTMs:** configurar parâmetros UTM padrão que são anexados automaticamente em todos os links. Cada link pode sobrescrever. O analytics não é feito pelo shortner — os UTMs chegam na URL de destino e o **Umami** instalado no site da empresa rastreia.

**Settings:** definir se os redirects são 301 ou 302 por padrão, e personalizar a aparência do dashboard.

**Params avançados** (features futuras): expiração por data ou por número de cliques, proteção por senha, redirect condicional por país ou dispositivo, Open Graph customizado para preview no WhatsApp e Slack.

---

## O que o produto não faz

- Não faz analytics próprio — delega ao Umami via UTMs
- Não gerencia DNS — só valida que o cliente configurou corretamente
- Não emite SSL manualmente — o Caddy faz isso automaticamente via Let's Encrypt quando o domínio aponta para o servidor

---

## Estado atual e próximos passos

O produto está sendo construído em features incrementais, da mais essencial para a mais avançada.

Veja a ordem e o que cada feature entrega em [feature-roadmap.md](./feature-roadmap.md).
