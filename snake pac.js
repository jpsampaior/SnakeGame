var tela;
var ctx;

var cabeca; 
var maca = [];
var bola;
var obs = [];

var tamanho;
var vidas = 2;
var pontos = 0;
var pontosVida = 0;

var maca_x = [];
var maca_y = [];
var obs_x = [];
var obs_y = [];

var seletor = [];
var paraEsquerda = false;
var paraDireita = false;
var paraCima = false;
var paraBaixo = false;

var noJogo = true;    

const TAMANHO_PONTO = 20;
const ALEATORIO_MAXIMO = 29;
const ATRASO = 100;
const C_ALTURA = 600;
const C_LARGURA = 600;    

var TECLA_SPACE = 32;

const TECLA_ESQUERDA = 37;
const TECLA_DIREITA = 39;
const TECLA_ACIMA = 38;
const TECLA_ABAIXO = 40;

const TECLA_W = 87;
const TECLA_A = 65;
const TECLA_S = 83;
const TECLA_D = 68;

onkeydown = verificarTecla;

var x = [];
var y = [];

var somMusica = new Audio("UNATCO.mp3");
var somPonto = new Audio("pickupCoin.wav");
var somBatida = new Audio("hitHurt.wav");
var somGameOver = new Audio("gameover.wav");

var painelInfo = document.querySelector(".geral");
var imgVidas = document.getElementById("img_vidas");
var classImg = document.querySelector(".classImg");
var userGroup = document.querySelector(".username");
var usernameBox = document.getElementById("username");
var btnSalvar = document.getElementById("sub");
var lblTempo = document.getElementsByClassName("tempoReal");
var lblPontos = document.getElementsByClassName("pontosReal");

var pLugar = document.getElementsByClassName("pLugar");
var sLugar = document.getElementsByClassName("sLugar");
var tLugar = document.getElementsByClassName("tLugar");
var q4Lugar = document.getElementsByClassName("q4Lugar");
var q5Lugar = document.getElementsByClassName("q5Lugar");

var username;
var segundos = 60;

window.onload = inicioDeJogo();

function rankingSort() {
    var aux;
    var j;
  
    for (var i = 1; i < rankingList.length; i++) {
      aux = rankingList[i];
      j = i;
  
      while (j > 0 && rankingList[j - 1].pontos < aux.pontos) {
        rankingList[j] = rankingList[j - 1];
        j--;
      }
  
      rankingList[j] = aux;
    }
}

function carregarRanking() {
    if (localStorage.getItem("rankingList") == null) {
        return rankingList = [];
    } 
    
    else {
        return rankingList = JSON.parse(localStorage.getItem("rankingList"));
    }
}

function MostrarPlayer(N) {
	return `${N+1}. ${rankingList[N].username} - ${rankingList[N].pontos} pontos`
}

function rankingTOP() {
	var N
	for (var i = 0; i < lblTempo.length; i++) {
		N = 0;
		if (rankingList[N] != null) {
			pLugar[i].innerHTML = MostrarPlayer(N);
		}
	}
	for (var i = 0; i < lblTempo.length; i++) {
		N = 1;
		if (rankingList[N] != null) {
			sLugar[i].innerHTML = MostrarPlayer(N);
		}
	}
	for (var i = 0; i < lblTempo.length; i++) {
		N = 2;
		if (rankingList[N] != null) {
			tLugar[i].innerHTML = MostrarPlayer(N);
		}
	}
	for (var i = 0; i < lblTempo.length; i++) {
		N = 3;
		if (rankingList[N] != null) {
			q4Lugar[i].innerHTML = MostrarPlayer(N);
		}
	}
	for (var i = 0; i < lblTempo.length; i++) {
		N = 4;
		if (rankingList[N] != null) {
			q5Lugar[i].innerHTML = MostrarPlayer(N);
		}
	}
}

function inicioDeJogo() {
    tela = document.getElementById("tela");
    ctx = tela.getContext("2d");

    ctx.fillStyle = "black";
	ctx.fillRect(0, 0, C_LARGURA, C_ALTURA);
    ctx.fillStyle = "white";
    ctx.textBaseline = "middle"; 
    ctx.textAlign = "center"; 
    ctx.font = "normal bold 24px serif";
    ctx.fillText("Press SPACE to start", C_LARGURA/2, C_ALTURA/2);

    carregarRanking();
    rankingTOP();
}

