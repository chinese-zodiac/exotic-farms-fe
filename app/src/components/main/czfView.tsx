
import { useState, useEffect, useRef } from 'react';
import { useAccountCtx, supportedChains, useConnectCalls } from '../web3';
import './main.scss';
import { Row, Col, Spinner } from "react-bootstrap";

import {formatCZfVal} from '../utils/display';
import { useFarmPools } from '../pools';
import { IAsyncResult } from '../utils';


import { CZFarm } from '../../typechain/CZFarm';
import CZFarm_JSON from '../../typechain/CZFarm.json';

type AccountStatProp = {
  vested:number;
  czfPerDay:number;
  harvastable:number;
};

export default function CZFView() {

  const { account, networkId, nounce } = useAccountCtx();
  const { readOnly, connect } = useConnectCalls();
  const [czfBalance, setCzfBalance] = useState<IAsyncResult<string>>();

  const [accounStat,setAccountStat] = useState<AccountStatProp>();
  const accountRef = useRef<AccountStatProp>();

  const farmPools = useFarmPools();
  

  useEffect(() => {

    (async () => {
      try {

        const chainInfo = networkId && supportedChains.find(n => n.chainId == networkId) || undefined;

        if (!chainInfo || undefined === account) {
          setCzfBalance({result:''});
          return;
        }

        setCzfBalance({ isLoading: true });

        const { web3ro } = await readOnly();

        const czFarm: CZFarm = new web3ro.eth.Contract(CZFarm_JSON.abi as any, chainInfo.contracts.czFarm) as any;
        const currBalance_Wei = await czFarm.methods.balanceOf(account).call();

        setCzfBalance({ result: web3ro.utils.fromWei(currBalance_Wei) });

      } catch (error: any) {
        setCzfBalance({ error });
      }

    })();

  }, [account, networkId, nounce]);

  useEffect(() => {

    const chainInfo = networkId && supportedChains.find(n => n.chainId == networkId) || undefined;

    if (!chainInfo  || !farmPools?.result) {
      return;
    }

    const allPools = [...Object.keys(farmPools.result.exoticPools)
          .map(k => ((farmPools.result?.exoticPools || {})[k])
          .pools).flat(), ...farmPools?.result.chronoPools];

    const czfPerDay = allPools.map(p => p.czfPerDay).reduce((a, b) => a + b);
    const vested = allPools.map(p => p.vested).reduce((a, b) => a + b);

    const stat = {vested,czfPerDay,harvastable:0};
    setAccountStat(stat);
    accountRef.current = stat;

    const harvestTimer = setInterval(()=>{
      
      const harvastable = allPools.map(p => p.harvestableFn()).reduce((a, b) => a + b);
      accountRef.current && setAccountStat({...accountRef.current,harvastable});

      //console.debug(`harv updated : ${harvastable}`);
    },1000);

    return ()=>{
      clearInterval(harvestTimer);
    }

  }, [networkId, nounce, farmPools?.result]);


  const czfData = [
      { val: formatCZfVal(czfBalance?.result), label: 'Your CZF', loading: czfBalance?.isLoading}, 
      { val: formatCZfVal(accounStat?.czfPerDay), label: 'CZF/day', loading:undefined === accounStat },
      { val: formatCZfVal(accounStat?.harvastable), label: 'Harvestable CZF', loading:undefined === accounStat }, 
      { val: formatCZfVal(accounStat?.vested), label: 'CZF Vesting', loading:undefined === accounStat }
  ];


  return <Row className="gap-3">
    {czfData.map((d, i) => <Col key={i} sm className="bg-light-mod text-center py-3">

      {d.loading ? <Spinner animation="border" variant="primary" /> : <h4>{d.val}</h4>}

      <div>{d.label}</div>
    </Col>)}
  </Row>;

}