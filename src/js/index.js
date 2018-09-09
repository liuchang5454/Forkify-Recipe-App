import Search from "./models/Search";
import * as searchView from "./views/searchView";
import {elements, renderLoader, clearloader} from "./views/base";


/*gloable state of the app
- Obj const state
- Current recipe obj
- Shopping list obj
- Liked recipe
*/

const state = {};

const controlSearch = async () => {
    //1. get query from view
    const query = searchView.getInput();
    console.log(query);

    if(query){
        //2. new search obj and add to state
        state.search = new Search(query);

        //3. prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        //4. search for recipes
        await state.search.getResults();

        //5. render results to UI
        clearloader();
        //console.log(state.search.result);
        searchView.renderResults(state.search.result, 1);
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
        console.log(goToPage);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        console.log(goToPage);
    }
});
