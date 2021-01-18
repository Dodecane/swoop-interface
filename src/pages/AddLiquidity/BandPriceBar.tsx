import { Currency } from '@swoop-exchange/sdk'
import React, { useContext } from 'react'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { AutoRow } from '../../components/Row'
import { Field } from '../../state/mint/actions'
import { TYPE } from '../../theme'
import { useState, useEffect } from 'react'
import { Client } from '@bandprotocol/bandchain.js'
import { SYMBOL_VALUES } from '../../constants/symbolvalues'

export function BandPriceBar({ currencies }: { currencies: { [field in Field]?: Currency } }) {
  const theme = useContext(ThemeContext)
  const endpoint = 'https://api-gm-lb.bandchain.org'
  const [bandPrice, setBandPrice] = useState(null)

  useEffect(() => {
    const client = new Client(endpoint)
    async function getBandPrice() {
      const inputCurrencySymbol =
        SYMBOL_VALUES[currencies[Field.CURRENCY_A]?.symbol] || currencies[Field.CURRENCY_A]?.symbol
      const outputCurrencySymbol =
        SYMBOL_VALUES[currencies[Field.CURRENCY_B]?.symbol] || currencies[Field.CURRENCY_B]?.symbol
      const rate = await client.getReferenceData([inputCurrencySymbol + '/' + outputCurrencySymbol])
      setBandPrice(rate[0].rate)
    }
    getBandPrice()
  }, [currencies])
  return (
    <AutoColumn gap="md">
      <AutoRow justify="space-around" gap="4px">
        <AutoColumn justify="center">
          <TYPE.black>{bandPrice?.toPrecision(6) ?? '-'}</TYPE.black>
          <Text fontWeight={500} fontSize={14} color={theme.text2} pt={1}>
            {currencies[Field.CURRENCY_B]?.symbol} per {currencies[Field.CURRENCY_A]?.symbol}
          </Text>
        </AutoColumn>
        <AutoColumn justify="center">
          <TYPE.black>{bandPrice ? (1 / bandPrice).toPrecision(6) : '-'}</TYPE.black>
          <Text fontWeight={500} fontSize={14} color={theme.text2} pt={1}>
            {currencies[Field.CURRENCY_A]?.symbol} per {currencies[Field.CURRENCY_B]?.symbol}
          </Text>
        </AutoColumn>
      </AutoRow>
    </AutoColumn>
  )
}
