const reu = document.getElementById('reu');
const formaAct = document.getElementById('childpid');
var cosname;

//Funcion que se encarga de configurar el menu al momento de que el usuario inicia sesion o cierra la sesion.
auth.onAuthStateChanged((user) => {
  if (user) {
    //console.log('Usuario entró');
    configuraMenu(user);
    var name, email;

    name = user.displayName;
    email = user.email;
  } else {
    //console.log('Usuario salió');
    configuraMenu();
  }
});

//Funcion que permite al usuario registrarse con su correo y contraseña
const formaregistrate = document.getElementById('formaregistrate');
formaregistrate.addEventListener('submit', (e) => {
  e.preventDefault();

  //Llama los valores ingresador en las casillas de corre y contraseñá
  const correos = formaregistrate['rcorreo'].value;
  const contrasena = formaregistrate['rcontrasena'].value;

  //Crea el usuario, con las respectivas credenciales que otorgo anteriormente.
  auth
    .createUserWithEmailAndPassword(correos, contrasena)
    .then((cred) => {
      return db.collection('usuarios').doc(cred.user.uid).set({
        nombre: formaregistrate['rnombres'].value,
        correo: formaregistrate['r2correo'].value,
      });
    })
    .then(() => {
      //Oculta el modal del registro.
      $('#registratemodal').modal('hide');
      formaregistrate.reset();
      formaregistrate.querySelector('.error').innerHTML = '';
    })
    .catch((err) => {
      //Manda un error en caso de que tenga alguno.
      formaregistrate.querySelector('.error').innerHTML = mensajeError(
        err.code
      );
    });
});

//Funcion que realiza el cierre de sesion
const salir = document.getElementById('salir');
salir.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    alert('El usuario ha salido del sistema');
  });
});

//Funcion que almacena las cadenas a mostrar se el usuario se equivoca en sus credenciales
//al momento de intentar iniciar sesion.
function mensajeError(codigo) {
  let mensaje = '';

  switch (codigo) {
    //Caso de contraseñá erronea.
    case 'auth/wrong-password':
      mensaje = 'Su contraseña no es correcta';
      break;
    //Caso de usuario no encontrado.
    case 'auth/user-not-found':
      mensaje = 'El usuario no existe o el correo no esta registrado';
      break;
    //Caso de contraseñá debil.
    case 'auth/weak-password':
      mensaje = 'Contraseña débil debe tener al menos 6 caracteres';
      break;
    default:
      //Caso default al ingresar.
      mensaje = 'Ocurrió un error al ingresar con este usuario';
  }
  //Envia el error.
  return mensaje;
}

//Funcion para el inicio de sesion con sus respectivas credenciales.
const formaingresar = document.getElementById('formaingresar');
const namaewasss = document.getElementById('namaewa');
//Funcion que da inicio a que el usuario pueda iniciar sesion.
formaingresar.addEventListener('submit', (e) => {
  e.preventDefault();

  //Manda llamar los valores que se ingresaron en las casillas de texto.
  let correo = formaingresar['correo'].value;
  let contrasena = formaingresar['contrasena'].value;

  //Permite iniciar sesion comparando las credenciasles escritas
  //con las existentes de firebase.
  auth
    .signInWithEmailAndPassword(correo, contrasena)
    .then((cred) => {
      //Oculta el modal del inicio de sesion.
      $('#ingresarmodal').modal('hide');
      formaingresar.reset();
      formaingresar.querySelector('.error').innerHTML = '';
      namaewasss.innerHTML = '';
    })
    .catch((err) => {
      //Manda un error en caso de que tenga alguno.
      formaingresar.querySelector('.error').innerHTML = mensajeError(err.code);
      console.log(err);
    });
});

//Funcion que permite iniciar sesion con una cuenta de google
entrarGoogle = () => {
  var provider = new firebase.auth.GoogleAuthProvider();

  //Abre una ventana emergente para acceder con las credenciales de google.
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function (result) {
      //Variables que se obtienen al iniciar sesion.
      var token = result.credential.accessToken;
      var user = result.user;

      //Guarda la informacion obtenida del usuario.
      const html = `
                <p>Nombre: ${user.displayName}</p>
                <p>Correo: ${user.email}</p>
                <img src="${user.photoURL}" width="50px">
            `;

      //Manda la informacion obtenida al modal de Mis Reuniones.
      datosdelacuenta.innerHTML = html;

      //Oculta el modal del inicio de sesion con google.
      $('#ingresarmodal').modal('hide');
      formaingresar.reset();
      formaingresar.querySelector('.error').innerHTML = '';
    })
    .catch(function (error) {
      //Manda un error en caso de que tenga alguno.
      console.log(error);
    });
};

