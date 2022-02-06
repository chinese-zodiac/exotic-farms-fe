import './topbar.scss';

import { Button, Dropdown } from 'react-bootstrap';

import { ConnectWallet, Web3Provider, useweb3Context, useConnectCalls } from '../web3';



export default function Topbar() {
  const web3Ctx = useweb3Context();
  const { disconnect } = useConnectCalls();

  const czfPrice = '0.00000111';
  const netWorkName = 'BSC';

  /*
  if (!web3Ctx?.account)
    return null;
  */

  return <div className='topBar d-flex flex-row justify-content-between pe-2  align-items-center'>

    <div className='logo d-flex flex-row align-items-center'><span>CZ.FARM</span></div>

    <div>

      <div className='d-flex flex-row gap-1'>

        <Button variant="light">
          ${czfPrice}
        </Button>


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
          <span className="networkBtn">{netWorkName}</span>
        </Button>

        <Button variant="primary" >
          Connect
        </Button>

        <Button variant="secondary modeswitch" >
          <div className="icon">&nbsp;</div>
        </Button>


      </div>

    </div>

  </div>;
}

