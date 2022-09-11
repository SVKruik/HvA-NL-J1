import Intro from "./components/Intro";
import General from "./components/general";
import Social from "./components/social";
import Email from "./components/email";

const ContactPage = () => {
  return (
    <>
      <section className="text-info box">
        <Intro />
        <General />
        <Social />
        <Email />
      </section>
    </>
  )
}

export default ContactPage