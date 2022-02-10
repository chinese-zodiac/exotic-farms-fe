import { useEffect, useState } from 'react';
import { IAsyncResult } from '../utils';

import './topbar.scss';

import { Button, Dropdown, Modal, Spinner } from 'react-bootstrap';

import { TxModal, useAccountCtx, useConnectCalls, supportedChains, TxModelProp } from '../web3';

import { useDisplayMode, formatCZfVal } from '../utils/display';

import PAIR_ABI from '../../typechain/pair.json';
const PCS_CZF_CZUSD_PAIR = '0x98b5F5E7Ec32cda1F3E89936c9972f92296aFE47';


function DisclaimerModal({ onClose }: {
  onClose: () => any;
}) {
  const { darkMode } = useDisplayMode();
  return <Modal show centered onHide={() => onClose && onClose()}
    contentClassName={"disclaimerModel " + (darkMode ? 'app-dark-mode' : 'app-light-mode')}>

    <Modal.Header closeButton>
      <Modal.Title>Disclaimer</Modal.Title>
    </Modal.Header>

    <Modal.Body>

      <p>
        Nothing on this site or on related channels should be considered a promise by anyone, including but not limited to the developers and promoters of this site, to perform work to generate profits for anyone including but not limited to the following: the users of this site; CZodiac community members; CZF holders; or anyone using any of the sites, smart contracts, social media channels, and any other media or tech related to CZF and CZodiac or any of the community members. Czodiac, CZF, cz.farm, and related technologies plus media are all experimental and must be used according to your personal financial situation and risk profile. There are no guarantees of profits, but the smart contracts are guaranteed to perform as written on the BSC blockchain.
      </p>

    </Modal.Body>

    <Modal.Footer>
      <Button variant="primary" onClick={() => onClose()}>
        Ok, got it!
      </Button>
    </Modal.Footer>

  </Modal>;
}

