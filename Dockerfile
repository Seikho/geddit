FROM node:8

VOLUME [ "/code/data" ]

ENV PORT=7344 \
  NODE_ENV=development \
  APP_ENV=dev

WORKDIR /code

# Optimise cache hits for dependencies
COPY ./package.json /code/package.json
COPY ./yarn.lock /code/yarn.lock
RUN yarn


COPY ./ /code
RUN yarn build

ENTRYPOINT ["node", "."]