import React from 'react';
import FORGOT from '../screens/ForgotPassword';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<FORGOT />).toJSON();
  expect(tree).toMatchSnapshot();
});