function verificarTecla(e) {
    var tecla = e.keyCode;

    if ((tecla == TECLA_ESQUERDA || tecla == TECLA_A) && (!paraDireita)) {
        paraEsquerda = true;
        paraCima = false;
        paraBaixo = false;
    }

    if ((tecla == TECLA_DIREITA || tecla == TECLA_D) && (!paraEsquerda)) {
        paraDireita = true;
        paraCima = false;
        paraBaixo = false;
    }

    if ((tecla == TECLA_ACIMA || tecla == TECLA_W) && (!paraBaixo)) {
        paraCima = true;
        paraDireita = false;
        paraEsquerda = false;
    }

    if ((tecla == TECLA_ABAIXO || tecla == TECLA_S) && (!paraCima)) {
        paraBaixo = true;
        paraDireita = false;
        paraEsquerda = false;
    }
    
    if(tecla == TECLA_SPACE) {
        iniciar();
        painelInfo.style.visibility = "visible";
        TECLA_SPACE = 0
    }
}

function mover() {
    for (var z = tamanho; z > 0; z--) {
        x[z] = x[z-1];
        y[z] = y[z-1];
    }

    if (paraEsquerda) {
        x[0] -= TAMANHO_PONTO;
    }

    if (paraDireita) {
        x[0] += TAMANHO_PONTO;
    }

    if (paraCima) {
        y[0] -= TAMANHO_PONTO;
    }

    if (paraBaixo) {
        y[0] += TAMANHO_PONTO;
    }
} 

function bordas() {
    if (y[0] >= C_ALTURA) {
        y[0] = 0;
    }

    if (y[0] < 0) {
       y[0] = C_ALTURA;
    }

    if (x[0] >= C_LARGURA) {
      x[0] = 0;
    }

    if (x[0] < 0) {
      x[0] = C_LARGURA;
    }
}

function vida() {
    if(pontosVida>=3 && vidas<3) {
        vidas++
        pontosVida=0;
    }

    if(pontosVida>=3 && vidas==3) {
        pontosVida=0;
    }
}

function trocaVidas() {
    if(vidas==1) {
        imgVidas.src = "vidas 1.png";
    }

    if(vidas==2) {
        imgVidas.src = "vidas 2.png";
    }

    if(vidas==3) {
        imgVidas.src = "vidas 3.png";
    }
}

function seletorMov() {
    var sorteado = Math.floor(Math.random()*4)

    if(sorteado==0) {
        paraEsquerda = true;
    }

    if(sorteado==1) {
        paraDireita = true;
    }

    if(sorteado==2) {
        paraCima = true;
    }

    if(sorteado==3) {
        paraBaixo = true;
    }
}

function cronometro() {
    if (noJogo) {
        segundos--;

		lblTempo.textContent = segundos +" segundos";
		for (var i = 0; i < lblTempo.length; i++) {
			lblTempo[i].innerHTML = segundos+" segundos";
		}
		
        setTimeout("cronometro()", 1000);
    }
}

function carregarImagens() {
    cabeca = new Image();
    cabeca.src = "pac.png";    
    
    bola = new Image();
    bola.src = "corpo.png"; 
    
    for(var contador = 0; contador<15;contador++) {
        maca[contador] = new Image();
        maca[contador].src = "maca.png"; 
    }
    
    for(var contador = 0;contador<10;contador++) {
        obs[contador] = new Image();
        obs[contador].src = "fantasma.png"
    }
}

function localizarObstaculo() {
    for(var contador = 0;contador<10;contador++) {
        var o = Math.floor(Math.random() * ALEATORIO_MAXIMO);
        obs_x[contador] = o * TAMANHO_PONTO;

        o = Math.floor(Math.random() * ALEATORIO_MAXIMO);
        obs_y[contador] = o * TAMANHO_PONTO;
    }   
}

function localizarMaca() {
    for(var contador = 0; contador<15;contador++) {
        var r = Math.floor(Math.random() * ALEATORIO_MAXIMO);
        maca_x[contador] = r * TAMANHO_PONTO;
    
        r = Math.floor(Math.random() * ALEATORIO_MAXIMO);
        maca_y[contador] = r * TAMANHO_PONTO;

        for(var contador2=0;contador2<10;contador2++) {
            if(maca_x[contador] == obs_x[contador2] && maca_y[contador] == obs_y[contador2]) {
                var r = Math.floor(Math.random() * ALEATORIO_MAXIMO);
                maca_x[contador] = r * TAMANHO_PONTO;
            
                r = Math.floor(Math.random() * ALEATORIO_MAXIMO);
                maca_y[contador] = r * TAMANHO_PONTO; 
            }
        }
    }
}

function criarCobra() {
    tamanho = 3;
	
    for (var z = 0; z < tamanho; z++) {
        x[z] = 60 - z * TAMANHO_PONTO;
        y[z] = 60;
    }
}

