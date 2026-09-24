import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Web3Provider } from "./wagmi/Provider";
import store from "./redux/store/store";
import Header from "./components/Header/Header";
import Dashboard from "./components/Dashboard/Dashboard";
import ApiDemo from "./components/ApiDemo/ApiDemo";
import SocketDemo from "./components/SocketDemo/SocketDemo";
import ChartDemo from "./components/ChartDemo/ChartDemo";
import WalletDemo from "./components/WalletDemo/WalletDemo";
import ContractDemo from "./components/ContractDemo/ContractDemo";
import GraphDemo from "./components/GraphDemo/GraphDemo";
import "./App.css";

function AppInner() {
  return (
    <Router>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/api-demo" element={<ApiDemo />} />
          <Route path="/socket-demo" element={<SocketDemo />} />
          <Route path="/chart-demo" element={<ChartDemo />} />
          <Route path="/wallet-demo" element={<WalletDemo />} />
          <Route path="/contract-demo" element={<ContractDemo />} />
          <Route path="/graph-demo" element={<GraphDemo />} />
        </Routes>
      </main>
      <ToastContainer theme="dark" />
    </Router>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Web3Provider>
        <AppInner />
      </Web3Provider>
    </Provider>
  );
}
