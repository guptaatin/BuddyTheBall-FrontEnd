import React, { useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, StyleSheet, Text, Alert, View, Image, TextInput, ScrollView } from 'react-native';
import { useSelector } from "react-redux";
import LinearGradient from 'react-native-linear-gradient';
import buddy from '../assets/buddy.png';
import { SelectList, MultipleSelectList } from 'react-native-dropdown-select-list';
import { GetSessionsService } from '../services/SessionService';
import { DeleteClassService, UpdateClassService } from '../services/ClassService';

export default function CoachClassDescription({ navigation, route }) {
    const state = useSelector((state) => state);
    const [sessionsList, setSessionsList] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [selectedSessions, setSelectedSessions] = useState(route.params.classData.schedules);
    const schoolsList = state.authPage.auth_data?.assigned_schools.map(v => Object.assign(v, { key: v?._id, value: v?.school_name }));
    const [selectedSchool, setSelectedSchool] = useState();
    const [topic, setTopic] = useState(route.params.classData?.topic);

    useEffect(() => {
        const getCoachSessions = async () => {
            try {
                const data = { coach_id: state.authPage.auth_data?.user_id, regional_manager_id: state.authPage.auth_data?.assigned_by_user_id };
                const result = await GetSessionsService(data);
                if (result) {
                    result.map(v => {
                        if (v?.coaches?.some(element => element._id === state.authPage.auth_data?._id) === true) {
                            Object.assign(v, { key: v._id, value: `${v.date} (${v.start_time} to ${v.end_time})` });
                        }
                    });
                    const filteredArray = result.filter(obj => obj.hasOwnProperty('key'));
                    var newArr = filteredArray.filter(function (objFromA) {
                        return !route.params.classData?.schedules?.find(function (objFromB) {
                            return objFromA._id === objFromB._id;
                        });
                    });
                    setSessionsList(newArr);
                }
            } catch (e) { }
        };
        getCoachSessions();
    }, []);

    const handleUpdateClass = async () => {
        const selectedSessionsId = selectedSessions.map(v => { return v._id; });
        if (selectedSessionsId.concat(sessions).length > 0 && selectedSchool && topic) {
            const data = {
                schedules: selectedSessionsId.concat(sessions),
                school: selectedSchool,
                topic: topic
            };
            try {
                const result = await UpdateClassService(route.params.classData._id, data);
                if (result) {
                    Alert.alert(
                        "Alert",
                        "Class Updated Successfully",
                        [
                            {
                                text: "OK",
                                onPress: () => navigation.navigate("Coach Dashboard")
                            }
                        ]
                    );
                }
            } catch (e) { }
        }
    };

    const handleClassDelete = async () => {
        try {
            Alert.alert(
                "Alert",
                "Do You Want to Delete the Class ?",
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    {
                        text: "OK",
                        onPress: async () => {
                            const data = { id: route.params.classData._id };
                            const result = await DeleteClassService(data);
                            if (result) {
                                Alert.alert(
                                    "Alert",
                                    "Class Deleted Successfully",
                                    [
                                        {
                                            text: "OK",
                                            onPress: () => navigation.navigate("Coach Dashboard")
                                        }
                                    ]
                                );
                            }
                        }
                    }
                ]
            );
        } catch (e) {
            Alert.alert(
                "Alert",
                "Failed! Can't Delete Class!"
            );
        }
    };

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <ScrollView>
                    <Image source={buddy} style={{ width: 200, height: 100, marginLeft: 'auto', marginRight: 'auto' }} />
                    <View>
                        <Text style={styles.label}>Class Name :</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(val) => setTopic(val)}
                            value={topic}
                            placeholder='Class Name'
                        />
                    </View>
                    {!topic &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Class Name is Required</Text>
                    }
                    <Text style={styles.label}>Sessions :</Text>
                    {selectedSessions.map((v, index) => {
                        return (
                            <View key={index}>
                                <Text>{v.date} ({v.start_time} to {v.end_time}) By {v.coaches.map(u => u.coach_name)}</Text>
                                <TouchableOpacity onPress={() => {
                                    v.key = v._id;
                                    v.value = `${v.date} (${v.start_time} to ${v.end_time})`;
                                    var array = [...selectedSessions];
                                    var indexData = array.indexOf(v);
                                    if (indexData !== -1) {
                                        array.splice(indexData, 1);
                                        setSelectedSessions(array);
                                    }
                                    setSessionsList(prevState => [...prevState, v]);
                                }}>
                                    <Text>X</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                    <MultipleSelectList
                        setSelected={(val) => setSessions(val)}
                        data={sessionsList}
                        save="key"
                        label="Selected Sessions"
                    />
                    {selectedSessions.concat(sessions).length === 0 &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Session is Required</Text>
                    }
                    <Text style={styles.label}>School :</Text>
                    <SelectList
                        setSelected={(val) => setSelectedSchool(val)}
                        data={schoolsList}
                        save="key"
                        defaultOption={{ key: route.params.classData?.school?._id, value: route.params.classData?.school?.school_name }}
                    />
                    {!selectedSchool &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Coach is Required</Text>
                    }
                </ScrollView>
                <View style={{ marginTop: 20 }}>
                    <TouchableOpacity onPress={handleUpdateClass}>
                        <Text style={styles.btnWrapper}>Update</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 80 }}>
                    <TouchableOpacity onPress={handleClassDelete}>
                        <Text style={styles.deletebtn}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Coach Classes")}>
                        <Text style={styles.backbtn}>Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}


const styles = StyleSheet.create({
    wrapper: {
        marginTop: 60,
        flex: 1,
        position: 'relative',
        padding: 15
    },
    deletebtn: {
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
        left: 0,
        width: 100,
        justifyContent: 'flex-end',
        bottom: 0,
        marginBottom: 10
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
        justifyContent: 'flex-end',
        bottom: 0,
        marginBottom: 10
    },
    linearGradient: {
        flex: 1,
        borderRadius: 5
    },
    scrollView: {
        marginHorizontal: 5,
    },
    input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 10
    },
    label: {
        fontSize: 16,
        color: '#000',
        paddingTop: 10,
        paddingBottom: 5
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
    }
});