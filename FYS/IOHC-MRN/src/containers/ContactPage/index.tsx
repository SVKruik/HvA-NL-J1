import General from "./components/general"
import Social from "./components/social"
import Email from "./components/email"

const ContactPage = () => {
  return (
    <>
      <section className="text-info box">
        <General />
        <Social />
        <Email />
      </section>
    </>
  )
}

export default ContactPage