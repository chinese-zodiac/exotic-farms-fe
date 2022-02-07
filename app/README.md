# creating types for contratcs

`npm run generateTypes`


# deploy contracts to testnet

`cd ..\czodiac\packages\sc`

`npx hardhat run --network bscTestnet scripts/deploy-czfarm.js`

CZFarm deployed to: 0xc74aA89c7e2BEB5F993b602e7a3ccdEFd92FddB9
CZFarmMaster deployed to: 0x74E2A2aC12C0341a7816fa09C3c8bFfF995A2209
CZFarmPoolFactory deployed to: 0x7DA7b32fE631E971a351B4ab351ff1CDfF867DCB


`set CZFARM=0xc74aA89c7e2BEB5F993b602e7a3ccdEFd92FddB9`
`npx hardhat run --network bscTestnet scripts/deploy-ChronoPoolService.js`

starting to deploy.. will take some time.. czfToken : 0xc74aA89c7e2BEB5F993b602e7a3ccdEFd92FddB9
ChronoPoolService deployed to: 0xcc2604AA5ab2D0fa7A177A39c6A29aEC17a06bA5
Grant roles
Complete