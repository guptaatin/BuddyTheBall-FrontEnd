import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, TextInput, StyleSheet, Image, Alert, ScrollView, TouchableOpacity, View } from "react-native";
import { SelectList } from 'react-native-dropdown-select-list';
import { MultiSelect } from 'react-native-element-dropdown';
import buddy from '../assets/buddy.png';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector } from "react-redux";
import { SignUpService } from '../services/UserAuthService';
import LinearGradient from 'react-native-linear-gradient';
import { GetAwardsService } from '../services/ParentService';
import { GetClassesService } from '../services/ClassService';

export default function CoachParentCreation({ navigation }) {
    const state = useSelector((state) => state);
    const [awardList, setAwardList] = useState([]);
    const [parentData, setParentData] = useState({
        email: '',
        password: '',
        parent_name: ''
    });
    const [childrenData, setChildrenData] = useState([]);
    const [classes, setClasses] = useState([]);
    const wristbands = [
        { key: "White", value: "White" },
        { key: "Yellow", value: "Yellow" },
        { key: "Orange", value: "Orange" },
        { key: "Blue", value: "Blue" },
        { key: "Green", value: "Green" },
        { key: "Purple", value: "Purple" },
        { key: "Red", value: "Red" },
        { key: "Black", value: "Black" }
    ];

    useEffect(() => {
        const getAwardsList = async () => {
            try {
                const result = await GetAwardsService();
                if (result) {
                    result.map(v => {
                        Object.assign(v, { key: v._id, value: `${v.award_name} (${v.award_description})` });
                    });
                    setAwardList(result);
                }
            } catch (e) { }
        };
        getAwardsList();

        const getClasses = async () => {
            try {
                const result = await GetClassesService();
                if (result) {
                    result.map(v => {
                        if (v.school.region === state.authPage.auth_data?.assigned_region) {
                            v?.schedules?.map(u => {
                                Object.assign(v, { key: v._id, value: `${v.topic} from ${u.date} (${u.start_time} to ${u.end_time})` });
                            });
                        }
                    });
                    setClasses(result);
                }
            } catch (e) { }
        };
        getClasses();
    }, []);

    const handleAddCustomer = async () => {
        try {
            childrenData.forEach(v => delete v.calendar_visible);
            childrenData.forEach(v => delete v.class_list);
            childrenData.forEach(v => delete v.visible);
            childrenData.forEach(v => delete v.award_list);
            childrenData.forEach(v => delete v.handed_list);
            childrenData.forEach(v => delete v.wristband_level_list);

            function checkKeyValues(array) {
                for (let obj of array) {
                    for (let key in obj) {
                        if (!obj[key]) {
                            return false;
                        }
                    }
                }
                return true;
            }

            if (checkKeyValues(childrenData) && parentData.email !== "" && parentData.password !== "" && parentData.parent_name !== "") {
                const data = {
                    email: parentData.email,
                    password: parentData.password,
                    roles: ['customer'],
                    parent_name: parentData.parent_name,
                    created_by: 'coach',
                    created_by_name: state.authPage.auth_data?.coach_name,
                    created_by_user_id: state.authPage.auth_data?.user_id,
                    coach: state.authPage.auth_data?._id,
                    children_data: childrenData
                };
                const result = await SignUpService(data);
                if (result) {
                    Alert.alert(
                        "Alert",
                        "Parent Added Successfully",
                        [
                            {
                                text: "OK",
                                onPress: () => navigation.navigate("Coach Dashboard")
                            }
                        ]
                    );
                }
            }
        } catch (e) {
            Alert.alert(
                "Alert",
                "Failed! Email is already in use!"
            );
        }
    };

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <ScrollView>
                    <Image source={buddy} style={{ width: 200, height: 100, marginLeft: 'auto', marginRight: 'auto' }} />
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        name="email"
                        placeholder="Email Address"
                        onChangeText={(val) => setParentData({ ...parentData, email: val })}
                        value={parentData.email}
                        style={styles.input}
                        autoCapitalize='none'
                    />
                    {!parentData.email &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Email is Required</Text>
                    }
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        name="password"
                        placeholder="Password"
                        onChangeText={(val) => setParentData({ ...parentData, password: val })}
                        value={parentData.password}
                        style={styles.input}
                    />
                    {!parentData.password &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Password is Required</Text>
                    }
                    <Text style={styles.label}>Parent Name</Text>
                    <TextInput
                        name="parent_name"
                        placeholder="Parent Name"
                        onChangeText={(val) => setParentData({ ...parentData, parent_name: val })}
                        value={parentData.parent_name}
                        style={styles.input}
                    />
                    {!parentData.parent_name &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Parent Name is Required</Text>
                    }
                    <View style={styles.labelBtn}>
                        <Text style={styles.label}>Child</Text>
                        <TouchableOpacity onPress={() => {
                            setChildrenData([...childrenData, {
                                player_name: '',
                                calendar_visible: false,
                                player_age: '',
                                wristband_level_list: wristbands,
                                wristband_level: '',
                                class_list: classes,
                                class: '',
                                handed_list: ["Left", "Right"],
                                handed: '',
                                num_buddy_books_read: '',
                                jersey_size: '',
                                visible: false,
                                award_list: awardList,
                                current_award: ''
                            }]);
                        }}>
                            <Text style={styles.plusBtn}>+</Text>
                        </TouchableOpacity>
                    </View>
                    {childrenData.length > 0 && childrenData.map((item, index) => {
                        { console.log("dwddw--->", item.class_list); }
                        return (
                            <View style={styles.childDiv} key={index}>
                                <Text style={styles.label}>Child Name</Text>
                                <TextInput
                                    name="player_name"
                                    placeholder="Child Name"
                                    onChangeText={(val) => {
                                        let newArr = [...childrenData];
                                        newArr[index].player_name = val;
                                        setChildrenData(newArr);
                                    }}
                                    value={item.player_name}
                                    style={styles.input}
                                />
                                {!item.player_name &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>Child Name is Required</Text>
                                }
                                <View style={styles.labelBtn}>
                                    <Text style={styles.label}>Child Age</Text>
                                    <Text style={styles.plusBtn} onPress={() => {
                                        let newArr = [...childrenData];
                                        newArr[index].calendar_visible = !newArr[index].calendar_visible;
                                        setChildrenData(newArr);
                                    }}>+</Text>
                                </View>
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
                                    <Text style={{ fontSize: 10, color: 'red' }}>Child Age is Required</Text>
                                }
                                <Text style={styles.label}>WristBand Level</Text>
                                <SelectList
                                    setSelected={(val) => {
                                        let newArr = [...childrenData];
                                        newArr[index].wristband_level = val;
                                        setChildrenData(newArr);
                                    }}
                                    data={item?.wristband_level_list?.length > 0 ? item?.wristband_level_list : []}
                                    label="Selected WristBand"
                                />
                                {!item.wristband_level &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>WristBand Level is Required</Text>
                                }
                                <Text style={styles.label}>Class</Text>
                                <SelectList
                                    setSelected={(val) => {
                                        let newArr = [...childrenData];
                                        newArr[index].class = val;
                                        setChildrenData(newArr);
                                    }}
                                    data={item.class_list}
                                    save="key"
                                    label="Selected Class"
                                />
                                {!item.class &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>Class is Required</Text>
                                }
                                <Text style={styles.label}>Handed</Text>
                                <SelectList
                                    setSelected={(val) => {
                                        let newArr = [...childrenData];
                                        newArr[index].handed = val;
                                        setChildrenData(newArr);
                                    }}
                                    data={item?.handed_list?.length > 0 ? item?.handed_list : []}
                                    label="Selected Handed"
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
                                <View style={styles.container}>
                                    <MultiSelect
                                        style={styles.dropdown}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        inputSearchStyle={styles.inputSearchStyle}
                                        iconStyle={styles.iconStyle}
                                        containerStyle={styles.containerStyle}
                                        search
                                        data={item.award_list}
                                        labelField="value"
                                        valueField="key"
                                        placeholder="Select Awards"
                                        searchPlaceholder="Search..."
                                        value={item.current_award}
                                        onChange={item => {
                                            let newArr = [...childrenData];
                                            newArr[index].current_award = item;
                                            setChildrenData(newArr);
                                        }}
                                        selectedStyle={styles.selectedStyle}
                                    />
                                </View>
                                {item.current_award.length === 0 &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>Current Award is Required</Text>
                                }
                                <TouchableOpacity
                                    onPress={() => {
                                        Alert.alert(
                                            "Alert",
                                            "Do You Want to Delete the Child ?",
                                            [
                                                {
                                                    text: 'Cancel',
                                                    onPress: () => console.log('Cancel Pressed'),
                                                    style: 'cancel',
                                                },
                                                {
                                                    text: "OK",
                                                    onPress: () => {
                                                        var array = [...childrenData];
                                                        var indexData = array.indexOf(item);
                                                        if (indexData !== -1) {
                                                            array.splice(indexData, 1);
                                                            setChildrenData(array);
                                                        }
                                                    }
                                                }
                                            ]
                                        );
                                    }}>
                                    <Text style={styles.removebtn}>Remove Child</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </ScrollView>
                <View style={{ marginTop: 20 }}>
                    <TouchableOpacity onPress={handleAddCustomer}>
                        <Text style={styles.btnWrapper}>Submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Coach Parents")}>
                        <Text style={styles.btnWrapper}>Back</Text>
                    </TouchableOpacity>
                </View>
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
        marginBottom: 10,
        marginTop: 60
    },
    labelBtn: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    plusBtn: {
        borderColor: "#fff",
        padding: 3,
        textAlign: "center",
        backgroundColor: "#ff8400",
        borderWidth: 3,
        borderRadius: 50,
        width: 30,
        height: 30
    },
    btnWrapper: {
        borderColor: "#fff",
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: "#ff8400",
        borderWidth: 3,
        borderRadius: 10,
        textAlign: "center",
        fontWeight: "700",
        marginTop: 10
    },
    label: {
        fontSize: 16,
        color: '#000',
        paddingTop: 10,
        paddingBottom: 5
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
    removebtn: {
        borderColor: "#fff",
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#ff8400",
        borderWidth: 3,
        borderRadius: 10,
        textAlign: "center",
        fontWeight: "700",
        marginTop: 10,
        display: 'flex',
        left: 0,
        width: 150,
        bottom: 0,
        marginBottom: 10
    },
    childDiv: {
        borderWidth: 1,
        borderColor: "#000",
        padding: 10,
        borderRadius: 10,
        marginVertical: 10
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
    container: { padding: 16 },
    dropdown: {
        height: 50,
        backgroundColor: 'transparent',
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 14,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    containerStyle: {
        height: 200,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    icon: {
        marginRight: 5,
    },
    selectedStyle: {
        borderRadius: 12,
    },
});
