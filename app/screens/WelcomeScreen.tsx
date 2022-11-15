import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { AppStackScreenProps } from "../navigators" // @demo remove-current-line
import { Box, Center, Checkbox, Flex, HStack, Pressable, ScrollView, Text, VStack } from "native-base"
import { FlatList, Image, PermissionsAndroid, Platform, SafeAreaView, useWindowDimensions } from "react-native"
import { SceneMap, TabBar, TabView } from "react-native-tab-view"
import { CustomInput, CustomInputSelectBox, Icon } from "../components"
import { launchImageLibrary } from "react-native-image-picker"
import { useStores } from "../models"
import _ from "lodash"

interface SelectionType {
  label: string
  value: string
}


const categoryData: SelectionType[] = [
  {
    label: "Collectables",
    value: "collectables",
  },
  {
    label: "Accessories",
    value: "accessories",
  },
  {
    label: "T-Shirts",
    value: "t-shirts",
  },
]

const conditionData: SelectionType[] = [
  {
    label: "Bad",
    value: "bad",
  },
  {
    label: "Fair",
    value: "fair",
  },
  {
    label: "Good",
    value: "good",
  },
  {
    label: "New",
    value: "new",
  },
]
const getPermissionFile = async () => {
  let permissionGranted = false
  switch (Platform.OS) {
    case "ios":
      permissionGranted = true
      break
    case "android":
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "File and media permission",
            message:
              "App need access to your file and media ",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          },
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the file and media")
          permissionGranted = true
        } else {
          console.log("file and media permission denied")
        }
      } catch (err) {
        console.warn(err)
      }
      break
  }

  return permissionGranted
}


const FirstRoute = observer(() => {
  const {
    commonStore: {
      setImage,
      image,
    },
  } = useStores()
  const options = {
    mediaType: "photo",
    // fileSize: 200,

    maxHeight: 900,
    maxWidth: 1200,
    duration: 15,
    selectionLimit: 5 - image.length,
    storageOptions: {
      skipBackup: true,
      path: "media",
    },
  }
  const handleUploadLibrary = async () => {
    const permissionGranted = await getPermissionFile()
    const pathArr = []
    if (permissionGranted) {
      launchImageLibrary(options, async (response) => {
        if (response.assets && response.assets?.length > 0) {
          response.assets.forEach((element) => {

            pathArr.push(element.uri)
          })
          setImage(pathArr)
        }
      })
    }
  }
  return (
    <Pressable alignItems={"center"} justifyContent={"center"} h={"100%"} onPress={handleUploadLibrary}>
      <Box borderWidth={1} borderColor={"#00000033"} p={45}>
        <VStack>
          <Center>
            <Icon icon="addCar" style={{ justifyContent: "center" }} />
          </Center>
          <Text>Add Image</Text>
        </VStack>
      </Box>
      <Text textAlign={"center"} px={16} mt={10} color={"#898989"}>
        You may upload up to 5 images. Supported file types: jpg, png
      </Text>
    </Pressable>
  )

})


const SecondRoute = observer(() => {
  const { commonStore: { image } } = useStores()
  if (image.length > 0){
    return (
      <FlatList scrollEnabled={false} data={image} numColumns={3} renderItem={ ({item}) => <Image source={{uri: item}} style={{width: 100, height: 100}} />} />
      // <>
      //   {_.map(image, (item, index) => {
      //     return (
      //       <Box>
      //         <Image source={{ uri: item }} style={{ width: 100, height: 100 }} />
      //       </Box>
      //     )
      //   })}
      // </>
    )
  }else{
    return null
  }
})

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
})

const renderLabel = ({ route, focused }) => (
  <Text fontWeight={focused ? 700 : 400}>{route.title}</Text>
)
const renderTabBar = (props) => {
  return (
    <TabBar {...props} style={{
      backgroundColor: "transparent",
      color: "#000000",
      borderBottomColor: "#00000033",
      borderBottomWidth: 1,
    }} inactiveColor={"#898989"}
            activeColor={"#202020"} indicatorStyle={{ backgroundColor: "#202020" }} renderLabel={renderLabel} />
  )
}


interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {
} // @demo remove-current-lineseco

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen(
  _props, // @demo remove-current-line
) {
  const layout = useWindowDimensions()
  const { commonStore: { reset,image } } = useStores()
  const [index, setIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: "first", title: "Image Gallery" },
    { key: "second", title: `Preview` },
  ])
  useEffect(() => {
    reset()
  }, [])
  useEffect(()=>{
    if (image.length > 0){
      setIndex(1)
    }
  },[image])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <HStack height={10} backgroundColor={"#202020"} justifyContent={"center"} alignItems={"center"}>
          <Text fontSize={22} color={"#FFFFFF"} fontWeight={800}>LOGO</Text>
        </HStack>
        <HStack borderBottomWidth={1} borderBottomColor={"#898989"} p={2}>
          <Text fontSize={13} fontWeight={700}>Add a Product</Text>
        </HStack>
        <Box height={500} px={5}>
          <TabView
            renderTabBar={renderTabBar}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
          />
        </Box>
        <VStack space={4} p={5}>
          <CustomInput placeholder={"Name your listing. Keep it short and sweet"} label={"Product Name"} />
          <CustomInputSelectBox label={"Category"} selection={categoryData} />
          <CustomInput placeholder={"Add a keyword and press Enter"} label={"Brand (up to 2) *"} />
          <CustomInput placeholder={"Add some information about the product"} label={"Description"} isTextArea={true} />
          <HStack justifyContent={"space-between"}>
            <VStack>
              <Text fontWeight={600}>Thumbnail Images <Text color={"#D54F4F"}>*</Text></Text>
              <Pressable backgroundColor={true ? "#202020" : "#FFFFFF"} key={index} borderWidth={1}
                         borderColor={"#00000033"} px={5} py={3} mt={2} borderRadius={5}>
                <HStack space={2} alignItems={"center"}>
                  <Icon icon="addCarLight" style={{ justifyContent: "center", width: 17, height: 17 }} />
                  <Text color={true ? "#FFFFFF" : "#202020"}>Add Image</Text>
                </HStack>
              </Pressable>
            </VStack>
            <Box width={"50%"}>
              <CustomInput placeholder={"Enter available quantity"} label={"Available Qty"} />
            </Box>
          </HStack>
          <CustomInputSelectBox label={"Condition"} selection={conditionData} />
          <HStack justifyContent={"space-between"}>
            <Box w={"49%"}>
              <CustomInput label={"Season"} placeholder={"SS20"} />
            </Box>
            <Box w={"49%"}>
              <CustomInput label={"Retail"} placeholder={"400"} inputLeftElement={<Text mr={2}>S$</Text>} />
            </Box>
          </HStack>
          <VStack>
            <Text fontWeight={600}>
              Authenticity
            </Text>
            <Text>
              100%
            </Text>
          </VStack>
          <VStack>
            <Text fontWeight={600}>Declaration<Text color={"#D54F4F"}>*</Text></Text>
            <HStack space={2}>
              <Checkbox value={"test"} mt={1} borderColor={"#202020"} borderRadius={0} color={"#202020"} />
              <Text pr={5}>
                I hereby declare that my item is 100% authentic and in the original packaging. In the event that any
                information given in this application proves to be false or incorrect, I shall be responsible for the
                consequences.
              </Text>
            </HStack>
          </VStack>
          <HStack justifyContent={"flex-end"} space={2}>
            <Text color={"D54F4F"}>*</Text>
            <Text>Indicates Requires </Text>
          </HStack>
          <HStack justifyContent={"center"} space={26} mt={3}>
            <Pressable borderWidth={1} borderColor={"Cancel"} px={10} py={3}>
              <Text>
                Cancel
              </Text>
            </Pressable>
            <Pressable borderWidth={1} borderColor={"Cancel"} px={10} py={3} bgColor={"#202020"}>
              <Text color={"#FFFFFF"}>
                Publish
              </Text>
            </Pressable>
          </HStack>
        </VStack>

      </ScrollView>
    </SafeAreaView>

  )
})
