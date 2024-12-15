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


const PList = (props) => {
    const [p, setP] = useState([]);
    //setP(null);

    let source = window.location.pathname;
    source = source.split('/');
    source = source[source.length - 1]

    useEffect(() => {
        const loadPFromServer = async () => {
            const response = await fetch(`/p/view/${source}`);
            const data = await response.json();
            if(data.error){
                console.log('error!!:' + data.error);
            }
            else{
                setP(data.ps);
            }
        };
        loadPFromServer();

    }, [props.reloadP]);

    //console.log(p);
    if(p.length === 0){
        return (
            <div className = "pList">
                <h3 className = "emptyp">Personalitea Not Found.....</h3>
            </div>
        );
    }

    let pNodes = p.map(per => {
        console.log(per);
        return (
            <div key = {per.id} className = "p">
                <img class = "linkImg" src = "/assets/img/p.png"></img>
                <a className = "pName" href = {per.url}>{per.name}</a>
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

const View = () => {
    const [reloadP, setReloadP] = useState(false);

    return (
        <div>
            <div id = "pList">
                <PList p = {[]} reloadP = {reloadP} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('view'));
    root.render(<View />);
}

window.onload = init;