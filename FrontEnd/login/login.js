class Work{
    constructor(work){
            work && Object.assign(this,work)
    }

}

document.querySelector('form').addEventListener("submit",function(e){ 
    e.preventDefault()
    let valid="true"
    for(let input of document.querySelectorAll("form input")){
        valid &= input.reportValidity();     
    } 
        let user=new User(document.querySelector('input[name="email"]').value,document.querySelector('input[name="password"]').value)
        fetch('http://localhost:5678/api/users/login',{
                method:"post",
                headers:{'Content-Type':'application/json;charset=utf-8'},
                body:JSON.stringify(user)
        }).then(data=>data.json()).then(resp=>{
        document.querySelector('.formError').innerHTML=""
        if(resp.message=='user not found'){
            document.querySelector('.formError').innerHTML= `<p style="color:red">Cet utilisateur n'hexiste pas</p>`;
        }else if(resp.message=='error password'){
            document.querySelector('.formError').innerHTML= `<p style="color:red">Erreur Mot De Pass</p>` ;
        }else{
            alert("Vous etes connecté");

            window.localStorage.setItem("userId",resp.userId);
            window.localStorage.setItem("token",resp.token);
            location.href = "../index.html";
            // window.location.replace("http://127.0.0.1:5500/Portfolio-architecte-sophie-bluel/FrontEnd/index.html")
        }
       
    })
    
    
  
    
});
