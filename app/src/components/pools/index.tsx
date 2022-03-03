import { useEffect, useState, FC } from 'react';
import { IAsyncResult, ShowError } from '../utils';
import { Button, Spinner, Row, Col } from 'react-bootstrap';
import './chronoPools.scss';
import { useConnectCalls, useAccountCtx } from '../web3';

import { formatCZfVal } from '../utils/display';

import { ChronoPoolService } from '../../typechain/ChronoPoolService';
import ChronoPoolService_JSON from '../../typechain/ChronoPoolService.json';

import { ExoticMaster } from '../../typechain/ExoticMaster';
import ExoticMaster_JSON from '../../typechain/ExoticMaster.json';
import constate from 'constate';

import moment from 'moment';
import Web3 from 'web3';

import { CZActionProps, PoolProps, PoolTypeProps } from '../main/loopCZF';
import { CZFarm } from '../../typechain/CZFarm';
import CZFarm_JSON from '../../typechain/CZFarm.json';


const _lpDefination: {
    [lp: string]: {
        title: string;
        cashLogo: string;
        guideUrl: string;
    }
} = {
    '0xeF8e8CfADC0b634b6d0065080a69F139159a17dE': {
        title: 'CZF/BNB on PCS',
        cashLogo: 'bnbLogo',
        guideUrl: 'https://cz.cash/#/add/0x7c1608C004F20c3520f70b924E2BfeF092dA0043/BNB'
    },
    '0xAAC96d00C566571bafdfa3B8440Bdc3cDB223Ad0': {
        title: 'CZF/BUSD on PCS',
        cashLogo: 'busdLogo',
        guideUrl: 'https://cz.cash/#/add/0x7c1608C004F20c3520f70b924E2BfeF092dA0043/0xe9e7cea3dedca5984780bafc599bd69add087d56'
    },
    '0x98b5F5E7Ec32cda1F3E89936c9972f92296aFE47': {
        title: 'CZF/CZUSD on PCS',
        cashLogo: 'busdLogo',
        guideUrl: 'https://cz.cash/#/add/0x7c1608C004F20c3520f70b924E2BfeF092dA0043/0xE68b79e51bf826534Ff37AA9CeE71a3842ee9c70'
    }
}



export function ChronoPools({ onCZAction }: {
    onCZAction: (props: CZActionProps) => any;

}) {
    const pools = useFarmPools();

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
        pools: pools?.result?.chronoPools || [],
        actions: [
            { label: 'Loop CZF', action: (p: PoolProps) => onCZAction({ type: 'loopCZF', pId: p.pId }) },
            { label: 'ReLoop CZF', action: (p: PoolProps) => onCZAction({ type: 'reloopCZF', pId: p.pId }) },
            { label: 'Harvest CZF', action: (p: PoolProps) => onCZAction({ type: 'harvestCZF', pId: p.pId }) },
            { label: 'Fast Foward 75.00%',labelAc:(p: PoolProps)=>`Fast Forward ${p.ffPercentage||75}%`, 
                    action: (p: PoolProps) => onCZAction({ type: 'ff75', pId: p.pId, percentage:p.ffPercentage||75 }) },
            { label: 'Buy CZF', action: (p: PoolProps) => onCZAction({ type: 'buyCZF', pId: p.pId }) },
        ]
    };

    return <PoolsView
        poolList={[pool]}

        title="Chrono Pools"
        guidePrompt="Chrono Pool Guide"
        guideURL="https://czodiac.gitbook.io/czodiac-litepapper/features-active/chrono-pools"
    />;
}


export const [PoolsProvider,
    useFarmPools] = constate(
        useLoadPools,
        v => v.farmPools
    );

// props we get from the pool RPC methods
type PoolRPCProps = {
    poolType: PoolTypeProps;
    pId: number;
    accountInfo?: {
        updateEpoch_: string;
        emissionRate_: string;
        totalVesting_: string;
    },
    poolInfo: {
        adjustedRateBasis_: string;
        vestPeriod_: string;
    }

}

/*

function durationFromSeconds(vestPeriod_: string) {

    const m_duration = moment.duration(vestPeriod_, 'seconds');
    const durationDays = m_duration.asDays();

    let duration = `${durationDays} DAYS`;
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

    return { duration, durationDays };
}
*/