//Manda llamar la forma del modal para agregar una nueva reunion.
const formaAdd = document.getElementById('formaAdd');
//Manda llamar el modal para agregar una reunion.
const addReunionModalLabel = document.getElementById('addReunionModalLabel');
//Manda llamar el id del boton que permite agregar una nueva reunion.
var buttonAppearAdd = document.getElementById('buttonAppearAdd');

//Funcion que permite agregar una nueva reunion.
formaAdd.addEventListener('submit', (e) => {
  e.preventDefault();

  //Manda llamar al usuario que esta actualmente logeado.
  var user = firebase.auth().currentUser;
  //Manda llamar el email de una casilla de texto, y lo transforma en una cadena de texto.
  //Para despues insertarlo en firebase.
  var emails1 = document.getElementById('raccount');
  var emails2 = emails1.outerHTML;
  var emails3 = emails2.substring('17');
  var emails4 = emails3.substring('26', emails3.indexOf(','));
  var emailinfo = document.getElementById('viewemail');
  emailinfo.innerHTML = emails4;

  console.log('emails1: ' + emails3);
  console.log('emails2: ' + emails4);
  console.log('emails3: ' + emails4);

  //Manda llamar la latitud de una casilla de texto, y lo transforma en una cadena de texto.
  //Para despues insertarlo en firebase.
  var lat1 = document.getElementById('latitude_view');
  var lat2 = lat1.outerHTML;
  var lat3 = lat2.substring('25');
  var lat4 = lat3.substring('10', lat3.indexOf('|'));
  var lat5 = lat4.toString();

  //console.log("Latitud3: " + lat3);
  //console.log("Latitud4: " + lat4);
  //console.log("Latitud5: " + lat5);

  //Manda llamar la longitud de una casilla de texto, y lo transforma en una cadena de texto.
  //Para despues insertarlo en firebase.
  var long1 = document.getElementById('longitude_view');
  var long2 = long1.outerHTML;
  var long3 = long2.substring('26');
  var long4 = long3.substring('11', long3.indexOf('|'));
  var long5 = long4.toString();

  //console.log("Longitud4: " + long3);
  //console.log("Longitud4: " + long4);
  //console.log("Longitud5: " + long5);

  //Esta funcion crea aleatoriamente una cadena de numeros y letras
  //con un largo de caracteres, para la creacion del codigo de la reunion
  //que se creara.
  var length = 5;
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  //Funcion que hace la insercion a firebase, usando los valores previamente mencionados.
  addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('reuniones').add({
      nombre: formaAdd['rnombre'].value,
      descripcion: formaAdd['rdescripcion'].value,
      email: emails4,
      latitud: lat5,
      longitud: long5,
      codigo: result,
    });

    //Permite que la forma modal se cierre automaticamente
    //al mostrar una alerta.
    alert('Reunion creada con exito');
    $('#addreunionmodal').modal('hide');
    formaAdd.reset();
    formaAdd.querySelector('.error').innerHTML = '';

    //Vacia el modal de la reunion, la forma del modal y el boton.
    addReunionModalLabel.innerHTML = '';
    formaAct.innerHTML = '';
    buttonAppearAdd.innerHTML = '';
    //Vuelve a configurar el menu.
    configuraMenu(user);
    refreshPage();
  });
});

///Manda llamar unas casillas de texto creadas en el moadal de agregar reunion.
const lati = document.getElementById('latitude_view');
const lngu = document.getElementById('longitude_view');

//Permite iniciar el autocompletado de google places en el modal de Agregar Reunion.
function autocomplete() {
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById('inputPlaces'),
    {
      componentRestrictions: {
        country: ['mx'],
      },
      fields: ['geometry', 'name'],
      types: ['establishment'],
    }
  );
}

