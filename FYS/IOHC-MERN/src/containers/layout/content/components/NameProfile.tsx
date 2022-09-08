import * as Logo from "./../../../../shared/assets/img/ProfilePic.png";

const NameProfile = () => {
    return (
        <article>
            <img src={Logo} width="338px" alt="default profile"/>
                <h1 className="centered">Stefan Kruik</h1>
                <p className="centered">Student HBO-ICT SE</p>
                <p className="centered">Den Helder, Nederland</p>
        </article>
    )
}

export default NameProfile