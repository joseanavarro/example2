var redirectRetries = 0;
window.ISLOGINGRESOLVED = false;
function handleOpenURL(url) {
    setTimeout(function() {
               redirectRetries = 0;
               var i = url.indexOf('walk2view://tour/');
               
               if ( i > -1) {
               var id_tour	= Number( url.substring(i+17) );
               window.sessionStorage.setItem("intentURL","#/visit/" + id_tour + "/recent");
               setTimeout(waitRedirect,0);
               }                }, 0);
    
}

function waitRedirect(){
    if(ISLOGINGRESOLVED){
        window.location.href = window.sessionStorage.getItem("intentURL");
    }
    else
    {
        redirectRetries++;
        if( redirectRetries < 20) {
            setTimeout(waitRedirect,500);
        }
    }
}