const btnValidate = document.getElementById('smitadd');
const inputPlacess = document.getElementById('inputPlaces');
//Permite iniciar el mapa en el modal de Agregar Reunion.
function GetLatlong() {
  if (inputPlacess != '') {
    var place = autocomplete.getPlace();
    //console.log(place.name);
    var latlong = place.geometry.location;
    let ltln = latlong.toString();
    let ltln1 = ltln.substring(1);
    let ltln2 = ltln1.substring(0, ltln1.length - 1);
    let ltln3 = ltln2.substring(0, ltln2.indexOf(','));
    let ltln4 = ltln2.substring(ltln2.indexOf(',') + 2);
    var latiFinal = ltln3.toString();
    var longiFinal = ltln4.toString();
    //console.log("LatitLongit " + ltln2)
    console.log('Lati ' + latiFinal);
    console.log('Longit ' + longiFinal);
    lati.innerHTML = latiFinal;
    lngu.innerHTML = longiFinal;

    //Agrega un nuevo mapa con un valor de centrado y un zoom.
    var map = new google.maps.Map(document.getElementById('mapCanvas'), {
      center: {
        lat: 21.152639,
        lng: -101.711598,
      },
      zoom: 13,
    });

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
      btnValidate.hidden = false;
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
      btnValidate.hidden = false;
    }
    var marker = new google.maps.Marker({
      position: place.geometry.location,
      map: map,
      draggable: true,
    });
  } else {
    console.log('Favor de agregar el punto de reunion');
  }
}

//Llama la forma del modal de Borrar Reunion
const formaDrop = document.getElementById('formaDrop');
//Llama el codigo de la reunion actual
var codigos = document.getElementById('reu');

//Funcion de la forma que permite borrar una reunion.
formaDrop.addEventListener('submit', (e) => {
  e.preventDefault();

  //Llama al usuario autenticado.
  var user = firebase.auth().currentUser;
  //Manda llamar el codigo de la reunion de la casilla de texto y lo convierte en una cadena.
  var codigos1 = codigos.outerHTML;
  var codigos2 = codigos1.substring('15');
  var codigos3 = codigos2.substring('0', codigos2.indexOf('<'));

  //Se crean variables para guardar el email en estas.
  var em1, em2, em3;
  //Se crea un arreglo para guarda la informacion del correo.
  arreglo = [];
  //Se crea un prompt para que el usuario confirme que quiere borrar la reunion.
  var confir = prompt(
    'Seguro que quieres borrar esta reunion: Escribe SI en caso de querer borrarla'
  );
  //S compara el valor obtenido del prompt para validar si el usuario quiere borrar la reunion.
  if (confir == 'SI' || confir == 'si' || confir == 'Si' || confir == 'sI') {
    //Se obtiene la informacion de firebase.
    db.collection('reuniones')
      .get()
      .then((doc) => {
        doc.docs.forEach((doc) => {
          //Se compara que el codigo que ingreso el usuario si exista en firebase.
          if (doc.data().codigo == codigos3) {
            data = {
              email: doc.data().email,
            };
            //Se inserta la informacion en el arreglo.
            arreglo.push(data);
            //Manda llamar el email guardado en el arreglo y lo convierte en una cadena.
            em1 = JSON.stringify(arreglo);
            em2 = em1.substring('11');
            em3 = em2.substring('0', em2.indexOf('"'));
          }
        });

        //Se compara que el usuario que quiere borrar la reunion
        //Sea el usuario que la creo
        if (user.email == em3) {
          //Se revisa que el codigo no sea nulo.
          if (codigo != null) {
            //Se crea una funcion que busque el codigo que se va a borrar en firebase
            //comparandolo con el que el usuario uso.
            var dele = db
              .collection('reuniones')
              .where('codigo', '==', codigos3);

            //Se revisa que el codigo sea diferente de la variable.
            if (codigo != dele) {
              dele.get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                  //Se borra el codigo de firebase.
                  doc.ref.delete();
                });
              });

              //Oculta el modal del Borrar Reunion.
              $('#dropreunionmodal').modal('hide');
              formaDrop.reset();
              formaDrop.querySelector('.error').innerHTML = '';
              alert('Reunion eliminada con exito');
              $('#modifreunionmodal').modal('hide');
              formaDrop.reset();
              formaDrop.querySelector('.error').innerHTML = '';
              buttonAppear.innerHTML = '';
              buttonAppeared.innerHTML = '';
              formaAct.innerHTML = '';
              configuraMenu(user);
            } else {
              //En caso de que el codigo no sea diferente.
            }
          } else {
            //En caso de que el codigo no sea diferente que nulo.
          }
        } else {
          //En caso de no ser el que creo la reunion.
          alert(
            'Tienes que ser el creador de esta reunion para poder eliminarla'
          );
        }
      });
  } else {
    //En caso de no aceptar borrar la reunion.
    alert('Intenta borrarla cuando estes seguro de querer hacerlo.');
  }
});

