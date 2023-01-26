import vakantie1 from "../../../shared/assets/img/Vakantie1.jpg";
import vakantie2 from "../../../shared/assets/img/Vakantie2.jpg";

const myStyles = {
  borderRadius: "5px"
}

const ImagesCard = () => {
  return (
    <article>
      <h3>Images</h3>
      <p>2 foto's van mijn laatste vakantie in Oppenau, Duitsland</p>
      <img src={vakantie1} width="768px" alt="Vacation 1" style={myStyles} className="image-info-picture" />
      <img src={vakantie2} width="768px" alt="Vacation 2" style={myStyles} className="image-info-picture" />
    </article>
  )
}

export default ImagesCard