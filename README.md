# Locci Url

- A blazing fast `url shortener`

## Technologies:

- Framework: Axum
- Database: Libsql

### Start in dev mode with `cargo-watch`

First install the binary

```sh
cargo install cargo-watch
```

Start the project

```sh
cargo watch -q -c -w ./src -x run
```

If you have just installed

```sh
just run-dev
```

## Interacting w/ API

GET - Healthcheck

```sh
curl \
--header "Content-Type: application/json" \
--request GET \
http://localhost:3000/health
```

POST - Create Short URL

```sh
curl  \
--header "Content-Type: application/json" \
--request POST \
--data '{"url":"https://example.com"}' \
http://localhost:3000/shorten

```

## Benchmarks

Using the [rewrk](https://github.com/ChillFish8/rewrk) HTTP load benchmarker

```sh
rewrk -c 256 -d 60s -h http://localhost:5050/todos --pct
```
