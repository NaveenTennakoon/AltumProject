import React from 'react';
import ENTERSCREEN from '../screens/EnterScreen';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<ENTERSCREEN />).toJSON();
  expect(tree).toMatchSnapshot();
});