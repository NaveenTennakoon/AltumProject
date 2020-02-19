import React from 'react';
import PROFILE from '../screens/ProfileScreen';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<PROFILE />).toJSON();
  expect(tree).toMatchSnapshot();
});