import customprofile from "../../../shared/assets/img/custom-profile.png";

const NameProfile = () => {
    const myStyles = {
        display: "block",
        width: "182px",
        margin: "auto",
        borderRadius: "5px",
    }
    return (
        <article>
            <img src={customprofile} alt="Profile" style={myStyles} className="profile-image"/>
                <h1 className="centered">Stefan Kruik</h1>
                <p className="centered">Student HBO-ICT SE</p>
                <p className="centered">Den Helder, Nederland</p>
        </article>
    )
}

export default NameProfile