import {useState} from 'react';

import constate from 'constate';

export const [DisplayProvider, useDisplayMode] =constate(useDisplay);

function useDisplay(){
    const [darkMode,setDarkModeOn] = useState(true);
    const toggleDisplay = ()=>{
        
        setDarkModeOn(!darkMode)
    };
    return {darkMode,toggleDisplay};
}


export function ShowAddress({address}:{address:string}){

    if(!address)
        return null;

    const begin = address.substring(0,3);
    const end = address.substring(address.length -4);

    return <div className="d-flex flex-row">
        <span>{begin}...{end}</span>

    </div>;
}

export function TrModel(){

    return <div></div>;

}