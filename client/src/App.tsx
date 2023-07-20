import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main.tsx";
import Content from "./components/Content.tsx";
import Login from "./components/Login.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />}>
            <Route path="content" element={<Content />} />
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
