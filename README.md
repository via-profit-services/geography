# Via Profit services / Geography

![via-profit-services-cover](./assets/via-profit-services-cover.png)

> Via Profit services / **Geography** - это пакет, который является частью сервиса, базирующегося на `via-profit-services` и представляет собой реализацию схемы работы с городами.


## TODO

- [ ] Описание методов класса сервиса
- [ ] CONTRIBUTING docs
- [ ] Тесты
- [ ] Subscriptions

## Содержание

- [Установка и настройка](#setup)
- [Как использовать](#how-to-use)
- [Подключение](#integration)


## <a name="setup"></a> Установка и настройка

### Установка

```bash
yarn add ssh://git@gitlab.com:via-profit-services/geography.git#semver:^0.4.6
```

Список версий [см. здесь](https://gitlab.com/via-profit-services/geography/-/tags)

### Миграции

1. После первой установки примените все необходимые миграции:

```bash
yarn knex:migrate:latest
```

После применения миграций будут созданы все необходимые таблицы в вашей базе данных

Заполнение таблиц данными происходит в ручном режиме. Это сделано для того, чтобы ваши миграции не содержали список стран и городов всего мира, а только те страны, которые требуются в вашем проекте.

2. Создайте файл миграций используя команду ниже:

```bash
yarn knex:migrate:make internal-geography-fill
```

3. Поместите код, указанный ниже, в созданный файл миграций. При необходимости скорректируйте набор стран, которые вы будете использовать

```ts
/* eslint-disable import/no-extraneous-dependencies */
import * as Knex from 'knex';
import * as kz from '@via-profit-services/geography/dist/countries/KZ';
import * as ru from '@via-profit-services/geography/dist/countries/RU';
import * as ua from '@via-profit-services/geography/dist/countries/UA';

const list = [kz, ru, ua];

export async function up(knex: Knex): Promise<any> {
  return list.reduce(async (prev, { countries, states, cities }) => {
    await prev;

    // insert countries
    await knex.raw(`
      ${knex('geographyCountries').insert(countries).toQuery()}
      on conflict ("id") do update set
      ${Object.keys(countries[0]).map((field) => `"${field}" = excluded."${field}"`).join(',')}
    `);

    // insert states
    await knex.raw(`
      ${knex('geographyStates').insert(states).toQuery()}
      on conflict ("id") do update set
      ${Object.keys(states[0]).map((field) => `"${field}" = excluded."${field}"`).join(', ')}
    `);

    // insert cities
    await knex.raw(`
      ${knex('geographyCities').insert(cities).toQuery()}
      on conflict ("id") do update set
      ${Object.keys(cities[0]).map((field) => `"${field}" = excluded."${field}"`).join(', ')}
    `);
  }, Promise.resolve());
}

export async function down(knex: Knex): Promise<any> {
  return knex.raw(`
    delete from "geographyCities";
    delete from "geographyStates";
    delete from "geographyCountries";
  `);
}

```



## <a name="how-to-use"></a> Как использовать

Soon


### <a name="integration"></a> Подключение

Для интеграции модуля требуется задействовать типы и резолверы модуля, затем необходимо подключить Express middleware, поставляемое пакетом. Так же необходимо сконфигурировать логгер.

Модуль экспортирует наружу:

  - typeDefs - служебные Типы
  - resolvers - Служеюные Резолверы
  - Geography - Класс, реализующий модель данного модуля

Пример подключения:

```ts
import { App } from '@via-profit-services/core';
import { typeDefs, resolvers } from '@via-profit-services/geography';

const app = new App({
  ...
  typeDefs: [
    typeDefs,
  ],
  resolvers: [
    resolvers,
  ],
  ...
});
app.bootstrap();

```

