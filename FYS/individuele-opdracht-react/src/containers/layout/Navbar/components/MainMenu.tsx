import { NavLink } from "react-router-dom";

const MainMenu = () => {
    return (
        <ul>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="Info">Info</NavLink></li>
            <li><NavLink to="Projects">Projects</NavLink></li>
            <li><NavLink to="Contact">Contact</NavLink></li>
            <li><NavLink to="Misc">Misc</NavLink></li>
        </ul>
    )
}

export default MainMenu