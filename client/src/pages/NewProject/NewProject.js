import Header from "../../components/Header";
import './NewProject.css';

function NewProject({enableNet}) {
    return (
        <div className="new-project">
            <Header isHome={false} enableNet={enableNet}/>
            <div className="new-project-body">
                <h1>New Project</h1>
            </div>
        </div>
    );
}

export default NewProject;
