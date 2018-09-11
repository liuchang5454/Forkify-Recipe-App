import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import {elements, renderLoader, clearloader} from "./views/base";


/*gloable state of the app
- Obj const state
- Current recipe obj
- Shopping list obj
- Liked recipe
*/

const state = {};
window.state = state;

/*
SEARCH CONTROLLER
*/
const controlSearch = async () => {
    // //1. get query from view
    const query = searchView.getInput();

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


/*
LIST CONTROLLER
*/
const controlList = () => {
    //create a new list if there is none yet
    if(!state.list) state.list = new List();

    //add each ingredient to the list
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

//handle delete and update list item events
elements.shopping.addEventListener("click", e => {
    const id = e.target.closest(".shopping__item").dataset.itemid;

    //handle the delete button
    if(e.target.matches(".shopping__delete, .shopping__delete *")){
        //delete from state
        state.list.deleteItem(id);

        //delete from UI
        listView.deleteItem(id);
    
    //handle count update
    }else if(e.target.matches(".shopping__count-value")){
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});


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
    }else if(e.target.matches(".recipe__btn--add, .recipe__btn--add *")){
        controlList();
    }


});

window.l = new List(); 