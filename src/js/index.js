import Search from "./models/Search";
import Recipe from "./models/Recipe";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import {elements, renderLoader, clearloader} from "./views/base";


/*gloable state of the app
- Obj const state
- Current recipe obj
- Shopping list obj
- Liked recipe
*/

const state = {};

/*
SEARCH CONTROLLER
*/
const controlSearch = async () => {
    // //1. get query from view
    const query = searchView.getInput();
    console.log(query);

    if(query){
        //2. new search obj and add to state
        state.search = new Search(query);

        //3. prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try{
            //4. search for recipes
            await state.search.getResults();

            //5. render results to UI
            clearloader();
            //console.log(state.search.result);
            searchView.renderResults(state.search.result, 1);
        }catch(err){
            alert("something went wrong with the search...");
            clearloader();
        }
        
    }
}

elements.searchForm.addEventListener("submit", e => {
    e.preventDefault();
    controlSearch();
});


elements.searchResPages.addEventListener("click", e => {
    const btn = e.target.closest(".btn-inline");
    console.log(btn); 
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        //console.log(goToPage);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        //console.log(goToPage);
    }
});

/*
RECIPE CONTROLLER
*/
const controlRecipe = async () => {
    //get id from url
    const id = window.location.hash.replace("#", "");
    console.log(id);

    if(id){
        //prepare ui for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //highlight selected search item
        if(state.search){
            searchView.highlightSelected(id);
        }

        //crate new recipe obj
        state.recipe = new Recipe(id);

        try{
            //get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //calculate serving and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //render recipe
            clearloader();
            recipeView.renderRecipe(state.recipe);
        }catch(err){
            console.log(err);
            alert("Error processing recipe!");
        }
        
    }
};


["hashchange", "load"].forEach(event => window.addEventListener(event, controlRecipe));

//handling recipe button clicks
elements.recipe.addEventListener("click", e => {
    if(e.target.matches(".btn-decrease, .btn-decrease *")){
        //decrease button is clicked
        if(state.recipe.servings > 1){
            state.recipe.updateServings("dec");
            recipeView.updateServingsIngredients(state.recipe);
        }
    }else if(e.target.matches(".btn-increase, .btn-increase *")){
        //increase button is clicked
        state.recipe.updateServings("inc");
        recipeView.updateServingsIngredients(state.recipe);
    }
    console.log(state.recipe);
});