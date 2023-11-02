import React, { FC, PropsWithChildren, useEffect, useState } from "react";
import ScrollPicker from '../component/DatePicker';
import { View, Modal, TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

type Props = {};

function pad(n: number) {
  const s = '000' + n;
  return s.substr(s.length - 4);
}

const daySeries = Array.from({length: 31}).map((_, i) => i + 1);
const monthSeries = Array.from({length: 12}).map((_, i) => i + 1);
const yearSeries: number[] = [];

for (let i = 1500; i <= 2500; i++) {
  yearSeries.push(i);
}

const Home: FC<PropsWithChildren<Props>> = () => {
  const [year, setYear] = useState<number>(0)
  const [isModalVisible, setModalVisible] = useState(false);
  const [textDay, setTextDay] = useState<any>('MM/dd/YYY')

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const currentDay = new Date().getDate() -1;
  const currentMouth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if(yearSeries) {
      yearSeries.map((value, index) => {
        if(currentYear === value){
          setYear(index)
        }
      })
    }
  }, [year])

  return (
    <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 100}}>
      <TouchableOpacity onPress={toggleModal} style={styles.button}>
        <Text>{textDay}</Text>
        <Icon name="calendar-outline" size={20} />
      </TouchableOpacity>
      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{fontWeight: 'bold'}}>Date of birth</Text>
            {
              year && currentDay && currentMouth ? <View
                style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: '6%',
                  borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#eaeaea', paddingTop: 40}}>
                <View
                  style={{
                    backgroundColor: '#fff',
                    height: 200,
                    width: '33%',
                  }}>
                  <ScrollPicker
                    dataSource={daySeries}
                    selectedIndex={currentDay}
                    onValueChange={(data, selectedIndex) =>
                      console.log(data, selectedIndex)
                      //todo...
                    }
                    wrapperHeight={200}
                    wrapperBackground="#fff"
                    itemHeight={20}
                    highlightBorderWidth={2}
                  />
                </View>
                <View
                  style={{
                    backgroundColor: '#fff',
                    height: 200,
                    width: '33%',
                  }}>
                  <ScrollPicker
                    dataSource={monthSeries}
                    selectedIndex={currentMouth}
                    onValueChange={(data, selectedIndex) =>
                      console.log(data, selectedIndex)
                    }
                    wrapperHeight={200}
                    wrapperBackground="#fff"
                    itemHeight={20}
                    highlightBorderWidth={2}
                  />
                </View>
                <View
                  style={{
                    backgroundColor: '#fff',
                    height: 200,
                    width: '33%',
                  }}>
                  <ScrollPicker
                    dataSource={yearSeries}
                    selectedIndex={year}
                    onValueChange={(data, selectedIndex) => {
                      console.log(data, selectedIndex)
                    }}
                    wrapperHeight={200}
                    wrapperBackground="#fff"
                    itemHeight={20}
                    highlightBorderWidth={2}
                  />
                </View>
              </View> : <></>
            }

            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Text>Sumit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    padding: 10,
    width: '60%',
    display: 'flex',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    height: '50%'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButton: {
    minWidth: '100%',
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 5,
    alignItems: 'center',
  },
})
