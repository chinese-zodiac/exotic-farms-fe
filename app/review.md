General:
`done` - Font size, increase globally by ~70% (match figma) 

`done` - When displaying CZF numbers, never show more than 5 digits of precision and use letter shorthand (eg: 10.402k or 490.21m, or 10.323)

- Update harvestable displays every second

`already working. let me know if there's a bug` -  Update CZF displays whenever a transaction is completed

`done`- Automatically connect wallet when possible


- Light/dark mode: fix the gradient to match figma, especially light mode
- Light mode: add the shadows from figma for elements were applicable


Header: Display current CZF price rather than wallet CZF balance (refer to figma)

CZF top stats bar: 
- Fix background color and fonts to match Figma
- Display "Harvestable CZF" as sum of all harvestable from both chrono pools and exotic farms

Chrono Farmer Image:
- Fix spacing to match documentation. Should be more than half of screen.

"Loop CZF For High Yield" section:
- The time selection should be a dropdown allowing selecting the proper chrono pool, as shown in Figma with the dropdown arrow to the left of "1 YEAR"
- ROI should be correctly calculated using the formula: APR * (period / 1 year). 
- Change +CZF to "Buy CZF" and link to https://app.1inch.io/#/56/swap/BNB/0x7c1608C004F20c3520f70b924E2BfeF092dA0043

Transaction Modal
- Fix spacing
- Fix (X) and (Close) buttons to correctly close the modal when transaction is pending

Chrono/Exotic Accordions:
- When clicking on an item in the Accordion, any open items should stay open and the clicked item should close.

Exotic Farms
- The CZF/BNB on PCS and CZF/BUSD links in Exotic Farms should link to the mint LP pages on pancakeswap:
CZF/BNB https://pancakeswap.finance/add/0x7c1608C004F20c3520f70b924E2BfeF092dA0043/BNB
CZF/BUSD https://pancakeswap.finance/add/0x7c1608C004F20c3520f70b924E2BfeF092dA0043/0xe9e7cea3dedca5984780bafc599bd69add087d56
- If the LP token has already been approved, then it should instead display a "Deposit LP" button if the LP token balance of the wallet is more than zero. Otherwise, it should have a "Mint LP" button which links to the correct LP minting on Pancakeswap.

Disclaimer
- Fix spacing to match figma

app.1inch.io
1inch - DeFi / DEX aggregator on Ethereum, Binance Smart Chain, Optimism, Polygon, Arbitrum

DeFi / DEX aggregator with the most liquidity and the best rates on Ethereum, Binance Smart Chain, Optimism, Polygon, 1inch dApp is an entry point to the 1inch Network's ...