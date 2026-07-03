# Campfire (guitarhero) — static app served by nginx.
# Serves plain HTTP (everything) and HTTPS with a self-signed cert (needed so the
# tuner can access the microphone over the LAN — browsers require a secure context).
FROM nginx:alpine

# openssl is used by the entrypoint script to generate a self-signed cert on first run.
RUN apk add --no-cache openssl

# The app itself (no build step — plain HTML + ES modules).
COPY index.html /usr/share/nginx/html/index.html
COPY src /usr/share/nginx/html/src

# Server config + cert bootstrap.
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY deploy/40-generate-certs.sh /docker-entrypoint.d/40-generate-certs.sh
RUN chmod +x /docker-entrypoint.d/40-generate-certs.sh

EXPOSE 80 443
