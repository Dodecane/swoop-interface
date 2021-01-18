import React from 'react'
import { Currency } from '@swoop-exchange/sdk'
import { useContext } from 'react'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { useState, useEffect } from 'react'
import { SYMBOL_VALUES } from '../../constants/symbolvalues'
import { BINANCE_PAIRS } from '../../constants/binancepairs'
import axios from 'axios'
import { ExternalLink } from '../../theme/components'
import { ExternalLink as LinkIcon } from 'react-feather'
import { AutoRow } from '../Row'

interface BinanceUSPriceProps {
  inputCurrency?: Currency
  outputCurrency?: Currency
  showInverted: boolean
}

export default function BinanceUSPrice({ inputCurrency, outputCurrency, showInverted }: BinanceUSPriceProps) {
  const theme = useContext(ThemeContext)

  const [binancePrice, setBinancePrice] = useState(null)
  const [labels, setLabels] = useState(null)

  let show = Boolean(inputCurrency && outputCurrency) && labels

  useEffect(() => {
    async function getBinancePrice() {
      const inputCurrencySymbol = SYMBOL_VALUES[inputCurrency?.symbol] || inputCurrency?.symbol
      const outputCurrencySymbol = SYMBOL_VALUES[outputCurrency?.symbol] || outputCurrency?.symbol
      if (BINANCE_PAIRS[inputCurrencySymbol + '/' + outputCurrencySymbol]) {
        try {
          const res = await axios.get(
            'https://api.binance.us/api/v3/avgPrice?symbol=' +
              BINANCE_PAIRS[inputCurrencySymbol + '/' + outputCurrencySymbol].replace('/', '')
          )
          setBinancePrice(parseFloat(res.data.price))
          const labels = BINANCE_PAIRS[inputCurrencySymbol + '/' + outputCurrencySymbol].split('/')
          setLabels(labels)
        } catch (err) {
          console.error(err)
        }
      } else if (BINANCE_PAIRS[outputCurrencySymbol + '/' + inputCurrencySymbol]) {
        try {
          const res = await axios.get(
            'https://api.binance.us/api/v3/avgPrice?symbol=' +
              BINANCE_PAIRS[outputCurrencySymbol + '/' + inputCurrencySymbol].replace('/', '')
          )
          setBinancePrice(1 / parseFloat(res.data.price))
          const labels = BINANCE_PAIRS[outputCurrencySymbol + '/' + inputCurrencySymbol].split('/').reverse()
          setLabels(labels)
        } catch (err) {
          console.error(err)
        }
      } else {
        setBinancePrice(null)
        setLabels(null)
      }
    }
    getBinancePrice()
  }, [inputCurrency, outputCurrency])

  const formattedBinancePrice = binancePrice
    ? parseFloat(showInverted ? binancePrice.toPrecision(6) : (1 / binancePrice).toPrecision(6))
    : null

  const label = labels ? (showInverted ? `${labels[1]} per ${labels[0]}` : `${labels[0]} per ${labels[1]}`) : ''

  return (
    <>
      {show ? (
        <>
          <Text fontWeight={500} fontSize={14} color={theme.text2}>
            Binance.us price
            <AutoRow justify="space-between">
              <ExternalLink
                href={'https://www.binance.us/en/trade/' + labels[0] + '_' + labels[1]}
                style={{ color: '#f3ba2f' }}
              >
                <LinkIcon size={16} />
                <span style={{ marginLeft: '4px' }}>View on Binance.us</span>
              </ExternalLink>
            </AutoRow>
          </Text>
          <Text
            fontWeight={500}
            fontSize={14}
            color={theme.text2}
            style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}
          >
            {formattedBinancePrice ?? '-'} {label}
          </Text>
        </>
      ) : (
        <></>
      )}
    </>
  )
}
