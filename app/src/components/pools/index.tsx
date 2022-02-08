import { useEffect, useState } from 'react';
import { IAsyncResult, ShowError } from '../utils';
import { Button, Spinner, Row, Col } from 'react-bootstrap';
import './chronoPools.scss';
import { useConnectCalls } from '../web3';

import { ChronoPoolService } from '../../typechain/ChronoPoolService';
import ChronoPoolService_JSON from '../../typechain/ChronoPoolService.json';
import moment from 'moment';

import {CZActionProps, PoolProps} from '../main/loopCZF';



export function ChronoPools({onCZAction,onPoolSelected}:{
    onCZAction:(props:CZActionProps)=>any;
    onPoolSelected?:(p:PoolProps)=>any;
}) {
    const { readOnly } = useConnectCalls();
    const [pools, setPools] = useState<IAsyncResult<PoolProps[]>>();

    useEffect(() => {

        (async () => {
            try {
                setPools({ isLoading: true });

                const { web3ro, chainInfo } = await readOnly();

                const chronoPoolService: ChronoPoolService = new web3ro.eth.Contract(ChronoPoolService_JSON.abi as any, chainInfo.contracts.chronoPoolService) as any;

                const result: PoolProps[] = [];
                //max 50 pools
                for (let pId = 0; pId <= 50; pId++) {

                    try {
                        const pool = await chronoPoolService.methods.getChronoPoolInfo(pId).call();


                        const m_duration = moment.duration(pool.vestPeriod_, 'seconds');

                        let duration = `${m_duration.asDays()} DAYS`;
                        const years = Math.floor(m_duration.asYears());
                        const months = Math.floor(m_duration.asMonths());
                        if (years > 1) {
                            duration = `${years} YEARS`;
                        } else if (years > 0) {
                            duration = '1 YEAR';
                        } else if (months > 1) {
                            duration = `${months} MONTHS`;
                        } else if (months > 0) {
                            duration = '1 MONTH';
                        }

                        const apr = Number.parseInt(pool.adjustedRateBasis_) / 100.0;

                        result.push({ pId, duration, apr, czf: '0.0000', harvestable: '0.0000' });

                    } catch (error: any) {

                        if (error.toString().includes('reverted')) {
                            console.debug('no more pools');
                            break;
                        } else {
                            throw error;
                        }
                    }
                }

                if(result.length>0 && onPoolSelected){
                    onPoolSelected(result[0]);
                }

                setPools({ result });

            } catch (error: any) {
                setPools({ error });
            }

        })();
    }, []);

    /*
    const pool = {
        pools: [
            { duration: '7 DAYS', apr: 17.73, czf: '0.0000', harvestable: '0.0000' },
            { duration: '30 DAYS', apr: 23.73, czf: '0.0000', harvestable: '0.0000' },
            { duration: '90 DAYS', apr: 29.77, czf: '0.0000', harvestable: '0.0000' },
            { duration: '1 YEAR', apr: 59.59, czf: '0.0000', harvestable: '0.0000' },
            { duration: '18 MONTHS', apr: 77.47, czf: '0.0000', harvestable: '0.0000' },
            { duration: '4 YEARS', apr: 119.19, czf: '0.0000', harvestable: '0.0000' },
            { duration: '10 YEARS', apr: 148.99, czf: '0.0000', harvestable: '0.0000' },
        ]
    };
    */


    if (pools?.isLoading) {
        return <Spinner animation="border" variant="primary" />;
    }

    if (pools?.error) {
        return <ShowError error={pools?.error} />;
    }

    const pool = {
        pools: pools?.result || [],
        actions: [
            { label: 'Loop CZF', action:(pId:number)=>onCZAction({type:'loopCZF',pId}) },
            { label: 'ReLoop CZF' , action:()=>onCZAction({type:'reloopCZF'})},
            { label: 'Harvest CZF' , action:()=>onCZAction({type:'harvestCZF'})},
            { label: 'Fast Foward 75.00%' , action:()=>onCZAction({type:'ff75'})},
            { label: 'Buy CZF' , action:()=>onCZAction({type:'buyCZF'})},
        ]
    };

    return <PoolsView 
        poolList={[pool]} 
        onPoolSelected={onPoolSelected}
        title="Chrono Pools" 
        guidePrompt="Chrono Pool Guide" 
    />;
}

