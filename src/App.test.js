import { render, screen } from '@testing-library/react';
import App from './App';

test('renders ERP system welcome message', () => {
  render(<App />);
  const welcomeMessage = screen.getByText(/مرحبًا بك في نظام تخطيط موارد المؤسسات/i);
  expect(welcomeMessage).toBeInTheDocument();
});
