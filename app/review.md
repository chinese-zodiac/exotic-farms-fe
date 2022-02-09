General:
`done` - Font size, increase globally by ~70% (match figma) 

`done` - When displaying CZF numbers, never show more than 5 digits of precision and use letter shorthand (eg: 10.402k or 490.21m, or 10.323)

`done` - Update harvestable displays every second

`already working. let me know if there's a bug` -  Update CZF displays whenever a transaction is completed

`done` - Automatically connect wallet when possible

`done` - Light/dark mode: fix the gradient to match figma, especially light mode
`done` - Light mode: add the shadows from figma for elements were applicable


`done` - Header: Display current CZF price rather than wallet CZF balance (refer to figma)

CZF top stats bar: 
`done`- Fix background color and fonts to match Figma

`done`- Display "Harvestable CZF" as sum of all harvestable from both chrono pools and exotic farms

Chrono Farmer Image:
`done` - Fix spacing to match documentation. Should be more than half of screen.

"Loop CZF For High Yield" section:
`done`- The time selection should be a dropdown allowing selecting the proper chrono pool, as shown in Figma with the dropdown arrow to the left of "1 YEAR"

`done` - ROI should be correctly calculated using the formula: APR * (period / 1 year).

`done` - Change +CZF to "Buy CZF" and link to https://app.1inch.io/#/56/swap/BNB/0x7c1608C004F20c3520f70b924E2BfeF092dA0043

Transaction Modal
`done` - Fix spacing
`done, we cannot cancel the tx`- Fix (X) and (Close) buttons to correctly close the modal when transaction is pending

Chrono/Exotic Accordions:
`fixed`- When clicking on an item in the Accordion, any open items should stay open and the clicked item should close.

Exotic Farms
`done` - The CZF/BNB on PCS and CZF/BUSD links in Exotic Farms should link to the mint LP pages on pancakeswap:
CZF/BNB https://pancakeswap.finance/add/0x7c1608C004F20c3520f70b924E2BfeF092dA0043/BNB
CZF/BUSD https://pancakeswap.finance/add/0x7c1608C004F20c3520f70b924E2BfeF092dA0043/0xe9e7cea3dedca5984780bafc599bd69add087d56

# Note I am not able to test this fully (except mock and test) as I couldn't create LP on testnet
` done `- If the LP token has already been approved, then it should instead display a "Deposit LP" button if the LP token balance of the wallet is more than zero. Otherwise, it should have a "Mint LP" button which links to the correct LP minting on Pancakeswap.

Disclaimer
`done` - Fix spacing to match figma


---
`done` 1. sort the pools by duration
`done` 2. anything with 0 APR hiden them
`done` 3. the loops czf box lives on it's own
`done` 4. Round UP the durations

`the loop all CZF does that` - add MAX czfButton

`done - reduced size` 5. footer icons are pixelated 

