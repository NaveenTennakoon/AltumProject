import React from 'react';
import LOCATIONS from '../screens/Locations';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<LOCATIONS />).toJSON();
  expect(tree).toMatchSnapshot();
});