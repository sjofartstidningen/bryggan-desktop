import * as utils from '../';

describe('Module: utils.sortByType', () => {
  it('should sort an array of files and folders by type then by name', () => {
    const items = [
      { type: 'file', name: 'test1.a' },
      { type: 'folder', name: 'test' },
      { type: 'file', name: '.env' },
      { type: 'file', name: 'test1.b' },
      { type: 'file', name: 'test2.a' },
    ];

    const sorted = items.sort(utils.sortByType);
    expect(sorted).toEqual([
      { type: 'folder', name: 'test' },
      { type: 'file', name: '.env' },
      { type: 'file', name: 'test1.a' },
      { type: 'file', name: 'test2.a' },
      { type: 'file', name: 'test1.b' },
    ]);
  });
});

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
