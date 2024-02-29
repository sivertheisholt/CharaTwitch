import "./App.css";
import { Router } from "./Router";
import { NavBar } from "./components/navbar/NavBar";
import useSocket from "./hooks/useSocket";

function App() {
  const socket = useSocket("http://localhost:5000");

  socket?.on("hello", (arg) => {
    console.log(arg); // world
  });

  return (
    <div style={{ backgroundColor: "#212529", height: "100vh" }}>
      <Router>
        <NavBar />
      </Router>
    </div>
  );
}

export default App;
