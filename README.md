[![CircleCI](https://circleci.com/gh/henriblancke/dbt-formatter/tree/master.svg?style=svg)](https://circleci.com/gh/henriblancke/dbt-formatter/tree/master)

# DBT Formatter

### Install

```bash
npm install -s dbt-formatter
```

### Usage

```javascript
import formatter from 'dbt-formatter';

const mySql = "SELECT * FROM {{ ref('myTableRef') }}";
const myOpts = { sql: 'default', indent: 2, upper: false };

formatter.format(mySql, myOpts);
```

This will result in:

```sql
SELECT
  *
FROM
  {{ ref('myTableRef') }}
```

### Usage options

Fine tune `dbt-formatter` behavior with the following options:

| Option         | Default   | Description                                                            |
| -------------- | --------- | ---------------------------------------------------------------------- |
| sql            | `default` | The sql dialect you want to use, currently only `default` is available |
| indent         | `2`       | How many spaces you want an indentation to be                          |
| upper          | `false`   | Formats sql reserved words to be uppercase when set to `true`          |
| newline        | `false`   | Appends a new line at the end of the formatted sql string              |
| lowerWords     | `false`   | Lowercases all `words` as identified by the tokenizer                  |
| allowCamelcase | `true`    | Allows column names to be camelcased                                   |

## Development

### NPM scripts

- `npm test`: Run test suite
- `npm start`: Run `npm run build` in watch mode
- `npm run build`: Generate bundles and typings, create docs
- `npm run lint`: Lints code
- `npm run package`: Package dbt-formatter as a binary

## Roadmap

- Add more sql dialects:
  - [x] snowflake
  - [ ] redshift
  - [ ] bigquery
  - [ ] postgres
  - [ ] presto
