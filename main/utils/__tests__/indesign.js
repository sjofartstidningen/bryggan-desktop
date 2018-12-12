import * as indesign from '../indesign';
import execa from 'execa';
import glob from 'glob';

jest.mock('glob', () => jest.fn());
jest.mock('execa', () => jest.fn());

glob.mockImplementation((str, opts, cb) =>
  setTimeout(
    () =>
      cb(null, [
        'Adobe InDesign CC 2019/Adobe InDesign CC 2019.app',
        'Adobe InDesign CC 2018/Adobe InDesign CC 2018.app',
        'Adobe InDesign CC 2017/Adobe InDesign CC 2017.app',
      ]),
    0,
  ),
);

const createRes = version => () =>
  Promise.resolve({ stdout: `kMDItemVersion = "${version}"` });

execa
  .mockImplementationOnce(createRes('14.0.1.209'))
  .mockImplementationOnce(createRes('13.0.5.99'))
  .mockImplementationOnce(createRes('12.1.12.103'));

describe('Module: indesign', () => {
  it('should retrieve the latest indesign version', async () => {
    const result = await indesign.getLatestVersion();

    expect(result.app).toEqual('Adobe InDesign CC 2019.app');
    expect(result.version).toMatch(/\d+\.\d+\.\d+\.\d+/);
  });

  it('should handle failure of execa mdls call', async () => {
    execa.mockImplementationOnce(() =>
      Promise.reject(new Error('mdls is not available')),
    );

    const result = await indesign.getLatestVersion();
    expect(result.app).toEqual('Adobe InDesign CC 2019.app');
  });
});
