var formElement = null;
var respuestaSelect = [];
var respuestaText = [];
var respuestaRadio = [];
var nota = 0; //nota de la prueba sobre 10 puntos

var min=10;
var seg=00;
var alerta=false;

//**************************************************************************************************** 
//Después de cargar la página (onload) se definen los eventos sobre los elementos entre otras acciones.
window.onload = function() {

    //CORREGIR al apretar el botón
    formElement = document.getElementById('myform');
    formElement.onsubmit = function() {
        inicializar();
        if (comprobar()){
            if (confirm("¿Quieres corregir el examen?")){
                corregirSelect();
                corregirText();
                corregirRadio();
                presentarNota();
                document.getElementById("cronometro").style.display="none";
                alerta=true;
                window.location.hash = '#notaFinal';
            }     
        }
        return false;
    }

    //LEER XML de xml/preguntas.xml
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            gestionarXml(this);
        }
    };
    xhttp.open("GET", "xml/preguntas.xml", true);
    xhttp.send();
    
    setInterval(actualizarTime,500);
}

//****************************************************************************************************
// Recuperamos los datos del fichero XML xml/preguntas.xml
// xmlDOC es el documento leido XML. 
function gestionarXml(dadesXml) {
    var xmlDoc = dadesXml.responseXML; //Parse XML to xmlDoc  

    //SELECT
    //Recuperamos el título y las opciones, guardamos la respuesta correcta
    for (numPregunta=0; numPregunta<4; numPregunta++) {
        var tituloSelect = xmlDoc.getElementsByTagName("title")[numPregunta].innerHTML;
        var opcionesSelect = [];
        var nopt = xmlDoc.getElementsByTagName("question")[numPregunta].getElementsByTagName('option').length;
        for (i = 0; i < nopt; i++) {
            opcionesSelect[i] = xmlDoc.getElementsByTagName("question")[numPregunta].getElementsByTagName('option')[i].innerHTML;
        }
        ponerDatosSelectHtml(tituloSelect, opcionesSelect, numPregunta);
        respuestaSelect[numPregunta] = parseInt(xmlDoc.getElementsByTagName("question")[numPregunta].getElementsByTagName("answer")[0].innerHTML);
    }
    
    //TEXT
    //Recuperamos el título y la respuesta correcta del input text
    for (numPregunta=4; numPregunta<6; numPregunta++) {
        var tituloInput = xmlDoc.getElementsByTagName("title")[numPregunta].innerHTML;
        ponerDatosInputHtml(tituloInput,numPregunta);
        respuestaText[numPregunta] = xmlDoc.getElementsByTagName("question")[numPregunta].getElementsByTagName("answer")[0].innerHTML;
    }

    //RADIO
    //Recuperamos el título y las opciones, guardamos la respuesta correcta
    for (numPregunta=6 ; numPregunta<10; numPregunta++) {
        var tituloRadio = xmlDoc.getElementsByTagName("title")[numPregunta].innerHTML;
        var opcionesRadio = [];
        var nopt = xmlDoc.getElementsByTagName("question")[numPregunta].getElementsByTagName('option').length;
        for (i = 0; i < nopt; i++) {
            opcionesRadio[i] = xmlDoc.getElementsByTagName("question")[numPregunta].getElementsByTagName('option')[i].innerHTML;
        }
        ponerDatosRadioHtml(tituloRadio, opcionesRadio, numPregunta);
        respuestaRadio[numPregunta] = parseInt(xmlDoc.getElementsByTagName("question")[numPregunta].getElementsByTagName("answer")[0].innerHTML);
    }
}
  
//****************************************************************************************************
// Implementación de la corrección

//Corrección de los Select
function corregirSelect(){
    for(n=0;n<4;n++){
        var sel = formElement.elements[n];  
        if ((sel.selectedIndex-1)==respuestaSelect[n]) {
			darRespuestaHtml("- Pregunta "+(n+1)+": Correcta");
            nota +=1;
        }
        else {
            darRespuestaHtml("- Pregunta "+(n+1)+": Incorrecta");
        }       
    }       
}

//Corrección de los Text
function corregirText() {
    for(n=4;n<6;n++){
        var txt = formElement.elements[n].value;  
        if (txt.toLowerCase()==respuestaText[n]) {
            darRespuestaHtml("- Pregunta "+(n+1)+": Correcta");
            nota +=1;
        }
		else {
            darRespuestaHtml("- Pregunta "+(n+1)+": Incorrecta");
        }
    }
}

//Corrección de los Radio
function corregirRadio(){
    var f=formElement;
    for(n=6;n<8;n++){
        var nombreRadio;
        if (n==6){
            nombreRadio=f.seis;
        } else {
            nombreRadio=f.siete;
        }
        if (nombreRadio.value==respuestaRadio[n]) {
            darRespuestaHtml("- Pregunta "+(n+1)+": Correcta");
            nota +=1;
        }
        else {
            darRespuestaHtml("- Pregunta "+(n+1)+": Incorrecta");
             
        } 
    }        
}

