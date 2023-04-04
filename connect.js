let spanEditPhoto=`<span class="editBtn editBtnPhoto"> <i class="fa-solid fa-pen-to-square"></i> modifier</span>`
let spanEdit=`<span class="editBtn" onclick='AddModal()'> <i class="fa-solid fa-pen-to-square"></i> modifier</span>`
let modal=`<div class="modal">
                    <i class="fa-solid fa-xmark" onclick="CloseXmark()"></i>
                    <h2>Gallery</h2>
                    <div class="mingallery">    
                    </div>
                    <span class="separation"></span>
                    <button class="btnAjout" onclick="AddModalAjout(event)">Ajouter une photo</button>
                    <p class='supGallery'>Suprimer la galerie</p>  
                    <button onclick="ImgPlus(event)" class="plus"><i class="fa-sharp fa-solid fa-arrow-right"></i></button>
                    <button onclick="ImgMoins(event)" class="moins"><i class="fa-sharp fa-solid fa-arrow-left"></i></button>
            </div>`;
let modalAjout=`<div class="modal">
                        <i class="fa-solid fa-xmark" onclick="CloseXmark()"></i>
                        <i class="fa-solid fa-arrow-left-long" onclick="AddModal()"></i>
                        <h2>Ajout Photo</h2>
                        <form class="formAjout" method="POST" enctype="multipart/form-data" onsubmit='SendWork(event)'>
                            <div>
                                <i class="fa-solid fa-image"></i>
                                <button onclick="BtnAjoutPhoto(event)">+ Ajouter photo</button>
                                <p style="color:black" class="formatImg">jpg, png : 4mo max</p>
                                <img src="" onclick="ImgClick()"/>
                                <input type="file" name="image" id="image" accept=".jpg, .png, .webp" onchange="readFile(this)" />
                               
                            </div>
                            <div>
                                <label for="title">Titre</label>
                                <input type="text" name='title' id="title" onchange="VerifStyleSubmitBtn(event)"/>
                            </div>
                            <div>
                                <label for="category">Catégorie</label>
                                <select name="category" id='category'></select>
                            </div>       
                            
                            <span class="separation"></span>
                            <input type="submit" value="Valider"/>
                        </form>
                </div>`;
    const userId=window.localStorage.getItem('userId');
    const token=window.localStorage.getItem('token');
    const backModal=document.querySelector('.backmodal');
    var workuser;
    let worklist;
    let compt=1;
    let formAj=new FormData();
    
    function ImgPlus(event){
        event.preventDefault()
            compt++;
            fillMinGallery(compt)
    }
    function ImgMoins(event){
        event.preventDefault()
            compt--;
            fillMinGallery(compt)
    }
    function AddModal(){
        //apparition modal
        backModal.style.display='block';
        backModal.innerHTML=''
        backModal.innerHTML+=modal;
       //insertion des travaux ds la mingalerie
       document.querySelector('.mingallery').innerHTML=""

       fillMinGallery(compt)
    }

    function fillGallery(){
        fetch('http://localhost:5678/api/works').then(data=>data.json()).then(listwork=>{
            document.querySelector('.gallery').innerHTML ="";       
            workuser=listwork.filter(work=>work.userId==userId) 
        workuser.forEach(work => {
            document.querySelector('.gallery').innerHTML += `<figure>
                                                                        <img src="${work.imageUrl}" alt="${work.title}">
                                                                        <figcaption>${work.title}</figcaption>
                                                              </figure>`; 
             })
            document.querySelector("li[data-catId='0']").click()

        })
    }
    function ImgSup(work){
        
                   fetch(`http://127.0.0.1:5678/api/works/${work.dataset.workid}`,{
                            method:'DELETE',
                            headers:{'Authorization':`Bearer ${token+" "+`userId:${userId}`}`}
                        }).then(resp=>{
                            if(resp.status==204){
                                fillMinGallery(compt)
                                 fillGallery()
                                 document.querySelector("li[data-catId='0']").click();
                            }
                        })
                    }
                
    function fillMinGallery(){
        fetch('http://localhost:5678/api/works').then(data=>data.json()).then(listwork=>{
            workuser=listwork.filter(work=>work.userId==userId)  
            document.querySelector('.mingallery').innerHTML ="";  
            let maxcompt=(Math.round(workuser.length)/20)+1;
            if(compt>maxcompt){
                compt=1;
            }else if(compt<=0){
                compt=1
            }
        workuser.slice((compt-1)*20,compt*20).forEach(work => {
            document.querySelector('.mingallery').innerHTML += `<figure >
                                                                   <img src="${work.imageUrl}" alt="${work.title}">
                                                                   <figcaption>Editer</figcaption>
                                                                   <div class='dustbin' data-workId=${work.id}  onclick="ImgSup(this)">
                                                                       <i class="fa-solid fa-trash-can" ></i>
                                                                   </div>
                                                                </figure>`; })
        })

    }

   function ImgClick(){             
                    document.querySelector('.formAjout input[type="file"]').click()
   }
   function VerifStyleSubmitBtn(event){
    let valid=true; 
    let inputtitle=document.querySelector('.formAjout input[name="title"]');
    let inputfile=document.querySelector('.formAjout input[name="image"]');
    let select=document.querySelector('.formAjout select');
    if(formAj.length!=0){
        formAj.delete(select.name);
        formAj.delete(inputtitle.name)
        formAj.delete(inputfile.name)
    }
    formAj.append(select.name,select.value);
    formAj.append(inputtitle.name,inputtitle.value)
    formAj.append(inputfile.name,inputfile.value)
    for(let val of formAj){
        console.log(val);
        if(val[1]== null || val[1] == ''){
                valid=false;
        }
    }
    if(valid){
        document.querySelector('.formAjout input[type="submit"]').classList.add('selected');
    }else{
        if(document.querySelector('.formAjout input[type="submit"]').classList.contains('selected')){
        document.querySelector('.formAjout input[type="submit"]').classList.remove('selected');}
        
    }
   }
   //read img when fill input file 
    function readFile(input) {
        VerifStyleSubmitBtn();
        let file = input.files[0];
        let reader = new FileReader();
        document.querySelector('.formAjout button').style.display="none";
        document.querySelector('.fa-image').style.display="none";
        document.querySelector('.formAjout .formatImg').style.display="none";
        reader.readAsDataURL(file);
        reader.onload = function() {
          let img= document.querySelector('.formAjout img');
          img.style.display="block"; 
          img.style.height="inherit"       
            img.src=reader.result

        };
      
        reader.onerror = function() {
          console.log(reader.error);
        };
      
      }
    //   close modal
      function CloseXmark(){
        backModal.style.display='none';          
        backModal.innerHTML=""; 
      }
      function VerifForm(form){
        let valid=true;
        if(document.querySelector('.formAjout .error')!= null){
           document.querySelectorAll('.formAjout .error').forEach(er => {
                    er.remove()
           });
        }
        for(let input of form){
            // valid &= input.reportValidity(); 
             if(input[1]=='' && input[0]=='title'){
                document.querySelector('.formAjout').innerHTML+=`<p class="error">erreur : champ ${input[0]} non rempli</p>`;
                valid=false
             }
             if(input[0]=='image' && input[1]==''){
                document.querySelector('.formAjout').innerHTML+='<p class="error">erreur : fichier manquant</p>';
                valid=false
             }
             if(input[0]=='image' && input[1].size==0){
                document.querySelector('.formAjout').innerHTML+='<p class="error">erreur : fichier manquant</p>';
                valid=false
             }
            if(input[0]=="image" && input[1].size>400000000 ){
                document.querySelector('.formAjout').innerHTML+='<p class="error">erreur : taille du fichier > 4Mo</p>';
                valid=false
            } 
        } 
        return valid
      }
      function BtnAjoutPhoto(event){
            event.preventDefault();
            document.querySelector('.formAjout input[type="file"]').click()
      }
      function NoneModal(event){
        if(event.target==backModal){
            backModal.style.display='none';          
           backModal.innerHTML="";     
        }
      }
      function ReturnMinGallery(){
        AddModal();
        fillMinGallery(compt);
      }
      function AddModalAjout(){
        let userId=window.localStorage.getItem('userId');
        backModal.innerHTML=""; 
        backModal.innerHTML=modalAjout;
        
        fetch('http://127.0.0.1:5678/api/categories').then(data=>data.json()).then(jsonlistcategories=>{
            for(let jsoncategorie of jsonlistcategories){
                 catego= new Work(jsoncategorie);
                document.querySelector('.formAjout select').innerHTML+= `<option value='${catego.id}'>${catego.name}</option>`
            }
      
        })
      }
      async function SendWork(event){
        event.preventDefault();
        let token =window.localStorage.getItem('token')||'';
        let formA=document.querySelector('.formAjout');
        let formAjout = new FormData(formA);
        let valid=VerifForm(formAjout);
        if(valid== true){
            await  fetch(`http://localhost:5678/api/works`,{
            method:'POST',
            headers:{'Authorization':`Bearer ${token+" "+`userId:${userId}`}`,'Accept':'*/*'},
            body:formAjout
         }).then(resp=>{
            if(resp.status==201){
                fillGallery()
                backModal.style.display='none';          
              backModal.innerHTML="";                  
            }
        })
    }

      }
 window.addEventListener('DOMContentLoaded',()=>{
    // prompt edit
    if(token!= null && userId!=null){
        document.querySelector('#introduction figure').innerHTML+=spanEditPhoto;
        document.querySelector('.log').textContent="logout"
        document.querySelector(".edit").innerHTML+=spanEdit;
        fetch('http://localhost:5678/api/works').then(data=>data.json()).then(listwork=>{
        workuser=listwork.filter(work=>work.userId==userId)  
                workuser.forEach(work => {  
                document.querySelector('.gallery').innerHTML = `<figure>
                                                                    <img src="${work.imageUrl}" alt="${work.title}">
                                                                    <figcaption>${work.title}</figcaption>
                                                                </figure>`;
            })
            document.querySelector("li[data-catId='0']").click();
         })
             
//  backModal.addEventListener('click', function(e){
//             e.stopPropagation();
//   })

    
//       //event click modal prompt
//  document.querySelector('.editBtn').addEventListener('click', function(e){ 
//         //apparition modal
//          backModal.style.display='block';
//          document.querySelector(".backmodal").innerHTML+=modal;
//         //insertion des travaux ds la mingalerie
//         document.querySelector('.mingallery').innerHTML=""
//         fillMinGallery()
//                          //supression d'un work
//                          let supressor =document.querySelectorAll('.fa-trash-can')
//                          supressor.forEach(element => {
//                          element.addEventListener('click', (supW)=>{
                        
//                         // console.log(supW.target.dataset.workid)
//                    fetch(`http://127.0.0.1:5678/api/works/${supW.target.dataset.workid}`,{
//                             method:'DELETE',
//                             headers:{'Authorization':`Bearer ${token+" "+`userId:${userId}`}`}
//                         }).then(resp=>{
//                             console.log(resp.status)
//                             if(resp.status==204){
//                                  fillGallery()
//                                  fillMinGallery()
//                                  document.querySelector("li[data-catId='0']").click();
//                             }
//                         })
                       
//                     })
                    
//                  });
             
            
           
           
        // //fermeture modal clique a l'exterieur
        //  backModal.addEventListener('click',(ev)=>{
        //         if(ev.target == backModal){
        //             backModal.style.display='none';          
        //             document.querySelector(".backmodal").innerHTML=""; 
        //        }                                
        //   })
        
        //ajouter photo modal
    //   document.querySelector('.btnAjout').addEventListener('click',()=>{
    //         let userId=window.localStorage.getItem('userId');
    //         document.querySelector(".backmodal").innerHTML=""; 
    //         document.querySelector(".backmodal").innerHTML=modalAjout;
            
    //         fetch('http://127.0.0.1:5678/api/categories').then(data=>data.json()).then(jsonlistcategories=>{
    //             for(let jsoncategorie of jsonlistcategories){
    //                  catego= new Work(jsoncategorie);
    //                 document.querySelector('.formAjout select').innerHTML+= `<option value='${catego.id}'>${catego.name}</option>`
    //             }
    //             // document.querySelector('.formAjout div:nth-child(1)  button').addEventListener('click',(evfich)=>{
    //             //     evfich.preventDefault()
    //             //     document.querySelector('.formAjout input[type="file"]').click()
    //             //       })
    //             BtnAjoutPhoto();
    //         })
       
      
        
             //retour modal 

            // document.querySelector('.fa-arrow-left-long').addEventListener('click',(eRetour)=>{
            //  fillMinGallery()
            // document.querySelector(".backmodal").innerHTML="";          
            // backModal.innerHTML=modal ;
            // })

            // //ajout du work (image) requette vers api 
            // document.querySelector(".formAjout").addEventListener('submit',async (sub)=>{
               
            //     let token =window.localStorage.getItem('token')||'';
            //     let formA=document.querySelector('.formAjout');
            //     let formAjout = new FormData(formA);
            //     let valid=VerifForm(formAjout);
            //     if(valid== true){  await  fetch(`http://localhost:5678/api/works`,{
            //         method:'POST',
            //         headers:{'Authorization':`Bearer ${token+" "+`userId:${userId}`}`,'Accept':'*/*'},
            //         body:formAjout
            //      }).then(resp=>{
            //         if(resp.status==201){
            //             fillGallery()
            //         //     backModal.style.display='none';          
            //         // document.querySelector(".backmodal").innerHTML="";                  
            //         }
            //     })
            // }
             
            // })
        }})
        
 
    
