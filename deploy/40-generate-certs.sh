#!/bin/sh
# Generate a self-signed TLS cert on first run so the tuner's microphone works over
# the LAN (browsers require HTTPS for getUserMedia on non-localhost origins).
# Runs via nginx's /docker-entrypoint.d/ hook before nginx starts.
set -e

CERT_DIR=/etc/nginx/certs
CN="${TLS_CN:-guitarhero.local}"

if [ ! -f "$CERT_DIR/cert.pem" ]; then
    echo ">> [guitarhero] Generating self-signed TLS certificate for '$CN'"
    echo ">>              (needed for the tuner microphone — you'll accept a one-time browser warning)"
    mkdir -p "$CERT_DIR"
    openssl req -x509 -newkey rsa:2048 -nodes \
        -keyout "$CERT_DIR/key.pem" \
        -out "$CERT_DIR/cert.pem" \
        -days 3650 \
        -subj "/CN=$CN" \
        -addext "subjectAltName=DNS:$CN,DNS:localhost,IP:127.0.0.1"
fi
