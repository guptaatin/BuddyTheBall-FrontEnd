import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { useSelector } from "react-redux";
import { DataTable } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { GetParentsService } from '../services/ParentService';

export default function CoachParents({ navigation }) {
    const state = useSelector((state) => state);
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        try {
            const getCustomers = async () => {
                const result = await GetParentsService();
                if (result) {
                    var parents = [];
                    result.forEach(element => {
                        element.children_data.forEach(u => {
                            u.class.schedules.forEach(w => {
                                w.coaches.forEach(q => {
                                    if (q._id === state.authPage.auth_data?._id) {
                                        parents.push(element)
                                    }
                                })
                            })
                        })
                    });
                    setCustomers([...new Set(parents)])
                }
            };
            getCustomers();
        } catch (e) { }
    }, []);

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <ScrollView horizontal>
                    <View>
                        <DataTable style={styles.container}>
                            <DataTable.Header style={styles.tableHeader}>
                                <DataTable.Title>PARENT</DataTable.Title>
                                <DataTable.Title>CREATED BY</DataTable.Title>
                                <DataTable.Title>EMAIL</DataTable.Title>
                            </DataTable.Header>
                            {customers.map(item => {
                                return (
                                    <TouchableOpacity key={item._id} onPress={() => navigation.navigate("Coach Parent Description", { customerData: item })}>
                                        <DataTable.Row>
                                            <DataTable.Cell>{item.parent_name}</DataTable.Cell>
                                            <DataTable.Cell>{item.created_by_user_id === state.authPage.auth_data?.user_id ? 'You' : item.created_by_user_id === state.authPage.auth_data?.assigned_by_user_id ? item.created_by_name : 'Shopify'}</DataTable.Cell>
                                            <DataTable.Cell>{item.email}</DataTable.Cell>
                                        </DataTable.Row>
                                    </TouchableOpacity>
                                );
                            })}
                        </DataTable>
                    </View>
                </ScrollView>
                <View style={styles.adminbtn}>
                    <TouchableOpacity onPress={() => navigation.navigate("Coach Parent Creation")}>
                        <Text style={styles.coach_cta}>Add New Parent</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Coach Dashboard")}>
                        <Text style={styles.backbtn}>Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    adminbtn: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 0,
        marginBottom: 10,
        width: '100%'
    },
    container: {
        margin: 10,
        borderColor: '#000',
        borderWidth: 1,
        overflow: 'scroll',
        width: 550,
        marginLeft: 'auto',
        marginRight: 'auto',
        fontFamily: 'LemonJuice',
        fontSize: 12,
        backgroundColor: '#fff'
    },
    wrapper: {
        marginTop: 60,
        flex: 1,
        position: 'relative'
    },
    tableHeader: {
        // backgroundColor: '#f3d8c6',
        textAlign: 'center',
        fontFamily: 'LemonJuice',
        // color: '#fff'
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
    },
    coach_cta: {
        borderColor: "#fff",
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#ff8400",
        borderWidth: 3,
        borderRadius: 10,
        textAlign: "center",
        fontWeight: "700",
        display: 'flex',
        width: 150,
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
        width: 150,
    }
});