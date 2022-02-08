import { useEffect, useState } from 'react';
import { IAsyncResult, ShowError } from '../utils';

import './topbar.scss';

import { Button, Dropdown } from 'react-bootstrap';

import { TxModal, useAccountCtx, useConnectCalls, supportedChains } from '../web3';

import { CZFarm } from '../../typechain/CZFarm';
import CZFarm_JSON from '../../typechain/CZFarm.json';


export function BottomBar() {

  const socials = [
    { action: 'twitter' },
    { action: 'telegram' },
    { action: 'discord' },
    { action: 'medium' },
    { action: 'github' },
    { action: 'image3' },
    { action: 'image5' },
    { action: 'image6' },
    { action: 'image7' },
    { action: 'bscScan' },
  ]

  const dBtn = (<Button variant="link">Read our Disclaimer</Button>);

  return <div className="mt-5 mb-1 bottomBar">

    {/* only for xs */}
    <div className="d-block d-sm-none d-flex flex-row justify-content-around">
      <div>CZodiac v0.11.9</div>
      {dBtn}
    </div>

    <div className="d-flex flex-row justify-content-around align-items-center">

      {/* only > xs */}
      <div className="d-none d-sm-block">CZodiac v0.11.9</div>

      <div className="d-flex flex-row soBtnHolder">
        {socials.map((s, i) => <Button key={i} variant="link">
          <div className={'soBtn ' + s.action}></div>
        </Button>)}

      </div>

      {/* only > xs */}
      <div className="d-none d-sm-block">{dBtn}</div>

    </div>


  </div>;

}


export function Topbar() {

  const { account, networkId } = useAccountCtx();
  const { readOnly, connect } = useConnectCalls();
  const [czfBalance, setCzfBalance] = useState<IAsyncResult<string>>();
  const [connectAction, setConnectAction] = useState<IAsyncResult<string>>();

  const [networkName,setNetworkName] = useState<string>('');

  useEffect(() => {


    (async () => {
      try{

        const chainInfo = networkId && supportedChains.find(n=>n.chainId == networkId) || undefined;
        
        if(chainInfo){
          setNetworkName(chainInfo?.name||'');
        }
        
        if (!chainInfo || undefined === account) {
          return;
        }
    
        setCzfBalance({isLoading:true});

        const { web3ro } = await readOnly();

        const czFarm: CZFarm = new web3ro.eth.Contract(CZFarm_JSON.abi as any, chainInfo.contracts.czFarm) as any;

        const currBalance_Wei = await czFarm.methods.balanceOf(account).call();

        setCzfBalance({result:web3ro.utils.fromWei(currBalance_Wei)});

      }catch(error:any){
        setCzfBalance({error});
      }
      
    })();

  }, [account, networkId]);

  

  /*
  if (!web3Ctx?.account)
    return null;
  */

  return <div className='topBar d-flex flex-row justify-content-between pe-2  align-items-center'>

    <div className='logo d-flex flex-row align-items-center'><span>CZ.FARM</span></div>

    <div>

      <div className='d-flex flex-row gap-1'>

        {czfBalance?.result && <Button variant="light">
          {czfBalance.result}
        </Button>
        }


        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dd-1">
            Buy CZF
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dd-2">
            Socials
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Button variant="secondary" >
          <span className="networkBtn">{networkName}</span>
        </Button>

        {connectAction && <TxModal txResult={connectAction} onClose={()=> setConnectAction(undefined)}/>}

        <Button variant="primary" onClick={async ()=>{
          try{
            setConnectAction({isLoading:true});

            const { web3, chainInfo, account } = await connect();

            //if we connected then close the connect dlg
            setConnectAction(undefined);

          }catch(error:any){
            setConnectAction({error});
          }

        }}>
          Connect
        </Button>

        <Button variant="secondary modeswitch" >
          <div className="icon">&nbsp;</div>
        </Button>


      </div>

    </div>

  </div>;
}

