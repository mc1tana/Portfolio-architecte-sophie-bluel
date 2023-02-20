let catego;

//filtre de categorie
fetch('http://127.0.0.1:5678/api/categories').then(data=>data.json()).then(jsonlistcategories=>{
for(let jsoncategorie of jsonlistcategories){
     catego= new Work(jsoncategorie);
    document.querySelector('#portfolio ul').innerHTML+= `
                                                            <li data-catid='${catego.id}'>${catego.name}</li>
                                                        `;
}
let liList=document.querySelectorAll("#portfolio ul li");
//afficher par categorie au click
liList.forEach(li => {
    li.addEventListener('click',async function(e){
    document.querySelectorAll('#portfolio li[class="selected"]').forEach(elt => {
        if(elt.classList.contains('selected') && elt!=this){
            elt.classList.remove("selected");
        }  
    });
    this.classList.add('selected')
    
    //prise de donnees(tout les work) aupres de l'api 
   await fetch('http://localhost:5678/api/works').then(data=>data.json()).then(listWork=>{
    //trie des work en fonction de la categorie
        let workCategorie= li.dataset.catid == 0 ? listWork : listWork.filter(work=>work.categoryId==li.dataset.catid);
        if(window.localStorage.getItem.userId==null){
        //insertion des travaux ds la galerry
        document.querySelector('.gallery').innerHTML="";
    workCategorie.forEach(work => {
        
        document.querySelector('.gallery').innerHTML += `<figure>
                                                        <img src="${work.imageUrl}" alt="${work.title}">
                                                          <figcaption>${work.title}</figcaption>
                                                        </figure>`
        
                });  }      
            });
        });
    });
    document.querySelector("li[data-catId='0']").click();
});