//Se mandan llamar todos los id de la forma de Entrar Reunino
const formaEnter = document.getElementById('formaEnter');
const latit = document.getElementById('lati');
const longit = document.getElementById('longi');
var mapita = document.getElementById('map');
var codigo = document.getElementById('codigo');
var buttonAppear = document.getElementById('buttonAppear');
var buttonAppeared = document.getElementById('buttonAppeared');
var codigosi = document.getElementById('reu');
const namaewass = document.getElementById('namaewa');
//Funcion de la forma Entrar Reunion
formaEnter.addEventListener('submit', (e) => {
  e.preventDefault();

  //Se llama el mapa para despues meterle los marcadores.
  var mapa = document.getElementById('map');

  //Se crean arreglos para guardar la informacion.
  arregloss = [];
  array1 = [];
  array2 = [];
  arrayemail = [];
  arregloname = [];
  arraymaili = [];
  arreglodescricion = [];
  //Variables que guardaran el correo.
  var ema, ema2, ema3;
  //variable que guardara el nombre de la reunion.
  var namae;
  //Variables que guardan el codigo de la reunion.
  var codigos1 = codigosi.outerHTML;
  var codigos2 = codigos1.substring('15');
  var codigos3 = codigos2.substring('0', codigos2.indexOf('<'));

  //Variable que guardan el nombre del creador de la reunion.
  var namaewa1 = namaewass.innerHTML;

  //Se accede a la informacion de firebase.
  db.collection('reuniones')
    .get()
    .then((doc) => {
      doc.docs.forEach((doc) => {
        //Se compara que el codigo dado por el usuario sea el mismo que obtenido por firebase.
        if (doc.data().codigo == codigos3) {
          datas = {
            //Se almacena el email obtenido de firebase.
            email: doc.data().email,
          };
          //Se añaden los valores obtenidos al arreglo.
          arregloss.push(datas);
          //Se convierten en cadena.
          ema = JSON.stringify(arregloss);
          ema2 = ema.substring('11');
          ema3 = ema2.substring('0', ema2.indexOf('"'));
        }
      });
    });

  const modalreuni = document.getElementById('modalreuni');
  const modaldrop = document.getElementById('modaldrop');
  const modalexit = document.getElementById('modalexit');
  const modaladd = document.getElementById('modaladd');

  const moddescripcion = document.getElementById('moddescripcion');
  const modnombre = document.getElementById('modnombre');
  const nameReu = document.getElementById('nameReu');
  const emailReu = document.getElementById('emailReu');
  const codeReu = document.getElementById('codeReu');
  const reunameReu = document.getElementById('reunameReu');
  const descripcionReu = document.getElementById('descripcionReu');
  //Se obtiene el codgio de la forma de Entrar reunion
  var codigos = formaEnter['codigo'].value;
  //Se compara que el codigo no sea nulo.
  if (codigo != null) {
    //Se compara que el codigo alamcenado en firebase sea igual al que el usuario accedio.
    var code = db.collection('reuniones').where('codigo', '==', codigos);
    //Se compara que el codigo se diferente del valor de firebase.
    if (codigos != code) {
      code.get().then(function (querySnapshot) {
        //Se obtiene la informacion y se guarda en 3 variables diferentes.
        querySnapshot.forEach(function (doc) {
          data1 = {
            latitud: doc.data().latitud,
          };
          data2 = {
            longitud: doc.data().longitud,
          };
          data3 = {
            email: doc.data().email,
          };
          datas4 = {
            nombre: doc.data().nombre,
          };
          datas5 = {
            descripcion: doc.data().descripcion,
          };
        });
        //Se agrega la informacion obtenida a los arreglos
        array1.push(data1);
        array2.push(data2);
        arrayemail.push(data3);
        arregloname.push(datas4);
        arreglodescricion.push(datas5);

        //Se transforman las variables de longitud a Float para poder mandarlas a un marcador.
        var array3 = parseFloat(array1[0].latitud);
        var array4 = parseFloat(array2[0].longitud);

        //Se guarda el correo.
        arraymaili = arrayemail[0].correo;
        arrayname = arregloname[0].nombre;
        arraydescrip = arreglodescricion[0].descripcion;

        //console.log("nombre: " + arrayname);
        //console.log("email: " + arraymaili);
        //console.log("descripcion: " + arraydescrip);
        //console.log("lati: " + array3);
        //console.log("longi: " + array4);

        reunameReu.innerHTML = arrayname;
        descripcionReu.innerHTML = arraydescrip;
        moddescripcion.innerHTML = arraydescrip;

        //Se limpia el mapa para poner el nuevo.
        mapa.innerHTML = '';

        //Se crean las propiedades del mapa.
        var propiedades = {
          center: {
            lat: 21.152639,
            lng: -101.711598,
          },
          zoom: 13,
        };

        //Se crea el nuevo mapa con las propiedades.
        var map = new google.maps.Map(mapa, propiedades);

        //Se crea el icono a usar.
        var icono1 = {
          url: './img/markerr.png',
          scaledSize: new google.maps.Size(25, 25),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(0, 0),
        };

        informaciones = new google.maps.InfoWindow();

        //Se crea un marcador.
        var markers = new google.maps.Marker({
          position: {
            lat: array3,
            lng: array4,
          },
          icon: icono1,
          map: map,
        });
        var pos = {
          lat: array3,
          lng: array4,
        };

        informaciones.setPosition(pos);
        informaciones.setContent(arregloname[0].nombre);
        console.log(arregloname[0].nombre);
        informaciones.open(map);
        //Se agrega el marcador.
        markers.setPosition(new google.maps.LatLng(array3, array4));

        //Se crea el icono a usar.
        var icono = {
          url: './img/stick.png',
          scaledSize: new google.maps.Size(25, 25),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(0, 0),
        };

        //Se crea un marcador.
        var markerYou = new google.maps.Marker({
          position: {
            lat: 0,
            lng: 0,
          },
          icon: icono,
          map: map,
        });

        //Se crea una variable nula.
        var watchId = null;
        //console.log("Llego aqui")

        //Se crean las opciones para el marcador en teimpo real.
        var positionOptions = {
          enableHighAccuracy: true,
          timeout: 10 * 1000, //10 segundos
          maximumAge: 30 * 1000, //30 segundos
        };

        //Creacion variable para almacenar info de marcador
        informacion = new google.maps.InfoWindow();
        //console.log("Llego aqui1")
        //Obtenes la geolocalizacion del navegador.
        if (navigator.geolocation) {
          //Se toma la variable para la localizacion en tiempo real,
          //y se le agrega la funcion de tiempo real.
          watchId = navigator.geolocation.watchPosition(function (position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            //console.log("Llego aqui2")
            console.log(position);

            var posit = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            //Se agrega el marcador.
            markerYou.setPosition(new google.maps.LatLng(lat, lng));
            map.panTo(new google.maps.LatLng(lat, lng));
            informacion.setPosition(posit);
            informacion.setContent(namaewa1);
            //console.log("anem " + namaewa1);
            informacion.open(map);
            //console.log("Llego aqui3")

            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay = new google.maps.DirectionsRenderer();

            //call renderer to display directions
            directionsDisplay.setMap(map);

            var bounds = new google.maps.LatLngBounds();
            //        var mapOptions = {
            //            mapTypeId: 'roadmap'
            //        };
            directionsService.route(
              {
                // origin: document.getElementById('start').value,
                origin: posit,

                // destination: marker.getPosition(),
                destination: {
                  lat: array3,
                  lng: array4,
                },
                travelMode: 'DRIVING',
              },
              function (response, status) {
                if (status === 'OK') {
                  directionsDisplay.setDirections(response);
                } else {
                  window.alert('Directions request failed due to ' + status);
                }
              }
            );
          });
        }

        //Se obtiene el codigo.
        values = codigo.value;

        //Se obtienen los correos en 2 variables para compararlos
        var viewemails = document.getElementById('viewemail');
        var emas1 = viewemails.outerHTML;
        var emas2 = emas1.substring('36');
        var emas3 = emas2.substring('1', emas2.indexOf(','));
        //
        var emails = JSON.stringify(arrayemail[0]);
        var emailss = emails.substring('10');
        var emailsss = emailss.substring('0', emailss.indexOf('"'));

        try {
          //Se comparan las varibles obtenidas.
          if (emailsss == emas3) {
            //Oculta el modal de Entrar a Reunion.
            $('#enterreunionmodal').modal('hide');
            formaEnter.reset();
            formaEnter.querySelector('.error').innerHTML = '';
            alert('Entraste con exito a la reunion');
            reu.innerHTML = values;
            modalreuni.hidden = false;
            modaldrop.hidden = false;
            modalexit.hidden = false;
            modaladd.hidden = true;
            //Agrega un boton de eliminar si los correos son iguales.
            //buttonAppear.innerHTML = '<data-target="#modifreunionmodal" >Modificar reunion</a>'
            //buttonAppeared.innerHTML = '<data-target="#dropreunionmodal" >Borrar reunion</a>'
            //buttonAppear.innerHTML = '<a data-toggle="modal" onclick="refreshPage()">Salir Reunion</a>'
            formaAct.innerHTML = '';
            namaewass.innerHTML = '';
          } else {
            //Oculta el modal de Entrar a Reunion.
            $('#enterreunionmodal').modal('hide');
            formaEnter.reset();
            formaEnter.querySelector('.error').innerHTML = '';
            alert('Entraste con exito a la reunion');
            reu.innerHTML = values;
            modalexit.hidden = false;
            modaladd.hidden = true;
            //Agrega un boton de salir si los correos son diferentes.
            //buttonAppear.innerHTML = '<a data-toggle="modal" onclick="refreshPage()">Salir Reunion</a>'
            namaewass.innerHTML = '';
          }
        } catch (err) {
          console.log('Verificar bien el codigo de la reunion' + err);
        }
      });
    } else {
      console.log('Sabe');
    }
  } else {
    console.log('Sabe2');
  }
});

