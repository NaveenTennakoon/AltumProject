import React from 'react';
import SETTINGS from '../screens/SettingsScreen';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<SETTINGS />).toJSON();
  expect(tree).toMatchSnapshot();
});