export function BottomBar() {

  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const socials = [
    { action: 'twitter', url: 'https://twitter.com/zodiacs_c' },
    { action: 'telegram', url: 'https://t.me/CZodiacANN' },
    { action: 'discord', url: 'https://discord.gg/FEpu3xF2Hb' },
    { action: 'medium', url: 'https://czodiacs.medium.com/' },
    { action: 'github', url: 'https://github.com/chinese-zodiac/czodiac' },
    { action: 'image3', url: '' },
    { action: 'image5', url: '' },
    { action: 'image6', url: '' },
    { action: 'image7', url: '' },
    { action: 'bscScan', url: '' },
  ]

  const dBtn = (<Button variant="link" onClick={() => setShowDisclaimer(true)} >Read our Disclaimer</Button>);

  return <div className="mt-5 mb-1 bottomBar">

    {showDisclaimer && <DisclaimerModal onClose={() => setShowDisclaimer(false)} />}

    {/* only for xs */}
    <div className="d-block d-sm-none d-flex flex-row justify-content-around">
      <div>CZodiac v0.11.9</div>
      {dBtn}
    </div>

    <div className="d-flex flex-row justify-content-around align-items-center">

      {/* only > xs */}
      <div className="d-none d-sm-block">CZodiac v0.11.9</div>

      <div className="d-flex flex-row soBtnHolder">
        {socials.map((s, i) => <Button key={i} variant="link" onClick={() => s.url && window.open(s.url)}>
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
  const [czfPrice, setCzfPrice] = useState<IAsyncResult<string>>();
  const [connectAction, setConnectAction] = useState<IAsyncResult<TxModelProp>>();

  const [networkName, setNetworkName] = useState<string>('');

  const { toggleDisplay, darkMode } = useDisplayMode();

  useEffect(() => {


    (async () => {
      try {

        const chainInfo = networkId && supportedChains.find(n => n.chainId == networkId) || undefined;

        if (chainInfo) {
          setNetworkName(chainInfo?.name || '');
        }

        if (!chainInfo) {
          return;
        }

        setCzfPrice({ isLoading: true });

        const { web3ro } = await readOnly();

        
        var pair = new web3ro.eth.Contract(PAIR_ABI as any, PCS_CZF_CZUSD_PAIR);
        var reserves:{
          _reserve0: string;
          _reserve1:string;
        } = await pair.methods.getReserves().call();

        const resCzf = Number.parseFloat( web3ro.utils.fromWei(reserves._reserve0));
        const resCzUSD = Number.parseFloat( web3ro.utils.fromWei(reserves._reserve1));

        const result = ((resCzf>0 && resCzUSD>0 && resCzUSD/resCzf) || 0).toFixed(10);

        setCzfPrice({ result });

      } catch (error: any) {
        setCzfPrice({ error });
      }

    })();

  }, [networkId]);

  const menu1 = <>
            {czfPrice?.result && <Dropdown.Item href="#"><span>CZF {czfPrice.result}</span></Dropdown.Item>}
            <Dropdown.Item href="#"><span>PancakeSwap</span></Dropdown.Item>
            <Dropdown.Item onClick={() => window.open('https://app.1inch.io/#/56/swap/BNB/0x7c1608C004F20c3520f70b924E2BfeF092dA0043')}><span>1inch</span></Dropdown.Item>
            <Dropdown.Item href="#"><span>Poocoin</span></Dropdown.Item>
  </>;

  const menu2 = <>
            <Dropdown.Item onClick={() => window.open('https://twitter.com/zodiacs_c')} ><span>Twitter</span></Dropdown.Item>
            <Dropdown.Item onClick={() => window.open('https://t.me/CZodiacofficial')}><span>Telegram</span></Dropdown.Item>
            <Dropdown.Item onClick={() => window.open('https://discord.gg/FEpu3xF2Hb')}><span>Discord</span></Dropdown.Item>
            <Dropdown.Item onClick={() => window.open('https://czodiacs.medium.com/')}><span>Medium</span></Dropdown.Item>
  </>;

  return <div className='topBar d-flex flex-row justify-content-between pe-2  align-items-center'>

    <div className='logo d-flex flex-row align-items-center'><span>CZ.FARM</span></div>

    <div >

      <div className='d-flex flex-row gap-1'>

        <Button variant="light" className="lgOnly">
          {czfPrice?.isLoading && <Spinner animation="border" variant="info" size="sm" />}
          {czfPrice?.result}
        </Button>
        

        <Dropdown className="lgOnly">
          <Dropdown.Toggle variant="secondary" id="dd-1">
            Buy CZF
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {menu1}
          </Dropdown.Menu>

        </Dropdown>

        <Dropdown className="lgOnly">

          <Dropdown.Toggle variant="secondary" id="dd-2">
            Socials
          </Dropdown.Toggle>

          <Dropdown.Menu>
              {menu2}
          </Dropdown.Menu>
        </Dropdown>

        <Button variant="secondary" >
          <span className="networkBtn">{networkName}</span>
        </Button>

        {connectAction && <TxModal txResult={connectAction} onClose={() => setConnectAction(undefined)} />}

        <Button variant="primary" disabled={!!account} onClick={async () => {
          try {
            setConnectAction({ isLoading: true });

            const { web3, chainInfo, account } = await connect();

            //if we connected then close the connect dlg
            setConnectAction(undefined);

          } catch (error: any) {
            setConnectAction({ error });
          }

        }}>
          Connect
        </Button>

        <Button variant="secondary modeswitch" onClick={() => toggleDisplay()} className="lgOnly">
          <div className="icon">&nbsp;</div>
        </Button>

        <Dropdown className="settings">

          <Dropdown.Toggle variant="secondary" id="dd-3">
            <div className="icon">&nbsp;</div>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <div>Buy CZF</div>
            {menu1}
            <div>Socials</div>
            {menu2}

          </Dropdown.Menu>
        </Dropdown>


      </div>

    </div>

  </div>;
}