function fazerDesenho() {
    ctx.clearRect(0, 0, C_LARGURA, C_ALTURA);
	ctx.fillRect(0, 0, C_LARGURA, C_ALTURA);
	
    if (noJogo) {
        for(var contador = 0; contador<15;contador++) {
            ctx.drawImage(maca[contador], maca_x[contador], maca_y[contador]);
        }

        for(var contador = 0;contador<10;contador++) {
            ctx.drawImage(obs[contador],obs_x[contador],obs_y[contador]);
        }
		
        for (var z = 0; z < tamanho; z++) {
            if (z == 0) {
                ctx.drawImage(cabeca, x[z], y[z]);
            } else {
                ctx.drawImage(bola, x[z], y[z]);
            }
        }    
    } 
    
    else {
        fimDeJogo();
    }        
}

function verificarDerrota() {
    for (var z = tamanho; z > 0; z--) {
        if ((z > 4) && (x[0] == x[z]) && (y[0] == y[z])) {
            somBatida.play();
			
            if (pontos>10) {
				pontos -=10;
			} 

            if(vidas>1) {
                vidas--;
            }

            else {
                noJogo = false;
                classImg.style.visibility = "hidden";
            }
        }
    }

    for(var contador = 0;contador<10;contador++) {
        if(x[0] == obs_x[contador] && y[0] == obs_y[contador]) {
            somBatida.play();
			if (pontos>10) {
				pontos -=10;
			} 
			
            for (var i = 0; i < lblTempo.length; i++) {
				lblPontos[i].innerHTML = pontos + " pontos";
			}

			if(vidas>1) {
                vidas--;
            }

            else {
                noJogo = false;
                classImg.style.visibility = "hidden";
            }
        }
    }

    if(segundos==0) {
        noJogo = false;
    }
}

function verificarMaca() {
    for(var contador = 0;contador<15;contador++) {
        if ((x[0] == maca_x[contador]) && (y[0] == maca_y[contador])) {
            var somPonto = new Audio("pickupCoin.wav");
			somPonto.play();

            tamanho++;
            pontosVida++;
            pontos +=10;

			for (var i = 0; i < lblTempo.length; i++) {
				lblPontos[i].innerHTML = pontos+" pontos";
			}
            maca_x[contador] = maca_y[contador] = 1000;
        }
    }
} 

function cicloDeJogo() {
    if (noJogo) {
        verificarMaca();
        verificarDerrota();
        bordas();
        mover();
        fazerDesenho();
        setTimeout("cicloDeJogo()", ATRASO);
        vida();
        trocaVidas();
        verificarVitoria();
    }
}
 
function iniciar() {
    ctx.fillStyle = "black";
	ctx.fillRect(0, 0, C_LARGURA, C_ALTURA);
    somMusica.play();
    seletorMov();
    carregarImagens();
    criarCobra();
    localizarObstaculo();
    localizarMaca();
    setTimeout("cicloDeJogo()", ATRASO);
    setTimeout("cronometro()", 1000);
} 

function fimDeJogo() {
    
    userGroup.style.display = "block";
    somMusica.pause();
	somGameOver.play();
    ctx.fillStyle = "white";
    ctx.textBaseline = "middle"; 
    ctx.textAlign = "center"; 
    ctx.font = "normal bold 24px serif";
    ctx.fillText("Game Over", 300, 270);
    ctx.fillText("Digite seu username para salvar a pontuação",300,300);
    noJogo = false;
}

function verificarVitoria() {
    for(var contador = 0, vitoria = 0;contador<15;contador++) {
        if (maca_x[contador] == 1000 && maca_y[contador] == 1000) {
            vitoria++
        }
    }

    if(vitoria >= 15) {
        somPonto.play();
        pontos+=segundos;
        userGroup.style.display = "block";
        somMusica.pause();
        ctx.clearRect(0, 0, C_LARGURA, C_ALTURA);
	    ctx.fillRect(0, 0, C_LARGURA, C_ALTURA);
        ctx.fillStyle = "white";
        ctx.textBaseline = "middle"; 
        ctx.textAlign = "center"; 
        ctx.font = "normal bold 24px serif";
        ctx.fillText("Vitória", C_LARGURA/2, 270);
        ctx.fillText("Digite seu username para salvar a pontuação",300,300);
        noJogo = false;
        for (var i = 0; i < lblTempo.length; i++) {
            lblPontos[i].innerHTML = pontos+" pontos";
        }
    }
}

function ranking() {
    userGroup.style.display = "none";
    username = usernameBox.value;
    rankingList.push({
      username: username,
      pontos: pontos
    });
    rankingSort();
    localStorage.setItem("rankingList", JSON.stringify(rankingList));
    rankingTOP()
}

btnSalvar.onclick = ranking;