import DetailInfo from "./components/DetailInfo";
import GeneralInfo from "./components/GeneralInfo";

const Content = () => {
    return <header className="content">
        <GeneralInfo />
        <DetailInfo />
    </header>;
}

export default Content;