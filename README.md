# Swoop DEX Interface (integration with BandChain and Binance.us API)
[![Styled With Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)
### [Link to demo video](https://youtu.be/1wethoG_2XQ)
## Configuration
### Assigning reference price data to custom tokens
Modify `src/constants/symbolvalues.ts` as follows:
```javascript
export  const  SYMBOL_VALUES: Record<string, string> = {
	...	
	'symbol of custom token': 'symbol of reference price data'
	//example
	//'1WBTC':  'WBTC'
	...
}
```
Valid reference price data symbols can be found at [data.bandprotocol.com](https://data.bandprotocol.com/)
### Assigning Binance.us trading pair price to custom token pairs
Modify `src/constants/binancepairs.ts` as follows:
```javascript
export  const  BINANCE_PAIRS: Record<string, string> = {
	...	
	'symbol of custom token pair': 'symbol of Binance.us trading pair'
	//example
	//'WBTC/BUSD':  'BTC/BUSD',
	...
}
```
Valid Binance.us trading pair symbols can be found at [support.binance.us](https://support.binance.us/hc/en-us/articles/360049417674-What-trading-pairs-does-Binance-US-offer-)
## Development

### Install Dependencies

```bash
yarn
```

### Run

```bash
yarn start
```
