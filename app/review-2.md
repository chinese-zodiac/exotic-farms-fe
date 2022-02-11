`fixed` Disclaimer: Add "Dont Show Again" button which prevents discalimer from showing when page opens (can still be viewed using the footer button

`fixed` Header: Change price display to: CZF $0.0000006233, when clicked open https://app.1inch.io/#/56/swap/BNB/0x7c1608C004F20c3520f70b924E2BfeF092dA0043

`fixed` Header "Buy CZF" dropdown: 
-- Remove the first "CZF 0.0xx" item
-- Link "Pancakeswap" to https://pancakeswap.finance/info/token/0x7c1608c004f20c3520f70b924e2bfef092da0043
-- Link "Poocoin" to https://poocoin.app/tokens/0x7c1608c004f20c3520f70b924e2bfef092da0043

`fixed` Header "Socials" dropdown:
-- Add Link "Whitepaper" to https://czodiac.gitbook.io/czodiac-litepapper/features-active/chrono-pools
-- Change Discord Link to https://discord.gg/QDyTJccdE9

`fixed` Security Section:
-- Link "Github here" to https://github.com/chinese-zodiac/czodiac
-- Link "audits.finance here" to https://audits.finance/Audits/CZFarmAudit.pdf
-- Link "BSCscan here" to https://bscscan.com/token/0x7c1608C004F20c3520f70b924E2BfeF092dA0043

`fixed` Footer socials:
-- Change Discord Link to https://discord.gg/QDyTJccdE9
-- Link "Eye" bogged icon (in middle, between github and gecko) to https://charts.bogged.finance/0x7c1608c004f20c3520f70b924e2bfef092da0043
-- Link Coingecko to: https://www.coingecko.com/en/coins/czfarm
-- Link Coinmarketcap (deep blue) to: https://coinmarketcap.com/currencies/czfarm/
-- Link 1inch (horse) to: https://app.1inch.io/#/56/swap/BNB/0x7c1608C004F20c3520f70b924E2BfeF092dA0043
-- Link BSCscan (last icon) to: https://bscscan.com/token/0x7c1608C004F20c3520f70b924E2BfeF092dA0043


`fixed` APR displays: APR is incorrectly displaying ROI everywhere in the dapp. Most likely this is because ROI is returned from the chrono/exotic contracts not APR. So you will need to use this formula to calculate APR: APR = ROI * 1 year / period
^^ I will double check this in the contracts

app.1inch.io
1inch - DeFi / DEX aggregator on Ethereum, Binance Smart Chain, Optimism, Polygon, Arbitrum

DeFi / DEX aggregator with the most liquidity and the best rates on Ethereum, Binance Smart Chain, Optimism, Polygon, 1inch dApp is an entry point to the 1inch Network's ...