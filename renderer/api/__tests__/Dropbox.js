import * as Dropbox from '../Dropbox';
import { filesListFolder } from '../../__fixtures__/Dropbox';
import { __setResponseData } from 'axios';

jest.mock('axios');
__setResponseData({ data: filesListFolder });

describe('Api: Dropbox.listFolder', () => {
  it('should throw if apiKey is not provided', async () => {
    await expect(Dropbox.listFolder('/path')).rejects.toThrow();
  });

  it('should return a normalized array of files and folders of the provided path', async () => {
    const path = '/Tidningen/2018/11';
    const { items } = await Dropbox.listFolder(path, {
      apiKey: 'foo',
    });

    const folder = expect.objectContaining({
      id: expect.any(String),
      type: expect.stringMatching(/folder/gm),
      name: expect.any(String),
      path: expect.stringContaining(path),
    });

    const file = expect.objectContaining({
      id: expect.any(String),
      type: expect.stringMatching(/file/gm),
      name: expect.any(String),
      path: expect.stringContaining(path),
      clientModified: expect.any(String),
      serverModified: expect.any(String),
      modifiedBy: expect.any(String),
    });

    expect(items).toEqual(expect.arrayContaining([folder, file]));
    expect(items).toMatchSnapshot();
  });

  it('should be cancellable', async () => {
    const { CancelToken } = jest.requireActual('axios');
    const controller = CancelToken.source();

    const promise = Dropbox.listFolder('/path', {
      apiKey: 'foo',
      token: controller.token,
    });

    controller.cancel('Aborted');

    try {
      await promise;
    } catch (err) {
      expect(err.message).toMatch(/Aborted/);
    }
  });
});