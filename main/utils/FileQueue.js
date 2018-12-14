import mitt from 'mitt';

class FileQueue {
  constructor() {
    this.emitter = mitt();
    this.files = [];
  }

  get size() {
    return this.files.length;
  }

  on(channel, handler) {
    this.emitter.on(channel, handler);
  }

  off(channel, handler) {
    this.emitter.off(channel, handler);
  }

  push(file) {
    this.files.push(file);
    this.emitter.emit('push', file);
  }

  pop(amount = Infinity) {
    let popped = [];

    for (let i = 0; i < amount && this.files.length > 0; i++) {
      popped.push(this.files.shift());
    }

    this.emitter.emit('pop', popped);
    return popped;
  }
}

const fileQueue = new FileQueue();

export { FileQueue, fileQueue };
