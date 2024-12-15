const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

const handleP = (e, onPAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#pName').value;
    const url = e.target.querySelector('#pUrl').value;

    if(!name || !url ){
        helper.handleError('All fields are required');
        return false;
    }
    helper.sendPost(e.target.action, {name, url}, e.target.method, onPAdded);
    console.log("sent!");
    return false;
}

const handleS = (e, onSAdded) => {
    e.preventDefault();
    helper.hideError();

    const url = e.target.querySelector('#sName').value;

    if(!url){
        helper.handleError('All fields are required');
        return false;
    }
    console.log(e.target.action)
    helper.sendPost(e.target.action, {url: url}, e.target.method, onSAdded);
    console.log("sent!");
    return false;
}

const deleteP = (e, onPDelete) => {
    const id = e.target.value;
    helper.sendPost("/home", {id}, 'DELETE', onPDelete);
    return false;
}


const PForm = (props) => {
    return(
        <form id = "pForm"
            onSubmit = {(e) => handleP(e, props.triggerReload)}
            name = "pForm"
            action = "/home"
            method = "POST"
            className = "pForm"
        >
            <label htmlFor="name">Name: </label>
            <input id = "pName" type = "text" name = "name" placeholder = "name" />
            <label htmlFor = "url">Url: </label>
            <input id = "pUrl" type = "text" name = "url" placeholder = "url"/>
            <input className = "makePSubmit" type = "submit" value = "Make P"/>
        </form>
    );
};


const SForm = (props) => {
    return(
        <form id = "sForm"
            onSubmit = {(e) => handleS(e, props.triggerReload)}
            name = "sForm"
            action = "/s"
            method = "POST"
            className = "sForm"
        >
            <label htmlFor="url"> Display URL </label>
            <input id = "sName" type = "text" name = "url" placeholder = "url" />
            <input className = "makeSSubmit" type = "submit" value = "Update Settings"/>
        </form>
    );
};

const PList = (props) => {
    const [p, setP] = useState([]);
    //setP(null);

    useEffect(() => {
        const loadPFromServer = async () => {
            const response = await fetch('/getP');
            const data = await response.json();
            console.log(data);
            setP(data.ps);
        };
        loadPFromServer();

    }, [props.reloadP]);

    //console.log(p);
    if(p.length === 0){
        return (
            <div className = "pList">
                <h3 className = "emptyp">Nothing Here Yet!</h3>
            </div>
        );
    }

    let pNodes = p.map(per => {
        console.log(per);
        return (
            <div key = {per.id} className = "p">
                <img class = "linkImg" src = "/assets/img/p.png"></img>
                <a className = "pName" href = {per.url}>{per.name}</a>
                <button onClick = {(e) => deleteP(e, props.reloadP)} class = "pId" id = "p._id" value = {per._id}>Delete</button>
            </div>
        );
    });
    
    return (
        <div id = "main">
            <div className = "pList">
                {pNodes}
            </div>
        </div>
    );
}

const App = () => {
    const [reloadP, setReloadP] = useState(false);

    return (
        <div>
            <div id = "settingsForm">
                <SForm />
            </div>
            <div id = "pList">
                <PList p = {[]} reloadP = {reloadP}/>
                <PForm triggerReload = {() => setReloadP(!reloadP)} />
            </div>
            <div id = "pForm">
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
}

window.onload = init;