function fromPool(web3: Web3, { poolType, pId, accountInfo, poolInfo }: PoolRPCProps): PoolProps {

    const ROI = Number.parseInt(poolInfo.adjustedRateBasis_) / 100.0;

    const m_duration = moment.duration(poolInfo.vestPeriod_, 'seconds');
    const durtaionSeconds = m_duration.asSeconds();
    const durationDays = Math.ceil(m_duration.asDays());
    const durationMonths = Math.ceil(m_duration.asMonths());



    const apr = durtaionSeconds > 0 ? Number.parseFloat((ROI * (365 * 24 * 3600) / durtaionSeconds).toFixed(2)) : 0;

    const partialYear = durationMonths % 12;

    let duration = '';
    if (partialYear > 1) {
        duration = `${durationMonths} months`;
    } else {
        const futureDay = moment().add(m_duration, 'seconds');
        duration = futureDay.fromNow(true);

    }

    /*userInfo.emissionRate * secondsPerDay = CZF/Day*/

    const accoutEmissionrate = (accountInfo?.emissionRate_ &&
        Number.parseFloat(web3.utils.fromWei(accountInfo.emissionRate_))) || 0;

    const czfPerDay = accoutEmissionrate * (24 * 60 * 60);

    const vested = (accountInfo?.totalVesting_ &&
        Number.parseFloat(web3.utils.fromWei(accountInfo.totalVesting_))) || 0;

    /*(currentEpoch - userInfo.updateEpoch) * userInfo.emissionRate = Est Harvestable*/
    const harvestableFn = () => {
        if (!accoutEmissionrate || !accountInfo?.updateEpoch_) {
            return 0;
        }

        const secondsSinceEpoch = Math.round(new Date().getTime() / 1000);

        return (secondsSinceEpoch - Number.parseInt(accountInfo.updateEpoch_)) * accoutEmissionrate;

    }

    return { ...poolType, apr, vested, harvestableFn, duration, durationDays, pId, czfPerDay };

}

