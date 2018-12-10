const parallell = (...tasks) => Promise.all(tasks.map(t => t()));

const chain = (...tasks) =>
  tasks.reduce((prev, curr) => {
    return prev.then(res => curr(res));
  }, Promise.resolve());

export { parallell, chain };
