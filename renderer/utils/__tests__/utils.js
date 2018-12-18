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
