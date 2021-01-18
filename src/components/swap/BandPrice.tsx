import React from 'react'
import { Currency, Price } from '@swoop-exchange/sdk'
import { useContext } from 'react'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { useState, useEffect } from 'react'
import { ErrorText } from './styleds'
import { Client } from '@bandprotocol/bandchain.js'
import { SYMBOL_VALUES } from '../../constants/symbolvalues'

interface BandPriceProps {
  price?: Price
  inputCurrency?: Currency
  outputCurrency?: Currency
  showInverted: boolean
}

export default function BandPrice({ price, inputCurrency, outputCurrency, showInverted }: BandPriceProps) {
  const theme = useContext(ThemeContext)

  const show = Boolean(inputCurrency && outputCurrency)

  const label = showInverted
    ? `${outputCurrency?.symbol} per ${inputCurrency?.symbol}`
    : `${inputCurrency?.symbol} per ${outputCurrency?.symbol}`

  const endpoint = 'https://api-gm-lb.bandchain.org'

  const [bandPrice, setBandPrice] = useState(null)

  useEffect(() => {
    const client = new Client(endpoint)
    async function getBandPrice() {
      const inputCurrencySymbol = SYMBOL_VALUES[inputCurrency?.symbol] || inputCurrency?.symbol
      const outputCurrencySymbol = SYMBOL_VALUES[outputCurrency?.symbol] || outputCurrency?.symbol
      const rate = await client.getReferenceData([inputCurrencySymbol + '/' + outputCurrencySymbol])
      setBandPrice(rate[0].rate)
    }
    getBandPrice()
  }, [inputCurrency, outputCurrency])

  const formattedBandPrice = bandPrice
    ? parseFloat(showInverted ? bandPrice.toPrecision(6) : (1 / bandPrice).toPrecision(6))
    : null
  const formattedPrice = price
    ? parseFloat(showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6))
    : null
  const percentageChange =
    formattedBandPrice && formattedPrice
      ? parseFloat((((formattedBandPrice - formattedPrice) / formattedPrice) * 100).toFixed(2))
      : null

  const percentageColour = percentageChange ? (percentageChange > 0 ? 0 : 4) : 1

  return (
    <>
      <ErrorText
        fontWeight={500}
        fontSize={14}
        severity={percentageColour}
        style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}
      >
        {show ? <>{percentageChange ? percentageChange + '%' : <></>}</> : <></>}
      </ErrorText>
      <Text
        fontWeight={500}
        fontSize={14}
        color={theme.text2}
        style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}
      >
        {show ? (
          <>
            {formattedBandPrice ?? '-'} {label}
          </>
        ) : (
          '-'
        )}
      </Text>
    </>
  )
}
