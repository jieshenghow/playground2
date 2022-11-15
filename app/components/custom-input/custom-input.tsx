import * as React from "react"
import { StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Box, Input, Text, TextArea } from "native-base"

export interface CustomInputProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  label: string
  placeholder: string
  isTextArea?: boolean
  inputLeftElement?: any
}

/**
 * Describe your component here
 */
export const CustomInput = observer(function CustomInput(props: CustomInputProps) {
  const { label, placeholder, isTextArea = false, inputLeftElement = null } = props

  return (
    <Box>
      <Text fontWeight={600}>{label} <Text color={"#D54F4F"}>*</Text></Text>
      {isTextArea ? (
        <TextArea autoCompleteType={undefined} mt={2} variant={"underlined"} placeholder={placeholder} />
      ) : (
        <Input InputLeftElement={inputLeftElement} variant={"underlined"} placeholder={placeholder} />
      )}

    </Box>

  )
})
