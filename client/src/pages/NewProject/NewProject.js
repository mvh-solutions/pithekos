import Header from "../../components/Header";
import './NewProject.css';

function NewProject({enableNet, setEnableNet}) {
    return (
        <div className="new-project">
            <Header isHome={false} enableNet={enableNet} setEnableNet={setEnableNet}/>
            <div className="new-project-body">
                <h1>New Project</h1>
            </div>
        </div>
    );
}

export default NewProject;
