import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { pages } from "../navUtils";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// The nav bar is used to move between different pages in the app
export const Navbar = (props) => {
    // Is the nav bar attached to the home page
    const isHome = props.isHome || false;
    // Title of the page
    const pageTitle = props.pageTitle || "";
    // Navigation object for the page
    const navigation = props.navigation;

    //console.log('Navbar props: ', Object.keys(props));

    if (isHome) {
        // Navbar in on home page
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Home</Text>
                <TouchableOpacity onPress={
                    () => {
                        navigation.navigate(pages.SELECT_DEVICES_PAGE, {});
                    }
                }
                style={{marginLeft: 15, marginRight: 15}}>
                    <FontAwesomeIcon icon={ faPlus } size={40} />
                </TouchableOpacity>
            </View>
        );
    } else {
        return (
            // Navbar is not on home page
            <View style={styles.container}>
                <TouchableOpacity onPress={() => {
                    navigation.pop();
                }}
                style={{marginLeft: 15, marginRight: 15}}>
                    <FontAwesomeIcon icon={ faArrowLeft } size={40} style={{marginRight: 15}} />
                </TouchableOpacity>
                <Text style={StyleSheet.compose(styles.title, styles.generalTitle)}>{pageTitle}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
    title: {
        flex: 2,
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
        marginLeft: 15,
        marginRight: 15,
    },
    generalTitle: {
        textAlign: 'right',
    },
});

export default { Navbar };
