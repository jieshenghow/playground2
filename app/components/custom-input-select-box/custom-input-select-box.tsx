import * as React from "react"
import { StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Box, HStack, Input, Pressable, Text } from "native-base"
import _ from "lodash"

export interface CustomInputSelectBoxProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  label: string
  selection: {
    label: string
    value: string
  }[]
}

/**
 * Describe your component here
 */
export const CustomInputSelectBox = observer(function CustomInputSelectBox(props: CustomInputSelectBoxProps) {
  const [selected, setSelected] = React.useState<{label:string, value:string}>(null)
  const {label, selection} = props

  const handleSelect = (item) => {
   setSelected(item)
  }

  return (
    <Box>
      <Text fontWeight={600}>{label} <Text color={"#D54F4F"}>*</Text></Text>
      <HStack space={3}>
        {_.map(selection, (item, index) => {
          const isSelected = selected?.value === item.value
          return (
            <Pressable onPress={()=>{
              handleSelect(item)
            }} backgroundColor={isSelected? "#202020" : "#FFFFFF" }  key={index} borderWidth={1} borderColor={"#202020"} px={5} py={3} mt={5} >
              <Text color={isSelected? "#FFFFFF":"#202020"}>{item.label}</Text>
            </Pressable>
          )
        })}
      </HStack>
    </Box>
  )
})

