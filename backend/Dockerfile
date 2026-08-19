# syntax=docker/dockerfile:1

ARG RUBY_VERSION=3.2.0

FROM ruby:${RUBY_VERSION}-slim AS base

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
      curl \
      libpq5 \
      libyaml-0-2 \
      tzdata && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV LANG=C.UTF-8 \
    BUNDLE_PATH=/usr/local/bundle

FROM base AS build-deps

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
      build-essential \
      libpq-dev \
      libyaml-dev \
      pkg-config && \
    rm -rf /var/lib/apt/lists/*

FROM build-deps AS development

ENV RAILS_ENV=development \
    BUNDLE_WITHOUT=""

COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY . .
RUN chmod +x bin/docker-entrypoint bin/rails

EXPOSE 3000
ENTRYPOINT ["./bin/docker-entrypoint"]
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]

FROM build-deps AS gems

ENV RAILS_ENV=production \
    BUNDLE_WITHOUT="development:test" \
    BUNDLE_DEPLOYMENT=1

COPY Gemfile Gemfile.lock ./
RUN bundle install && \
    rm -rf ~/.bundle /usr/local/bundle/src /usr/local/bundle/cache

COPY . .

FROM base AS production

RUN useradd --create-home --shell /bin/bash rails

ENV RAILS_ENV=production \
    BUNDLE_WITHOUT="development:test" \
    BUNDLE_DEPLOYMENT=1 \
    RAILS_LOG_TO_STDOUT=true \
    RAILS_SERVE_STATIC_FILES=true

COPY --from=gems /usr/local/bundle /usr/local/bundle
COPY --from=gems --chown=rails:rails /app /app

RUN chmod +x bin/docker-entrypoint bin/rails && \
    mkdir -p tmp/pids tmp/cache log && \
    chown -R rails:rails /app

USER rails

EXPOSE 3000
ENTRYPOINT ["./bin/docker-entrypoint"]
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
