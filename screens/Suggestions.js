import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RecipeList from "../components/RecipeList";
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import LoadingScreen from "./LoadingScreen";

function Suggestions() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const foodItems = ['chicken', 'pasta', 'salad', 'sushi', 'pizza', 'burger', 'soup', 'taco', 'sandwich', 'steak'];
  const randomFood = foodItems[Math.floor(Math.random() * foodItems.length)];
  let randomNumber = Math.floor(Math.random() * 20);
  randomNumber = randomNumber < 4 ? 4 : randomNumber;
  // const navigation = useNavigation();
  const iconName = 'add-circle'
  const iconColor = ''
  const [selectedRecipes, setSelectedRecipes] = useState([])

  useEffect(() => {
    const edamamApiUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${randomFood}&app_id=41abb1f4&app_key=375f32061b6e7ab61e5b1808f4469c1e`;
    axios.get(edamamApiUrl)
      .then(response => {
        const recipeData = response.data.hits || [];
        const sliceEnd = randomNumber;
        const sliceStart = randomNumber - 4;
        setRecipes(recipeData.slice(sliceStart, sliceEnd));
        console.log(recipeData.slice(sliceStart, sliceEnd))
        
        setTimeout(() =>setIsLoading(false),3000)
      })
      .catch(error => {
        console.error('Error fetching recipes:', error);
        setIsLoading(false);
      });
  }, []);

  const handleRecipeSelect = (recipe) => {
    const index = selectedRecipes.findIndex((selectedRecipe) => selectedRecipe.uri === recipe.uri);
    if (index === -1) {
      setSelectedRecipes([...selectedRecipes, recipe]);
    } else {
      const newSelectedRecipes = [...selectedRecipes];
      newSelectedRecipes.splice(index, 1);
      setSelectedRecipes(newSelectedRecipes);
    }
  }

  console.log(selectedRecipes)

  if (isLoading) {
    return (
    
        <LoadingScreen />
      
    );
  }
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Meal Suggestions</Text>
      <RecipeList recipes={recipes} iconColor={iconColor} iconName={iconName} onSelect={handleRecipeSelect} />
       <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Save</Text>
            <Ionicons name="arrow-forward" size={24} color="white" />
          </TouchableOpacity>
         
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems:'center',
  },
  

  headerText: {
    fontSize: 24,
    margin: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: "center",
  },
  
  button: {
    flexDirection: 'row',
    backgroundColor: 'rgb(149, 184, 57)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    paddingHorizontal: 35,
    borderRadius: 10,
    maxWidth: 'max-content',
    marginVertical: 20,
    textAlign: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    marginRight: 10,
    fontWeight: '600',
  },
});

export default Suggestions;
