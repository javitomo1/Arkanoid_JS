
//Variables

//Variables para crear el canvas y poder usar getContext('2d) para hacer figuras bidimensionales.
let canvas = document.getElementById("myCanvas");//Display del juego, pantalla, el canvas.
let ctx = canvas.getContext("2d");//Propiedad para hacer figuras geometricas en 2d.
//Variables para la bola, su movimiento y velocidad
let ballRadius = 5;//Radio de la bola
let x = canvas.width/2;//Coordenada horizontal donde aparece la bola.
let y = canvas.height-30;//Coordenada Vertical donde aparece la bola.
let dx = 2;//Velocidad de la bola
let dy = -2;//Velocidad de la bola
//Variables para la paleta y su control
let paddleHeight = 10;//Altura de la paleta
let paddleWidth = 40;//Anchura de la paleta
let paddleX = (canvas.width-paddleWidth)/2;//Posicion donde aparece la paleta
let rightPressed = false;//Variables que apuntan a si las teclas de fecha para mover la paleta, por defecto false
let leftPressed = false;
//Variables para la matriz de los ladrillos
let brickRowCount = 5;//Numero de filas
let brickColumnCount = 8;//Numero de columnas
let brickWidth = 50;//Ancho del ladrillo
let brickHeight = 13;//Alto del ladrillo
let brickPadding = 5;//Espaciado entre ladrillos ?
let brickOffsetTop = 30;//Espaciado entre ladrillos ?
let brickOffsetLeft = 20;//Espaciado entre ladrillos ?
//Variables para el contador de puntuación y victoria
let score = 0;
//Vidas
let vidas = 5



