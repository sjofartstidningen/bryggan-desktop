import * as version from '../version';

test('version.gt', () => {
  expect(version.gt('10', '1')).toBeTruthy();
  expect(version.gt('1.2.3', '1.22.3')).toBeFalsy();
  expect(version.gt('1.2', '1.2.10.123')).toBeFalsy();
  expect(version.gt('1.2.10.123', '1.2')).toBeTruthy();
  expect(version.gt('1.2.10.123.1', '1.2.10.123.1.1')).toBeFalsy();
});

test('version.compare', () => {
  expect(['1', '10', '1', '1.2', '1.1', '0.2.3'].sort(version.compare)).toEqual(
    ['0.2.3', '1', '1', '1.1', '1.2', '10'],
  );
});

test('version.rcompare', () => {
  expect(
    ['1', '10', '1', '1.2', '1.1', '0.2.3'].sort(version.rcompare),
  ).toEqual(['10', '1.2', '1.1', '1', '1', '0.2.3']);

  expect(
    ['13.0.5.99', '14.0.1.209', '12.1.12.103'].sort(version.rcompare),
  ).toEqual(['14.0.1.209', '13.0.5.99', '12.1.12.103']);
});
