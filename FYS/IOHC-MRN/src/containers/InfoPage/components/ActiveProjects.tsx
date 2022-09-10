const ActiveProjects = () => {
    return (
        <article className="info-cards">
            <h3>Active Projects</h3>
            <p>
                Ik heb tot nu toe al een paar projecten gehad, van klein tot groot. Dit zijn de projecten waar ik op
                dit moment regelmatig aan werk. Ik heb ook een link gegeven naar de GitHub repository.
            </p>
            <ul className="active-project-list">
                <li>Portfolio - <a href="https://github.com/PuffinKwadraat/Portfolio-Website" className="paragraph-link" target="_blank" rel="noreferrer">link</a></li>
                <li>School projecten - <a href="https://github.com/PuffinKwadraat/HvA-NL-J1" className="paragraph-link" target="_blank" rel="noreferrer">link</a></li>
                <li>PGreflect - <a href="https://github.com/PuffinKwadraat/PGreflect" className="paragraph-link" target="_blank" rel="noreferrer">link</a></li>
            </ul>
        </article>
    )
}

export default ActiveProjects