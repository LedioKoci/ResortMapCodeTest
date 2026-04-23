import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock the global fetch API
global.fetch = jest.fn();

const mockMapResponse = {
  grid: [
    ['W', '.', 'p'],
    ['c', '#', '#']
  ],
  booked: []
};

describe('Resort Map UI', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('Renders the map and fetches data on load', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => mockMapResponse,
    });

    render(<App />);

    // Wait for the map to render our "Luxury Resort" header
    expect(screen.getByText('Luxury Resort & Cabanas')).toBeInTheDocument();
    
    // Ensure fetch was called
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/map'));
  });

  test('Opens booking modal when clicking an available cabana', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => mockMapResponse,
    });

    const { container } = render(<App />);

    // Wait for tiles to render, then find the cabana tile
    await waitFor(() => {
      const cabanaTile = container.querySelector('.cabana.available');
      expect(cabanaTile).toBeInTheDocument();
      // Click the cabana
      fireEvent.click(cabanaTile);
    });

    // Check if modal opened
    expect(screen.getByText('Book Cabana')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Room Number/i)).toBeInTheDocument();
  });

  test('Shows success message upon valid booking', async () => {
    // Initial map load
    fetch.mockResolvedValueOnce({ json: async () => mockMapResponse });
    
    const { container } = render(<App />);
    
    await waitFor(() => {
      fireEvent.click(container.querySelector('.cabana.available'));
    });

    // Fill out form
    fireEvent.change(screen.getByPlaceholderText(/Room Number/i), { target: { value: '101' } });
    fireEvent.change(screen.getByPlaceholderText(/Guest Name/i), { target: { value: 'Alice Smith' } });

    // Mock the POST request for booking
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });
    // Mock the subsequent GET request to refresh the map
    fetch.mockResolvedValueOnce({ json: async () => mockMapResponse });

    // Submit
    fireEvent.click(screen.getByText('Confirm Booking'));

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText('Cabana booked successfully!')).toBeInTheDocument();
    });
  });
});