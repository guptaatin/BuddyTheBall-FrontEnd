import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, TextInput, StyleSheet, Image, Alert, ScrollView, TouchableOpacity, View } from "react-native";
import buddy from '../assets/buddy.png';
import { GetAwardPhotosService, GetParticularCustomerService, UpdateCustomerService } from '../services/CustomerService';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import { GetClassesService } from '../services/ClassService';

export default function SuperAdminCustomerDescription({ navigation, route }) {
    const [classList, setClassList] = useState([])
    const [customerData, setCustomerData] = useState({
        user_id: '',
        email: '',
        password: '',
        parent_name: '',
        created_by: ''
    });
    const [childrenData, setChildrenData] = useState([]);
    const [awardList, setAwardList] = useState([]);

    useEffect(() => {
        try {
            const getAwardsList = async () => {
                const result = await GetAwardPhotosService();
                if (result) {
                    setAwardList(result);
                }
            };
            getAwardsList();

            const getClasses = async () => {
                const result = await GetClassesService();
                if (result) {
                    result.map(v => {
                        v.schedules.map(u => {
                            Object.assign(v, { value: v._id, label: `Class from ${u.date} (${u.start_time} to ${u.end_time}) By ${u.coaches.map(x => x.coach_name)} in ${v.school.school_name}` })
                        })
                    })
                    setClassList(result)
                    const result1 = await GetParticularCustomerService(route.params.customerData._id);
                    if (result1 && result1.children_data.length > 0) {
                        for (let element of result1.children_data) {
                            setTimeout(() => {
                                element.class.schedules.map(u => {
                                    Object.assign(element.class, { value: element.class._id, label: `Class from ${u.date} (${u.start_time} to ${u.end_time}) By ${u.coaches.map(x => x.coach_name)} in ${element.class.school.school_name}` })
                                })
                                setChildrenData(prevState => [...prevState, {
                                    player_name: element.player_name,
                                    calendar_visible: false,
                                    player_age: element.player_age,
                                    wristband_level: element.wristband_level,
                                    class_list: result,
                                    class: element.class,
                                    handed: element.handed,
                                    num_buddy_books_read: element.num_buddy_books_read,
                                    jersey_size: element.jersey_size,
                                    visible: false,
                                    current_award: { name: element.current_award.name, image: element.current_award.image }
                                }]);
                            }, 1000)
                        }
                        setCustomerData({
                            user_id: result1.user_id,
                            email: result1.email,
                            password: result1.password,
                            parent_name: result1.parent_name,
                            created_by: result1.created_by
                        });
                    }
                }
            }
            getClasses()
        } catch (e) { }
    }, []);

    const handleCustomerUpdate = async () => {
        try {
            childrenData.forEach(v => delete v.calendar_visible);
            childrenData.forEach(v => delete v.class_list);
            childrenData.forEach(v => delete v.visible);
            const data = {
                email: customerData.email,
                password: customerData.password,
                parent_name: customerData.parent_name,
                children_data: childrenData
            };
            const result = await UpdateCustomerService(customerData.user_id, route.params.customerData._id, data);
            if (result) {
                Alert.alert(
                    "Alert",
                    "Customer Updated Successfully",
                    [
                        {
                            text: "OK",
                            onPress: () => navigation.navigate("SuperAdmin Customers")
                        }
                    ]
                );
            }
        } catch (e) {
            Alert.alert(
                "Alert",
                "Failed! Can't Update Customer!"
            );
        }
    };

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <ScrollView style={styles.scrollView}>
                    <Image source={buddy} style={{ width: 200, height: 100, marginLeft: 'auto', marginRight: 'auto' }} />
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        name="email"
                        placeholder="Email Address"
                        onChangeText={(value) => setCustomerData({ ...customerData, email: value })}
                        value={customerData.email}
                        style={styles.input}
                    />
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        name="password"
                        placeholder="Password"
                        onChangeText={(value) => setCustomerData({ ...customerData, password: value })}
                        value={customerData.password}
                        style={styles.input}
                    />
                    <Text style={styles.label}>Parent Name</Text>
                    <TextInput
                        name="parent_name"
                        placeholder="Parent Name"
                        onChangeText={(value) => setCustomerData({ ...customerData, parent_name: value })}
                        value={customerData.parent_name}
                        style={styles.input}
                    />
                    <View>
                        <Text style={styles.label}>Child</Text><TouchableOpacity onPress={() => {
                            setChildrenData(prevState => [...prevState, {
                                player_name: '',
                                calendar_visible: false,
                                player_age: '',
                                wristband_level: '',
                                class_list: classList,
                                class: '',
                                handed: '',
                                num_buddy_books_read: '',
                                jersey_size: '',
                                visible: false,
                                current_award: { name: '', image: '' }
                            }]);
                        }}><Text>+</Text></TouchableOpacity>
                    </View>
                    {childrenData.length > 0 && childrenData.map((item, index) => {
                        return (
                            <View key={index}>
                                <Text style={styles.label}>Player Name</Text>
                                <TextInput
                                    name="player_name"
                                    placeholder="Player Name"
                                    onChangeText={(val) => {
                                        let newArr = [...childrenData];
                                        newArr[index].player_name = val;
                                        setChildrenData(newArr);
                                    }}
                                    value={item.player_name}
                                    style={styles.input}
                                />
                                {!item.player_name &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>Player Name is Required</Text>
                                }
                                <Text style={styles.label}>Player Age</Text><Text onPress={() => {
                                    let newArr = [...childrenData];
                                    newArr[index].calendar_visible = !newArr[index].calendar_visible;
                                    setChildrenData(newArr);
                                }}>+</Text>
                                {item.calendar_visible && (
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={new Date()}
                                        mode={'date'}
                                        onChange={(event, selectedDate) => {
                                            var ageDifMs = Date.now() - selectedDate.getTime();
                                            var ageDate = new Date(ageDifMs);
                                            var age = Math.abs(ageDate.getUTCFullYear() - 1970);
                                            let newArr = [...childrenData];
                                            newArr[index].calendar_visible = !newArr[index].calendar_visible;
                                            newArr[index].player_age = age;
                                            setChildrenData(newArr);
                                        }}
                                    />
                                )}
                                <Text>Age: {item.player_age}</Text>
                                {!item.player_age &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>Player Age is Required</Text>
                                }
                                <Text style={styles.label}>WristBand Level</Text>
                                <TextInput
                                    name="wristband_level"
                                    placeholder="WristBand Level"
                                    onChangeText={(val) => {
                                        let newArr = [...childrenData];
                                        newArr[index].wristband_level = val;
                                        setChildrenData(newArr);
                                    }}
                                    value={item.wristband_level}
                                    style={styles.input}
                                />
                                {!item.wristband_level &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>WristBand Level is Required</Text>
                                }
                                <Text style={styles.label}>Class</Text>
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={item.class_list}
                                    search
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    searchPlaceholder="Search..."
                                    value={item.class}
                                    onChange={(val) => {
                                        let newArr = [...childrenData];
                                        newArr[index].class = val;
                                        setChildrenData(newArr);
                                    }}
                                />
                                {!item.class &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>Class is Required</Text>
                                }
                                <Text style={styles.label}>Handed</Text>
                                <TextInput
                                    name="handed"
                                    placeholder="Handed"
                                    onChangeText={(val) => {
                                        let newArr = [...childrenData];
                                        newArr[index].handed = val;
                                        setChildrenData(newArr);
                                    }}
                                    value={item.handed}
                                    style={styles.input}
                                />
                                {!item.handed &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>Handed is Required</Text>
                                }
                                <Text style={styles.label}>Number of Buddy Books Read</Text>
                                <TextInput
                                    name="num_buddy_books_read"
                                    placeholder="Number of Buddy Books Read"
                                    onChangeText={(val) => {
                                        let newArr = [...childrenData];
                                        newArr[index].num_buddy_books_read = val;
                                        setChildrenData(newArr);
                                    }}
                                    value={item.num_buddy_books_read}
                                    style={styles.input}
                                />
                                {!item.num_buddy_books_read &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>Number of Buddy Books Read is Required</Text>
                                }
                                <Text style={styles.label}>Jersey Size</Text>
                                <TextInput
                                    name="jersey_size"
                                    placeholder="Jersey Size"
                                    onChangeText={(val) => {
                                        let newArr = [...childrenData];
                                        newArr[index].jersey_size = val;
                                        setChildrenData(newArr);
                                    }}
                                    value={item.jersey_size}
                                    style={styles.input}
                                />
                                {!item.jersey_size &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>Jersey Size is Required</Text>
                                }
                                <Text style={styles.label}>Current Award</Text>
                                <TouchableOpacity onPress={() => {
                                    let newArr = [...childrenData];
                                    newArr[index].visible = !newArr[index].visible;
                                    setChildrenData(newArr);
                                }}>
                                    <View style={styles.buttonText}>{item.current_award.image ? <Image source={{ uri: item.current_award.image }} style={styles.buttonImage} /> : <Text>Select the Award</Text>}</View>
                                </TouchableOpacity>
                                {item.visible &&
                                    (<View style={styles.award}>
                                        {item.visible && awardList.map(v => {
                                            return (
                                                <ScrollView showsVerticalScrollIndicator>
                                                    <TouchableOpacity key={v.index} onPress={() => {
                                                        let newArr = [...childrenData];
                                                        newArr[index].current_award.name = v.name;
                                                        newArr[index].current_award.image = v.url;
                                                        newArr[index].visible = !newArr[index].visible;
                                                        setChildrenData(newArr);
                                                    }}>
                                                        <Image source={{ uri: v.url }} style={{ height: 100, width: 100 }} />
                                                    </TouchableOpacity>
                                                </ScrollView>
                                            );
                                        })}
                                    </View>
                                    )}
                                {!item.current_award.name &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>Current Award is Required</Text>
                                }
                                <TouchableOpacity
                                    onPress={() => {
                                        var array = [...childrenData];
                                        var indexData = array.indexOf(item);
                                        if (indexData !== -1) {
                                            array.splice(indexData, 1);
                                            setChildrenData(array);
                                        }
                                    }}>
                                    <Text >Remove</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                    <TouchableOpacity onPress={handleCustomerUpdate}>
                        <Text style={styles.submit}>Update</Text>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity onPress={() => navigation.navigate("Regional Manager Customers")}>
                    <Text style={styles.backbtn}>Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 2,
        paddingLeft: 15,
        paddingRight: 15,
        position: 'relative',
        marginBottom: 56,
        marginTop: 60
    },
    submit: {
        borderColor: "#fff",
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#ff8400",
        borderWidth: 3,
        borderRadius: 10,
        textAlign: "center",
        fontWeight: "700",
        marginTop: 5,
        display: 'flex',
        justifyContent: 'flex-end'
    },
    backbtn: {
        borderColor: "#fff",
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#ff8400",
        borderWidth: 3,
        borderRadius: 10,
        textAlign: "center",
        fontWeight: "700",
        marginTop: 5,
        position: 'absolute',
        display: 'flex',
        right: 0,
        width: 100,
        justifyContent: 'flex-end'
    },
    linearGradient: {
        flex: 1,
    },
    input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 10
    },
    label: {
        fontSize: 18,
        color: '#000',
        paddingTop: 10,
        paddingBottom: 0
    },
    buttonText: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 10
    },
    award: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 10
    },
    buttonImage: {
        height: 100,
        width: 100
    },
    dropdown: {
        margin: 16,
        height: 80,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
        height: 100
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});