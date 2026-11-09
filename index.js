/*INICINIALIZAMOS NUESTRA BASE DE DATOS DE GOOGLE FIRESTORE*/
    /*import { getFirestore ,getDoc,updateDoc,collection, addDoc, getDocs, deleteDoc, doc} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
    import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";
    import { firebaseConfig } from './firebase_config.js';
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    // Get firestore
    // Forzamos la conexión especificando tanto el proyecto como el ID de la base de datos por defecto
    const db = getFirestore(app);  */   
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
        import {  initializeFirestore,getFirestore ,getDoc,updateDoc,collection, addDoc, getDocs, deleteDoc, doc} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
        import { firebaseConfig } from './firebase_config.js';
        const app = initializeApp(firebaseConfig);
        // Get firestore
        const db = getFirestore(app);
    /*MANIPULACION DE DOM EVENTOS LOGIKA*/
    let caja = document.getElementById("add");
    var offsetX, offsetY;
    var btnaddUltimoToque;
    caja.addEventListener("touchstart",(e)=>{
        e.preventDefault();
        console.log("tocas el div");
        caja.style.backgroundColor="yellow";
        /*caja.style.backgroundColor="green";*/
        offsetX=e.touches[0].clientX - caja.offsetLeft;
        offsetY=e.touches[0].clientY - caja.offsetTop;
    });
    let banderaAdd=false;
    caja.addEventListener("touchend",(e)=>{
        e.preventDefault();
        console.log("levantas el dedo");
        caja.style.backgroundColor="rgb(207, 200, 200)";
        let tiempoActual= Date.now();
        if(tiempoActual-btnaddUltimoToque<300){
            if(banderaAdd){
                return;
            }
            else if(!banderaAdd){
                let divNuevo = document.getElementById("divNuevo");
                if(divNuevo){
                    divNuevo.style.display="block";
                }else{console.error("El elemento con ID 'divNuevo' no existe en el HTML.");}
                //logica para añadir un div o crear un div post it
                console.log("hiciste un doble toque");
            }
            banderaAdd=true;
        }
        btnaddUltimoToque=tiempoActual;
    });
    caja.addEventListener("touchmove",(e)=>{
        let toque = e.touches[0];
        
        //console.log("x= "+toque.clientX + " Y= " + toque.clientY);
        caja.style.top=toque.clientY-offsetY+"px";
        caja.style.left=toque.clientX-offsetX+"px";
    });

/*
******************************
**LOGICA PARA AÑADIR POST-IT**
******************************
*/
let liPagina = document.getElementById("contenedores-lista-notas");
//Leer datos
  var ooffsetX, ooffsetY;
  let zIndexActual = 1; 
  async function cargarNotas(primeraCarga){
      const misDatos = await getDocs(collection(db, "notas"));

      let listaDatos = misDatos.docs;
        
      if(!primeraCarga){
            liPagina.innerHTML = "";
        }
       for(let doc of listaDatos){
        let randomTop = Math.floor(Math.random() * 400) + 100;
        let randomLeft = Math.floor(Math.random() * 400) + 50;
        let documento = doc.data();
        let idContenedor = "post-" + doc.id;
        let idTitulo = "titulo-" + doc.id;
        liPagina.innerHTML += "<div class=\"contenedorNotas\" id='" + idContenedor + "' style=\"position: absolute;  top:"+randomTop+"px; left:"+randomLeft+"px;\"> <h2 id='"+idTitulo+"' class=\"postTitulos\">"+ documento.titulo + "</h2><article class=\"postContenido\" ontouchend=\"borraruno(\'"+doc.id+"',event)\" ontouchstart=\"borrar(\'"+ doc.id +"\',event)\">" + documento.contenido + "</article><br>&nbsp;</div>";
      }
      for(let doc of listaDatos){
        let idContenedor = "post-" + doc.id;
        let idTitulo = "titulo-" + doc.id;
        
        let notaCompleta = document.getElementById(idContenedor);
        let tituloNota = document.getElementById(idTitulo);
        tituloNota.addEventListener("touchstart", (e) => {
            e.preventDefault();
            console.log("tocas el título: " + idTitulo);
            zIndexActual++;
            notaCompleta.style.zIndex=zIndexActual;
            ooffsetX = e.touches[0].clientX - notaCompleta.offsetLeft;
            ooffsetY = e.touches[0].clientY - notaCompleta.offsetTop;
        });
        tituloNota.addEventListener("touchmove", (e) => {
            let toque = e.touches[0];
            notaCompleta.style.top = toque.clientY - ooffsetY + "px";
            notaCompleta.style.left = toque.clientX - ooffsetX + "px";
        });
      }
    }
