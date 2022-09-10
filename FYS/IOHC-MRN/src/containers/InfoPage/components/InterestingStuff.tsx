import carbon from "../../../shared/assets/img/Carbon.png";
import lua from "../../../shared/assets/img/Lua.png";
import rabbitmq from "../../../shared/assets/img/RabbitMQ.png";
import swift from "../../../shared/assets/img/Swift.png";
import tensorflow from "../../../shared/assets/img/TensorFlow.png";

const InterestingStuff = () => {
    const myStyles = {
        align: "left",
        width: "40px"
    }
    return (
        <article className="info-cards">
            <h3>Interesting Stuff</h3>
            <p className="interesting-languages-title">Carbon, Lua, RabbitMQ, Swift en TensorFlow</p>
            <ul>
                <li className="horizontal-list"><img alt="Carbon" style={myStyles} src={carbon} /></li>
                <li className="horizontal-list"><img alt="Lua" style={myStyles} src={lua} /></li>
                <li className="horizontal-list"><img alt="RabbitMQ" style={myStyles} src={rabbitmq} /></li>
                <li className="horizontal-list"><img alt="Swift" style={myStyles} src={swift} /></li>
                <li className="horizontal-list"><img alt="TensorFlow" style={myStyles} src={tensorflow} /></li>
            </ul>
            <p className="interesting-languages-desc">
                Dit zijn dingen die ik erg interessant vind, en graag zou willen leren. Deze talen zijn niet van
                toepassing bij wat ik voorlopig in de toekomst wil doen, maar wie weet.
            </p>
        </article>
    )
}

export default InterestingStuff