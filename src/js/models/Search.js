import axios from "axios";

export default class Search{
    constructor(query){
        this.query = query;
    }
    async getResults() {
        //gmail key
        //const key = "f0c2b0134d9bee5b78aed919982d0c86";
        //163 key
        const key = "1aec72f3fb543b9f591155567b0266b0";
        try{
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
            //console.log(this.result);
        }catch(error){
            alert(error);
        }
    }
    
}
