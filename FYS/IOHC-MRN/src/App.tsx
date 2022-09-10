import Navbar from './containers/layout/Navbar/index';
import Content from './containers/layout/content/index';
import { Routes, Route } from 'react-router-dom';
import HomePage from './containers/HomePage';
import InfoPage from './containers/InfoPage';
import ProjectPage from './containers/ProjectPage';
import ContactPage from './containers/ContactPage';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Content>
        <Routes> {/*Page Routing*/}
          <Route path="/">
            <Route index element={<HomePage />}></Route>
            <Route path="Info" element={<InfoPage />}></Route>
            <Route path="Projects" element={<ProjectPage />}></Route>
            <Route path="Contact" element={<ContactPage />}></Route>
          </Route>
        </Routes>
      </Content>
    </div>
  );
}

export default App;