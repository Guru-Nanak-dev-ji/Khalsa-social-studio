# Security Policy

KDN Social Studio v0.2 is a development-only prototype. Do not expose its Python HTTP server directly to the public internet.

Never commit credentials, Telegram bot tokens, API keys, SQLite databases, or personal news-source information.

Public deployment requires HTTPS, proper account authentication, authorization, secret storage, rate limiting, and an audited publishing queue. GitHub Pages can host a static demonstration only; it cannot run the Python backend or scheduled publishing worker.

Report security concerns privately to the repository maintainers rather than opening a public issue containing secrets.
