#!/bin/bash
# Genera certificado SSL autofirmado para desarrollo local

DEPLOY_DIR="$(cd "$(dirname "$0")" && pwd)"
SSL_DIR="$DEPLOY_DIR/ssl"

mkdir -p "$SSL_DIR"

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout "$SSL_DIR/server.key" \
  -out "$SSL_DIR/server.crt" \
  -subj "/C=AR/ST=EntreRios/L=Parana/O=UNER/CN=localhost"

echo "Certificado generado en $SSL_DIR"
