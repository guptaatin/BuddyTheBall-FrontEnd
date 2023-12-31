import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, TextInput, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, View, Pressable } from "react-native";
import { SelectList, MultipleSelectList } from 'react-native-dropdown-select-list';
import { Dropdown } from 'react-native-element-dropdown';
import LinearGradient from 'react-native-linear-gradient';
import buddy from '../assets/buddy.png';
import { CoachUpdateService, DeleteCoachService, GetParticularCoachService } from '../services/CoachService';
import { GetRegionWiseSchools } from '../services/SchoolService';
import { GetAllRegionsService } from '../services/RegionService';

export default function SuperAdminCoachDescription({ navigation, route }) {
    const [coachData, setCoachData] = useState({
        coach_id: "",
        user_id: "",
        email: "",
        password: "",
        coach_name: "",
        assigned_region: "",
        tennis_club: "",
        favorite_pro_player: "",
        handed: "",
        favorite_drill: ""
    });
    const handed_list = ["Left", "Right"];
    const [data, setData] = useState([]);
    const [regions, setRegions] = useState([]);
    const [coachSchools, setCoachSchools] = useState([]);
    const [assignedSchools, setAssignedSchools] = useState([]);
    const [selected, setSelected] = useState([]);
    const [schoolListVisible, setSchoolListVisible] = useState(false);

    useEffect(() => {
        const getParticularCoach = async () => {
            try {
                const result = await GetParticularCoachService(route.params.coach._id);
                if (result) {
                    setCoachData({
                        coach_id: result._id,
                        user_id: result.user_id,
                        email: result.email,
                        password: result.password,
                        coach_name: result.coach_name,
                        assigned_region: result.assigned_region,
                        tennis_club: result.tennis_club,
                        favorite_pro_player: result.favorite_pro_player,
                        handed: result.handed,
                        favorite_drill: result.favorite_drill
                    });
                    setCoachSchools(result.assigned_schools.map(v => v.school_name));
                    setAssignedSchools(result.assigned_schools.map(v => { return { ...v, key: v._id, value: v.school_name }; }));
                    const data = { region: result.assigned_region };
                    const result1 = await GetRegionWiseSchools(data);
                    result1.map(v => Object.assign(v, { key: v._id, value: v.school_name }));
                    var c = result1.filter(function (objFromA) {
                        return assignedSchools.find(function (objFromB) {
                            return objFromA.key === objFromB.key;
                        });
                    });
                    setData(c);
                }
            } catch (e) { }
        };
        getParticularCoach();

        const getRegions = async () => {
            try {
                const result = await GetAllRegionsService();
                if (result) {
                    result.map(v => Object.assign(v, { key: v.region_name, value: v.region_name }));
                    setRegions(result);
                }
            } catch (e) { }
        };
        getRegions();
    }, []);

    const handleCoachUpdate = async () => {
        try {
            if (coachData.email && coachData.password && coachData.coach_name && coachData.assigned_region && coachSchools.concat(selected).length > 0 && coachData.tennis_club && coachData.favorite_pro_player && coachData.handed && coachData.favorite_drill) {
                const data = {
                    email: coachData.email,
                    password: coachData.password,
                    coach_name: coachData.coach_name,
                    assigned_region: coachData.assigned_region,
                    assigned_schools: coachSchools.concat(selected),
                    tennis_club: coachData.tennis_club,
                    favorite_pro_player: coachData.favorite_pro_player,
                    handed: coachData.handed,
                    favorite_drill: coachData.favorite_drill
                };
                const result = await CoachUpdateService(coachData.user_id, coachData.coach_id, data);
                if (result) {
                    Alert.alert(
                        "Alert",
                        "Coach Updated Successfully",
                        [
                            {
                                text: "OK",
                                onPress: () => navigation.navigate("Super Admin Dashboard")
                            }
                        ]
                    );
                }
            }
        } catch (e) {
            Alert.alert(
                "Alert",
                "Failed! Can't Update Coach!"
            );
        }
    };

    const handleCoachDelete = async () => {
        try {
            Alert.alert(
                "Alert",
                "Do You Want to Delete the Coach ?",
                [
                    {
                        text: "YES",
                        onPress: async () => {
                            const data = { id: route.params.coach._id, user_id: coachData.user_id };
                            const result = await DeleteCoachService(data);
                            if (result) {
                                Alert.alert(
                                    "Alert",
                                    "Coach Deleted Successfully",
                                    [
                                        {
                                            text: "OK",
                                            onPress: () => navigation.navigate("Super Admin Dashboard")
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
                "Failed! Can't Update Coach!"
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
                        style={styles.input}
                        onChangeText={(e) => setCoachData({ ...coachData, email: e })}
                        value={coachData.email}
                        autoCapitalize='none'
                    />
                    {!coachData.email &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Email is Required</Text>
                    }
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => setCoachData({ ...coachData, password: e })}
                        value={coachData.password}
                    />
                    {!coachData.password &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Password is Required</Text>
                    }
                    <Text style={styles.label}>Coach Name</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => setCoachData({ ...coachData, coach_name: e })}
                        value={coachData.coach_name}
                    />
                    {!coachData.coach_name &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Coach Name is Required</Text>
                    }
                    <Text style={styles.label}>Assigned Region</Text>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={regions}
                        search
                        maxHeight={300}
                        labelField="value"
                        valueField="key"
                        searchPlaceholder="Search..."
                        value={coachData.assigned_region}
                        onChange={async (val) => {
                            setCoachData({ ...coachData, assigned_region: val.region_name });
                            const data = { region: val.region_name };
                            const result = await GetRegionWiseSchools(data);
                            result.map(v => Object.assign(v, { key: v._id, value: v.school_name }));
                            var c = result.filter(function (objFromA) {
                                return !assignedSchools.find(function (objFromB) {
                                    return objFromA.key === objFromB.key;
                                });
                            });
                            setData(c);
                            setAssignedSchools([]);
                            setCoachSchools([]);
                        }}
                    />
                    {!coachData.assigned_region &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Assigned Region is Required</Text>
                    }
                    <Text style={styles.label}>Assigned Schools</Text>
                    {assignedSchools.length === 0 ?
                        <TouchableOpacity
                            onPress={async () => {
                                setSchoolListVisible(true);
                                const data = { region: coachData.assigned_region };
                                const result = await GetRegionWiseSchools(data);
                                result.map(v => Object.assign(v, { key: v._id, value: v.school_name }));
                                var c = result.filter(function (objFromA) {
                                    return !assignedSchools.find(function (objFromB) {
                                        return objFromA.key === objFromB.key;
                                    });
                                });
                                setData(c);
                            }}>
                            <Text style={styles.plusBtn}>+</Text>
                        </TouchableOpacity>
                        :
                        <>
                            {assignedSchools.length > 0 && assignedSchools.map((item, index) => {
                                return (
                                    <View key={index}>
                                        {item.region === coachData.assigned_region && (
                                            <View key={item.key} style={{
                                                alignItems: 'center',
                                                flexDirection: 'row',
                                                justifyContent: 'space-between'
                                            }}>
                                                <View style={{ flexDirection: 'column' }}>
                                                    <Text>{item.value}</Text>
                                                </View>
                                                <Pressable
                                                    style={[styles.agendaButton, styles.buttonClose]}
                                                    onPress={() => {
                                                        setAssignedSchools(assignedSchools.filter((school) => school.key !== item.key));
                                                        setCoachSchools(coachSchools.filter((school) => school !== item.value));
                                                        setData(prevState => [...prevState, item]);
                                                    }}>
                                                    <Text style={styles.agendaCrossBtn}>X</Text>
                                                </Pressable>
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                        </>
                    }
                    {schoolListVisible && (
                        <MultipleSelectList
                            setSelected={(val) => setSelected(val)}
                            data={data}
                            save="value"
                            label="Selected Schools"
                        />
                    )}
                    {coachSchools.concat(selected).length === 0 &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Assigned Schools is Required</Text>
                    }
                    <Text style={styles.label}>Tennis Club</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => setCoachData({ ...coachData, tennis_club: e })}
                        value={coachData.tennis_club}
                    />
                    {!coachData.tennis_club &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Tennis Club is Required</Text>
                    }
                    <Text style={styles.label}>Favourite Pro Player</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => setCoachData({ ...coachData, favorite_pro_player: e })}
                        value={coachData.favorite_pro_player}
                    />
                    {!coachData.favorite_pro_player &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Favorite Pro Player is Required</Text>
                    }
                    <Text style={styles.label}>Handed</Text>
                    <SelectList
                        setSelected={(val) => setCoachData({ ...coachData, handed: val })}
                        data={handed_list}
                        defaultOption={{ "key": coachData.handed, "value": coachData.handed }}
                        label="Selected Handed"
                    />
                    {!coachData.handed &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Handed is Required</Text>
                    }
                    <Text style={styles.label}>Favourite Drill</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => setCoachData({ ...coachData, favorite_drill: e })}
                        value={coachData.favorite_drill}
                    />
                    {!coachData.favorite_drill &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Favorite Drill is Required</Text>
                    }
                </ScrollView>
                <View style={{ marginTop: 20 }}>
                    <TouchableOpacity onPress={handleCoachUpdate}>
                        <Text style={styles.submit}>Update</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 80 }}>
                    <TouchableOpacity onPress={handleCoachDelete}>
                        <Text style={styles.deletebtn}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Super Admin Coaches")}>
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
        padding: 15,
        justifyContent: 'flex-end'
    },
    scrollView: {
        marginHorizontal: 20,
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
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        margin: 5
    },
    agendaButton: {
        borderRadius: 50,
        elevation: 2,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    agendaCrossBtn: {
        fontSize: 15,
    },
    buttonOpen: {
        backgroundColor: '#2196F3'
    },
    plusButton: {
        borderRadius: 50,
        elevation: 2,
        width: 30,
        height: 30,
        alignItems: 'center'
    },
    textPlus: {
        fontSize: 20,
    },
    buttonClose: {
        backgroundColor: 'red'
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    schoolList: {
        width: 225,
        marginTop: 10,
        marginBottom: 10
    },
    dropdown: {
        margin: 16,
        height: 40,
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
        height: 40
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