# DBT Formatter

### Install
```bash
npm install -s dbt-formatter
```

### Usage
```javascript
import formatter from 'dbt-formatter';

const mySql = "SELECT * FROM {{ ref('myTableRef') }}";
const myOpts = { sql: "default", indent: 2, upper: false };

formatter.format(mySql, myOpts)
```

This will result in:

```sql
SELECT
  *
FROM
  {{ ref('myTableRef') }}
```

### Usage options
- `sql` -> the sql dialect to use, currently only `default` is available (standard sql).
- `indent` -> How many spaces you want to use for indentations
- `upper` -> set to `true` if you want sql language related words to be uppercase.

## Development

### NPM scripts

 - `npm t`: Run test suite
 - `npm start`: Run `npm run build` in watch mode
 - `npm run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
 - `npm run test:prod`: Run linting and generate coverage
 - `npm run build`: Generate bundles and typings, create docs
 - `npm run lint`: Lints code
 - `npm run commit`: Commit using conventional commit style ([husky](https://github.com/typicode/husky) will tell you to use it if you haven't :wink:)

### Excluding peerDependencies

On library development, one might want to set some peer dependencies, and thus remove those from the final bundle. You can see in [Rollup docs](https://rollupjs.org/#peer-dependencies) how to do that.

Good news: the setup is here for you, you must only include the dependency name in `external` property within `rollup.config.js`. For example, if you want to exclude `lodash`, just write there `external: ['lodash']`.

### Git Hooks

There is already set a `precommit` hook for formatting your code with Prettier :nail_care:

By default, there are two disabled git hooks. They're set up when you run the `npm run semantic-release-prepare` script. They make sure:
 - You follow a [conventional commit message](https://github.com/conventional-changelog/conventional-changelog)
 - Your build is not going to fail in [Travis](https://travis-ci.org) (or your CI server), since it's runned locally before `git push`

This makes more sense in combination with [automatic releases](#automatic-releases)

## Roadmap
- CI/CD
- Testing
- Add more sql dialects compatible with dbt