/*******************************************************
 *************** * **************************************
 ****** LOGICA DE SWIPE**********************************
 ***********************************************************
************************************************************/
   var inicioX;
   var idNotaActualizar;
    window.borrar = async function(id,e){
        e.preventDefault();
        idNotaActualizar=id;
        inicioX=e.touches[0].clientX;
        console.log('id a borrar: '+id);
    }
    let banderaActualizar=false;
    var btnaddUltimoToqueActualizar;

    window.borraruno=async function(id,e){
        e.preventDefault();
        let endX=e.changedTouches[0].clientX;
        let diffX = endX - inicioX;
        if(diffX < -50){
            let confirmado =confirm("Estas seguro de eliminar");
            if(confirmado){
                console.log('id a borrar: '+id);
                await deleteDoc(doc(db,"notas",id));
                cargarNotas(false);
            }
        }
        let tiempoActual= Date.now();
        if(tiempoActual-btnaddUltimoToqueActualizar<300){
            if(banderaActualizar){
                return;
            }
            else if(!banderaActualizar){
                let divNuevo = document.getElementById("divActualizar");
                if(divNuevo){
                    divNuevo.style.display="block";
                }else{console.error("El elemento con ID 'divNuevo' no existe en el HTML.");}
                //logica para añadir un div o crear un div post it
                console.log("hiciste un doble toque");
                let divNota = document.getElementById(idNotaActualizar);
                let miNota = await getDoc(doc(db,"notas",idNotaActualizar));
                let datosEnjs = miNota.data();
                document.getElementById("inputTituloActualizar").placeholder=datosEnjs.titulo;
                document.getElementById("inputContenidoActualizar").placeholder=datosEnjs.contenido;
            }
            banderaActualizar=true;
        }
        btnaddUltimoToqueActualizar=tiempoActual;
    }
    let divActualizar = document.getElementById("divActualizar");
    let btnCancelActualizar= document.getElementById("btnCancelActualizar");
    btnCancelActualizar.addEventListener("click",(e)=>{
        divActualizar.style.display="none";
        banderaActualizar=false;
        document.getElementById("inputTituloActualizar").value="";
        document.getElementById("inputContenidoActualizar").value="";
    });
    let btnActualizar= document.getElementById("btnActualizar");
    btnActualizar.addEventListener("click",async(e)=>{
        const tituloNuevo = document.getElementById("inputTituloActualizar").value.trim();
        const contenidoNuevo = document.getElementById("inputContenidoActualizar").value.trim();
        let miNota = await getDoc(doc(db,"notas",idNotaActualizar));
        let datosEnjs = miNota.data();
        let datosActualizados = {
            titulo: datosEnjs.titulo,
            contenido: datosEnjs.contenido,
        };
        if(tituloNuevo!==""){
            datosActualizados.titulo=tituloNuevo;
        }
        if(contenidoNuevo!==""){
            datosActualizados.contenido=contenidoNuevo;
        }
        await updateDoc(doc(db,"notas",idNotaActualizar),datosActualizados);
        divActualizar.style.display="none";
        banderaActualizar=false;
        //insertarLibro();
        document.getElementById("inputTituloActualizar").value="";
        document.getElementById("inputContenidoActualizar").value="";
        cargarNotas(false);
    });
    /* LOGICA PARA AÑADIR UN NUEVO POSTÑIT */
    let btnAlta= document.getElementById("btnAlta");
    btnAlta.addEventListener("click",(e)=>{
        divNuevo.style.display="none";
        banderaAdd=false;
        insertarLibro();
        document.getElementById("inputTitulo").value="";
        document.getElementById("inputContenido").value="";
    });
    let btnCancelAlta= document.getElementById("btnCancelAlta");
    btnCancelAlta.addEventListener("click",(e)=>{
        divNuevo.style.display="none";
        banderaAdd=false;
        document.getElementById("inputTitulo").value="";
        document.getElementById("inputContenido").value="";
    });
    async function insertarLibro(){
    //leer los campos con datos dellibro
    let tituloDesdeInput = document.getElementById("inputTitulo").value;
    let contenidoDesdeInput = document.getElementById("inputContenido").value;


    //Escribir datos en firestore
    let nuevoLibro = {
    titulo: tituloDesdeInput,
    contenido: contenidoDesdeInput,
    
    }
    //Guardar datos
    await addDoc(collection(db,"notas"), nuevoLibro);
    cargarNotas(false);
  }
  /*LOGICA DE ACTUALIZAR UN POST-IT**
  ***********************************
  ************************************/
  
   cargarNotas(false);
   /*cambiar color de titulo opcional*/
   let tituloPost = document.getElementById("tituloPost");
   
   function coloresRandom(){
        let r = Math.floor(Math.random() * 256);
        let g = Math.floor(Math.random() * 256);
        let b = Math.floor(Math.random() * 256);
        tituloPost.style.color= "rgb("+r+","+g+","+b+")";
        //document.body.style.backgroundColor="rgb("+r+","+g+","+b+")";
    }
    setInterval(coloresRandom, 2000);