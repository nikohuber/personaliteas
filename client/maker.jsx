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

const deleteP = (e, onPDelete) => {
    const id = e.target.value;
    helper.sendPost("/home", {id}, 'DELETE', onPDelete);
    return false;
}

/*const sortDomos = (domos, type) => {

    let tempDomos = domos.sort(function (a,b){
        if(a[type] < b[type]){
            return -1;
        }
        if(a[type] > b[type]) {
            return 1;
        }
        return 0;
    });

    return tempDomos;
}*/

const PForm = (props) => {
    return(
        <form id = "pForm"
            onSubmit = {(e) => handleP(e, props.triggerReload)}
            name = "pForm"
            action = "/home"
            method = "POST"
            className = "pForm"
        >
            <label htmlFor="name">Link Name: </label>
            <input id = "pName" type = "text" name = "name" placeholder = "name" />
            <label htmlFor = "url">Url: </label>
            <input id = "pUrl" type = "text" name = "url" />
            <input className = "makePSubmit" type = "submit" value = "Make P"/>
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
                <img class = "linkImg" src = "/assets/img/cat.gif"></img>
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

const DomoList = (props) => {
    const [domos, setDomos] = useState(props.domos);
    //console.log(domos);
    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getP');
            const data = await response.json();
            console.log(data);
            
            setDomos(data.domos);
        };
        loadDomosFromServer();

    }, [props.reloadDomos]);

    /*const changeFilter = (type) => {
        setDomos(sortDomos(domos, type));
        //console.log(domos);
        //props.triggerReload;
    }*/

    if(domos.length === 0){
        console.log("ee");
        return (
            <div className = "domoList">
                <h3 className = "emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }
    
    let domoNodes = domos.map(domo => {
        return (
            <div key = {domo.id} className = "domo">
                <img src = "/assets/img/domoface.jpeg" alt = "domo face" className = "domoFace" />
                <h3 className = "domoName">Name: {domo.name}</h3>
                <h3 className = "domoAge"> Age: {domo.url}</h3>
            </div>
        );
    });
    
    return (
        <div id = "main">
            <div className = "domoList">
                {domoNodes}
            </div>
        </div>
    );
};

const App = () => {
    const [reloadP, setReloadP] = useState(false);

    return (
        <div>
            <div id = "pList">
                <PList p = {[]} reloadP = {reloadP} />
            </div>
            <div id = "makeDomo">
                <PForm triggerReload = {() => setReloadP(!reloadP)} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
}

window.onload = init;