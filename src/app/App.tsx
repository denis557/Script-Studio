import Header from '../components/Header/Header'
import SideBar from '../components/SideBar/SideBar'
import './App.scss'
import '../styles/global.scss'
import OpenedFiles from '../components/OpenedFiles/OpenedFiles'
import Codespace from '../components/Codespace/Codespace'
import Terminal from '../components/Terminal/Terminal'

function App() {
  return (
    <>
      <Header />
      <div className='wrapper'>
        <SideBar />
        <div className='secondWrapper'>
          <OpenedFiles />
          <Codespace />
          <Terminal />
        </div>
      </div>
    </>
  )
}

export default App
