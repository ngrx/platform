import plugin from '../src';

test('exports all config', () => {
  expect(Object.keys(plugin.configs).length).toBe(14);
});