export function useLoadPools() {

    const { readOnly } = useConnectCalls();

    //const [exoticPools, setExoticPools] = useState<IAsyncResult<{ [lp: string]: PoolListProps }>>({});
    //const [chronoPools, setChronoPools] = useState<IAsyncResult<PoolProps[]>>();

    const [farmPools, setFarmPools] = useState<IAsyncResult<{
        exoticPools: { [lp: string]: PoolListProps };
        chronoPools: PoolProps[]
    }>>({});

    const { account, networkId, nounce } = useAccountCtx();

    useEffect(() => {

        (async () => {
            try {


                const loadChronoPools = async () => {
                    //setChronoPools({ isLoading: true });

                    const { web3ro, chainInfo } = await readOnly();

                    const chronoPoolService: ChronoPoolService = new web3ro.eth.Contract(ChronoPoolService_JSON.abi as any, chainInfo.contracts.chronoPoolService) as any;

                    let result: PoolProps[] = [];
                    //max 50 pools
                    for (let pId = 0; pId <= 50; pId++) {

                        try {
                            const poolInfo = await chronoPoolService.methods.getChronoPoolInfo(pId).call();
                            const accountInfo = account && await chronoPoolService.methods.getChronoPoolAccountInfo(account, pId).call() || undefined;

                            const pDetails = fromPool(web3ro, { pId, poolInfo, accountInfo, poolType: { type: 'chronoPool' } });
                            if (!pDetails.apr) {
                                console.log(`pid ${pDetails.pId} has 0 apr`);
                                continue;
                            }


                            let ffPercentage = 75;
                            switch (pDetails.durationDays) {
                                case 30: //1 month
                                    ffPercentage = 50;
                                    break;
                                case 90: //3 months
                                    ffPercentage = 30;
                                    break;
                                case 365: //a year
                                    ffPercentage = 5;
                                    break;
                                case 548: //18 months
                                    ffPercentage = 3;
                                    break;
                                case 1460: //4 years
                                    ffPercentage = 0.75;
                                    break;
                                case 3650: //10 years
                                    ffPercentage = 0.35;
                                    break;
                            }

                            result.push({...pDetails,ffPercentage});

                            /*
    
                            const { duration, durationDays } = durationFromSeconds(poolInfo.vestPeriod_);
                            const apr = Number.parseInt(poolInfo.adjustedRateBasis_) / 100.0;
    
                            let czf = '';
                            let harvestable = '';
    
                            if (undefined !== account) {
                                
                                czf = web3ro.utils.fromWei(accountInfo.emissionRate_);
                                harvestable = web3ro.utils.fromWei(accountInfo.totalVesting_);
                            }
    
                            result.push({ type: 'chronoPool', pId, duration, durationDays, apr, czfPerDay: czf, harvestableFn: harvestable });
                            */

                        } catch (error: any) {

                            if (error.toString().includes('reverted')) {
                                console.debug('no more pools');
                                break;
                            } else {
                                throw error;
                            }
                        }
                    }

                    result = result.sort((a, b) => a.durationDays - b.durationDays);

                    /*
                    if(result.length>0 && onPoolSelected){
                        onPoolSelected(result[0]);
                    }
                    */

                    //setChronoPools({ result });

                    return result;

                }

                const loadExoticPools = async () => {
                    //setExoticPools({ isLoading: true });

                    const { web3ro, chainInfo } = await readOnly();

                    const exoticMaster: ExoticMaster = new web3ro.eth.Contract(ExoticMaster_JSON.abi as any, chainInfo.contracts.exoticMaster) as any;

                    const poolsMap: { [lp: string]: PoolListProps } = {};

                    //max 50 pools
                    for (let pId = 0; pId <= 50; pId++) {

                        try {

                            //const k = await exoticMaster.methods.getCzfPerLPWad(pId).call();
                            const poolInfo = await exoticMaster.methods.getExoticFarmInfo(pId).call();
                            const accountInfo = account && await exoticMaster.methods.getExoticFarmAccountInfo(account, pId).call() || undefined;

                            let pDetails = fromPool(web3ro, { pId, poolInfo, accountInfo, poolType: { type: 'exoticfarm', lp: poolInfo.lp_ } });
                            if (!pDetails.apr) {
                                console.log(`pid ${pDetails.pId} has 0 apr`);
                                continue;
                            }

                            let ffPercentage = 75;
                            switch (pDetails.durationDays) {
                                case 90: //3 months
                                    ffPercentage = 30;
                                    break;
                                case 365: //a year
                                    ffPercentage = 5;
                                    break;
                            }

                            pDetails = {...pDetails,ffPercentage};



                            /*
                            const { duration, durationDays } = durationFromSeconds(poolInfo.vestPeriod_);
                            const apr = Number.parseInt(poolInfo.adjustedRateBasis_) / 100.0;
    
                            let czf = '';
                            let harvestable = '';
    
                            if (undefined !== account) {
                                
                                czf = web3ro.utils.fromWei(accountInfo.emissionRate_);
                                harvestable = web3ro.utils.fromWei(accountInfo.totalVesting_);
    
    
                            }
                            */

                            if (!poolsMap[poolInfo.lp_]) {



                                const foundLpDef = _lpDefination[poolInfo.lp_];

                                if (!foundLpDef) {
                                    throw new Error(`Unknown LP ${poolInfo.lp_}`);
                                }

                                let lpBalance_eth = 0;
                                let lpAllowance_eth = 0;
                                let lpBalance_Wei = '0';
                                let lpAllowance_Wei = '0';


                                if (undefined !== account) {
                                    const bep20: CZFarm = new web3ro.eth.Contract(CZFarm_JSON.abi as any, poolInfo.lp_) as any;

                                    lpAllowance_Wei = await bep20.methods.allowance(account, chainInfo.contracts.exoticMaster).call();
                                    lpBalance_Wei = await bep20.methods.balanceOf(account).call();

                                    lpAllowance_eth = Number.parseFloat(web3ro.utils.fromWei(lpAllowance_Wei));

                                    lpBalance_eth = Number.parseFloat(web3ro.utils.fromWei(lpBalance_Wei));

                                    console.log(`lpAllowance_Wei = ${lpAllowance_Wei}, lpBalance_Wei=${lpBalance_Wei}`);
                                }

                                const lpProps = { ...foundLpDef, lpBalance_eth, lpAllowance_Wei, lpAllowance_eth, lpBalance_Wei };

                                poolsMap[poolInfo.lp_] = {
                                    lpProps,
                                    pools: [],
                                };
                            }

                            poolsMap[poolInfo.lp_].pools.push(pDetails);

                            //poolsMap[poolInfo.lp_].pools.push({ type: 'exoticfarm', lp: poolInfo.lp_, pId, duration, durationDays, apr, czfPerDay: czf, harvestableFn: harvestable });

                        } catch (error: any) {

                            if (error.toString().includes('reverted')) {
                                console.debug('no more exotic pools');
                                break;
                            } else {
                                throw error;
                            }
                        }
                    }

                    Object.keys(poolsMap).forEach(k => {
                        poolsMap[k].pools = poolsMap[k].pools.sort((a, b) => a.durationDays - b.durationDays);
                    });


                    //setPools({ result: Object.keys(poolsMap).map(k=>poolsMap[k])  });
                    //setExoticPools({ result: poolsMap });
                    return poolsMap;

                }

                setFarmPools({ isLoading: true });

                const chronoPools = await loadChronoPools();
                const exoticPools = await loadExoticPools();

                

                setFarmPools({ result: { chronoPools, exoticPools } });

            } catch (error: any) {
                //setChronoPools({ error });
                //setExoticPools({ error });
            }

        })();
    }, [account, networkId, nounce]);

    return { farmPools };
    //return { exoticPools, chronoPools };
}