//Funcion que permite refrescar la pagina
function refreshPage() {
  window.location.reload();
}

//Manda llamar la forma de Agregar Reunion
const formaAddd = document.getElementById('formaAdd');
//Funcion que permite limpiar las casillas de texto al cancelar
//una accion en el modal de Agregar Reunion.
function clearAdd() {
  formaAddd['rnombre'].value = '';
  console.log('entro aqui');
}

//Manda llamar la forma de Entrar a Reunion
const formaEnterr = document.getElementById('formaEnter');
//Funcion que permite limpiar las casillas de texto al cancelar
//una accion en el modal de Entrar a Reunion.
function clearEnter() {
  formaEnterr['codigo'].value = '';
}

//Funcion que permite limpiar las casillas de texto nombre
const namaewasa = document.getElementById('namaewa');

function clearname() {
  namaewasa.innerHTML = '';
}

//Llama la forma del modal de MOodificar Reunion
const formaMod = document.getElementById('formaMod');
//Llama el codigo de la reunion actual
var codigosMod = document.getElementById('reu');
const nameR = document.getElementById('reunameReu');

//Funcion de la forma que permite modficar una reunion.
formaMod.addEventListener('submit', (e) => {
  e.preventDefault();

  //Llama al usuario autenticado.
  var user = firebase.auth().currentUser;
  //Manda llamar el codigo de la reunion de la casilla de texto y lo convierte en una cadena.
  var codigos1 = codigosMod.outerHTML;
  var codigos2 = codigos1.substring('15');
  var codigos3 = codigos2.substring('0', codigos2.indexOf('<'));

  //Se crean variables para guardar el email en estas.
  var em1, em2, em3;
  var lat1, lat2, lat3;
  var long1, long2, long3;
  var id1, id2, id3;
  //Se crea un arreglo para guarda la informacion del correo.
  arreglo = [];
  arreglolong = [];
  arreglolat = [];
  arregloid = [];
  //Se crea un prompt para que el usuario confirme que quiere borrar la reunion.
  var confir = prompt(
    'Seguro que quieres modficiar esta reunion: Escribe SI en caso de querer modificarla'
  );
  //Se compara el valor obtenido del prompt para validar si el usuario quiere borrar la reunion.
  if (confir == 'SI' || confir == 'si' || confir == 'Si' || confir == 'sI') {
    //Se obtiene la informacion de firebase.
    db.collection('reuniones')
      .get()
      .then((doc) => {
        doc.docs.forEach((doc) => {
          //Se compara que el codigo que ingreso el usuario si exista en firebase.
          if (doc.data().codigo == codigos3) {
            data = {
              email: doc.data().email,
            };
            datalat = {
              latitud: doc.data().latitud,
            };
            datalong = {
              longitud: doc.data().longitud,
            };
            dataid = {
              id: doc.data().id,
            };
            //Se inserta la informacion en el arreglo.
            arreglo.push(data);
            arreglolat.push(datalat);
            arreglolong.push(datalong);
            arregloid.push(dataid);
            //Manda llamar el email guardado en el arreglo y lo convierte en una cadena.
            em1 = JSON.stringify(arreglo);
            em2 = em1.substring('11');
            em3 = em2.substring('0', em2.indexOf('"'));
            console.log('email: ' + em3);

            lat1 = JSON.stringify(arreglolat);
            lat2 = lat1.substring('13');
            lat3 = lat2.substring('0', lat2.indexOf('"'));
            console.log('lat: ' + lat3);

            long1 = JSON.stringify(arreglolong);
            long2 = long1.substring('14');
            long3 = long2.substring('0', long2.indexOf('"'));
            console.log('long: ' + long3);

            id1 = JSON.stringify(arregloid);
            id2 = id1.substring('15');
            id3 = id2.substring('0', id2.indexOf('"'));
            console.log('id1: ' + id1);
            console.log('id2: ' + id2);
            console.log('id3: ' + id3);
          }
        });

        //Se compara que el usuario que quiere borrar la reunion
        //Sea el usuario que la creo
        if (user.email == em3) {
          //Se revisa que el codigo no sea nulo.
          if (codigo != null) {
            //Se crea una funcion que busque el codigo que se va a borrar en firebase
            //comparandolo con el que el usuario uso.
            var dele = db
              .collection('reuniones')
              .where('codigo', '==', codigos3);

            //Se revisa que el codigo sea diferente de la variable.
            if (codigo != dele) {
              var name1 = document.getElementById('modnombre');
              var name2 = name1.value;

              var desc = document.getElementById('moddescripcion');
              var desc1 = desc.value;
              //console.log("Descripcion: " + desc1);

              try {
                dele.get().then(function (querySnapshot) {
                  querySnapshot.forEach(function (docFun) {
                    //console.log(docFun.val());
                    docFun.ref.update({
                      nombre: name2,
                      descripcion: desc1,
                    });
                  });
                });
              } catch {}
              //Oculta el modal del Borrar Reunion.

              $('#modifreunionmodal').modal('hide');
              formaDrop.reset();
              formaDrop.querySelector('.error').innerHTML = '';
              buttonAppear.innerHTML = '';
              buttonAppeared.innerHTML = '';
              formaAct.innerHTML = '';
              configuraMenu(user);
              timer();
            } else {
              //En caso de que el codigo no sea diferente.
            }
          } else {
            //En caso de que el codigo no sea diferente que nulo.
          }
        } else {
          //En caso de no ser el que creo la reunion.
          alert(
            'Tienes que ser el creador de esta reunion para poder modificarla'
          );
        }
      });
  } else {
    //En caso de no aceptar borrar la reunion.
    alert('Intenta modificarla cuando estes seguro de querer hacerlo.');
  }
});

function timer() {
  alert(
    'Reunion modificada con exito, se finalizara la sesion con la reunion actual'
  );
  setTimeout(refreshPage, 3000);
}
