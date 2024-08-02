import Header from '../components/Header/Header'
import SideBar from '../components/SideBar/SideBar'
import './App.scss'
import '../styles/global.scss'
import OpenedFiles from '../components/OpenedFiles/OpenedFiles'
import Codespace from '../components/Codespace/Codespace'

function App() {
  return (
    <>
      <Header />
      <div className='wrapper'>
        <SideBar />
        <div className='secondWrapper'>
          <OpenedFiles />
          <Codespace />
        </div>
      </div>
    </>
  )
}

export default App
