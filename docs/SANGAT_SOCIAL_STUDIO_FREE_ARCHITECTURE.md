# KDN Sangat Social Studio — Free and Open Architecture

Status: approved direction, implementation pending. Metricool is optional, not a dependency.

## Principles
- Free-to-use for Sangat; open-source code and no compulsory paid subscription.
- Member owns their social accounts and controls every authorization.
- No password collection, no shared tokens, no scraping, no fabricated API access.
- Original Panthic writing preserved; moderation and publishing require explicit approval.
- Mobile-first royal gold/dark visual identity consistent with KDN.

## Implementation sequence
1. **Local-first Post Studio**: drafts, images, captions, approval, export, and platform-specific share links; usable without a server.
2. **Accounts dashboard**: show only user-entered account identities, distinguish listed, Meta-linked, OAuth-authorized, and API-ready states.
3. **Secure OAuth backend**: Meta Login and other official provider authorizations; encrypted token storage, scopes, refresh, revoke and audit log. GitHub Pages alone cannot safely hold OAuth secrets or server tokens.
4. **Publishing adapters**: official Meta APIs for eligible Facebook Pages and Instagram professional accounts; YouTube APIs when approved. Capability and rate limits per provider; no promise of universal auto-posting.
5. **Sangat multi-tenant system**: isolated member data, access controls, consent, abuse prevention, quotas, deletion and portability.
6. **Scheduling and analytics**: worker queue and provider-approved insights; clear operational cost and limits.

## Costs and sustainability
Source code and basic local features can be free. Hosting, media storage, scheduled workers, email and platform APIs may impose real costs or policy limits. Seek community sponsorship/donations and low-cost open-source hosting, but never guarantee zero infrastructure cost.

## Current known Meta state
Facebook Page 'भारत जागरण मिशन' is linked inside Meta to Instagram '@khatri.bussiness.konnect', as shown in the user's Meta screenshots. This is NOT KDN OAuth/API authorization. Other listed Facebook Pages and Instagram profiles remain unverified for KDN.

## Acceptance criteria for first release
- Draft/create/edit/export and manual-share without sign-in.
- All publishing disabled until verified per-account authorization.
- No secrets in public repository, client JS or screenshots.
- Accessibility, mobile usability, clear Hindi labels.
- Test with one opted-in account before expanding to Sangat.
