import reference from "../../../shared/assets/img/Reference.png";
import TableP2 from "./TableP2";

const myStyles = {
  borderRadius: "5px",
  width: "700px"
}

const Project2 = () => {
  return (
    <article className="info-cards">
      <h2>Project 2</h2>
      <h4>Template Nabouwen</h4>
      <p>
        Dit project ben ik gestart zodat ik <a href="https://reactjs.org/" className="paragraph-link" target="_blank" rel="noreferrer">React</a>,
        een frond-end framework, kan leren. Ik doe dit samen met een paar andere mensen. We hebben wekelijks 2 keer een meeting, en daar gaan we
        samen aan de slag. Zelf kunnen we altijd buiten deze momenten afspreken, en kunnen we elkaar altijd vragen om hulp.
      </p>
      <p>
        Voor dit project hebben we een bestaande <a href="https://odindesignthemes.com/vikinger/profile-timeline.html" className="paragraph-link" target="_blank" rel="noreferrer">website</a> gekozen, 
        die er erg goed uitzag en goed gebouwd was. Het doel was om hem 1 op 1 na te bouwen, met de volledige functionaliteiten. Front-end,
        back-end, alles moet werken.
      </p>
      <p>
        Dit project is, op moment van schrijven, nog steeds bezig. Het kost enorm veel tijd om een website te bouwen, zeker als je met een
        kleine groep bent. Het lukt wel, en elke meeting maken we veel progressie en leer ik veel.
      </p>
      <p>
        We hebben elkaar ontmoet via een Reddit post.
        Iemand vroeg in een <a href="https://www.reddit.com/r/learnprogramming/" className="paragraph-link" target="_blank" rel="noreferrer">programmeer</a> sub-Reddit, of er
        mensen geïntress waren voor een casual project. Op deze post is zeer veel gereageerd, en er is een Discord <a href="https://discord.gg/96DWpzGTmt" className="paragraph-link" target="_blank" rel="noreferrer">server</a> uit 
        voortgekomen. Toen heb ik in deze server gevraagd of er mensen een project willen doen. Ook daar reageerde weer mensen op, en een maandje vooruit zitten we midden in een fantastisch project.
      </p>
      <TableP2 />
      <h4>Commits op repository</h4>
      <img src={reference} alt="Vikinger Page" style={myStyles} className="project-picture" />
      <h4>Talen en Tools</h4>
      <ul className="bullet-list">
        <li>Typescript</li>
        <li>SCSS</li>
        <li>JSON</li>
        <li>HTML</li>
        <li>Git ignore</li>
        <br />
      </ul>
      <ul className="bullet-list">
        <li>React.js</li>
        <li>NPM</li>
        <li>GitHub</li>
      </ul>
      <br />
      <h4>Links</h4>
      <ul className="bullet-list">
        <li><a href="https://github.com/PuffinKwadraat/PGreflect" className="paragraph-link" target="_blank" rel="noreferrer">Repository</a></li>
        <li><a href="https://reactjs.org/" className="paragraph-link" target="_blank" rel="noreferrer">React</a></li>
        <li><a href="https://odindesignthemes.com/vikinger/profile-timeline.html" className="paragraph-link" target="_blank" rel="noreferrer">Reference</a></li>
      </ul>
    </article>
  )
}

export default Project2