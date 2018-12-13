import axios from 'axios';
import * as Dropbox from '../Dropbox';
import {
  filesListFolder,
  getAccount,
  getCurrentAccount,
} from '../../../__fixtures__/Dropbox';

jest.mock('axios');
jest.mock('electron-log');
jest.mock('../../../shared/simple-cache.js');

afterEach(() => {
  axios.post.mockReset();
});

describe('Api: Dropbox.listFolder', () => {
  beforeEach(() => {
    Dropbox.listFolderCache.get.mockClear();
    Dropbox.listFolderCache.clear();
  });

  it('should throw if accessToken is not provided', async () => {
    await expect(Dropbox.listFolder('/path')).rejects.toThrow();
  });

  it('should return a normalized array of files and folders of the provided path', async () => {
    axios.post.mockResolvedValue({ data: filesListFolder });
    const path = '/Tidningen/2018/11';
    const { items } = await Dropbox.listFolder(path, {
      accessToken: 'foo',
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

  it('should fetch items from cache if possible', async () => {
    axios.post.mockResolvedValue({ data: filesListFolder });

    await Dropbox.listFolder('/Tidningen/2018/11', { accessToken: 'foo' });
    expect(Dropbox.listFolderCache.get).not.toHaveBeenCalled();

    await Dropbox.listFolder('/Tidningen/2018/11', { accessToken: 'foo' });
    expect(Dropbox.listFolderCache.get).toHaveBeenCalled();
  });

  it('should ignore cache if told to', async () => {
    axios.post.mockResolvedValue({ data: filesListFolder });

    await Dropbox.listFolder('/Tidningen/2018/11', { accessToken: 'foo' });
    expect(Dropbox.listFolderCache.get).not.toHaveBeenCalled();

    await Dropbox.listFolder('/Tidningen/2018/11', {
      accessToken: 'foo',
      ignoreCache: true,
    });
    expect(Dropbox.listFolderCache.get).not.toHaveBeenCalled();
  });
});

describe('Api: Dropbox.getAccount', () => {
  beforeEach(() => {
    Dropbox.getAccountCache.get.mockClear();
    Dropbox.getAccountCache.clear();
  });

  it('should throw if accessToken is not provided', async () => {
    await expect(Dropbox.getAccount('accountId')).rejects.toThrow();
  });

  it('should return normalized information about an account', async () => {
    axios.post.mockResolvedValue({ data: getAccount });

    const { account } = await Dropbox.getAccount('account-id', {
      accessToken: 'accessToken',
    });

    const expectedShape = expect.objectContaining({
      id: expect.any(String),
      displayName: expect.any(String),
      profilePhotoUrl: expect.any(String),
    });

    expect(account).toEqual(expectedShape);
    expect(account).toMatchSnapshot();
  });

  it('should fetch items from cache if possible', async () => {
    axios.post.mockResolvedValue({ data: getAccount });

    await Dropbox.getAccount('account-id', { accessToken: 'foo' });
    expect(Dropbox.getAccountCache.get).not.toHaveBeenCalled();

    await Dropbox.getAccount('account-id', { accessToken: 'foo' });
    expect(Dropbox.getAccountCache.get).toHaveBeenCalled();
  });

  it('should ignore cache if told to', async () => {
    axios.post.mockResolvedValue({ data: getAccount });

    await Dropbox.getAccount('account-id', { accessToken: 'foo' });
    expect(Dropbox.getAccountCache.get).not.toHaveBeenCalled();

    await Dropbox.getAccount('account-id', {
      accessToken: 'foo',
      ignoreCache: true,
    });
    expect(Dropbox.getAccountCache.get).not.toHaveBeenCalled();
  });
});

describe('Api: Dropbox.getCurrentAccount', () => {
  it('should throw if accessToken is not provided', async () => {
    await expect(Dropbox.getCurrentAccount('accountId')).rejects.toThrow();
  });

  it('should return normalized information about an account', async () => {
    axios.post.mockResolvedValue({ data: getCurrentAccount });

    const { account } = await Dropbox.getCurrentAccount({
      accessToken: 'accessToken',
    });

    const expectedShape = expect.objectContaining({
      id: expect.any(String),
      displayName: expect.any(String),
      profilePhotoUrl: expect.any(String),
    });

    expect(account).toEqual(expectedShape);
    expect(account).toMatchSnapshot();
  });
});