//Matriz de labrillos
let bricks = [];
for( c = 0; c < brickColumnCount; c++) {//Por cada nº de columna se crea un indice(columna)
  bricks[c] = [];//Obtenemos: bricks[0],bricks[1],bricks[2],bricks[3],bricks[4] como indice de las columnas
  for( r = 0; r < brickRowCount; r++) {//Por cada columna, recorremos brickRowCount para crear el numero de filas y guardar su indice en r
    //Lo interesante de esta linea es que el ladrillo esta entre {}
    bricks[c][r] = { x: 0, y: 0, status: 1  };//Cada ladrillo se dibujara en las coordenadas de x e y, el status se usara para hacer desaparecer el ladrillo al golpearlo.
  }
}
//Dibujamos un ladrillo por cada celda de la matriz
function drawBricks() {
  for(c=0; c<brickColumnCount; c++) {
    for(r=0; r<brickRowCount; r++) {
      if( bricks[c][r].status == 1) {
        var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
        var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#023047";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}


//Implementaciones própias
//Contador de colisiones con el margen del canvas
let numeroColisiones = 0;
let contador = document.getElementById('contador');
contador.innerHTML = `Contador de colisiones:<span class="valor">${numeroColisiones}</span>`

//Funcion para augmentar la velocidad de la bola cuando toca la paleta
function ballSpeedPlus() {
  dx -= 0.1;
  dy -= 0.1;
}
//Funcion para mostrar la velocidad de la bola en px/seg
let ballSped = 200
function ballSpedUpdate() {
  ballSped += 10
}
//Funcion para contar las pulsaciones de tecla
let pulsaciones = 0
let mostrarPulsacion = document.getElementById('pulsaciones')
mostrarPulsacion.innerHTML = `Pulsaciones de tecla:<span class="valor">${pulsaciones}</span>`
function pulsacionDeTecla() {
  pulsaciones += 1
}
//Funcion para calcular cuanto dura la ronda
let duracion = 0
let minutos = 0
function cronometro() {
  if ( duracion < 60) {
    duracion += 0.01;
  } else if ( duracion > 60) {
    duracion = 0.01
    minutos += 1;
  }
}






//Eventos que capturan si las teclas de flecha se estan pulsando, ejecutaran las funciones
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
//Funciones para establecer en true/false las variables al pulsar/soltar una tecla
function keyDownHandler(e) {
  if(e.keyCode == 39) {
      rightPressed = true;
  }
  else if(e.keyCode == 37) {
      leftPressed = true;
  }
}
function keyUpHandler(e) {
  if(e.keyCode == 39) {
      rightPressed = false;
      pulsacionDeTecla()
      mostrarPulsacion.innerHTML = `Pulsaciones de tecla:<span class="valor">${pulsaciones}</span>`
  }
  else if(e.keyCode == 37) {
      leftPressed = false;
      pulsacionDeTecla()
      mostrarPulsacion.innerHTML = `Pulsaciones de tecla:<span class="valor">${pulsaciones}</span>`
  }
}
//Detectar el movimiento del raton
document.addEventListener('mousemove', deteccionMovRaton, false);
function deteccionMovRaton(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if( relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth/2;
  }
}
//Detección de colisión con los ladrillos
function collisionDetection() {
  for(c=0; c<brickColumnCount; c++) {
    for( r = 0; r<brickRowCount; r++) {
      let b = bricks[c][r];
      if(b.status == 1) {
        if( x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          if(score == brickRowCount*brickColumnCount) {
            alert("HAS GANADO! ENHORABUENA!");
            document.location.reload()
          }
        }
      }
    }
  }
}
//Contador de puntuación
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#023047";
  ctx.fillText("Score:" +score, 8, 20)
}
//Contador de vidas
function mostrarVidas() {
  ctx.font = "16px Arial"
  ctx.fillStyle = "#023047"
  ctx.fillText("Lives:" +vidas, canvas.width-65,20)
}




//Dibujamos la bola
function dibujarBola() {
  ctx.beginPath();//Esto crea el comienzo de una etiqueta de bola
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);//Coordenadas del centro de la bola, radio de la bola, angulo inicial/fianl en radianes para dibujar la bola y en que sentido horario comienza la bola, false = derecha 
  ctx.fillStyle = "#023047";//Elegimos color de relleno
  ctx.fill();//Aplicamos color de relleno
  ctx.closePath();//Cierre de la etiqueta
}
function dibujarPaleta() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);//Medidas de la paleta con rect(), similar al arc() que se usa para el circulo.
  ctx.fillStyle = "#023047";
  ctx.fill();
  ctx.closePath();
}
//Funcion principal que se ejecuta cada 10ms y dibujara la bola y demás
function dibujar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);//Borra todo el contenido del lienzo para que la bola no pinte una linea en su recorrido.
  drawBricks();
  dibujarBola();//Dibuja la bola cada 10ms
  dibujarPaleta();//Actualiza posicion de la paleta cada 10ms
  drawScore();
  mostrarVidas();
  collisionDetection();
  cronometro();

  //Cambiamos direccion de la bola cuando golpea los laterales del canvas
  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx;
    //Código añadido para el contador de colisiones
    numeroColisiones += 1;
    contador.innerHTML = `Contador de colisiones:<span class="valor">${numeroColisiones}</span>`
  }
  //Cambiamos direccion de la bola si toca la parte superior del canvas
  if(y + dy < ballRadius) {
    dy = -dy;
    numeroColisiones += 1;
    contador.innerHTML = `Contador de colisiones:<span class="valor">${numeroColisiones}</span>`
  } else if (y + dy > canvas.height-ballRadius) {//Si toca la parte inferior pero en la zona de la paleta
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
      ballSpeedPlus()
      ballSpedUpdate()
    }
    else {//Si no es la zona de la paleta fin de juego
      vidas--;
      if(!vidas) {
        // alert("Gamer Over");
        document.location.reload();
      }
      else {
        x = canvas.width/2;
        y = canvas.height-30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width-paddleWidth)/2;
      }
    }
  }
  //Si las teclas de flecha para mover la paleta se pulsan, sumamos/restamos 7 a la posicion de la paleta
  if(rightPressed && paddleX < canvas.width-paddleWidth) {
      paddleX += 7;
  }
  else if(leftPressed && paddleX > 0) {
      paddleX -= 7;
  }
  //Actualizamos los valores con nuestras variables dx y dy en cada fotograma de 10ms para que la bola se mueva
  x += dx;
  y += dy;

  //app-info, panel izquierdo
  let coordenadaX = document.getElementById('coordenadaX')
  coordenadaX.innerHTML = `Posición X:<span class="valor">${Math.floor(x)}</span>`
  let coordenadaY = document.getElementById('coordenadaY')
  coordenadaY.innerHTML = `Posición Y:<span class="valor">${Math.floor(y)}</span>`
  let pixelXsegTag = document.getElementById('pixelXsegTag')
  pixelXsegTag.innerHTML = `Velocidad de la bola:<span class="valor">${ballSped}</span>px/seg`
  let crono = document.getElementById('crono')
  crono.innerHTML = `Duración de la ronda:<span class="valor">${minutos}:${Math.floor(duracion)}</span>`

  requestAnimationFrame(dibujar)
}


//Ejecutamos la funcion principal que se ejecutara al cargar el archivo
dibujar();