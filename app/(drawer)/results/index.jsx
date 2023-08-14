import { FlatList, StyleSheet, Text, View } from "react-native"
import React, { useContext, useEffect, useRef, useState } from "react"
import { Button, ButtonGroup, Card, Image, ListItem } from "@rneui/themed"
import axios from "axios"
import { useAuth } from "../../../context/auth"
import Modal from "react-native-modal"
import DatePicker from "react-native-modern-datepicker"
import { format, formatDistanceToNow, parseISO } from "date-fns"

//ICONS
import { Feather, Ionicons } from "@expo/vector-icons"
import { Dropdown } from "react-native-element-dropdown"
import { useIsFocused } from "@react-navigation/native"

const index = () => {
  const { user } = useAuth()

  //URL
  const URL = "https://admin-api-production-9bae.up.railway.app/api/Agent"

  //DATEPICKER
  const today = new Date()
  const startDate = format(today.setDate(today.getDate()), "yyyy-MM-dd")

  const [date, setdate] = useState(startDate)
  const [newDate, setnewDate] = useState()

  //DATE PICKER STATE
  const [isModalVisible, setModalVisible] = useState(false)
  const dateModal = () => {
    setModalVisible(!isModalVisible)
  }

  function convertDate(stringdate) {
    const convertedDate = stringdate.replace(/\//g, "-")
    return convertedDate
  }

  function handleChange(propDate) {
    setnewDate(convertDate(propDate))
    const dateObject = parseISO(date)
    const formattedDate = format(dateObject, "MMMM dd, yyyy")
  }

  function stringdate(date) {
    const dateObject = parseISO(date)
    const formattedDate = format(dateObject, "MMMM dd, yyyy")
    return formattedDate
  }

  function formattedDistance(date) {
    const dateTime = parseISO(date)
    const formattedDistance = formatDistanceToNow(dateTime, { addSuffix: true })
    return formattedDistance
  }

  const timeData = [
    { label: "All", value: "" },
    { label: "2PM", value: "14:00:00" },
    { label: "5PM", value: "17:00:00" },
    { label: "9PM", value: "21:00:00" },
  ]
  const gameData = [
    { label: "All", value: "" },
    { label: "2D", value: "2d" },
    { label: "3D", value: "3d" },
    { label: "4D", value: "4d" },
  ]

  // GAME STATE
  const [gameValue, setGameValue] = useState(null)
  const [isGameFocus, setIsGameFocus] = useState(false)

  const renderGameLabel = () => {
    if (gameValue || isGameFocus) {
      return (
        <Text style={[styles.label, isGameFocus && { color: "blue" }]}>
          Game
        </Text>
      )
    }
    return null
  }
  // TIME STATE
  const [timeValue, settimeValue] = useState(null)
  const [istimeFocus, setIstimeFocus] = useState(false)

  const renderTimeLabel = () => {
    if (timeValue || istimeFocus) {
      return (
        <Text style={[styles.label, istimeFocus && { color: "blue" }]}>
          Time
        </Text>
      )
    }
    return null
  }

  function handleNewDate() {
    setdate(newDate)
    dateModal()
  }

  const [results, setResults] = useState([])
  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      axios({
        method: "post",
        url: `${URL}/Results`,

        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        data: {
          game_type: gameValue,
          draw_time: timeValue,
          draw_date: date,
        },
      })
        .then(function (response) {
          setResults(response.data)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }, [gameValue, timeValue, date, isFocused])

  return (
    <View style={styles.container}>
      <Button buttonStyle={{ marginBottom: 5 }} onPress={dateModal}>
        {stringdate(date)}
      </Button>

      {/* DATE PICKER MODAL */}
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View
              style={{
                justifyContent: "space-between",
                marginHorizontal: 20,
                // flexDirection: "row",
              }}
            >
              <DatePicker
                mode="calendar"
                minunumDate={startDate}
                selected={date}
                onDateChange={handleChange}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  buttonStyle={{ width: 120 }}
                  title={"Set"}
                  onPress={handleNewDate}
                />
                <Button
                  onPress={dateModal}
                  buttonStyle={{ width: 120 }}
                  title={"Cancel"}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* DROPDOWN */}
      <View style={{ flexDirection: "row" }}>
        <View style={styles.dropdownContainer}>
          {renderTimeLabel()}
          <Dropdown
            style={[styles.dropdown, istimeFocus && { borderColor: "blue" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={timeData}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!istimeFocus ? "Select Time" : "..."}
            value={timeValue}
            onFocus={() => setIstimeFocus(true)}
            onBlur={() => setIstimeFocus(false)}
            onChange={(item) => {
              settimeValue(item.value)
              setIstimeFocus(false)
            }}
            renderLeftIcon={() => (
              <Ionicons
                style={styles.icon}
                color={istimeFocus ? "blue" : "black"}
                name="time-outline"
                size={20}
              />
            )}
          />
        </View>
        <View style={styles.dropdownContainer}>
          {renderGameLabel()}
          <Dropdown
            style={[styles.dropdown, isGameFocus && { borderColor: "blue" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={gameData}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isGameFocus ? "Select Game" : "..."}
            value={gameValue}
            onFocus={() => setIsGameFocus(true)}
            onBlur={() => setIsGameFocus(false)}
            onChange={(item) => {
              setGameValue(item.value)
              setIsGameFocus(false)
            }}
            renderLeftIcon={() => (
              <Ionicons
                style={styles.icon}
                color={isGameFocus ? "blue" : "black"}
                name="game-controller-outline"
                size={20}
              />
            )}
          />
        </View>
      </View>

      {/* <View style={{ padding: 10 }}>
        <Text style={styles.subHeader}>{stringdate(date)}</Text>
      </View> */}
      <View style={styles.list}>
        <FlatList
          data={results}
          renderItem={({ item }) => (
            <ListItem bottomDivider>
              <ListItem.Content>
                <View>
                  <ListItem.Title
                    onPress={() => handleClickedHistory(item.transaction_code)}
                    style={{ color: "red" }}
                  >
                    {item.game_type}
                  </ListItem.Title>
                  <ListItem.Subtitle
                    onPress={() => handleClickedHistory(item.transaction_code)}
                  >
                    {item.winning_combination}
                  </ListItem.Subtitle>
                </View>
              </ListItem.Content>
              <ListItem.Content right>
                <ListItem.Title right style={{ color: "green" }}>
                  Prize: ₱{item.prize}
                </ListItem.Title>
                <ListItem.Subtitle right>
                  {formattedDistance(item.created_at)}
                </ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  picker: {
    alignItems: "center",
  },
  header: {},
  modalContainer: {
    justifyContent: "center",
    // alignItems: "center",
    maxHeight: "90%",
    borderRadius: 5,
    flex: 1,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    // justifyContent: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "skyblue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  subHeader: {
    backgroundColor: "#2089dc",
    color: "white",
    textAlign: "center",
    paddingVertical: 10,
    marginBottom: 0,
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  dropdownContainer: {
    backgroundColor: "white",
    padding: 16,
    width: "50%",
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
})
