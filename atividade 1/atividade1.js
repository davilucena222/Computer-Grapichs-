let color_buffer = new Canvas("canvas");
color_buffer.clear();

function MidPointLineAlgorithm(x0, y0, x1, y1, color_0, color_1) {
	
  //variaveis auxiliares
  let aux, i = 0;
  
  
  let x = x0;
  let y = y0;
  
  let color_2 = color_0;
  
  //Diferenciais
  let dx = x1 - x0
  let dy = y1 - y0
  
  //incremento 
  let incrementoX = 1;
  let incrementoY = 1;
  
  //verifica o octante usando as diferenças entre as coordenadas
  //caso os diferenciais sejam negativos, o incremento também sera negativo
  //permitindo assim desenhar em todos
  if (dx < 0) incrementoX = -incrementoX;
  if (dy < 0) incrementoY = -incrementoY;
  
  //variacoes de cor para interpolar 
  let dR = color_1[0] - color_0[0];
  let dG = color_1[1] - color_0[1];
  let dB = color_1[2] - color_0[2];
  let dA = color_1[3] - color_0[3];
  
  
  //recebendo o módulo das variacoes
  dx = Math.abs(dx)
  dy = Math.abs(dy)
  
  //retas no primeiro, quarto, quinto e oitavo octantes devido a variação de x ser maior que a de y
  if(dx > dy){
    
    //variavel auxiliar para verificar o octante no primeiro pixel
    aux = (dy * 2) - dx;
    
    //divide as cores de acordo com a quantidade de pixels para interpolar
    dR /= dx;
    dG /= dx; 
    dB /= dx;
    dA /= dx;
    
    
    for(i = 0; i <= dx; i++){
    
      //monta a cor do pixel, incrementando para fazer a interpolação
      color_2[0] = color_2[0] += dR;
      color_2[1] = color_2[1] += dG;
      color_2[2] = color_2[2] += dB;
      color_2[3] = color_2[3] += dA;
      
      //acende o pixel na tela
      color_buffer.putPixel(x, y, color_2);
      
      //alterando a auxiliar para desenhar no octante correto
      if(aux < 0){ //primeiro octante ou quinto
        aux += dy * 2;
      }else{ //quarto octante e oitavo octante
        y += incrementoY;
        aux += (dy-dx) * 2
      }
      
      x+=incrementoX;
      
    }
  }else{ //retas no segundo, terceiro, sexto e setimo octantes
 
    aux = dx * 2 - dy;
    dR /= dy;
    dG /= dy; 
    dB /= dy;
    dA /= dy;
    
    
    for(i = 0; i <= dy; i++){
     
     color_2[0] = color_2[0] += dR;
     color_2[1] = color_2[1] += dG;
     color_2[2] = color_2[2] += dB;
     color_2[3] = color_2[3] += dA;
     console.log(color_2)
     color_buffer.putPixel(x, y, color_2);
      
      if(aux < 0){ //terceiro e setimo octante
        aux += dx * 2;
      }else{ //segundo e sexto octante
        x += incrementoX;
        aux += (dx-dy) * 2 
      }
      
      y +=incrementoY;
    }
    
  }
 
  
  
  
 

       
}

function DrawTriangle(x0, y0, x1, y1, x2, y2, color_0, color_1, color_2) {
	MidPointLineAlgorithm(x0,y0,x1,y1, color_0, color_1)
  MidPointLineAlgorithm(x1,y1,x2,y2,color_1,color_2)
  MidPointLineAlgorithm(x2,y2,x0,y0,color_2, color_0)
}

 //MidPointLineAlgorithm(25, 30, 100, 80, [255,0,0,255], [255, 255, 0, 255 ]);
DrawTriangle(25, 30, 50, 100, 100,
15, [255,0,0,255], [0,0,255,255], [0,255,0,255])
