import customprofile from "../../../shared/assets/img/custom-profile.png";

const NameProfile = () => {
    const myStyles = {
        width: "200px",
        borderRadius: "10px"
    }
    return (
        <article>
            <img src={customprofile} width="338px" alt="default profile" style={myStyles} className="profile-image"/>
                <h1 className="centered">Stefan Kruik</h1>
                <p className="centered">Student HBO-ICT SE</p>
                <p className="centered">Den Helder, Nederland</p>
        </article>
    )
}

export default NameProfile