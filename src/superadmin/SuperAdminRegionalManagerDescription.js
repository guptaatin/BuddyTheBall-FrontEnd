import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, TextInput, StyleSheet, Image, Alert, ScrollView, View, TouchableOpacity } from "react-native";
import buddy from '../assets/buddy.png';
import LinearGradient from 'react-native-linear-gradient';
import { SelectList } from 'react-native-dropdown-select-list';
import { DeleteRegionalManagerService, GetParticularRegionalManagerService, RegionalManagerUpdateService } from '../services/RegionalManagerService';
import { GetAllRegionsService } from '../services/RegionService';

export default function SuperAdminRegionalManagerDescription({ navigation, route }) {
    const [regionalManagerData, setRegionalManagerData] = useState({
        regional_manager_user_id: "",
        email: "",
        password: "",
        regional_manager_name: "",
        assigned_region: ""
    });
    const [regions, setRegions] = useState([]);

    useEffect(() => {
        const getParticularRegionalManager = async () => {
            try {
                const result = await GetParticularRegionalManagerService(route.params.regional_manager._id);
                if (result) {
                    setRegionalManagerData({
                        regional_manager_user_id: result.user_id,
                        email: result.email,
                        password: result.password,
                        regional_manager_name: result.regional_manager_name,
                        assigned_region: result.assigned_region
                    });
                }
            } catch (e) { }
        };
        getParticularRegionalManager();

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

    const handleUpdateRegionalManager = async () => {
        try {
            if (regionalManagerData.email && regionalManagerData.password && regionalManagerData.regional_manager_name && regionalManagerData.assigned_region) {
                const data = {
                    email: regionalManagerData.email,
                    password: regionalManagerData.password,
                    regional_manager_name: regionalManagerData.regional_manager_name,
                    assigned_region: regionalManagerData.assigned_region
                };
                const result = await RegionalManagerUpdateService(regionalManagerData.regional_manager_user_id, route.params.regional_manager._id, data);
                if (result) {
                    Alert.alert(
                        "Alert",
                        "Regional Manager Updated Successfully",
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
                "Failed! Can't update Regional Manager!"
            );
        }
    };

    const handleRegionalManagerDelete = async () => {
        try {
            Alert.alert(
                "Alert",
                "Do You Want to Delete the RegionalManager ?",
                [
                    {
                        text: "YES",
                        onPress: async () => {
                            const data = { id: route.params.regional_manager._id, user_id: regionalManagerData.regional_manager_user_id }
                            const result = await DeleteRegionalManagerService(data)
                            if (result) {
                                Alert.alert(
                                    "Alert",
                                    "Regional Manager Deleted Successfully",
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
                "Failed! Can't Delete Customer!"
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
                        onChangeText={(e) => setRegionalManagerData({ ...regionalManagerData, email: e })}
                        value={regionalManagerData.email}
                        autoCapitalize='none'
                    />
                    {!regionalManagerData.email &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Email is Required</Text>
                    }
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => setRegionalManagerData({ ...regionalManagerData, password: e })}
                        value={regionalManagerData.password}
                    />
                    {!regionalManagerData.password &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Password is Required</Text>
                    }
                    <Text style={styles.label}>Regional Manager Name</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => setRegionalManagerData({ ...regionalManagerData, regional_manager_name: e })}
                        value={regionalManagerData.regional_manager_name}
                    />
                    {!regionalManagerData.regional_manager_name &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Regional Manager Name is Required</Text>
                    }
                    <Text style={styles.label}>Assigned Region</Text>
                    <SelectList
                        setSelected={(val) => setRegionalManagerData({ ...regionalManagerData, assigned_region: val })}
                        data={regions}
                        save="key"
                        defaultOption={{ key: regionalManagerData.assigned_region, value: regionalManagerData.assigned_region }}
                    />
                    {!regionalManagerData.assigned_region &&
                        <Text style={{ fontSize: 10, color: 'red' }}>Region is Required</Text>
                    }
                </ScrollView>
                <View style={{ marginTop: 20 }}>
                    <TouchableOpacity onPress={handleUpdateRegionalManager}>
                        <Text style={styles.btnWrapper}>Update</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 80 }}>
                    <TouchableOpacity onPress={handleRegionalManagerDelete}>
                        <Text style={styles.deletebtn}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Super Admin Regional Manager")}>
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
    },
});
