import { resolve, basename } from 'path';
import { promisify } from 'util';
import globCb from 'glob';
import execa from 'execa';
import { rcompare } from './version';

const glob = promisify(globCb);

let mdlsHasFailedBefore = false;
const getVersion = async app => {
  if (mdlsHasFailedBefore) return null;

  try {
    const appPath = resolve('/Applications', app);
    const { stdout } = await execa('mdls', [
      appPath,
      '-name',
      'kMDItemVersion',
    ]);
    const [, version] = /"(.+)"/.exec(stdout);
    return version;
  } catch (error) {
    /**
     * We only need to fail once...
     */
    mdlsHasFailedBefore = true;
    return null;
  }
};

async function getLatestVersion() {
  const apps = await glob('*indesign*/*.app', {
    cwd: '/Applications',
    nocase: true,
  });

  if (apps.length < 1) {
    throw new Error('Could not find any installed version of InDesign');
  }

  const indesignApps = await Promise.all(
    apps.map(async app => ({
      app: basename(app),
      version: await getVersion(app),
    })),
  );

  let sorted;
  if (indesignApps[0].version == null) {
    /**
     * If mdls call fails it will fall back to sorting
     * by name of the apps instead – this is not as safe
     * but it is acceptable
     */
    sorted = indesignApps.sort((a, b) =>
      a.app > b.app ? -1 : a.app < b.app ? 1 : 0,
    );
  } else {
    sorted = indesignApps.sort((a, b) => rcompare(a.version, b.version));
  }

  return sorted[0];
}

export { getLatestVersion };
