


//Inicializa as variáveis "globais"

var map;

lat_padrao = -22.903733;
long_padrao = -43.192711;


latitude = lat_padrao;
longitude = long_padrao;

var debug = document.getElementById("debug");

var dadosJSON = []
var pi = Math.PI;

//transforma o JSON do arquivo "bicicletários.js" em objeto
//var json = JSON.parse(geojson);



// Armazena o endereço digitado em uma variável



// função que busca as coordenadas do endereço digitado no Open Maps
function obterCoordenadas(){

    let endereco = document.getElementById("endereco").value;
    
    let endpoint = `http://nominatim.openstreetmap.org/search?format=json&country=brasil&state=rio%de%janeiro&city=rio%de%janeiro&street=${encodeURIComponent(endereco)}`;
    

      fetch(endpoint)
        .then(response => response.json())
        .then(data => {

            if (data.length > 0) {
                const latitude = parseFloat(data[0].lat);
                const longitude = parseFloat(data[0].lon);
                const nome_da_rua = data[0].name;

                console.log(`Coordenadas: ${latitude}, ${longitude}. Nome da rua ${nome_da_rua}`);

                contador = document.getElementById("contador").value;
                debug.innerHTML = contador;   
                mostraMapa(latitude, longitude);
                setaDistanciaArray(latitude, longitude);
                addMarcador(latitude, longitude, contador, nome_da_rua);
                console.log(latitude, longitude);
                //addMarcador(latitude, longitude, contador);
                L.geoJSON(geojson).addTo(map);


            } else {
                console.error('Erro na requisição!' + endereco);
                console.error(endereco);
                reject(errorMessage)
            }
        })
        .catch(error => {console.error('Erro na solicitação', error);
        reject(error);
        });

    }



//----------------------------------------------------------------------------------------------------------    
// Função que adiciona os marcadores no mapa

function addMarcador(lat, long, cont, nome_da_rua){

    //let cont = lerContador();
    let latMarcador = lat;
    let longMarcador = long;
    let nomeMarcador = nome_da_rua;
    
    

    while (cont > 0) {


    L.marker([latMarcador, longMarcador]).addTo(map)
        .bindPopup(nomeMarcador)
        .openPopup();

    
        cont--;
    }
}

//DESABILITADO
//----------------------------------------------------------------------------------------------------------

function lerContador(){
        obterCoordenadas();
        var select = document.getElementById("contador");
        var contador = 0;
        var debug = document.getElementById("debug");

        select.addEventListener('change', function(){
            contador = parseInt(this.value);
            debug.innerHTML("debug") = contador;   
        });

        return contador;
}


//----------------------------------------------------------------------------------------------------------





//----------------------------------------------------------------------------------------------------------
// Mostra o mapa de acordo com as coordenadas passadas via JSON
function mostraMapa(latitude, longitude){

    lat_mapa = latitude;
    long_mapa = longitude;


    if (map === undefined) {

        map = L.map('map').setView([lat_mapa, long_mapa], 13);

    } else {
        map.remove();
        map = L.map('map').setView([lat_mapa, long_mapa], 13);

    }
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


}



    addMarcador(latitude, longitude);
    console.log(addMarcador(latitude, longitude));


    var select = document.getElementById("contador");
    var button = document.getElementById("pesquisar");
    var debug = document.getElementById("debug");

//----------------------------------------------------------------------------------------------------------
// Ação para chamar os métodos de obter coordenadas e setar o mapa

    button.addEventListener('click', function(){

        obterCoordenadas();
        
    });


//----------------------------------------------------------------------------------------------------------
// Carrega o mapa inicial com as coordenadas padrão (Central do Brasil)
    mostraMapa(lat_padrao, long_padrao);
    setaDistanciaArray(lat_padrao, long_padrao);



// Mapeia o JSON para para calcular as distâncias
function calculaDistancia(lat1, long1, lat2, long2){

    const raioTerra = 6371;

// Fórmula do Triangulo Pitagórico
    const distanciaEmGraus = Math.sqrt(((lat2 - lat1)**2)+((long2 - long1)**2));  

    const voltaTerra = (2 * Math.PI * raioTerra);

    const distancia = distanciaEmGraus * voltaTerra / 360;

    return distancia;

}

//varre o array pegando as coordenadas de cada pondo BikeRio e coloca em outro array...
//já criando mais uma coluna com a distância calculada entre cada ponto e o endereço pesquisado. 
function setaDistanciaArray(latPrincipal, longPrincipal){

    latPrin = latPrincipal;
    longPrin = longPrincipal;

    geojson.features.forEach(function(feature) {
        var dados = {
          
          Nome: feature.properties.Nome,
          Latitude: feature.geometry.coordinates[1],
          Longitude: feature.geometry.coordinates[0],
          Distancia: calculaDistancia(latPrin, longPrin, feature.geometry.coordinates[1], feature.geometry.coordinates[0])
          
        };
        dadosJSON.push(dados);
      });

      dadosJSON.sort(function(a, b) {
        return a.Distancia - b.Distancia;
      });

        console.log(dadosJSON);



}



    

    