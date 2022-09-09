import Navbar from './containers/layout/Navbar/index';
import Content from './containers/layout/content/index';
import { Routes, Route } from 'react-router-dom';
import HomePage from './containers/HomePage';
import InfoPage from './containers/InfoPage';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Content>
        <Routes>
          <Route path="/" >
            <Route index element={<HomePage />}></Route>
            <Route path="Info" element={<InfoPage />}></Route>
          </Route>
        </Routes>
      </Content>
    </div>
  );
}

export default App;