export function ExoticFarms({ onCZAction }: {
    onCZAction: (props: CZActionProps) => any;
}) {


    const poolsAsync = useFarmPools();

    const actions = [
        {
            Component: ({ pool, lp }: { pool: PoolProps, lp?: PoolLpProps }) => {

                if (!lp || pool?.type != 'exoticfarm') {
                    return <small className="text-danger">no LP</small>;
                }

                if (lp.lpAllowance_eth > 0) {
                    return <Button size="lg" variant='secondary' className="mx-3 flex-grow-1" onClick={() => {
                        //onCZAction({ type: 'depositLP', pId: pool.pId, exoticLp: pool?.lp, amountEth: lp.lpAllowance_eth.toString() });
                        onCZAction({ type: 'depositLP', pId: pool.pId, exoticLp: pool?.lp, amount_Wei: lp.lpBalance_Wei });
                    }}>
                        Deposit LP
                    </Button>
                } else if (lp.lpBalance_eth > 0) {
                    return <Button size="lg" variant='secondary' className="mx-3 flex-grow-1" onClick={() => {
                        /*onCZAction({
                            type: 'loopCZF', pId: pool.pId, exotic: {
                                lp: pool?.lp,
                                lpBalance_eth:lp.lpBalance_eth,
                                lpBalance_Wei:lp.lpBalance_Wei
                            }
                        });*/
                        onCZAction({ type: 'approveLP', pId: pool.pId, exoticLp: pool?.lp });
                    }}>
                        Approve LP
                    </Button>
                } else {
                    return <Button size="lg" variant='secondary' className="mx-3 flex-grow-1" onClick={() => {
                        window.open(lp.guideUrl);
                    }}>
                        Mint LP
                    </Button>
                }


            },
            label: 'Approve LP', action: (pool: PoolProps) => {
                ///not used
            }
        },
        { label: 'Harvest CZF', action: (p: PoolProps) => onCZAction({ type: 'harvestCZF-lp', pId: p.pId }) },
        { label: 'Fast Foward 75.00%', labelAc:(p: PoolProps)=>`Fast Forward ${p.ffPercentage||75}%`, 
                 action: (p: PoolProps) => onCZAction({ type: 'ff75-lp', pId: p.pId, percentage:p.ffPercentage||75 }) },
        { label: 'Buy CZF', action: (p: PoolProps) => onCZAction({ type: 'buyCZF', pId: p.pId }) },
    ]

    /*
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
    */

    if (poolsAsync?.isLoading) {
        return <Spinner animation="border" variant="primary" />;
    }

    if (poolsAsync?.error) {
        return <ShowError error={poolsAsync?.error} />;
    }

    const poolList = poolsAsync.result?.exoticPools && Object.keys(poolsAsync.result?.exoticPools).map(k => {
        return { ...((poolsAsync.result?.exoticPools || {})[k]), actions };
    }) || [];

    return <PoolsView poolList={poolList || []}
        title="Exotic Farms" guidePrompt="Exotic Farms Guide"
        guideURL='https://czodiac.gitbook.io/czodiac-litepapper/features-active/exotic-farms'
    />;
}

