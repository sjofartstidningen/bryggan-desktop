import * as utils from '../utils';

describe('Module: utils.hasIdlkFile', () => {
  it('should check if a file has a corresponding idlk in the folder', () => {
    const file = { name: 'Test Document.indd' };

    expect(
      utils.hasIdlkFile(file, [
        { name: 'Test Document.indd' },
        { name: 'Test Document 1.indd' },
      ]),
    ).toBeFalsy();

    expect(
      utils.hasIdlkFile(file, [
        { name: 'Test Document.indd' },
        { name: 'Test Document 1.indd' },
        { name: '~test document~asd12.idlk' },
      ]),
    ).toBeTruthy();

    expect(
      utils.hasIdlkFile(file, [
        { name: 'Test Document.indd' },
        { name: 'Test Document 1.indd' },
        { name: '~test document 1~asd12.idlk' },
      ]),
    ).toBeFalsy();

    expect(
      utils.hasIdlkFile({ name: 'A-file-with-a-very-long-name.indd' }, [
        { name: 'A-file-with-a-very-long-name.indd' },
        { name: '~a-file-with-a-very~asd13ks.idlk' },
      ]),
    ).toBeTruthy();
  });
});
