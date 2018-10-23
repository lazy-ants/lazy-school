# Lazy school: server-side rendering [![CircleCI](https://circleci.com/gh/lazy-ants/lazy-school/tree/master.svg?style=svg)](https://circleci.com/gh/lazy-ants/lazy-school/tree/master)

## CLONE REPO

```
git clone git@github.com:lazy-ants/lazy-school.git
cd lazy-school
```

## CREATE APP CONFIG FILES

```
cp docker/nginx/nginx.conf.dist docker/nginx/nginx.conf
cp docker-compose.override.yml.dist docker-compose.override.yml
cp src/environments/environment.prod.ts.dist src/environments/environment.prod.ts
```

## BUILD APPLICATION

- in dev mode

```
docker-compose up -d --build
docker exec -ti lazy-school_nodejs npm install
docker exec -ti lazy-school_nodejs bash -c 'npm start'
```

- in prod mode (bash deploy.sh as quick solution)

```
docker-compose up -d --build
docker exec -ti lazy-school_nodejs npm install
docker exec -ti lazy-school_nodejs bash -c 'npm run build:ssr'
docker exec -ti lazy-school_nodejs bash -c 'npm run serve:ssr'
```
