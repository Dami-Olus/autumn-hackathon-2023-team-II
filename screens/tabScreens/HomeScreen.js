import { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import RecipeList from "../../components/RecipeList";
import { useNavigation } from "@react-navigation/native";
import LoadingDots from "react-native-loading-dots";
import { getUser } from "../../services/user";
import {
  postMeal,
  findMealByEdamamId,
  deleteMealByEdamamId,
} from "../../services/meal";
import { updateGroupMeals } from "../../services/group";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getAuth, signOut } from "firebase/auth";

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const foodItems = [
    "chicken",
    "pasta",
    "salad",
    "sushi",
    "pizza",
    "burger",
    "soup",
    "taco",
    "sandwich",
    "steak",
  ];
  const randomFood = foodItems[Math.floor(Math.random() * foodItems.length)];
  let randomNumber = Math.floor(Math.random() * 20);
  randomNumber = randomNumber < 4 ? 4 : randomNumber;
  const navigation = useNavigation();

  const [selectedRecipes, setSelectedRecipes] = useState([]);

  const [shouldPostMeal, setShouldPostMeal] = useState(false);
  const [shouldDeleteMeal, setShouldDeleteMeal] = useState(false);
  const [saveFormattedMeal, setSaveFormattedMeal] = useState({
    api_id: "",
    uri: "",
    label: "",
    cuisineType: [],
    numberOfIngredients: 0,
    totalTime: 0,
    shareAs: "",
    image: "",
  });
  const [deleteMeal, setDeleteMeal] = useState();

  const iconName = "more-horiz";
  const iconColor = "red";
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserToken = async () => {
      try {
        const token = await AsyncStorage.getItem("@user");
        if (token) {
          const googleInfo = JSON.parse(token);
          setUser(googleInfo);
          const user = await getUser(googleInfo.email);
          setUser(user);
        }
      } catch (error) {
        console.error("Error fetching user token:", error);
      }
    };

    fetchUserToken();
  }, []);

  const auth = getAuth();

  useEffect(() => {
    const edamamAppId = process.env.REACT_APP_EDAMAM_APP_ID;
    const edamamApiKey = process.env.REACT_APP_EDAMAM_API_KEY;
    const edamamApiUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${randomFood}&app_id=${edamamAppId}&app_key=${edamamApiKey}`;
    axios
      .get(edamamApiUrl)
      .then((response) => {
        const recipeData = response.data.hits || [];
        const sliceEnd = randomNumber;
        const sliceStart = randomNumber - 4;
        setRecipes(recipeData.slice(sliceStart, sliceEnd));
        setTimeout(() => setIsLoading(false), 4000);
        // setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (shouldPostMeal) {
      postMeal(saveFormattedMeal);
      handleUpdateGroup(saveFormattedMeal.api_id);
    }
  }, [saveFormattedMeal, shouldPostMeal]);

  useEffect(() => {
    const deleteAndHandleUpdate = async () => {
      if (shouldDeleteMeal) {
        await handleUpdateGroup(deleteMeal);
        await deleteMealByEdamamId(deleteMeal);
      }
    };

    deleteAndHandleUpdate();
  }, [deleteMeal, shouldDeleteMeal]);

  const handleUpdateGroup = async (edamamId) => {
    const token = await AsyncStorage.getItem("@user");
    if (token) {
      const googleInfo = JSON.parse(token);
      const userToken = await getUser(googleInfo.email);
      const personalGroupId = userToken.profile.groups[0]._id;
      const meal = await findMealByEdamamId(edamamId);
      await updateGroupMeals(personalGroupId, meal?._id);
    }
  };

  const handleRecipeSelect = (recipe) => {
    const index = selectedRecipes.findIndex(
      (selectedRecipe) => selectedRecipe.recipe.uri === recipe.recipe.uri
    );
    console.log(index);
    if (index === -1) {
      setSelectedRecipes([...selectedRecipes, recipe]);
      setSaveFormattedMeal((prevSaveFormattedMeal) => {
        return {
          api_id: recipe.recipe.uri ? recipe.recipe.uri.split("_")[1] : "",
          uri: recipe.recipe.uri,
          label: recipe.recipe.label,
          cuisineType: recipe.recipe.cuisineType,
          numberOfIngredients: recipe.recipe.ingredients.length,
          totalTime: recipe.recipe.totalTime,
          shareAs: recipe.recipe.shareAs,
          image: recipe.recipe.image,
        };
      });
      setShouldPostMeal(true);
    } else {
      const newSelectedRecipes = [...selectedRecipes];
      setDeleteMeal((prevDeleteMeal) => {
        return selectedRecipes[index].recipe.uri.split("_")[1];
      });
      newSelectedRecipes.splice(index, 1);
      setSelectedRecipes(newSelectedRecipes);
      setShouldDeleteMeal(true);
    }
  };
  console.log(selectedRecipes);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Image
          source={require("../../assets/meal-logo.png")}
          style={styles.loadingLogo}
        />
        <View style={styles.dotsWrapper}>
          <LoadingDots colors={["#FFF", "#FFF", "#FFF", "#FFF"]} size={10} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <LinearGradient
          colors={["#EAAD37", "rgba(255, 255, 255, 0.00)"]}
          style={styles.gradient}
        >
          <Image
            source={require("../../assets/meal-logo.png")}
            style={styles.logo}
          />
          <Text style={styles.headerText}>
            Welcome! {process.env.REACT_APP_API}
          </Text>
          <RecipeList
            recipes={recipes}
            iconColor={iconColor}
            iconName={iconName}
            onSelect={handleRecipeSelect}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Cravings")}
          >
            <Text style={styles.buttonText}>Let's CollaborEat</Text>
            <Ionicons name="arrow-forward" size={24} color="white" />
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    backgroundColor: "#EAA237",
    height: "100vh",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
    flexDirection: "column",
  },
  loadingLogo: {
    width: 250,
    height: 250,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  gradient: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 15,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    margin: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  logo: {
    width: 250,
    height: 250,
    marginTop: 10,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "rgb(149, 184, 57)",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    paddingHorizontal: 35,
    borderRadius: 10,
    maxWidth: "max-content",
    marginVertical: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    marginRight: 10,
    fontWeight: "600",
  },
});