export function ExoticFarms() {

    const pools = [
        {
            title: 'CZF/BNB on PCS',
            cashLogo: 'bnbLogo',
            pools: [
                { pId:0,duration: '7 DAYS', apr: 17.73, czf: '0.0000', harvestable: '0.0000' },
                { pId:0,duration: '90 DAYS', apr: 59.49, czf: '0.0000', harvestable: '0.0000' },
                { pId:0,duration: '1 YEAR', apr: 119.04, czf: '0.0000', harvestable: '0.0000' },
            ]
        },
        {
            title: 'CZF/BUSD on PCS',
            cashLogo: 'busdLogo',
            pools: [
                { pId:0,duration: '7 DAYS', apr: 17.73, czf: '0.0000', harvestable: '0.0000' },
                { pId:0,duration: '90 DAYS', apr: 59.49, czf: '0.0000', harvestable: '0.0000' },
                { pId:0,duration: '1 YEAR', apr: 119.04, czf: '0.0000', harvestable: '0.0000' },
            ]
        }
    ];

    return <PoolsView poolList={pools} 
        title="Exotic Farms" guidePrompt="Exotic Farms Guide" />;
}


function PoolsView({ poolList, title, guidePrompt, onPoolSelected  }: {
    title: string; guidePrompt: string;
    onPoolSelected?:(p:PoolProps)=>any;
    poolList: {
        title?: string;
        cashLogo?: string;
        actions?: { label: string, action:(pId:number)=>any }[]
        pools: PoolProps[]
    }[]
}) {

    const [expandedPool, setExpandedPool] = useState<{ poolListIndex: Number; poolIndex: Number; }>();

    useEffect(()=>{

        if(poolList && poolList.length>0){
            if(poolList[0].pools.length>0){
                setExpandedPool({poolListIndex:0,poolIndex:0});
            }
        }

    },[poolList]);

    return <div className="bg-secondary-mod-1 poolsView p-3">

        <div className="d-flex flex-row justify-content-between">
            <h4>{title}</h4>

            <Button variant='link' >
                <span className="guide">{guidePrompt}</span>
            </Button>
        </div>

        {poolList.map((pl, poolListIndex) => <div key={poolListIndex}>

            {pl.title && <div className='mt-4 mb-2 d-flex flex-row gap-2 align-items-center'>
                <h5 className="pt-2">{pl.title}</h5>
                <Button variant='link' >
                    <span className="guide">{pl.title}</span>
                </Button>
            </div>}

            {pl.pools.map((p, poolIndex) => <div key={poolIndex} className="bg-secondary-mod my-2 ">

                <div className="d-flex flex-row gap-2 p-2 align-items-center">

                    <div>
                        <div className="poolLogo bg-secondary-mod-1">
                            <div className="logo"></div>
                        </div>

                        {pl.cashLogo && <div className="poolLogo bg-secondary-mod-1 cashLogo">
                            <div className={pl.cashLogo}></div>
                        </div>
                        }

                    </div>

                    <div className="flex-grow-1 text-center">
                        <small>Duration</small>
                        <h5>{p.duration}</h5>
                    </div>

                    <div className="flex-grow-1 text-center">
                        <small>APR</small>
                        <h5>{p.apr}%</h5>
                    </div>

                    <div className="flex-grow-1 text-center">
                        <small>Est. CZF/day</small>
                        <h5>{p.czf}%</h5>
                    </div>

                    <div className="flex-grow-1 text-center">
                        <small>Est. Harvestable</small>
                        <h5>{p.harvestable}%</h5>
                    </div>

                    <Button variant='link' onClick={() => {
                        if (expandedPool?.poolIndex == poolIndex && expandedPool?.poolListIndex == poolListIndex) {
                            setExpandedPool(undefined);
                        } else {
                            setExpandedPool({ poolIndex, poolListIndex });
                            
                            onPoolSelected && onPoolSelected(p);
                        }
                    }}>
                        <div className='poolBtn'></div>
                    </Button>
                </div>

                {expandedPool?.poolIndex == poolIndex && expandedPool?.poolListIndex == poolListIndex &&
                    <div className="px-5"><Row className="poolViewActions p-4">
                        {(pl.actions || []).map((a, actionIndex) => <Col key={actionIndex} className="text-center">
                            <Button size="lg" variant='secondary' className="mx-3 flex-grow-1" onClick={() => {
                                a.action(p.pId);
                            }}>
                                {a.label}
                            </Button>
                        </Col>)}
                    </Row></div>}

            </div>)}

        </div>)}

    </div>;
}