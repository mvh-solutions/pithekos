import Header from "../../components/Header";
import './NewProject.css';

function NewProject({enableNet, setEnableNet, enabledRef}) {
    return (
        <div className="new-project">
            <Header isHome={false} enableNet={enableNet} setEnableNet={setEnableNet} enabledRef={enabledRef}/>
            <div className="new-project-body">
                <h1>New Project</h1>
            </div>
        </div>
    );
}

export default NewProject;
