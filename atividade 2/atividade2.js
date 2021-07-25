// Cria um color buffer para armazenar a imagem final.
let color_buffer = new Canvas("canvas");
color_buffer.clear();

/******************************************************************************
 * Vértices do modelo (cubo) centralizado no seu espaco do objeto. Os dois
 * vértices extremos do cubo são (-1,-1,-1) e (1,1,1), logo, cada aresta do cubo
 * tem comprimento igual a 2.
 *****************************************************************************/
//                                   X     Y     Z    W (coord. homogênea)
let vertices = [new THREE.Vector4(-1.0, -1.0, -1.0, 1.0),
                new THREE.Vector4( 1.0, -1.0, -1.0, 1.0),
                new THREE.Vector4( 1.0, -1.0,  1.0, 1.0),
                new THREE.Vector4(-1.0, -1.0,  1.0, 1.0),
                new THREE.Vector4(-1.0,  1.0, -1.0, 1.0),
                new THREE.Vector4( 1.0,  1.0, -1.0, 1.0),
                new THREE.Vector4( 1.0,  1.0,  1.0, 1.0),
                new THREE.Vector4(-1.0,  1.0,  1.0, 1.0)];

/******************************************************************************
 * As 12 arestas do cubo, indicadas através dos índices dos seus vértices.
 *****************************************************************************/
let edges = [[0,1],
             [1,2],
             [2,3],
             [3,0],
             [4,5],
             [5,6],
             [6,7],
             [7,4],
             [0,4],
             [1,5],
             [2,6],
             [3,7]];

/******************************************************************************
 * Matriz Model (modelagem): Esp. Objeto --> Esp. Universo. 
 * OBS: A matriz está carregada inicialmente com a identidade.
 *****************************************************************************/
let m_model = new THREE.Matrix4();

//matriz model identidade
m_model.set(1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0);

for (let i = 0; i < 8; ++i)
    vertices[i].applyMatrix4(m_model); //aplica a matriz em todos os vertices

 

/******************************************************************************
 * Parâmetros da camera sintética.
 *****************************************************************************/

let cam_pos = new THREE.Vector3(1.3,1.7,2.0);     // posição da câmera no esp. do Universo.
let cam_look_at = new THREE.Vector3(0.0,0.0,0.0); // ponto para o qual a câmera aponta.
let cam_up = new THREE.Vector3(0.0,1.0,0.0);      // vetor Up da câmera.

  //calcular o vetor d - direcao
  let d = new THREE.Vector3(0,0,0);
  d.setX(cam_look_at.getComponent(0) - cam_pos.getComponent(0));
  d.setY(cam_look_at.getComponent(1) - cam_pos.getComponent(1));
  d.setZ(cam_look_at.getComponent(2) - cam_pos.getComponent(2));


/******************************************************************************
 * Matriz View (visualização): Esp. Universo --> Esp. Câmera
 * OBS: A matriz está carregada inicialmente com a identidade. 
 *****************************************************************************/

  // Derivar os vetores da base da câmera a partir dos parâmetros informados acima.
 
  //ZCAM = - D / |D|
  //calcular o modulo |D|
  let modulod = Math.sqrt(Math.pow(d.x, 2) + Math.pow(d.y, 2) + Math.pow(d.z, 2));
  let zcam = new THREE.Vector3(0,0,0);
  zcam = d;
  zcam.divideScalar(modulod)
  //encontrou o zcam
  zcam = zcam.multiplyScalar(-1);
  
  //xcam
  let xcam = new THREE.Vector3(0,0,0)
  xcam.crossVectors(cam_up, zcam);
  xcam.divideScalar(Math.sqrt(Math.pow(xcam.x, 2) + Math.pow(xcam.y, 2) + Math.pow(xcam.z, 2)))
  
  //encontrar o ycam
  let ycam = new THREE.Vector3(0,0,0)
  ycam.crossVectors(zcam,xcam);
  ycam.divideScalar(Math.sqrt(Math.pow(ycam.x, 2) + Math.pow(ycam.y, 2) + Math.pow(ycam.z, 2)))
 

  // ---------- implementar aqui ----------------------------------------------

  // Construir 'm_bt', a inversa da matriz de base da câmera.

  // ---------- implementar aqui ----------------------------------------------
  let m_bt = new THREE.Matrix4();

  m_bt.set(xcam.getComponent(0), xcam.getComponent(1), xcam.getComponent(2), 0.0,
           ycam.getComponent(0), ycam.getComponent(1), ycam.getComponent(2), 0.0,
           zcam.getComponent(0), zcam.getComponent(1), zcam.getComponent(2), 0.0,
           0.0, 0.0, 0.0, 1.0);

  // Construir a matriz 'm_t' de translação para tratar os casos em que as
  // origens do espaço do universo e da câmera não coincidem.

  // ---------- implementar aqui ----------------------------------------------
  let m_t = new THREE.Matrix4();
  
  //coloca na ultima coluna as coordenadas da camera * -1
  m_t.set(1.0, 0.0, 0.0, -1 * cam_pos.getComponent(0),
          0.0, 1.0, 0.0, -1 * cam_pos.getComponent(1),
          0.0, 0.0, 1.0, -1 * cam_pos.getComponent(2),
          0.0, 0.0, 0.0, 1.0);

  // Constrói a matriz de visualização 'm_view' como o produto
  //  de 'm_bt' e 'm_t'.
  let m_view = m_bt.clone().multiply(m_t);

  for (let i = 0; i < 8; ++i)
      vertices[i].applyMatrix4(m_view); //aplica a matriz view a todos os vertices

