import {BrowserRouter,Routes,Route} from 'react-router-dom';
import {Home} from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import {Chat} from './pages/Chat';
import './index.css';
import  Navbar  from './components/Navbar/Navbar';

function App() {
  return (
    <div className="App">
     <BrowserRouter>
     <Navbar/>
     <Routes>
      <Route path='/' exact element={<Home/>}/>
      <Route path='/signup' exact element={<SignUp/>}/>
      <Route path='/signin' exact element={<SignIn/>}/>
      <Route path='/chat' exact element={<Chat/>}/>
     </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
