window.addEventListener('beforeunload', function (e) { 
    e.preventDefault(); 
    this.localStorage.clear()
    e.returnValue = 'cc'; 
}); 