/******************************************************************************
 * Matriz de Projecao: Esp. Câmera --> Esp. Recorte
 * OBS: A matriz está carregada inicialmente com a identidade. 
 *****************************************************************************/

  // ---------- implementar aqui ----------------------------------------------
  let m_projection = new THREE.Matrix4();

  //usando o modelo dado em aula, substituimos o d por 1;
  m_projection.set(1.0, 0.0, 0.0, 0.0,
                   0.0, 1.0, 0.0, 0.0,
                   0.0, 0.0, 1.0, 1.0,
                   0.0, 0.0, -1.0, 1.0);

  for (let i = 0; i < 8; ++i){
    vertices[i].applyMatrix4(m_projection);
  }

/******************************************************************************
 * Homogeneizacao (divisao por W): Esp. Recorte --> Esp. Canônico
 *****************************************************************************/
  for(let i = 0; i<8; ++i){
    let z = vertices[i].getComponent(2);
    vertices[i].divideScalar(1-z); //divide a coordenada de todos os vertices por 1-z
  }
  // ---------- implementar aqui ----------------------------------------------

/******************************************************************************
 * Matriz Viewport: Esp. Canônico --> Esp. Tela
 * OBS: A matriz está carregada inicialmente com a identidade. 
 *****************************************************************************/

  // ---------- implementar aqui ----------------------------------------------
  let m_translate = new THREE.Matrix4();
  let m_s = new THREE.Matrix4();

  //matriz com erro
  m_translate.set(1, 0, 0, 0,
                  0, 1, 0, 0,
                  0, 0, 1, 0,
                  0, 0, 0, 1)
  
  //matriz escala
  m_s.set( 128/2, 0.0, 0.0, 0.0,
          0.0, 128/2, 0.0, 0.0,
          0.0, 0.0, 128/2, 0.0,
          0.0, 0.0, 0.0, 1.0);
  
  let m_viewport = m_s.clone().multiply(m_translate)

  for (let i = 0; i < 8; ++i){
    vertices[i].applyMatrix4(m_viewport);
    
    //a solucao encontrada para o erro na matriz translacao foi aplicar a translacao em cada vertice separadamente
    vertices[i].x += 64; //transladando no eixo x 64px cada vertice
    vertices[i].y += 64; //transladando no eixo y 64px cada vertice
  }

  //tentamos aplicar uma matriz translação depois, mas mesmo assim deu o mesmo erro
//   let matrizTranslate = new THREE.Matrix4()
//   matrizTranslate.set(1, 0, 0, 64,
//                       0, 1, 0, 64,
//                       0, 0, 1, 64,
//                       0, 0, 0, 1);
 
// for (let i = 0; i < 8; ++i){
//   vertices[i].applyMatrix4(matrizTranslate)
// }
  

/******************************************************************************
 * Rasterização
 *****************************************************************************/

  // ---------- implementar aqui ----------------------------------------------
function MidPointLineAlgorithm(x0, y0, x1, y1, color) {
  //variaveis auxiliares
  let aux, i = 0;
  
  let x = x0;
  let y = y0;
  
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
 
  //recebendo o módulo das variacoes
  dx = Math.abs(dx)
  dy = Math.abs(dy)
  
  //retas no primeiro, quarto, quinto e oitavo octantes devido a variação de x ser maior que a de y
  if(dx > dy){
    
    //variavel auxiliar para verificar o octante no primeiro pixel
    aux = (dy * 2) - dx;
   
    for(i = 0; i <= dx; i++){
      //acende o pixel na tela
      color_buffer.putPixel(x, y, color);
      
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
    
    for(i = 0; i <= dy; i++){
      color_buffer.putPixel(x, y, color);
      
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

//Aplicar a funcao para rasterizar as arestas
for(let i = 0; i < 12; i++){
  MidPointLineAlgorithm(Math.round(vertices[edges[i][0]].x), Math.round(vertices[edges[i][0]].y), Math.round(vertices[edges[i][1]].x), Math.round(vertices[edges[i][1]].y), [255,0,0] )
}
