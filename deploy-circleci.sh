#!/bin/bash
docker-compose up -d --build
docker exec -i lazy-school_nodejs npm install
docker exec -i lazy-school_nodejs bash -c 'npm run build:ssr'
docker exec -i lazy-school_nodejs bash -c 'npm run serve:ssr'
