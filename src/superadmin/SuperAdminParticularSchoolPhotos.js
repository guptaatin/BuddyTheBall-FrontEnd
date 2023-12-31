import React, { useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, ImageBackground } from 'react-native';
import { GetParticularSchoolPhotosService } from '../services/SchoolService';
import galley from '../assets/galley.png';
import profile from '../assets/profile.png';
import LinearGradient from 'react-native-linear-gradient';

export default function SuperAdminParticularSchoolPhotos({ navigation, route }) {
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        const getPhotos = async () => {
            try {
                const result = await GetParticularSchoolPhotosService(route.params.schoolItem._id);
                if (result) {
                    setPhotos(result);
                }
            } catch (e) { }
        };
        getPhotos();
    }, [navigation]);

    return (
        <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
            <SafeAreaView style={styles.wrapper}>
                <ScrollView style={styles.scrollView}>
                    <Text style={styles.label}>{route.params.schoolItem.school_name}</Text>
                    <View style={styles.imgWrap}>
                        {photos.length > 0 && photos.map((item, index) => {
                            return (
                                <TouchableOpacity key={index} onPress={() => navigation.navigate("Super Admin Particular Photo", { photo: item })}>
                                    <ImageBackground key={item?._id} source={{ uri: item?.url }} style={styles.cardBackground}>
                                        <View style={styles.cardContent}>
                                            <View style={styles.carddes}>
                                                <Text style={styles.cardSubtitle}>Class: {item?.class_id?.topic}</Text>
                                                <View style={styles.cardText}>
                                                    <Text style={styles.title}>Session: {item?.schedule_id?.topic}</Text>
                                                    <Text style={styles.cardimg}>
                                                        <Image source={galley} style={{ width: 20, height: 20 }} />
                                                        <Text style={styles.num}>{item?.schedule_id?.status}</Text>
                                                        <Image source={profile} style={{ width: 20, height: 20 }} />
                                                        <Text style={styles.num}>{item?.schedule_id?.created_by_name}</Text>
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </ImageBackground>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>
                <View style={{ marginTop: 20 }}>
                    <TouchableOpacity onPress={() => navigation.navigate("Super Admin Photos")}>
                        <Text style={styles.backbtn}>Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        marginHorizontal: 20,
    },
    label: {
        fontSize: 20,
        color: '#000',
        paddingTop: 10,
        paddingBottom: 10,
        textAlign: 'center',
        // fontFamily: 'LemonJuice'
    },
    imgWrap: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    cta: {
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#ed7d31',
        fontFamily: 'LemonJuice',
        color: '#fff',
        textAlign: 'center',
        fontSize: 20,
        padding: 20
    },
    linearGradient: {
        flex: 1,
    },
    cardimg: {
        display: 'flex'
    },
    imgDes: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    day: {
        color: '#fff',
        // fontFamily: 'LemonJuice'
    },
    title: {
        color: '#fff',
        fontSize: 14,
        // fontFamily: 'LemonJuice'
        fontWeight: '700',
    },
    num: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14
        // fontFamily: 'LemonJuice'
    },
    kidimg: {
        position: 'absolute',
        top: 0,
        left: 15,
        width: '100%'
    },
    cardBackground: {
        height: 300,
        width: 300,
        marginBottom: 10,
        height: 200,
        resizeMode: 'cover',
        marginBottom: 10
    },
    cardContent: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        // borderRadius: 10,
        position: 'relative',
        bottom: 0,
        height: '100%',
    },
    carddes: {
        position: 'absolute',
        bottom: 0,
        padding: 10,
        width: '100%',
    },
    cardSubtitle: {
        color: '#fff',
        fontSize: 14,
        fontStyle: 'italic',
    },
    cardText: {
        color: '#fff',
        fontSize: 14,
        width: '100%',
        lineHeight: 20,
        flex: 1,
    },
    wrapper: {
        flex: 2,
        paddingLeft: 15,
        paddingRight: 15,
        position: 'relative',
        marginBottom: 56,
        marginTop: 60
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
});