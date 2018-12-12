const parseVersion = v => {
  try {
    return v
      .split('.')
      .map(v => v.replace(/\D/, ''))
      .filter(Boolean);
  } catch (err) {
    throw new Error(`Could not parse version ${v}`);
  }
};

const extendAndFill = (fill, length, arr) => {
  if (arr.length > length) return arr.slice(0, length);
  if (arr.length === length) return arr;
  return [...arr, ...Array.from({ length: length - arr.length }).fill(fill)];
};

const compare = (v1, v2) => {
  /**
   * Convert every version string to an array:
   * '1.1.1' => ['1', '1', '1']
   * '1.2-beta' => ['1', '2']
   */
  const v1Arr = parseVersion(v1);
  const v2Arr = parseVersion(v2);

  const longest = v1Arr.length > v2Arr.length ? v1Arr.length : v2Arr.length;

  /**
   * For comparison both the arrays need to be of equal
   * length, and the last positions needs to be filled with 0's
   */
  const v1FullArr = extendAndFill('0', longest, v1Arr);
  const v2FullArr = extendAndFill('0', longest, v2Arr);

  for (let i = 0; i < v1FullArr.length; i++) {
    const v1Curr = Number.parseInt(v1FullArr[i], 10);
    const v2Curr = Number.parseInt(v2FullArr[i], 10);

    if (v1Curr === v2Curr) continue;
    return v1Curr - v2Curr;
  }

  return 0;
};

const rcompare = (v1, v2) => compare(v2, v1);

const gt = (v1, v2) => compare(v1, v2) > 0;
const gte = (v1, v2) => compare(v1, v2) >= 0;
const lt = (v1, v2) => compare(v1, v2) < 0;
const lte = (v1, v2) => compare(v1, v2) <= 0;

export { compare, rcompare, gt, gte, lt, lte };