//Corrección de los radio
function corregirRadio(){
    var f=formElement;
    for(n=8;n<10;n++){
        var nombreRadio;
        if (n==8){
            nombreRadio=f.ocho;
        } else {
            nombreRadio=f.nueve;
        }
        if (nombreRadio.value==respuestaRadio[n]) {
            darRespuestaHtml("- Pregunta "+(n+1)+": Correcta");
            nota +=1;
            }
        else {
            darRespuestaHtml("- Pregunta "+(n+1)+": Incorrecta");
             
        } 
    }        
}

//****************************************************************************************************
// Poner los datos recibios en el HTML


function ponerDatosSelectHtml(t, opt, numPregunta) {
    document.getElementsByTagName("h3")[numPregunta].innerHTML = t;
    var select = document.getElementsByTagName("select")[numPregunta];
    for (i = 0; i < opt.length; i++) {
        var option = document.createElement("option");
        option.text = opt[i];
        option.value = i;
        select.options.add(option);
    }
}

function ponerDatosInputHtml(t, numPregunta) {
    document.getElementsByTagName("h3")[numPregunta].innerHTML = t;
}

function ponerDatosRadioHtml(t, opt, numPregunta) {
    document.getElementsByTagName("h3")[numPregunta].innerHTML = t;
    var radioCont = document.getElementsByClassName('radioDiv')[numPregunta-6];
    var radioAsignado;
    if (numPregunta==6){
     radioAsignado="seis";
    }
    else {
     radioAsignado="siete";
    }
    for (i = 0; i < opt.length; i++) { 
        var input = document.createElement("input");
        var label = document.createElement("label");
        label.innerHTML=opt[i];
        input.type="radio";
        input.name=radioAsignado;
        input.value=i;    
        radioCont.appendChild(input);
        radioCont.appendChild(label);
        radioCont.appendChild(document.createElement("br"));
		
    } 
}

//****************************************************************************************************
//Gestionar la presentación de las respuestas
function darRespuestaHtml(r) {
    var p = document.createElement("p");
    var node = document.createTextNode(r);
    p.appendChild(node);
    document.getElementById('resultadosDiv').appendChild(p);
}

function darExplicacion(e) {
    var p = document.createElement("p");
    var node = document.createTextNode(e);
    p.appendChild(node);
    document.getElementById('resultadosDiv').appendChild(p);
}

function presentarNota() {
    document.getElementById('notaFinal').style.display="block";
    document.getElementById("laNota").innerHTML="NOTA: " + nota.toFixed(2) + " puntos sobre 10.";
}

function inicializar() {
    document.getElementById('resultadosDiv').innerHTML = "";
    nota = 0.0;
}

//Comprobar que se han introducido datos en el formulario
function comprobar(){
   var f=formElement;

   // Comprobación del select normal
   for(numPreg=0;numPreg<4;numPreg++){
    if (f.elements[numPreg].selectedIndex==0) {
    f.elements[numPreg].focus();
    alert("Por favor, seleccione una opción en la pregunta "+(numPreg+1));
    return false;
    }
   }
   // Comprobación del text
   for(numPreg=4;numPreg<6;numPreg++){
    if (f.elements[numPreg].value=="") {
    f.elements[numPreg].focus();
    alert("Por favor, responda con un SÍ o un NO en la pregunta "+(numPreg+1));
    return false;
    }
   }
   // Comprobación del radio
   for(numPreg=6;numPreg<8;numPreg++){
       var nombreRadio;
        if (numPreg==6){
            nombreRadio=f.seis;
		
        } else {
            nombreRadio=f.siete;
        }
        if (nombreRadio.value=="") {
            nombreRadio[0].focus();
            alert("Por favor, responda la pregunta "+(numPreg+1));
            return false;
        }   
    }
	// Comprobación del radio
   for(numPreg=8;numPreg<10;numPreg++){
       var nombreRadio;
        if (numPreg==8){
            nombreRadio=f.ocho;
		
        } else {
            nombreRadio=f.nueve;
        }
        if (nombreRadio.value=="") {
            nombreRadio[0].focus();
            alert("Por favor, responda la pregunta "+(numPreg+1));
            return false;
        }   
    }

  return true;
}

//****************************************************************************************************
//Funciones del tiempo

function actualizarTime(){
    var segTimer;

    if((min>=0) && (seg>=0)){   
        if(seg<10){
            segTimer="0"+seg;
        }
		else{
            segTimer=seg;
        }
        document.getElementById("timer").innerHTML=min+" : "+segTimer;
        seg--; 
        if(seg<0){
            min--;
            seg=59;
        }  
    }
	else{
        document.getElementById("timer").innerHTML="0 : 00";        
        if (!alerta){
            alert("TIEMPO FINALIZADO. Tiene medio segundo de gracia para enviar el examen.");
            alerta=true;
		}	
    }
}