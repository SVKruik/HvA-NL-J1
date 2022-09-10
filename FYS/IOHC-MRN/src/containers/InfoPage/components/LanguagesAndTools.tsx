const myStyles = {
    align: "left",
    width: "40px"
}

const LanguagesAndTools = () => {
    return (
        <article className="info-cards">
            <h3>Languages and Tools</h3>
            <p className="languages-title">HTML, CSS, Javascript, Java, Typescript en Scss</p>
            <ul>
                <li className="horizontal-list"><img style={myStyles} alt="HTML5"
                    src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" /></li>
                <li className="horizontal-list"><img style={myStyles} alt="CSS3"
                    src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg" /></li>
                <li className="horizontal-list"><img style={myStyles} alt="JS"
                    src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" /></li>
                <li className="horizontal-list"><img style={myStyles} alt="Java"
                    src="https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg" /></li>
                <li className="horizontal-list"><img style={myStyles} alt="TS"
                    src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" /></li>
                <li className="horizontal-list"><img style={myStyles} alt="Sass"
                    src="https://raw.githubusercontent.com/devicons/devicon/master/icons/sass/sass-original.svg" /></li>
            </ul>
            <p className="tools-title">React, MySQL, Node.js, MongoDB, Git, Docker en Figma</p>
            <ul>
                <li className="horizontal-list"><img style={myStyles} alt="React"
                    src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" /></li>
                <li className="horizontal-list"><img style={myStyles} alt="MySql"
                    src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg" /></li>
                <li className="horizontal-list"><img style={myStyles} alt="Node.js"
                    src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" /></li>
                <li className="horizontal-list"><img style={myStyles} alt="MongoDB"
                    src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg" /></li>
                <li className="horizontal-list"><img style={myStyles} alt="Git"
                    src="https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg" /></li>
                <li className="horizontal-list"><img style={myStyles} alt="Docker"
                    src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg" /></li>
                <li className="horizontal-list"><img style={myStyles} alt="Figma"
                    src="https://www.vectorlogo.zone/logos/figma/figma-icon.svg" /></li>
            </ul>
        </article>
    )
}

export default LanguagesAndTools