[Compare changes](https://github.com/stacksjs/ts-medium-editor/compare/v0.1.0...v0.1.1)

## 🚀 Features

- **extensions**: tables, task-list, code-block shortcut + a11y polish ([a14e6ee](https://github.com/stacksjs/ts-medium-editor/commit/a14e6ee)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- **extensions**: add markdown shortcuts + slash commands ([bf29374](https://github.com/stacksjs/ts-medium-editor/commit/bf29374)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- **toolbar**: add aria-pressed for toggle buttons + a11y polish ([53158e0](https://github.com/stacksjs/ts-medium-editor/commit/53158e0)) _(by glennmichael123 <gtorregosa@gmail.com>)_

## 🐛 Bug Fixes

- **toolbar**: allow formatting actions on a collapsed caret ([50039f8](https://github.com/stacksjs/ts-medium-editor/commit/50039f8)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- **scripts**: stop double-generating CHANGELOG on release ([412bead](https://github.com/stacksjs/ts-medium-editor/commit/412bead)) _(by Glenn Michael Torregosa <gtorregosa@gmail.com>)_
- add setup-bun to publish-commit job ([7ca5b96](https://github.com/stacksjs/ts-medium-editor/commit/7ca5b96)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- switch to happy-dom for full DOM API support in tests ([8620377](https://github.com/stacksjs/ts-medium-editor/commit/8620377)) _(by Chris <chrisbreuer93@gmail.com>)_
- add getSelection stub to document object ([8ba40ae](https://github.com/stacksjs/ts-medium-editor/commit/8ba40ae)) _(by Chris <chrisbreuer93@gmail.com>)_
- add Range and Selection stubs for rich text editor tests ([fad1c94](https://github.com/stacksjs/ts-medium-editor/commit/fad1c94)) _(by Chris <chrisbreuer93@gmail.com>)_
- properly register browser globals in happy-dom preload ([fad5d53](https://github.com/stacksjs/ts-medium-editor/commit/fad5d53)) _(by Chris <chrisbreuer93@gmail.com>)_
- resolve typecheck syntax error and update happy-dom preload ([23cc1f1](https://github.com/stacksjs/ts-medium-editor/commit/23cc1f1)) _(by Chris <chrisbreuer93@gmail.com>)_
- **ci**: add timeouts to prevent endlessly running jobs ([83012b5](https://github.com/stacksjs/ts-medium-editor/commit/83012b5)) _(by Chris <chrisbreuer93@gmail.com>)_

## 🤖 Continuous Integration

- drop redundant setup-bun (pantry installs bun via deps.yaml) ([808c6a2](https://github.com/stacksjs/ts-medium-editor/commit/808c6a2)) _(by glennmichael123 <gtorregosa@gmail.com>)_

## 🧹 Chores

- release v0.1.1 ([5da108e](https://github.com/stacksjs/ts-medium-editor/commit/5da108e)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- **deps**: refresh bun.lock to pick up @stacksjs/logsmith 0.2.3 ([a4d3539](https://github.com/stacksjs/ts-medium-editor/commit/a4d3539)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- **deps**: refresh bun.lock to pick up buddy-bot 0.9.20 ([ee1a795](https://github.com/stacksjs/ts-medium-editor/commit/ee1a795)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([b1b3640](https://github.com/stacksjs/ts-medium-editor/commit/b1b3640)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([5c717ec](https://github.com/stacksjs/ts-medium-editor/commit/5c717ec)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- refresh bun.lock and apply pickier --fix ([7e314a3](https://github.com/stacksjs/ts-medium-editor/commit/7e314a3)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- refresh bun.lock ([517e62d](https://github.com/stacksjs/ts-medium-editor/commit/517e62d)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- fresh install to pick up dtsx 0.9.14 and bunfig 0.15.9 ([1a6962e](https://github.com/stacksjs/ts-medium-editor/commit/1a6962e)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- use --bun flag in release script ([95f8b33](https://github.com/stacksjs/ts-medium-editor/commit/95f8b33)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- fresh install to pick up pickier 0.1.21 ([f0bef0f](https://github.com/stacksjs/ts-medium-editor/commit/f0bef0f)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- gitignore pantry directory ([a1d129a](https://github.com/stacksjs/ts-medium-editor/commit/a1d129a)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- repo cleanup and modernization ([eacfbc0](https://github.com/stacksjs/ts-medium-editor/commit/eacfbc0)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- remove .zed and .cursor folders ([406d809](https://github.com/stacksjs/ts-medium-editor/commit/406d809)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([26f74d7](https://github.com/stacksjs/ts-medium-editor/commit/26f74d7)) _(by Chris <chrisbreuer93@gmail.com>)_
- use Pantry action for publish-commit and add job dependencies ([affb3a3](https://github.com/stacksjs/ts-medium-editor/commit/affb3a3)) _(by Chris <chrisbreuer93@gmail.com>)_
- fix better-dx version to ^0.2.7 ([f5ff434](https://github.com/stacksjs/ts-medium-editor/commit/f5ff434)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- migrate to better-dx ([e5b9bc0](https://github.com/stacksjs/ts-medium-editor/commit/e5b9bc0)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- update lockfile ([a791698](https://github.com/stacksjs/ts-medium-editor/commit/a791698)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- revert bun-plugin-dtsx to 0.9.9 ([0926171](https://github.com/stacksjs/ts-medium-editor/commit/0926171)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- fix remaining lint warnings ([28e6217](https://github.com/stacksjs/ts-medium-editor/commit/28e6217)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- fix lint warnings ([1f53ec4](https://github.com/stacksjs/ts-medium-editor/commit/1f53ec4)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- enrich CLAUDE.md with detailed project context from README ([6953dcf](https://github.com/stacksjs/ts-medium-editor/commit/6953dcf)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- update CLAUDE.md with project context and crosswind details ([0509eb4](https://github.com/stacksjs/ts-medium-editor/commit/0509eb4)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- add proper claude code guidelines ([58220ec](https://github.com/stacksjs/ts-medium-editor/commit/58220ec)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- fix lint errors and add pickier config ([91fedb6](https://github.com/stacksjs/ts-medium-editor/commit/91fedb6)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- refresh bun.lock ([59af369](https://github.com/stacksjs/ts-medium-editor/commit/59af369)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- replace eslint with pickier ([9feb29c](https://github.com/stacksjs/ts-medium-editor/commit/9feb29c)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- **deps**: update all non-major dependencies (#1222) ([87f1db0](https://github.com/stacksjs/ts-medium-editor/commit/87f1db0)) _(by [renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>](https://github.com/renovate[bot]))_ ([#1222](https://github.com/stacksjs/ts-medium-editor/issues/1222), [#1222](https://github.com/stacksjs/ts-medium-editor/issues/1222))
- **deps**: update dependency actions/cache to v5.0.3 (#1157) ([9642251](https://github.com/stacksjs/ts-medium-editor/commit/9642251)) _(by Chris <chrisbreuer93@gmail.com>)_ ([#1157](https://github.com/stacksjs/ts-medium-editor/issues/1157), [#1157](https://github.com/stacksjs/ts-medium-editor/issues/1157))
- **deps**: update dependency @happy-dom/global-registrator to 20.6.1 (#1156) ([a92d9f6](https://github.com/stacksjs/ts-medium-editor/commit/a92d9f6)) _(by Chris <chrisbreuer93@gmail.com>)_ ([#1156](https://github.com/stacksjs/ts-medium-editor/issues/1156), [#1156](https://github.com/stacksjs/ts-medium-editor/issues/1156))
- **deps**: update actions/cache action to v5 (#209) ([f75b009](https://github.com/stacksjs/ts-medium-editor/commit/f75b009)) _(by [renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>](https://github.com/renovate[bot]))_ ([#209](https://github.com/stacksjs/ts-medium-editor/issues/209), [#209](https://github.com/stacksjs/ts-medium-editor/issues/209))
- **deps**: update actions/checkout action to v6 (#21) ([1761a91](https://github.com/stacksjs/ts-medium-editor/commit/1761a91)) _(by [renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>](https://github.com/renovate[bot]))_ ([#21](https://github.com/stacksjs/ts-medium-editor/issues/21), [#21](https://github.com/stacksjs/ts-medium-editor/issues/21))
- **deps**: update dependency @happy-dom/global-registrator to v20 (#20) ([73080e6](https://github.com/stacksjs/ts-medium-editor/commit/73080e6)) _(by [renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>](https://github.com/renovate[bot]))_ ([#20](https://github.com/stacksjs/ts-medium-editor/issues/20), [#20](https://github.com/stacksjs/ts-medium-editor/issues/20))
- add clarity and cursor rules ([e533976](https://github.com/stacksjs/ts-medium-editor/commit/e533976)) _(by cab-mikee <mike.cabz32@gmail.com>)_
- **deps**: update dependency actions/checkout to v5.0.0 (#14) ([aeb57fc](https://github.com/stacksjs/ts-medium-editor/commit/aeb57fc)) _(by Chris <chrisbreuer93@gmail.com>)_ ([#14](https://github.com/stacksjs/ts-medium-editor/issues/14), [#14](https://github.com/stacksjs/ts-medium-editor/issues/14))
- **deps**: update all non-major dependencies (#15) ([841a2a6](https://github.com/stacksjs/ts-medium-editor/commit/841a2a6)) _(by Chris <chrisbreuer93@gmail.com>)_ ([#15](https://github.com/stacksjs/ts-medium-editor/issues/15), [#15](https://github.com/stacksjs/ts-medium-editor/issues/15))
- **deps**: update actions/cache action to v4.3.0 (#5) ([d23de73](https://github.com/stacksjs/ts-medium-editor/commit/d23de73)) _(by [renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>](https://github.com/renovate[bot]))_ ([#5](https://github.com/stacksjs/ts-medium-editor/issues/5), [#5](https://github.com/stacksjs/ts-medium-editor/issues/5))
- **deps**: update dependency @happy-dom/global-registrator to v19 (#4) ([b737cd4](https://github.com/stacksjs/ts-medium-editor/commit/b737cd4)) _(by [renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>](https://github.com/renovate[bot]))_ ([#4](https://github.com/stacksjs/ts-medium-editor/issues/4), [#4](https://github.com/stacksjs/ts-medium-editor/issues/4))
- **deps**: update dependency font-awesome to v7 (#6) ([a8fb600](https://github.com/stacksjs/ts-medium-editor/commit/a8fb600)) _(by [renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>](https://github.com/renovate[bot]))_ ([#6](https://github.com/stacksjs/ts-medium-editor/issues/6), [#6](https://github.com/stacksjs/ts-medium-editor/issues/6))
- **deps**: update dependency @happy-dom/global-registrator to 19.0.2 (#8) ([2dadd58](https://github.com/stacksjs/ts-medium-editor/commit/2dadd58)) _(by Chris <chrisbreuer93@gmail.com>)_ ([#8](https://github.com/stacksjs/ts-medium-editor/issues/8), [#8](https://github.com/stacksjs/ts-medium-editor/issues/8))
- **deps**: update all non-major dependencies (#10) ([0227409](https://github.com/stacksjs/ts-medium-editor/commit/0227409)) _(by Chris <chrisbreuer93@gmail.com>)_ ([#10](https://github.com/stacksjs/ts-medium-editor/issues/10), [#10](https://github.com/stacksjs/ts-medium-editor/issues/10))
- **deps**: update dependency buddy-bot to 0.9.7 (#12) ([6e92945](https://github.com/stacksjs/ts-medium-editor/commit/6e92945)) _(by Chris <chrisbreuer93@gmail.com>)_ ([#12](https://github.com/stacksjs/ts-medium-editor/issues/12), [#12](https://github.com/stacksjs/ts-medium-editor/issues/12))
- **deps**: update dependency actions/checkout to v5.0.0 (#13) ([6f5474b](https://github.com/stacksjs/ts-medium-editor/commit/6f5474b)) _(by Chris <chrisbreuer93@gmail.com>)_ ([#13](https://github.com/stacksjs/ts-medium-editor/issues/13), [#13](https://github.com/stacksjs/ts-medium-editor/issues/13))
- update tooling ([69be208](https://github.com/stacksjs/ts-medium-editor/commit/69be208)) _(by Adelino Ngomacha <adelinob335@gmail.com>)_
- adjust url ([522a743](https://github.com/stacksjs/ts-medium-editor/commit/522a743)) _(by Chris <chrisbreuer93@gmail.com>)_

## ⏪ Reverts

- keep staged-lint kebab + bunx gitlint shorthand ([3faabd3](https://github.com/stacksjs/ts-medium-editor/commit/3faabd3)) _(by glennmichael123 <gtorregosa@gmail.com>)_

## Contributors

- _Adelino Ngomacha <adelinob335@gmail.com>_
- _Chris <chrisbreuer93@gmail.com>_
- _Glenn Michael Torregosa <gtorregosa@gmail.com>_
- _[renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>](https://github.com/renovate[bot])_
- _cab-mikee <mike.cabz32@gmail.com>_
- _glennmichael123 <gtorregosa@gmail.com>_

## ...main

### 🏡 Chore

- Initial commit ([1465af7](https://github.com/stacksjs/ts-medium-editor/commit/1465af7))
- Wip ([c37c9a8](https://github.com/stacksjs/ts-medium-editor/commit/c37c9a8))
- Wip ([4292cac](https://github.com/stacksjs/ts-medium-editor/commit/4292cac))
- Wip ([edf7392](https://github.com/stacksjs/ts-medium-editor/commit/edf7392))
- Wip ([ab26a8b](https://github.com/stacksjs/ts-medium-editor/commit/ab26a8b))
- Wip ([249a04d](https://github.com/stacksjs/ts-medium-editor/commit/249a04d))
- Wip ([dccd3a1](https://github.com/stacksjs/ts-medium-editor/commit/dccd3a1))
- Wip ([a22e630](https://github.com/stacksjs/ts-medium-editor/commit/a22e630))
- Wip ([767ce51](https://github.com/stacksjs/ts-medium-editor/commit/767ce51))
- Wip ([87d5488](https://github.com/stacksjs/ts-medium-editor/commit/87d5488))
- Wip ([b93a457](https://github.com/stacksjs/ts-medium-editor/commit/b93a457))
- Wip ([b33d52c](https://github.com/stacksjs/ts-medium-editor/commit/b33d52c))
- Wip ([6265c7b](https://github.com/stacksjs/ts-medium-editor/commit/6265c7b))
- Wip ([d2c3bc5](https://github.com/stacksjs/ts-medium-editor/commit/d2c3bc5))
- Wip ([ac3ef03](https://github.com/stacksjs/ts-medium-editor/commit/ac3ef03))
- Wip ([225ab94](https://github.com/stacksjs/ts-medium-editor/commit/225ab94))
- Wip ([8506927](https://github.com/stacksjs/ts-medium-editor/commit/8506927))
- Wip ([e3e8c71](https://github.com/stacksjs/ts-medium-editor/commit/e3e8c71))
- Wip ([7aab276](https://github.com/stacksjs/ts-medium-editor/commit/7aab276))
- Wip ([12970e8](https://github.com/stacksjs/ts-medium-editor/commit/12970e8))
- Wip ([be2338a](https://github.com/stacksjs/ts-medium-editor/commit/be2338a))
- Wip ([2815775](https://github.com/stacksjs/ts-medium-editor/commit/2815775))
- Wip ([268b643](https://github.com/stacksjs/ts-medium-editor/commit/268b643))
- Wip ([60f0222](https://github.com/stacksjs/ts-medium-editor/commit/60f0222))
- Wip ([4c4eff0](https://github.com/stacksjs/ts-medium-editor/commit/4c4eff0))
- Wip ([cd7cc1c](https://github.com/stacksjs/ts-medium-editor/commit/cd7cc1c))
- Wip ([d1dc6db](https://github.com/stacksjs/ts-medium-editor/commit/d1dc6db))
- Wip ([73c909e](https://github.com/stacksjs/ts-medium-editor/commit/73c909e))
- Wip ([c2fac11](https://github.com/stacksjs/ts-medium-editor/commit/c2fac11))
- Wip ([f739d3d](https://github.com/stacksjs/ts-medium-editor/commit/f739d3d))
- Wip ([bf79055](https://github.com/stacksjs/ts-medium-editor/commit/bf79055))
- Wip ([a3124ab](https://github.com/stacksjs/ts-medium-editor/commit/a3124ab))
- Wip ([9b63390](https://github.com/stacksjs/ts-medium-editor/commit/9b63390))
- Wip ([7d34bab](https://github.com/stacksjs/ts-medium-editor/commit/7d34bab))
- Wip ([8c78db6](https://github.com/stacksjs/ts-medium-editor/commit/8c78db6))

### ❤️ Contributors

- Chris ([@chrisbbreuer](https://github.com/chrisbbreuer))
