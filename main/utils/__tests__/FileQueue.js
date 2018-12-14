import { FileQueue } from '../FileQueue';

describe('Util: FileQueue', () => {
  it('should create a queue from where one can get files in the queue', () => {
    const queue = new FileQueue();

    queue.push('file/path');
    expect(queue.size).toBe(1);
    expect(queue.pop()).toEqual(['file/path']);
    expect(queue.size).toBe(0);
  });

  it('should be able to only take n of the files in the queue', () => {
    const queue = new FileQueue();

    queue.push('file/path1');
    queue.push('file/path2');
    queue.push('file/path3');
    queue.push('file/path4');

    expect(queue.size).toBe(4);
    expect(queue.pop(2)).toEqual(['file/path1', 'file/path2']);
    expect(queue.size).toBe(2);
    expect(queue.files).toEqual(['file/path3', 'file/path4']);
  });

  it('should emit events when new files are added', () => {
    const queue = new FileQueue();

    const push = jest.fn();
    queue.on('push', push);

    queue.push('file/path');
    expect(push).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith('file/path');
  });
});
