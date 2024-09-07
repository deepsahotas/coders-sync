import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import EditorPage from './components/EditorPage';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <div>
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              theme: {
                primary: '#f00',
              },
            },
          }}
        ></Toaster>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor/:roomId" element={<EditorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
