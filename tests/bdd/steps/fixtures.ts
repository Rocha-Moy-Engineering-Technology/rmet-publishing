import { test as base } from 'playwright-bdd';

import {
  fixtureSiteFixtures,
  type FixtureSites,
} from '../../support/fixture-sites';

/** The playwright-bdd test every step file uses, with the fixture sites. */
export const test = base.extend<object, FixtureSites>(fixtureSiteFixtures);
