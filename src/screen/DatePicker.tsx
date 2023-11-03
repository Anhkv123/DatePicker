import React, {FC, PropsWithChildren, useEffect, useState} from 'react';
import ScrollPicker from '../component/ScrollPicker';
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = {};

const DatePicker: FC<PropsWithChildren<Props>> = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [day, setDay] = useState<number>();
  const [month, setMonth] = useState<number>();
  const [year, setYear] = useState<number>();
  const [value, setValue] = useState<any>('');
  const [isLeapYear, setIsLeapYear] = useState<number>(31);
  const [daySeries, setDaySeries] = useState<number[]>([]);

  const currentDay = new Date().getDate();
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const monthSeries = Array.from({length: 12}).map((_, i) => i + 1);
  const yearSeries = Array.from({length: 2050 - 1950 + 1}, (_, i) => 1950 + i);

  useEffect(() => {
    setDaySeries(Array.from({length: isLeapYear}).map((_, i) => i + 1));

    if (!!day && day > isLeapYear) {
      setDay(isLeapYear);
    }
  }, [isLeapYear, day]);

  const toggleModal = () => {
    const date =
      (day ?? currentDay) +
      '/' +
      (month ?? currentMonth) +
      '/' +
      (year ?? currentYear);
    setValue(date);
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    const tempYear = year ?? currentYear;
    const tempMonth = month ?? currentMonth;

    if ((tempYear % 4 === 0 && tempYear % 100 !== 0) || tempYear % 400 === 0) {
      if (tempMonth === 2) {
        setIsLeapYear(29);
      } else {
        if (
          tempMonth === 4 ||
          tempMonth === 6 ||
          tempMonth === 9 ||
          tempMonth === 11
        ) {
          setIsLeapYear(30);
        } else {
          setIsLeapYear(31);
        }
      }
    } else {
      if (tempMonth === 2) {
        setIsLeapYear(28);
      } else {
        if (
          tempMonth === 4 ||
          tempMonth === 6 ||
          tempMonth === 9 ||
          tempMonth === 11
        ) {
          setIsLeapYear(30);
        } else {
          setIsLeapYear(31);
        }
      }
    }
  }, [currentMonth, currentYear, month, year]);

  const checkMonth = () => {
    if (month === 4 || month === 6 || month === 9 || month === 11) {
      setIsLeapYear(30);
    } else {
      setIsLeapYear(31);
    }
  };
  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
      }}>
      <TouchableOpacity onPress={toggleModal} style={styles.button}>
        <TextInput
          autoComplete={'birthdate-full'}
          editable={false}
          multiline
          numberOfLines={4}
          maxLength={40}
          placeholder={'MM/dd/YYYY'}
          value={value}
          style={styles.input}
        />
        <Icon name="calendar-outline" size={20} />
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={toggleModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{fontWeight: 'bold'}}>Date of birth</Text>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: '6%',
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: '#eaeaea',
                paddingTop: 40,
              }}>
              <View
                style={{
                  backgroundColor: '#fff',
                  height: 200,
                  width: '33%',
                }}>
                <ScrollPicker
                  dataSource={daySeries}
                  selectedValue={day ? day : currentDay}
                  onValueChange={day => setDay(day)}
                  wrapperHeight={200}
                  wrapperBackground="#fff"
                  itemHeight={20}
                  highlightBorderWidth={1}
                  type={'day'}
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
                  selectedValue={month ? month : currentMonth}
                  onValueChange={month => {
                    if (
                      (currentYear % 4 === 0 && currentYear % 100 !== 0) ||
                      currentYear % 400 === 0
                    ) {
                      if (month === 2) {
                        setIsLeapYear(29);
                      } else {
                        checkMonth();
                      }
                    } else {
                      if (month === 2) {
                        setIsLeapYear(28);
                      } else {
                        checkMonth();
                      }
                    }
                    setMonth(month);
                  }}
                  wrapperHeight={200}
                  wrapperBackground="#fff"
                  itemHeight={20}
                  highlightBorderWidth={1}
                  type={'month'}
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
                  selectedValue={year ? year : currentYear}
                  onValueChange={year => {
                    if (
                      (year % 4 === 0 && year % 100 !== 0) ||
                      year % 400 === 0
                    ) {
                      if (month === 2) {
                        setIsLeapYear(29);
                      } else {
                        checkMonth();
                      }
                    } else {
                      if (month === 2) {
                        setIsLeapYear(28);
                      } else {
                        checkMonth();
                      }
                    }

                    setYear(year);
                  }}
                  wrapperHeight={200}
                  wrapperBackground="#fff"
                  itemHeight={20}
                  highlightBorderWidth={1}
                  type={'year'}
                />
              </View>
            </View>
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DatePicker;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    width: '60%',
    display: 'flex',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    height: '50%',
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
  input: {
    width: 100,
    height: 40,
    paddingHorizontal: 5,
  },
});
