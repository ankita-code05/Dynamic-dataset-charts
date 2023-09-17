import { render, screen } from '@testing-library/react';
import App from './App';

test('renders PriceAnalysis component within App', () => {
  render(<App />);
  const priceAnalysisElement = screen.getByText(/Commodity Price Analysis/i);

  expect(priceAnalysisElement).toBeInTheDocument();
});





