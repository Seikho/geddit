FROM mhart/alpine-node:8

COPY ./ /code

WORKDIR /code

VOLUME [ "/code/data" ]

ENV PORT=7344 \
  NODE_ENV=development \
  APP_ENV=dev

RUN yarn \
  && yarn build

ENTRYPOINT ["node", "."]