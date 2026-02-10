import {useState} from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Journal from './pages/Journal'
import Entreprise from './pages/Entreprise'
import Metier from './pages/Metier'
import Login from './pages/Login'
import AddEntry from './pages/AddEntry'

function App() {
const [currentPage, setCurrentPage] = useState('home');

  return (
    <div>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage}/>
      <main>
        {currentPage === 'home' && <Home setCurrentPage={setCurrentPage} />}
        {currentPage === 'journal' && <Journal setCurrentPage={setCurrentPage} />}
        {currentPage === 'entreprise' && <Entreprise/>}
        {currentPage === 'metier' && <Metier/>}
        {currentPage === 'login' && <Login setCurrentPage={setCurrentPage} />}
        {currentPage === 'addEntry' && <AddEntry setCurrentPage={setCurrentPage} />}
      </main>
      <Footer nom="Mattéo" annee={2026}/>
    </div>
  )
}

export default App