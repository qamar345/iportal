import "react-calendar/dist/Calendar.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Register } from "./pages/Register";
// import { Information } from "./pages/Information";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<Register />} />
          {/* <Route path="/information" element={<Information />} /> */}

          {/* Index Routes */}
          {/* <Route exact path="/intern-dashboard" element={<InternHome />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
