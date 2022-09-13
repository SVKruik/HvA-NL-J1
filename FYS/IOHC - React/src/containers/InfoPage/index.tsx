import Me from './components/Me'
import ActiveProjects from './components/ActiveProjects'
import InterestingStuff from './components/InterestingStuff'
import LanguagesAndTools from './components/LanguagesAndTools'
import ImagesCard from './components/ImagesCard'

const InfoPage = () => {
  return (
    <>
      <section className="text-info box">
        <Me />
        <ActiveProjects />
        <InterestingStuff />
        <LanguagesAndTools />
      </section>
      <section className="image-info box">
        <ImagesCard />
      </section>
    </>
  )
}

export default InfoPage