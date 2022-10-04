import React from "react";
import { SafeAreaView, SectionList, StyleSheet, View, Text } from "react-native";
import uuid from 'react-native-uuid';
import { Navbar } from "./Navbar";

export const Skeleton = (props) => {

    //console.log('Skeleton props: ', props);

    // Get objects to render on page
    const screenStack = props.screenStack || [];

    // Get the navbar from the props
    let navBar = undefined;
    if ('navbar' in props) {
        navBar = props.navBar;
    } else {
        // Does not include a nav bar so make one
        navBar = (<Navbar isHome={props.nav.isHome} pageTitle={props.nav.pageTitle} navigation={props.nav.navigation} />);
    }

    // Build page objects
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.navContainer}>
                {navBar}
            </View>
            <View style={{paddingTop: 10, paddingBottom: 60}}>
                <SectionList 
                    sections={screenStack}
                    keyExtractor={(item, index) => uuid.v4()}
                    renderItem={({item}) => item}
                    renderSectionHeader={({section: {title}}) => (title && <Text style={styles.title}>{title}</Text>)}
                    />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 0,
        backgroundColor: 'lightblue',
    },
    navContainer: {
        backgroundColor: 'white',
        paddingTop: 10,
        paddingBottom: 10,
    },
    item: {
        backgroundColor: 'red',
        padding: 20,
        marginVertical: 8,
    },
    header: {
        fontSize: 32,
        backgroundColor: 'Black',
    },
    title: {
        fontSize: 24,
        color: 'black',
        marginLeft: 5,
    },
});

export default { Skeleton };