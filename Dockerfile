FROM node:6

COPY ./ /code

WORKDIR /code

ENV PORT 7344 
ENV NODE_ENV development
ENV APP_ENV dev

RUN npm install \
  && npm run build

ENTRYPOINT ["node", "."]