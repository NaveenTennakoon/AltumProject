import React from 'react';
import FEEDBACKSCREEN from '../screens/FeedbackScreen';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<FEEDBACKSCREEN />).toJSON();
  expect(tree).toMatchSnapshot();
});