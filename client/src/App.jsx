import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import Overview from "./pages/Overview";
import Portfolio from "./pages/Portfolio";
import Aura from "./pages/Aura";
import Scenarios from "./pages/Scenarios";

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/overview" element={<Overview />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/aura" element={<Aura />} />
        <Route path="/scenarios" element={<Scenarios />} />

        <Route path="/" element={<Navigate to="/overview" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
