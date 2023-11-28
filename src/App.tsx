import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ListPage, MovieCardPage } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/movies" element={<ListPage />} />
        <Route path="/movies/:imbdID" element={<MovieCardPage />} />
        <Route path="*" element={<Navigate to="/movies" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