type PoolLpProps = {
    title: string;
    guideUrl: string;
    lpBalance_eth: number; lpAllowance_eth: number; lpAllowance_Wei: string; lpBalance_Wei: string;
    cashLogo: string;
}

type PoolListProps = {
    lpProps?: PoolLpProps;
    actions?: {
        Component?: (props: { pool: PoolProps, lp?: PoolLpProps }) => JSX.Element;
        label: string, action: (p: PoolProps) => any;
        labelAc?:(p: PoolProps)=>string;
    }[]
    pools: PoolProps[]
};


function EstHarvest({ p }: {
    p: PoolProps;
}) {
    const [estHarv, setEstHarv] = useState('');
    useEffect(() => {

        const harvestTimer = setInterval(() => {
            setEstHarv(formatCZfVal(p.harvestableFn()));
            //console.debug(`harv updated : ${harvastable}`);
        }, 1000);

        return () => {
            clearInterval(harvestTimer);
        }

    }, [p]);
    return <h5>{estHarv}</h5>;
}


function PoolsView({ poolList, title, guidePrompt, guideURL }: {
    title: string; guidePrompt: string; guideURL: string;
    poolList: PoolListProps[]
}) {

    const [expandedpId, setExpandedpId] = useState<number>();

    useEffect(() => {

        if (poolList && poolList.length > 0) {
            if (poolList[0].pools.length > 0) {
                setExpandedpId(poolList[0].pools[0].pId);
            }
        }
    }, [poolList]);

    return <div className="bg-secondary-mod-1 poolsView">

        <div className="d-flex flex-row justify-content-between">
            <h4>{title}</h4>

            <Button variant='link' onClick={() => window.open(guideURL)}>
                <span className="guide">{guidePrompt}</span>
            </Button>
        </div>

        {poolList.map((pl, poolListIndex) => <div key={poolListIndex}>

            {pl.lpProps?.title && <div className='mt-4 mb-2 d-flex flex-row align-items-center'>
                <h5 className="pt-2">{pl.lpProps.title}</h5>
                <Button variant='link' onClick={() => pl.lpProps?.guideUrl && window.open(pl.lpProps?.guideUrl)} >
                    <span className="guide">{pl.lpProps.title}</span>
                </Button>
            </div>}

            {pl.pools.map((p) => <div key={p.pId} className="bg-secondary-mod poolRow ">

                <div className="d-flex flex-row gap-2 align-items-center">

                    <div>
                        <div className="poolLogo bg-secondary-mod-1">
                            <div className="logo"></div>
                        </div>

                        {pl.lpProps?.cashLogo && <div className="poolLogo bg-secondary-mod-1 cashLogo">
                            <div className={pl.lpProps.cashLogo}></div>
                        </div>
                        }

                    </div>

                    <div className="poolCol text-center">
                        <small>Duration</small>
                        <h5>{p.duration}</h5>
                    </div>

                    <div className="poolCol text-center">
                        <small>APR</small>
                        <h5>{p.apr}%</h5>
                    </div>

                    <div className="poolCol text-center">
                        <small>Est. CZF/day</small>
                        <h5>{formatCZfVal(p.czfPerDay)}</h5>
                    </div>

                    <div className="poolCol text-center">
                        <small>Est. Harvestable</small>
                        <EstHarvest p={p} />
                    </div>

                    <Button variant='link' className="poolColBtn" onClick={() => {
                        if (expandedpId == p.pId) {
                            setExpandedpId(undefined);
                        } else {
                            setExpandedpId(p.pId);
                        }
                    }}>
                        <div className={'poolBtn ' + (expandedpId == p.pId ? 'expanded' : 'notExpanded')}></div>
                    </Button>

                </div>

                {expandedpId == p.pId &&
                    <div className="px-5"><Row className="poolViewActions p-4">

                        {(pl.actions || []).map((a, actionIndex) => <Col lg key={actionIndex} className="text-center m-1" >

                            {a.Component ? <a.Component pool={p} lp={pl.lpProps} /> :
                                <Button size="lg" variant='secondary' className="mx-3 flex-grow-1" onClick={() => {
                                    a.action(p);
                                }}>
                                    {a.labelAc?a.labelAc(p) : a.label}
                                </Button>
                            }

                        </Col>)}
                    </Row></div>
                }

            </div>)}

        </div>)}

    </div>;
}