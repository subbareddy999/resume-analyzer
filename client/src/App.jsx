import { Toaster as HotToaster } from 'react-hot-toast'; // We'll use the toast library we already have
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      {/* This component handles the pop-up notifications */}
      <HotToaster position="top-center" reverseOrder={false} />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* This is a catch-all route for any page that doesn't exist */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
