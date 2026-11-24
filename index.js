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
        //log con google y registro y log con Email y contraseña
        import { getAuth, signInWithPopup, GoogleAuthProvider , 
        signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js';


        const app = initializeApp(firebaseConfig);
        // Get firestore
        const db = getFirestore(app);
        //auth
        const auth = getAuth(app);
        var user=null;
        //BANDERA PARA FORMULARIOS ACTIVOS
        let banderaForms=false;
        //LOGICA DE FORMULARIO GOOGLE
        const provider = new GoogleAuthProvider();
        document.getElementById("contenedor-padre").style.display="none";
        let btnSesion = document.getElementById("btnLogin");
        btnSesion.addEventListener("click",()=>{
            signInWithPopup(auth, provider)
                .then((result) => {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential.accessToken;
                    // The signed-in user info.
                    user = result.user;
                    // IdP data available using getAdditionalUserInfo(result)
                    // ...
                    document.getElementById("formularioDeSesion").style.display="none";

                    document.getElementById("contenedor-padre").style.display="block";
                    cargarNotas(false);
                }).catch((error) => {
                    // Handle Errors here.
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // The email of the user's account used.
                    const email = error.customData.email;
                    // The AuthCredential type that was used.
                    const credential = GoogleAuthProvider.credentialFromError(error);
                    // ...
                    console.error("Código de error:", error.code);
                    console.error("Mensaje:", error.message);
                });
        });
        //LOGICA INISIO DE SESION CON EMAIL AND PASWORD
        document.getElementById("formEmail").style.display="none";
        const btnLog = document.getElementById("btnLog");
        btnLog.addEventListener("click",()=>{
            banderaForms=true;
            if(banderaForms){
                banderaForms=false;
                document.getElementById("formEmail").style.display="block";
            }
            
        })
        const btnLoginEmail = document.getElementById("btnLoginEmail");
        btnLoginEmail.addEventListener("click", () => {
            
                const email = document.getElementById("inputEmail").value.trim();
                const password = document.getElementById("inputPassword").value.trim();
                document.getElementById("inputEmail").value='';
                document.getElementById("inputPassword").value='';
                signInWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                    // El usuario inició sesión correctamente
                    user = userCredential.user;
                    console.log("Usuario conectado:", user.email);
                    document.getElementById("contenedor-padre").style.display = "block";
                    document.getElementById("formularioDeSesion").style.display="none";
                    cargarNotas(false);

                    })
                    .catch((error) => {
                    console.error("Código de error:", error.code);
                    console.error("Mensaje:", error.message);
                    alert("Error al iniciar sesión: " + error.message);
                    });
                    document.getElementById("formEmail").style.display="none";
                    
            });
        //LOGICA REGISTRO CON EMAIL AND PASSWORD
        document.getElementById("formRegister").style.display="none";
        const btnReg = document.getElementById("btnReg");
        btnReg.addEventListener("click",()=>{
            banderaForms=true;
            if(banderaForms){
                banderaForms=false;
                document.getElementById("formRegister").style.display="block";
            }
        }
        );
        const btnRegister = document.getElementById("btnRegister");
        btnRegister.addEventListener("click", () => {
            
            
                const emailReg = document.getElementById("inputEmailRegister").value.trim();
                const passwordReg = document.getElementById("inputPasswordRegister").value.trim();

                createUserWithEmailAndPassword(auth, emailReg, passwordReg)
                    .then((userCredential) => {
                    // Usuario creado e iniciado sesión automáticamente
                    user = userCredential.user;
                    console.log("Usuario registrado:", user.email);
                    document.getElementById("contenedor-padre").style.display = "block";
                    document.getElementById("formularioDeSesion").style.display="none";
                    cargarNotas(false);

                    })
                    .catch((error) => {
                    console.error("Código de error:", error.code);
                    console.error("Mensaje:", error.message);
                    alert("Error al registrarse: " + error.message);
                    });
                    document.getElementById("formRegister").style.display="none"
    
            });
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
    if(user!==null){
        const misDatos = await getDocs(collection(db, "NOTAS-USUARIO-"+user.uid));
        const colores = ["#f2ff00", "#ff7eb9", "#7afcff", "#feff9c", "#98ff98","#4a4645"];
        const coloresTexto = ["#ffffff", "#1a1a1a", "#1d4ed8", "#dc2626"];
        let listaDatos = misDatos.docs;
            
        if(!primeraCarga){
                liPagina.innerHTML = "";
            }
        for(let doc of listaDatos){
            
            let documento = doc.data();
            let posTop=documento.top!==undefined ? documento.top:(Math.floor(Math.random() *400)+ 100);
            let posLeft=documento.left!==undefined ? documento.left:(Math.floor(Math.random()*400) +50);

            let idContenedor = "post-" + doc.id;
            let idTitulo = "titulo-" + doc.id;
            let idContenido = "contenido-"+doc.id;
            liPagina.innerHTML += "<div class=\"contenedorNotas\" id='" + idContenedor + "' style=\"position: absolute;  top:"+posTop+"px; left:"+posLeft+"px;\"> <h2 id='"+idTitulo+"' class=\"postTitulos\">"+ documento.titulo + "</h2><article class=\"postContenido\" ontouchend=\"borraruno(\'"+doc.id+"',event)\" ontouchstart=\"borrar(\'"+ doc.id +"\',event)\" id='"+idContenido+"'>" + documento.contenido + "</article></div>";
        }
        for(let notaDoc of listaDatos){
            let idContenedor = "post-" + notaDoc.id;
            let idTitulo = "titulo-" + notaDoc.id;
            let idContenido = "contenido-"+notaDoc.id;
            let notaCompleta = document.getElementById(idContenedor);
            let tituloNota = document.getElementById(idTitulo);
            let contenidoNota = document.getElementById(idContenido);
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
            /*Guarddamos en base de datos las posiciones de la nota*/
            tituloNota.addEventListener("touchend", async () => {
                let nuevoTop = parseInt(notaCompleta.style.top);
                let nuevoLeft = parseInt(notaCompleta.style.left);

                const referenciaNota = doc(db, "NOTAS-USUARIO-" + user.uid, notaDoc.id);
                await updateDoc(referenciaNota, {
                    top: nuevoTop,
                    left: nuevoLeft
                });
            });
            /*Añadimos opcion de colores*/
            let divColores=document.createElement("div");
            divColores.classList.add("divColores");
            colores.forEach((color) => {
                let circulo = document.createElement("div");
                circulo.classList.add("btnColor");
                circulo.style.backgroundColor = color;

                circulo.addEventListener("click", () => {
                // Cambia el color del título (o de notaCompleta / article si prefieres)
                if(color==="#4a4645"){
                contenidoNota.style.background = `linear-gradient(0.25turn, ${color}, #706c6c, ${color})`;
                }else{contenidoNota.style.background = `linear-gradient(0.25turn, ${color}, #ffff, ${color})`;}
            });
            divColores.appendChild(circulo);
        });
        notaCompleta.appendChild(divColores);

        let divColoresTexto = document.createElement("div");
        divColoresTexto.classList.add("divColoresTexto");

        coloresTexto.forEach((colorTexto) => {
            let circuloTexto = document.createElement("div");
            circuloTexto.classList.add("btnColorTexto");
            circuloTexto.style.backgroundColor = colorTexto;

            circuloTexto.addEventListener("click", () => {
                contenidoNota.style.color = colorTexto;
            });

            divColoresTexto.appendChild(circuloTexto);
        });
        notaCompleta.appendChild(divColoresTexto);
        }
        }else{return;}
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
                await deleteDoc(doc(db,"NOTAS-USUARIO-"+user.uid,id));
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
                let miNota = await getDoc(doc(db,"NOTAS-USUARIO-"+user.uid,idNotaActualizar));
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
        let miNota = await getDoc(doc(db,"NOTAS-USUARIO-"+user.uid,idNotaActualizar));
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
        await updateDoc(doc(db,"NOTAS-USUARIO-"+user.uid,idNotaActualizar),datosActualizados);
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
    await addDoc(collection(db,"NOTAS-USUARIO-"+user.uid), nuevoLibro);
    cargarNotas(false);
  }
  /*LOGICA DE ACTUALIZAR UN POST-IT**
  ***********************************
  ************************************/
  if(user!==null){
   cargarNotas(false);
   }
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